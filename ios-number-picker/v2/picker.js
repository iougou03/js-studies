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
    color: #fff;
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
    padding: 0.35em 1.5em ;
    justify-content: space-between;
    perspective: 1000px;
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
  .picker .title {
    position: absolute;
    font-size: 0.6em;
    top: 50%;
    right: 0;
    word-break: keep-all;
    transform: translateY(-50%);
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
    margin-bottom: 1em;
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
   * @type {{"cnt": number, "num-list": Array<number>, "title-list": Array<string>, "picker-type": "end" | "endless", flexible: boolean, acc:number}}
   */
  userSettings = {
    cnt: 1,
    "num-list": [10],
    "title-list": [],
    "picker-type": "end",
    flexible: false,
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
  numCoorPerPicker = [];

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
   * @type {DOMRect}
   * @description the variable assigned at {@link syncCoor}
   */
  pickerContainerCoor;

  /**
   * @typedef {"UP" | "DOWN"} MouseDirection
   */
  /**
   * @type {{ y: number, isPressed: boolean, pressedPickerIdx: number, enteredPickerIdx: number}}
   */
  mouseCoor = {
    y: 0,
    isPressed: false,
    pressedPickerIdx: 0,
    enteredPickerIdx: 0,
  };

  keyCoor = {
    focusedPickerIdx: 0,
  }

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
    const userFlexible = this.getAttribute("flexible");
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
      if (userFlexible) {
        this.userSettings.flexible = userFlexible === "true";
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
    if (this.numCoorPerPicker[pickerIdx][numIdx].isEntered) {
      // @ts-ignore
      span.style.display = "block";

      // -------------------- setting opacity, rotateX&Y --------------------
      const numCoor = numElem.getBoundingClientRect();
      /**
       * -----------picker-container-----------
       *                  │
       *      numTop  ----│-----
       *              │   ↓    │
       *              │ center │
       *              │        │
       *              ----------
       */
      const numTopFromCenter = numCoor.top + numCoor.height / 2;
      const percentage =
        (numTopFromCenter - this.pickerContainerCoor.top) /
        this.elems["picker-container"].offsetHeight;

      /**
       * 8 is important constant
       */
      const zConstant = this.elems["picker-container"].offsetHeight / 7;
      const Zpx = zConstant * ((percentage - 0.5) / 0.5);

      let Xdeg = 0;
      let opacity = 1;

      const centerIdx = Math.floor(this.elems["all-picker"].length / 2);

      let Ydeg = 7 * (centerIdx - pickerIdx) * ((percentage - 0.5) / 0.5);

      let Zdeg = 7 * (centerIdx - pickerIdx) * ((percentage - 0.5) / 0.5);

      if (0.0 <= percentage && percentage < 0.5) {
        // 0.0 ~ 0.5 -> 90 * (1 -> 0)
        Xdeg = 60 * ((percentage - 0.5) / 0.5);
        opacity = percentage / 0.5;
      } else {
        // 0.5 ~ 1.0 -> -90 * (0 -> 1)
        Xdeg = -60 * ((percentage - 0.5) / 0.5);
        opacity = 1 - (percentage - 0.5) / 0.5;
      }
      // -------------------------------------------------------------------

      // @ts-ignore
      span.style.opacity = opacity;
      // @ts-ignore
      span.style.transform = `rotateX(${-Xdeg}deg) rotateY(${Ydeg}deg) rotateZ(${-Zdeg}deg) translateZ(${Zpx}px)`;
    } else {
      // @ts-ignore
      span.style.display = "none";
    }
  }

  animation() {
    requestAnimationFrame(this.animation.bind(this));

    if (this.mouseCoor.isPressed || this.isResizing) return;

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
              <div class="picker" tabIndex=0>
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

                <div class="title">${
                  this.userSettings["title-list"][pickerIdx]
                }</div>
              </div>
            `
            )
            .join("")}
          </div>

        </div>

      </section>  
    
      <
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

  /**
   * set static styles
   */
  setStyles() {
    const rootWidth = this.elems["root"].offsetWidth;
    /**
     * # How to calculate font size
     *
     * root width : 270.719 = font-size : 20
     */
    let fontSize = (rootWidth * 20) / IPHONE_PPI_WIDTH;

    this.elems["picker-container"].style.fontSize = `${fontSize}px`;

    this.elems["all-picker"].forEach((pickerElem, pickerIdx) => {
      const title = this.userSettings["title-list"][pickerIdx];

      // @ts-ignore
      pickerElem.querySelector(".title").style.right=`${-(title.length + 0.2)}em`;
    });
  }

  syncCoor() {
    this.numCoorPerPicker = [];

    this.elems["all-picker"].forEach((pickerElem, pickerIdx) => {
      this.numCoorPerPicker.push([]);

      const numsFromPicker = [...pickerElem.querySelectorAll("li.num")];

      numsFromPicker.forEach((numElem) => {
        this.numCoorPerPicker[pickerIdx].push({
          isEntered: false,
          // @ts-ignore
          offsetTop: -numElem.offsetTop,
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

  ioForCurvingNums = new IntersectionObserver(() => {});
  /**
   * @type {Array<IntersectionObserver>}
   */
  ioForSetDest = [];

  setObservers() {
    this.ioForCurvingNums.disconnect();
    this.ioForSetDest.forEach((io) => io.disconnect());

    this.ioForCurvingNums = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          const data = entry.target.classList.item(1)?.split("-");
          // @ts-ignore
          const pickerIdx = parseInt(data[1]);
          // @ts-ignore
          const numIdx = parseInt(data[2]);

          if (entry.isIntersecting) {
            this.numCoorPerPicker[pickerIdx][numIdx].isEntered = true;
          } else {
            this.numCoorPerPicker[pickerIdx][numIdx].isEntered = false;
          }
        }),
      {
        threshold: 0.1,
        root: this.elems["picker-container"],
      }
    );

    this.elems["all-nums"].forEach((elem) =>
      this.ioForCurvingNums.observe(elem)
    );

    this.elems["all-picker"].forEach((pickerElem, pickerIdx) => {
      this.ioForSetDest.push(
        new IntersectionObserver(
          (entries) =>
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const data = entry.target.classList.item(1)?.split("-");
                // @ts-ignore
                const pickerIdx = parseInt(data[1]);
                // @ts-ignore
                const numIdx = parseInt(data[2]);

                this.pickerCoor[pickerIdx].idealDest =
                  this.numCoorPerPicker[pickerIdx][numIdx].offsetTop;

                try {
                  new Audio('./assets/ios-tik.mp3').play();
                } catch (err) {
                  console.log(err);
                }
              }
            }),
          {
            threshold: 0.65,
            root: pickerElem,
          }
        )
      );

      pickerElem
        .querySelectorAll("li.num")
        .forEach((e) => this.ioForSetDest[pickerIdx].observe(e));
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
      console.log(this.keyCoor)
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

      let dis = Math.abs(e.y - this.mouseCoor.y);

      /**
       * when user scroll rapidly, the picker will move to pickers' bound ASAP
       */
      if (dis > window.innerWidth / 4) {
        dis = -this.pickerCoor[this.mouseCoor.pressedPickerIdx].lowerBound;
      }
      else if (dis > window.innerWidth / 6) {
        dis = -this.pickerCoor[this.mouseCoor.pressedPickerIdx].lowerBound / 2;
      } 

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

  stId = -1;
  isResizing = false;

 
  syncSettingsDependsOnResize() {
    this.setStyles();
    this.syncCoor();
    this.setObservers();

    this.isResizing = false;
  }

  async resizeListener() {
    this.isResizing = true;
    clearTimeout(this.stId);
    this.stId = setTimeout(this.syncSettingsDependsOnResize.bind(this), 100);
  }

  connectedCallback() {
    this.render();

    this.syncElements();

    this.syncSettingsDependsOnResize();

    Object.keys(this.mouseListener).forEach((event) => {
      window.addEventListener(event, this.mouseListener[event].bind(this));
    });
    document.onmouseleave = this.mouseListener.mouseleave;

    Object.keys(this.keyListener).forEach((event) => {
      window.addEventListener(event, this.keyListener[event].bind(this));
    });

    if (this.userSettings.flexible) {
      window.addEventListener("resize", this.resizeListener.bind(this));
    }
  }

  disconnectedCallback() {
    Object.keys(this.mouseListener).forEach((event) => {
      window.removeEventListener(event, this.mouseListener[event].bind(this));
    });
    document.removeEventListener("mouseleave", this.mouseListener.mouseleave);

    Object.keys(this.keyListener).forEach((event) => {
      window.removeEventListener(event, this.keyListener[event].bind(this));
    });

    if (this.userSettings.flexible) {
      window.removeEventListener("resize", this.resizeListener.bind(this));
    }
  }
}
