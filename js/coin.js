import { Bodies, Body } from 'matter-js';

const coinWidth = 20;

class Coin {
  constructor(x, y, evil) {
    this.width = coinWidth;
    this.evil = evil;
    this.body = Bodies.circle(
      x, y, this.width,
      {
        render: {
          fillStyle: '#FEC258',
          // sprite: {
          //   texture:
          // }
        },
        collisionFilter: { group: -1 },
        isStatic: true
      }
    );
  }
}

export default Coin;
