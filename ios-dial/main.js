// @ts-check

/**
 * 
 * @param {Array<number>} arr 
 */
function sum(arr) {
  return arr.reduce((acc, cur) => acc + cur,0);
}
function range(num) {
  return [...Array(num).keys()];
}

const styles = `
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    #root {
        margin: auto;
        width: 542px;
				height: 271px;
				background-color: #000;
				display: flex;
				align-items: center;
				justify-content: center;
        position: relative;
        padding: 0 20px;
    }
    .center-container {
				width: 100%;	
        display: flex;
        background-color: #151516;
        border-radius: 10px;
        justify-content: space-between;
        padding: 0 14px;
				color: #fff;
				font-size: 20px;
    }

    .dial-container {
				position: relative;
        cursor: pointer;
    }
    .dial {
        position: absolute;
				top:0;
				left:50%;
        transform: translateX(-50%) translateZ(110px);
      }
      li {
        display: inline-block;
				vertical-align: middle;
				text-align: center; 
    }

    .shadow-up,
    .shadow-bottom {
      width: 100%;
      height: 15%;
      position: absolute;
      z-index:10;
    }
    .shadow-up {
      top:0;
      left:0;
      background: linear-gradient(180deg, #000000 30%, rgba(0, 0, 0, 0) 100%);
    }
    .shadow-bottom {
      bottom: 0;
      left: 0;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000 70%);
    }
`;

const IPHONE_PPI_WIDTH = 270.719;

class IosDial extends HTMLElement {
  cnt = 1; // 1 ~ 3

  maxValList = [10];

  /**
   * @type {Array<Array<number>>}
   * @description 모든 li의 offsetTop 2차원 배열, dial index, num index로 접근
   */
  coorPerDial = [];

  /**
   * @type {Array<{y: number, dest: number}>}
   */
  positionPerDial = [];

  isKeydown = false;

  isMousedown = false;
  // mouseDest = 0;
  prevMouseY = 0;
  upperBound = 0;
  underBound = 0;
  mouseDialInfo = { dialIdx: 0 };

  dialElems = [];
  rootElem = null;
  centerElem = null;

  acc = 0.15;
  // for performance, since js calculate since position y is float number.
  animFloat = 0.1;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    const userInputCnt = this.getAttribute("cnt");
    if (userInputCnt !== null) {
      this.cnt = parseInt(userInputCnt);

      for (let i = 0; i < this.cnt; i += 1) {
        this.positionPerDial.push({ y: 0, dest: 0 });
      }
    }

    const userInputMaxValList = this.getAttribute("max-val-list");
    if (userInputMaxValList !== null) {
      this.maxValList = userInputMaxValList.split(",").map((v) => parseInt(v));
    }

    window.requestAnimationFrame(this.animate.bind(this));
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    if (this.isKeydown || this.isMousedown) return;

    // let
    // this.positionPerDial.forEach((posi) => {
    //   const md = Math.abs(-this.mouseDest - posi.y) * this.acc;

    //   if (-this.mouseDest < posi.y) {
    //     posi.y -= md;
    //   } else if (-this.mouseDest > posi.y) {
    //     posi.y += md;
    //   }

    //   posi.y = parseInt(posi.y);

    //   if (posi.y === this.mouseDest) this.mouseDest = 0;

    //   // console.log(posi.y, this.mouseDest)
    // });

    // if (this.mouseDest !== 0) {
    //   this.drawDial();
    //   return;
    // }

    this.findSelfPosition();

    this.drawDial();
    return;
  }

  findSelfPosition() {
    this.positionPerDial.forEach((posi) => {
      const d = Math.abs(posi.dest - posi.y) * this.acc;

      if (d === 0) return;

      if (posi.dest < posi.y) {
        /**
         * [scroll down]
         * ----y----
         *     ↓
         * ---dest--
         */
        if (posi.y - this.animFloat < posi.dest) {
          posi.y = posi.dest;
        } else {
          posi.y -= d;
        }
      } else if (posi.dest > posi.y) {
        /**
         * [scroll up]
         * ---dest--
         *     ↑
         * ----y----
         */
        if (posi.y + this.animFloat > posi.dest) {
          posi.y = posi.dest;
        } else {
          posi.y += d;
        }
      }
    });
  }

  /**
   * 
   * @param {number} totalLength
   * @param {number} currentDest
   * @param {number} totalIdx
   * @param {number} idx
   */
  getDegree(totalLength, currentDest, totalIdx, idx) {
    const percentage = currentDest / totalLength;
    idx += 1;

    return Math.round((90 / totalIdx) * percentage);
  }

  drawDial(dialIdx) {
    this.positionPerDial.forEach(
      (posi, idx) => {
        this.dialElems[idx].style.top = `${posi.y}px`;

        const totalLength = sum(this.coorPerDial[idx]);
        const totalIdx = this.coorPerDial[idx].length;

        const liElems = this.dialElems[idx].children;

        [...liElems].forEach((li, numIdx) => {
          const deg = this.getDegree(this.rootElem.offsetHeight, posi.y, totalIdx, numIdx);

          li.style.transform = "rotateX(" + deg + "deg)";
        })
      }
    );
  }

  resizeHandler() {
    const width = this.shadowRoot.getElementById("root").offsetWidth;

    // root width : 270.719 = font-size : 20
    const fontSize = (width * 20) / IPHONE_PPI_WIDTH;
    
    this.centerElem.style.fontSize = `${fontSize}px`;
    
    const h = this.centerElem.querySelector('li').offsetHeight;
    
    [...this.centerElem.querySelectorAll('li')].forEach(li => 
      li.style.width = `${h}px`
    )
    const dcList = this.shadowRoot.querySelectorAll('.dial-container');
    [...dcList].forEach(dc => {
      dc.style.height=`${h}px`;
      dc.style.width=`${h}px`;
    })

  }

  keyDownHandler(e) {
    this.isKeydown = true;
    if (e.code === "ArrowUp") {
      this.positionPerDial.forEach((posi) => (posi.y -= 1));
    } else if (e.code === "ArrowDown") {
      this.positionPerDial.forEach((posi) => (posi.y += 1));
    }

    this.drawDial();
  }

  keyUpHandler(e) {
    this.isKeydown = false;
  }

  mousedownHandler(e) {
    const target = e.composedPath()[0];

    if (target.classList.contains("dial-num")) {
      const info = target.classList.item(0).split("-");
      const dialIdx = parseInt(info[1]);
      const liLength = this.coorPerDial[dialIdx].length;

      this.isMousedown = true;
      this.prevMouseY = e.y;
      this.upperBound = this.coorPerDial[dialIdx][0];
      this.underBound = this.coorPerDial[dialIdx][liLength - 1];
      this.mouseDialInfo = {
        dialIdx,
      };
    }
  }

  mouseupHandler(e) {
    this.isMousedown = false;
  }

  /**
   *
   * @param {number} y
   * @returns {{distance: number, direction: 'SCROLL_DOWN' | 'SCROLL_UP'}}
   */
  getMouseDirection(y) {
    const distance = Math.abs(y - this.prevMouseY);
    if (this.prevMouseY < y) {
      return {
        distance,
        direction: "SCROLL_DOWN",
      };
    } else {
      return {
        distance,
        direction: "SCROLL_UP",
      };
    }
  }

  mousemoveHandler(e) {
    if (this.isMousedown) {
      const { distance, direction } = this.getMouseDirection(e.y);
      this.prevMouseY = e.y;

      const maxDistance = this.rootElem.offsetHeight / 4;
      const d = distance * 2;

      if (direction === "SCROLL_UP") {
        if (
          this.positionPerDial[this.mouseDialInfo.dialIdx].y - d <
          this.underBound - maxDistance
        ) {
          return;
        }
        this.positionPerDial[this.mouseDialInfo.dialIdx].y -= d;
      } else {
        if (
          this.positionPerDial[this.mouseDialInfo.dialIdx].y + d >
          this.upperBound + maxDistance
        ) {
          return;
        }
        this.positionPerDial[this.mouseDialInfo.dialIdx].y += d;
      }

      this.drawDial();
    }
  }
  attachObserver() {
    const centerContainer = this.shadowRoot.querySelector(".center-container");

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const info = entry.target.classList.item(0).split("-");

            const dialIdx = parseInt(info[1]);
            const numIdx = parseInt(info[2]);

            this.positionPerDial[dialIdx].dest =
              this.coorPerDial[dialIdx][numIdx];
          }
        });
      },
      {
        threshold: 0.6,
        root: centerContainer,
      }
    );

    const allLi = this.shadowRoot.querySelectorAll(".dial li");
    [...allLi].forEach((li) => {
      io.observe(li);
    });
  }

  init() {

    this.dialElems = this.shadowRoot.querySelectorAll(".dial");

    this.rootElem = this.shadowRoot.querySelector("#root");

    this.centerElem = this.shadowRoot.querySelector(".center-container");

    this.attachObserver();
    this.resizeHandler();
    
    this.coorPerDial = [...this.dialElems].map((dial) =>
    [...dial.children].map((li) => -li.offsetTop)
    );
    this.positionPerDial.forEach(
      (posi, idx) => (posi.y = this.coorPerDial[idx][0])
    );
  }

  connectedCallback() {
    this.render();
    this.init();
    this.drawDial();

    window.addEventListener("resize", this.resizeHandler.bind(this));
    window.addEventListener("keydown", this.keyDownHandler.bind(this));
    window.addEventListener("keyup", this.keyUpHandler.bind(this));

    window.addEventListener("mousedown", this.mousedownHandler.bind(this));
    window.addEventListener("mousemove", this.mousemoveHandler.bind(this));
    window.addEventListener("mouseup", this.mouseupHandler.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.resizeHandler);
    window.removeEventListener("keydown", this.keyDownHandler);
    window.removeEventListener("keyup", this.keyUpHandler);

    window.removeEventListener("mousedown", this.mousedownHandler);
    window.removeEventListener("mousemove", this.mousemoveHandler);
    window.removeEventListener("mouseup", this.mouseupHandler);
  }

  render() {
    this.shadowRoot.innerHTML = `
			<style>${styles}</style>
			
			<section id="root">
          <div class="shadow-up"></div>

					<div class="center-container">
					${range(this.cnt)
            .map(
              (dialIdx) => `
							<div class="dial-container">
									<ul class="dial">
									${range(this.maxValList[dialIdx])
                    .map(
                      (num, numIdx) => `
											<li class="dial-${dialIdx}-${numIdx} dial-num">${num}</li>
										`
                    )
                    .join("")}
									</ul>
							</div>
					`
            )
            .join("")}
					</div>

          <div class="shadow-bottom"></div>
			</section>
		`;
  }
}

(() => {
  customElements.define("ios-dial", IosDial);
})();
