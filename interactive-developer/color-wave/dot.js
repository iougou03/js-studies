const PI2 = Math.PI * 2;
const BOUNCE = 0.82;

export class Dot {
  constructor(x, y, radius, pixelSize, red, green, blue, scale, mode) {
    this.x = x;
    this.y = y;
    this.mode = mode;
    if (mode === 0){
      const ratio = radius / 256 / 2;
      this.targetRadius = ratio * scale;
    } else if (mode === 1){
      this.targetRadius = radius;
    }
    this.radius = 0;
    this.radiusV = 0;
    this.pixelSize = pixelSize
    this.pixelSizeHalf = pixelSize / 2;
    this.red = red
    this.green = green
    this.blue = blue
  }

  animate(ctx) {
    ctx.beginPath();
    if (this.mode === 0){
      ctx.fillStyle = '#fff';
    } else{
      ctx.fillStyle = '#000';
    }
    ctx.fillRect(
      this.x - this.pixelSizeHalf,
      this.y - this.pixelSizeHalf,
      this.pixelSize, this.pixelSize
    )

    const accel = (this.targetRadius - this.radius) / 2;
    this.radiusV += accel;
    this.radiusV *= BOUNCE;
    this.radius += this.radiusV;

    ctx.beginPath();
    if (this.mode === 0) 
      ctx.fillStyle = `#000`;
    else
      ctx.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
    ctx.arc(this.x, this.y, this.radius, 0, PI2, false);
    ctx.fill();
  }

  reset() {
    this.radius = 0;
    this.radiusV = 0;
  }
}