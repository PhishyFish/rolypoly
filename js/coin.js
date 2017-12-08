import { Bodies, Body } from 'matter-js';

class Coin {
  constructor(x, y) {
    this.width = 20;
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
