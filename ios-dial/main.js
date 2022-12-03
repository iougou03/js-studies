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
        max-width: 271px;
				height: 135px;
				background-color: #000;
				display: flex;
				align-items: center;
				justify-content: center;
        
    }
    .center-container {
				width: 100%;	
        display: flex;
        background-color: #151516;
        border-radius: 7px;
        justify-content: space-between;
        padding: 2px 14px;
				color: #fff;
				font-size: 20px;
    }

    .dial-container {
				width: 30px;
				height: 30px;
				position: relative;
    }
    .dial {
        position: absolute;
				top:0;
				left:0;
    }
    li {
        display: inline-block;
				vertical-align: middle;
				width: 30px;
				height: 30px;
				text-align: center;
				
    }
`;

const IPHONE_PPI_WIDTH = 270.719;

class IosDial extends HTMLElement {
  cnt = 1; // 1 ~ 3

  maxValList = [10];

  coorPerDial = [];

  positionPerDial = [];

  isKeydown = false;

  isMousedown = false;
  // mouseDest = 0;
  mouseY = 0;
  mouseOffsetTop = 0;
  mouseDialInfo = { dialIdx: 0, numIdx: 0 }

  dialElems = [];

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

    if (this.isKeydow || this.isMousedown) return;

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

  drawDial(dialIdx) {
    this.positionPerDial.forEach(
      (posi, idx) => (this.dialElems[idx].style.top = `${posi.y}px`)
    );
  }

  resizeHandler() {
    const width = this.shadowRoot.getElementById("root").offsetWidth;

    // root width : 270.719 = font-size : 20
    const fontSize = (width * 20) / IPHONE_PPI_WIDTH;
    // this.shadowRoot.querySelectorAll('li').forEach(elem => {
    // 	elem.style.width=fontSize + "px"
    // 	elem.style.height=fontSize + "px"
    // })

    this.shadowRoot.querySelector(
      ".center-container"
    ).style.fontSize = `${fontSize}px`;
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
    
    if (target.classList.contains('dial-num')) {
      const info = target.classList.item(0).split('-');
      this.isMousedown = true;
      this.mouseOffsetTop = e.y;
      this.mouseDialInfo = {
        dialIdx: parseInt(info[1]),
      }
    }
    // this.mouseDest = e.y;
  }

  mouseupHandler(e) {
    this.isMousedown = false;
    // this.mouseDest -= e.y;
  }

  mousemoveHandler(e) {
    if (this.isMousedown) {
      const d = Math.abs(e.y - this.mouseOffsetTop) * this.acc;
      // if (Math.abs(d) > 40) return;

      console.log(e.y)
      if (e.y < this.mouseOffsetTop) {
        this.positionPerDial[this.mouseDialInfo.dialIdx].y -= d;
      } else {
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

    this.coorPerDial = [...this.dialElems].map((dial) =>
      [...dial.children].map((li) => -li.offsetTop)
    );
    this.positionPerDial.forEach((posi, idx) => posi.y = this.coorPerDial[idx][0])

    this.drawDial()
    this.attachObserver();
    this.resizeHandler();
  }

  
  connectedCallback() {
    this.render();
    this.init();
    
    window.addEventListener("resize", this.resizeHandler.bind(this));
    window.addEventListener("keydown", this.keyDownHandler.bind(this));
    window.addEventListener("keyup", this.keyUpHandler.bind(this));
    
    window.addEventListener("mousedown", this.mousedownHandler.bind(this));
    window.addEventListener('mousemove', this.mousemoveHandler.bind(this));
    window.addEventListener("mouseup", this.mouseupHandler.bind(this));
  }
  
  disconnectedCallback() {
    window.removeEventListener("resize", this.resizeHandler);
    window.removeEventListener("keydown", this.keyDownHandler);
    window.removeEventListener("keyup", this.keyUpHandler);

    window.removeEventListener("mousedown", this.mousedownHandler);
    window.removeEventListener('mousemove', this.mousemoveHandler);
    window.removeEventListener("mouseup", this.mouseupHandler);
  }

  render() {
    this.shadowRoot.innerHTML = `
			<style>${styles}</style>
			
			<section id="root">

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
			</section>
		`;
  }
}

(() => {
  customElements.define("ios-dial", IosDial);
})();
