// @ts-check

const WIDTH = 250;
const HEIGHT = 200;

const carouselStyles = `
body {
    background: #333;
    padding: 70px 0;
    font: 15px/20px Arial, sans-serif;
  }
  
  .container {
    margin: 0 auto;
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    position: relative;
    perspective: 1000px;
  }
  
  .carousel {
    height: 100%;
    width: 100%;
    position: absolute;
    transform-style: preserve-3d;
    transition: transform 1s;
  }
  
  .item {
    display: block;
    position: absolute;
    background: #000;
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    line-height: ${HEIGHT}px;
    font-size: 5em;
    text-align: center;
    color: #FFF;
    opacity: 0.95;
    border-radius: 10px;
  }
  
  .a {
    transform: rotateY(0deg) translateZ(${WIDTH}px);
    background: #ed1c24;
  }
  .b {
    transform: rotateY(60deg) translateZ(${WIDTH}px);
    background: #0072bc;
  }
  .c {
    transform: rotateY(120deg) translateZ(${WIDTH}px);
    background: #39b54a;
  }
  .d {
    transform: rotateY(180deg) translateZ(${WIDTH}px);
    background: #f26522;
  }
  .e {
    transform: rotateY(240deg) translateZ(${WIDTH}px);
    background: #630460;
  } 
  .f {
    transform: rotateY(300deg) translateZ(${WIDTH}px);
    background: #8c6239;
  }
  
  .next, .prev {
    color: #444;
    position: absolute;
    top: 100px;
    padding: 1em 2em;
    cursor: pointer;
    background: #CCC;
    border-radius: 5px;
    border-top: 1px solid #FFF;
    box-shadow: 0 5px 0 #999;
    transition: box-shadow 0.1s, top 0.1s;
  }
  .next:hover, .prev:hover { color: #000; }
  .next:active, .prev:active {
    top: 104px;
    box-shadow: 0 1px 0 #999;
  }
  .next { right: 5em; }
  .prev { left: 5em; }
`;
class Carousel extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
  }
  render() {
    // @ts-ignore
    this.shadowRoot.innerHTML = `
    <style>${carouselStyles}</style>

    <div class="container">
        <div class="carousel">
            <div class="item a">A</div>
            <div class="item b">B</div>
            <div class="item c">C</div>
            <div class="item d">D</div>
            <div class="item e">E</div>
            <div class="item f">F</div>
        </div>
    </div>
    `;
  }

  init() {}

  connectedCallback() {
    this.render();
    this.init();
  }
}

customElements.define("carousel-slider", Carousel);
