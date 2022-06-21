import { Ball } from "./ball.js";
import { Block } from "./block.js";

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    document.body.appendChild(this.canvas);

    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();

    this.blocks = [
      new Block(
        700,
        30,
        this.stageWidth * Math.random(),
        this.stageHeight * Math.random()
      ),
      new Block(
        300,
        50,
        this.stageWidth * Math.random(),
        this.stageHeight * Math.random()
      ),
      new Block(
        200,
        10,
        this.stageWidth * Math.random(),
        this.stageHeight * Math.random()
      ),
    ];

    this.ball = new Ball(this.stageWidth, this.stageHeight, 40, 10, this.blocks);

    window.requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);
  }

  animate(t) {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    for (let i = 0; i < this.blocks.length; i++) {
      this.blocks[i].draw(this.ctx);
    }
    this.ball.draw(this.ctx, this.stageWidth, this.stageHeight, this.blocks);
  }
}

window.onload = () => {
  new App();
};
