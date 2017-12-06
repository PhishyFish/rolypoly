import { Bodies, Body } from 'matter-js';

class Player {
  constructor() {
    this.body = Bodies.circle(100, 100, 40, 10);
    this.onGround = false;
    this.body.friction = 0;
  }
}

export default Player;
