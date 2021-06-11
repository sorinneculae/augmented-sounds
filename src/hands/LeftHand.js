import Hand from './Hand.js';

import configHands from '../config/configHands.js';

export default class LeftHand extends Hand {
  constructor(ctx, w, h) {
    super(ctx, w, h);
  }
  draw(handPoints) {
    handPoints.forEach((point, index) => {
      const x = point.x * this.w;
      const y = point.y * this.h;
      const r = configHands.pointRadius;
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, 2 * Math.PI);
      this.ctx.fillStyle = configHands.leftHand.colors[0];
      this.ctx.font = configHands.font;
      // this.ctx.fillText(index, x - 8, y - 9);
      this.ctx.fill();
    });
    this.ctx.fillText(`bpm -> ${Math.round(Tone.Transport.bpm.value)}`, handPoints[8].x * this.w - 100, handPoints[8].y * this.h);
    this.ctx.restore();
  }
}