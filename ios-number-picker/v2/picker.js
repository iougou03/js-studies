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

    padding: 0 1rem;
  }

  .picker-container {
    position: relative;
    color: #fff;
    width: 100%;
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .center {
    background-color: #151516;
    width: 100%;
    height: fit-content;
    border-radius: 10px;
    display: flex;
    padding: 1rem;
    justify-content: space-between;
    perspective: 400px;
  }
  .picker {
    position: relative;
    top: 0;
    z-index: 2;
    width: 1em;
    height: 1em;
    transform-style: preserve-3d;
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
   * @type {{"cnt": number, "num-list": Array<number>, "title-list": Array<string>, "picker-type": "end" | "endless"}}
   */
  userSettings = {
    cnt: 1,
    "num-list": [10],
    "title-list": [],
    "picker-type": "end",
  };

  /**
   * @type {{"root": HTMLElement, "picker-container": HTMLElement, "all-nums": Array<HTMLElement>, "all-picker": Array<HTMLElement>}}
   */
  // @ts-ignore
  elems = {};

  /**
   * @typedef {Object} Info
   * @property {boolean} isEntered
   */

  /**
   * @type {Array<Array<Info>>}
   * @description the array initialize at {@link syncCoor}
   *  ,and {@link Info} data will be changed at ${@link setObservers}
   */
  numInfoPerPicker = []

  /**
   * @description the variable assigned at {@link syncCoor}
   */
  pickerContainerCoor

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


  draw() {

    this.elems["all-picker"].forEach((pickerElem, pickerIdx) => {
      
      [...pickerElem.querySelectorAll("li.num")].forEach((numElem, numIdx) => {

        if (this.numInfoPerPicker[pickerIdx][numIdx].isEntered) {
          // @ts-ignore
          numElem.children[0].style.display = 'block';

          const z = this.elems["picker-container"].offsetHeight / 12;
          const numCoor = numElem.getBoundingClientRect();
          const numTopFromCenter = numCoor.top + numCoor.height / 2;
          const percentage = (numTopFromCenter - this.pickerContainerCoor.top) / this.elems["picker-container"].offsetHeight;
          
          let deg = 0;
          let opacity = 1;
          if (0.0 <= percentage && percentage <= 0.5) {
            // 0.0 ~ 0.5 -> 90 * (1 -> 0)
            deg = 90 * (1 - percentage / 0.5);
            opacity = percentage / 0.5;
          } else {
            // 0.5 ~ 1.0 -> -90 * (0 -> 1)
            deg = -90 * ((percentage - 0.5) / 0.5);
            opacity = 1 - (percentage - 0.5) / 0.5;
          }

          // @ts-ignore
          numElem.children[0].style.opacity = opacity;
          // @ts-ignore
          numElem.children[0].style.transform = `rotateX(${deg}deg) translateZ(${z}px)`;
        } else {
          // @ts-ignore
          numElem.children[0].style.display = 'none';
        }
      })
    })
  }

  animation() {
    requestAnimationFrame(this.animation.bind(this));

    this.draw();
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

      <section id="root">

        <div class="picker-container">

          <div class="center">
          ${range(this.userSettings.cnt)
            .map(
              (pickerIdx) => `
              <div class="picker">
                <ul class="num-list">
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

      [...pickerElem.querySelectorAll("li.num")].forEach((e) => {
        this.numInfoPerPicker[pickerIdx].push({
          isEntered: false
        })
      })
    })

    this.pickerContainerCoor = this.elems["picker-container"].getBoundingClientRect();
  }

  setObservers() {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
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
        threshold: 0.5,
        root: this.elems["picker-container"],
      }
    );

    this.elems["all-nums"].forEach((elem) => io.observe(elem));
  }

  connectedCallback() {
    this.render();
    
    this.syncElements();
    
    this.setStyles();
    
    this.syncCoor();
    
    this.setObservers();
  }
}
