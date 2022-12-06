// @ts-check
import { IPHONE_PPI_WIDTH } from "./ios.js";
import { range } from "./utils.js";

const styles = `
  /* reset css */
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  li {
    display: block;
  }

  #root {
    width: 100%;
    height: 100%;
    background-color: #000;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
  }

  .picker-container {
    position: relative;
    color: rgba(255, 255, 255, .8);;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .center {
    width: 100%;
    height: fit-content;
    display: flex;
    padding: 0.35em 1em ;
    justify-content: space-between;
    perspective: 400px;
    background-color: rgba(255, 255, 255, .15);
    border-radius: 10px;
  }
  .picker {
    position: relative;
    top: 0;
    z-index: 3;
    width: 1em;
    height: 1em;
    transform-style: preserve-3d;
    transition: ease 300ms box-shadow;
  }
  .picker:focus {
    box-shadow: inset 0px 0px 0px 2px #e3e3e3;
    outline: none;
  }
  .num-list {
    cursor: pointer;
    position: relative;
  }
  .num-list li {
    width: 1em;
    height: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .num-list li:not(:last-child) {
    margin-bottom: 10px;
  }
  .num-list li span {
    line-height: 1em;
    padding: 1em;
  }
`;

/**
 * # LifeCycle
 *
 * constructor
 *     ↓
 * connectedCallback
 *     ↓
 * disconnectedCallback
 */
export class Picker extends HTMLElement {
  /**
   * @type {{"cnt": number, "num-list": Array<number>, "title-list": Array<string>, "picker-type": "end" | "endless", acc:number}}
   */
  userSettings = {
    cnt: 1,
    "num-list": [10],
    "title-list": [],
    "picker-type": "end",
    acc: 0.18,
  };

  /**
   * @type {{"root": HTMLElement, "picker-container": HTMLElement, "all-nums": Array<HTMLElement>, "all-picker": Array<HTMLElement>}}
   */
  // @ts-ignore
  elems = {};

  /**
   * @typedef {Object} Info
   * @property {boolean} isEntered
   * @property {number} offsetTop
   */

  /**
   * @type {Array<Array<Info>>}
   * @description the array initialize at {@link syncCoor}
   *  ,and {@link Info} data will be changed at ${@link setObservers}
   */
  numInfoPerPicker = [];

  /**
   * @type {DOMRect}
   * @description the variable assigned at {@link syncCoor}
   */
  pickerContainerCoor;

  /**
   * @typedef {"UP" | "DOWN"} MouseDirection
   */
  /**
   * @type {{ y: number, isPressed: boolean, pressedPickerIdx: number}}
   */
  mouseCoor = {
    y: 0,
    isPressed: false,
    pressedPickerIdx: 0,
  };

  /**
   * @typedef {Object} CoorInfo
   * @property {number} y
   * @property {number} dest
   * @property {number} upperBound
   * @property {number} lowerBound
   * @property {number} idealDest
   */
  /**
   * @type {Array<CoorInfo>}
   */
  pickerCoor = [];

  /**
   * @type {number}
   * @description float number that help js won't calculate too deeply from {@link animation}
   *  which has {@link reqestAnimationFrame}
   */
  animFloat = 0.1;

  syncAttributes() {
    const userCnt = this.getAttribute("cnt");
    const userNumList = this.getAttribute("num-list");
    const userTitleList = this.getAttribute("title-list");
    const userPickerType = this.getAttribute("picker-type");

    try {
      if (userCnt) {
        this.userSettings.cnt = parseInt(userCnt);
      }
      if (userNumList) {
        this.userSettings["num-list"] = userNumList
          .split(",")
          .map((v) => parseInt(v));
      }
      if (userTitleList) {
        this.userSettings["title-list"] = userTitleList.split(",");
      }
      if (userPickerType) {
        if (userPickerType === "end" || userPickerType === "endless") {
          this.userSettings["picker-type"] = userPickerType;
        } else throw new Error("unvalid picker type");
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   *
   * @param {CoorInfo} coor
   * @param {number} pickerIdx
   */
  setDestWhenStop(coor, pickerIdx) {
    if (this.mouseCoor.isPressed) return;

    // set number's postions to ideal location
    if (
      coor.y === coor.dest &&
      this.pickerCoor[pickerIdx].idealDest !== coor.dest
    ) {
      coor.dest = this.pickerCoor[pickerIdx].idealDest;
    }
  }
  /**
   *
   * @param {Element} pickerElem
   * @param {number} pickerIdx
   */
  drawPicker(pickerElem, pickerIdx) {
    const coor = this.pickerCoor[pickerIdx];
    this.setDestWhenStop(coor, pickerIdx);

    const dis = Math.abs(coor.dest - coor.y);
    const d = dis > 2 ? dis * this.userSettings.acc : dis;

    if (coor.dest > coor.y) {
      /**
       * [go down]
       * ----y----
       *     ↓
       * ---dest--
       */
      if (coor.y + this.animFloat > coor.dest) {
        coor.y = coor.dest;
      } else {
        coor.y += d;
      }
    } else if (coor.dest < coor.y) {
      /**
       * [go up]
       * ---dest--
       *     ↑
       * ----y----
       */
      if (coor.y - this.animFloat < coor.dest) {
        coor.y = coor.dest;
      } else {
        coor.y -= d;
      }
    }

    /**
     * Since picker should fix his position, numbers will be
     *  moved by transforming ul tag which is the parent of numbers
     * see {@link render}
     * <div>
     *
     * </div>
     */
    // @ts-ignore
    pickerElem.querySelector(".num-list").style.top = `${coor.y}px`;

    [...pickerElem.querySelectorAll("li.num")].forEach((numElem, numIdx) => {
      this.drawNum(numElem, pickerIdx, numIdx);
    });
  }

  /**
   * @param {Element} numElem
   * @param {number} pickerIdx
   * @param {number} numIdx
   */
  drawNum(numElem, pickerIdx, numIdx) {
    const span = numElem.children[0];
    if (this.numInfoPerPicker[pickerIdx][numIdx].isEntered) {
      // @ts-ignore
      span.style.display = "block";
      // -------------------- setting rotateY ----------------------------
      const centerIdx = Math.floor(this.elems["all-picker"].length / 2);

      const Ydeg = 10 * (pickerIdx - centerIdx);

      // -----------------------------------------------------------------

      // -------------------- setting opacity, rotateX --------------------
      const numCoor = numElem.getBoundingClientRect();
      const numTopFromCenter = numCoor.top + numCoor.height / 2;
      const percentage =
        (numTopFromCenter - this.pickerContainerCoor.top) /
        this.elems["picker-container"].offsetHeight;

      const zConstant = 100;
      let z = this.elems["picker-container"].offsetHeight / 20;
      let Xdeg = 0;
      let opacity = 1;

      if (0.0 <= percentage && percentage <= 0.5) {
        // 0.0 ~ 0.5 -> 90 * (1 -> 0)
        Xdeg = 90 * (1 - percentage / 0.5);
        opacity = percentage / 0.5;
        z += (zConstant * percentage) / 0.5;
      } else {
        // 0.5 ~ 1.0 -> -90 * (0 -> 1)
        Xdeg = -90 * ((percentage - 0.5) / 0.5);
        opacity = 1 - (percentage - 0.5) / 0.5;
        z += zConstant * (1 - (percentage - 0.5) / 0.5);
      }
      // -------------------------------------------------------------------

      // @ts-ignore
      span.style.opacity = opacity;
      // @ts-ignore
      span.style.transform = `rotateY(${Ydeg}deg) rotateX(${Xdeg}deg) translateZ(${z}px)`;
    } else {
      // @ts-ignore
      span.style.display = "none";
    }
  }

  animation() {
    requestAnimationFrame(this.animation.bind(this));

    if (this.mouseCoor.isPressed) return;

    this.elems["all-picker"].forEach((pickerElem, pickerIdx) => {
      this.drawPicker(pickerElem, pickerIdx);
    });
  }

  constructor() {
    super();

    // 1. attach shadow
    this.attachShadow({ mode: "open" });

    // 2. sync attributes from user's inputs
    this.syncAttributes();

    // 3. start animation
    requestAnimationFrame(this.animation.bind(this));
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>

      <section id="root" onmousedown="return false">

        <div class="picker-container">

          <div class="center">
          ${range(this.userSettings.cnt)
            .map(
              (pickerIdx) => `
              <div class="picker" tabIndex = 0>
                <ul class="num-list idx-${pickerIdx}">
                  ${range(this.userSettings["num-list"][pickerIdx])
                    .map(
                      (numIdx) => `
                    <li 
                      class="num idx-${pickerIdx}-${numIdx}"
                      ><span>${numIdx}</span>
                    </li>
                  `
                    )
                    .join("")}
                </ul>
              </div>
            `
            )
            .join("")}
          </div>

        </div>
      
      </section>  
    
    `;
  }

  syncElements() {
    // @ts-ignore
    this.elems.root = this.shadowRoot?.getElementById("root");

    // @ts-ignore
    this.elems["picker-container"] =
      this.shadowRoot?.querySelector(".picker-container");

    this.elems["all-picker"] = [
      // @ts-ignore
      ...this.shadowRoot?.querySelectorAll(".picker"),
    ];

    this.elems["all-nums"] = [
      // @ts-ignore
      ...this.shadowRoot?.querySelectorAll(".num-list .num"),
    ];
  }

  setStyles() {
    const rootWidth = this.elems["root"].offsetWidth;
    /**
     * # How to calculate font size
     *
     * root width : 270.719 = font-size : 20
     */
    const fontSize = (rootWidth * 20) / IPHONE_PPI_WIDTH;

    this.elems["picker-container"].style.fontSize = `${fontSize}px`;
  }

  syncCoor() {
    this.elems["all-picker"].forEach((pickerElem, pickerIdx) => {
      this.numInfoPerPicker.push([]);

      const numsFromPicker = [...pickerElem.querySelectorAll("li.num")];

      numsFromPicker.forEach((numElem) => {
        this.numInfoPerPicker[pickerIdx].push({
          isEntered: false,
          // @ts-ignore
          offsetTop: numElem.offsetTop,
        });
      });

      this.pickerCoor.push({
        y: 0,
        dest: 0,
        upperBound: 0,
        // @ts-ignore
        lowerBound: -numsFromPicker[numsFromPicker.length - 1].offsetTop,
        idealDest: 0,
      });
    });

    this.pickerContainerCoor =
      this.elems["picker-container"].getBoundingClientRect();
  }

  setObservers() {
    const ioForCurvingNums = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          const data = entry.target.classList.item(1)?.split("-");
          // @ts-ignore
          const pickerIdx = parseInt(data[1]);
          // @ts-ignore
          const numIdx = parseInt(data[2]);

          if (entry.isIntersecting) {
            this.numInfoPerPicker[pickerIdx][numIdx].isEntered = true;
          } else {
            this.numInfoPerPicker[pickerIdx][numIdx].isEntered = false;
          }
        }),
      {
        threshold: 0.1,
        root: this.elems["picker-container"],
      }
    );

    this.elems["all-nums"].forEach((elem) => ioForCurvingNums.observe(elem));

    this.elems["all-picker"].forEach((pickerElem) => {
      const ioForSetDest = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const data = entry.target.classList.item(1)?.split("-");
              // @ts-ignore
              const pickerIdx = parseInt(data[1]);
              // @ts-ignore
              const numIdx = parseInt(data[2]);

              this.pickerCoor[pickerIdx].idealDest =
                -this.numInfoPerPicker[pickerIdx][numIdx].offsetTop;
            }
          }),
        {
          threshold: 0.5,
          root: pickerElem,
        }
      );

      pickerElem
        .querySelectorAll("li.num")
        .forEach((e) => ioForSetDest.observe(e));
    });
  }

  /**
   * @param {number} pickerIdx
   * @param {number} dis
   * @param {'add' | 'sub'} method
   */
  addDistanceForDestination(pickerIdx, dis, method) {
    const maxDis = 50;

    if (method === "add") {
      if (
        this.pickerCoor[pickerIdx].dest + dis >
        this.pickerCoor[pickerIdx].upperBound + maxDis
      ) {
        this.pickerCoor[pickerIdx].dest =
          this.pickerCoor[pickerIdx].upperBound + maxDis;
      } else {
        this.pickerCoor[pickerIdx].dest += dis;
      }
    } else {
      if (
        this.pickerCoor[pickerIdx].dest - dis <
        this.pickerCoor[pickerIdx].lowerBound - maxDis
      ) {
        this.pickerCoor[pickerIdx].dest =
          this.pickerCoor[pickerIdx].lowerBound - maxDis;
      } else {
        this.pickerCoor[pickerIdx].dest -= dis;
      }
    }
  }

  keyListener = {
    /**
     * @param {KeyboardEvent} e
     */
    keydown: (e) => {
      if (e.code === "ArrowUp") {
        this.pickerCoor.forEach((coor) => (coor.dest -= 100));
      } else if (e.code === "ArrowDown") {
        this.pickerCoor.forEach((coor) => (coor.dest += 100));
      }
    },
    keyup: () => {},
  };

  mouseListener = {
    /**
     * @param {MouseEvent} e
     */
    mousedown: (e) => {
      const target = e.composedPath().find((elem) => {
        // @ts-ignore
        if (!elem.tagName) return false;
        // @ts-ignore
        if (elem.classList.contains("num-list")) return true;
      });
      // @ts-ignore
      if (!target) return;
      // @ts-ignore
      const info = target.classList.item(1).split("-");
      const pickerIdx = parseInt(info[1]);

      this.mouseCoor.y = e.y;
      this.mouseCoor.isPressed = true;
      this.mouseCoor.pressedPickerIdx = pickerIdx;
    },
    /**
     * @param {MouseEvent} e
     */
    mousemove: (e) => {
      if (!this.mouseCoor.isPressed) return;

      const dir = e.y - this.mouseCoor.y;

      let dis = Math.abs(e.y - this.mouseCoor.y) * 2;

      // if (dis > 60) {
      //   dis = -this.pickerCoor[this.mouseCoor.pressedPickerIdx].lowerBound;
      // }

      if (dir > 0) {
        // down
        this.addDistanceForDestination(
          this.mouseCoor.pressedPickerIdx,
          dis,
          "add"
        );
      } else {
        // up
        this.addDistanceForDestination(
          this.mouseCoor.pressedPickerIdx,
          dis,
          "sub"
        );
      }
      this.mouseCoor.y = e.y;

      this.drawPicker(
        this.elems["all-picker"][this.mouseCoor.pressedPickerIdx],
        this.mouseCoor.pressedPickerIdx
      );
    },
    /**
     * @param {MouseEvent} e
     */
    // @ts-ignore
    mouseup: (e) => {
      this.mouseCoor.isPressed = false;
    },
    mouseleave: () => {
      this.mouseCoor.isPressed = false;
    },
  };

  connectedCallback() {
    this.render();

    this.syncElements();

    this.setStyles();

    this.syncCoor();

    this.setObservers();

    Object.keys(this.mouseListener).forEach((event) => {
      window.addEventListener(event, this.mouseListener[event].bind(this));
    });
    document.onmouseleave = this.mouseListener.mouseleave;

    Object.keys(this.keyListener).forEach((event) => {
      window.addEventListener(event, this.keyListener[event].bind(this));
    });
  }

  disconnectedCallback() {
    Object.keys(this.mouseListener).forEach((event) => {
      window.removeEventListener(event, this.mouseListener[event].bind(this));
    });
    document.removeEventListener("mouseleave", this.mouseListener.mouseleave);

    Object.keys(this.keyListener).forEach((event) => {
      window.removeEventListener(event, this.keyListener[event].bind(this));
    });
  }
}
