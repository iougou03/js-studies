const PI2 = Math.PI * 2;

export class Ball {
  constructor(stageWidth, stageHeight, radius, speed, blocks) {
    this.radius = radius;
    this.vx = speed;
    this.vy = speed;

    const diameter = this.radius * 2;
    this.x = diameter + (Math.random() * stageWidth - diameter)
    this.y = diameter + (Math.random() * stageHeight - diameter)

    this.blocks = blocks;
  }
  
  draw(ctx, stageWidth, stageHeight) {
    this.x += this.vx;
    this.y += this.vy;

    this.bounceWindow(stageWidth, stageHeight);

    for (let i = 0 ; i < this.blocks.length ; i++) {
      this.bounceBlock(this.blocks[i], ctx);
    }

    ctx.fillStyle = '#fdd700';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, PI2);
    ctx.fill();
  }

  bounceWindow(stageWidth, stageHeight) {
    const minX = this.radius;
    const maxX = stageWidth - this.radius;
    const minY = this.radius;
    const maxY = stageHeight - this.radius;

    if (this.x <= minX || this.x >= maxX) {
      this.vx *= -1;
      this.x += this.vx;
    } else if (this.y <= minY || this.y >= maxY) {
      this.vy *= -1;
      this.y += this.vy;
    }
  }

  bounceBlock(block, ctx) {
    const minX = block.x - this.radius;
    const maxX = block.maxX + this.radius;
    const minY = block.y - this.radius;
    const maxY = block.maxY + this.radius;
    
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    // ctx.beginPath()
    // ctx.rect(block.x, block.y, block.width, block.height);
    // ctx.fill();
    if ((this.x >= minX && this.x <= maxX) && (this.y >= minY && this.y <= maxY)) {
      const x1 = Math.abs(minX - this.x);
      const x2 = Math.abs(this.x - maxX);
      const y1 = Math.abs(minY - this.y);
      const y2 = Math.abs(this.y - maxY);
      const min1 = Math.abs(x1, x2);
      const min2 = Math.abs(y1, y2);
      const min = Math.min(min1, min2);
      console.log(min1, min2)
      if (min == min1) {
        this.vx *= -1;
        this.x += this.vx;
      } else if (min == min2) {
        this.vy *= -1;
        this.y += this.vy;
      }
    }
    
  }
}