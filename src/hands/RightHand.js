import configHands from '../config/configHands.js';
import Hand from './Hand.js';

export default class RightHand extends Hand {

  activePoints = {};
  points = configHands.rightHand.activationPoints;

  constructor(ctx, w, h) {
    super(ctx, w, h);
  }
  draw(handPoints) {
    this.points.forEach(point => {
      const currentPoint = handPoints[point];
      const pressed = currentPoint.z < -0.1;
      const x = currentPoint.x * this.w;
      const y = currentPoint.y * this.h;
      const r = (Math.abs(currentPoint.z * 70));
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, 2 * Math.PI);
      this.ctx.fillStyle = pressed ? configHands.rightHand.colors[0] : configHands.rightHand.colors[1];
      if (pressed) {
        this.activePoints[`p_${point}`] = { x, y, r };
      }
      this.ctx.fill();
    });
    this.ctx.restore();
  }
}