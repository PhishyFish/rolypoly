import { Bodies, Body } from 'matter-js';

class Coin {
  constructor(x, y) {
    this.body = Bodies.circle(
      x, y, 20,
      {
        render: {
          fillStyle: '#FEC258',
          // sprite: {
          //   texture:
          // }
        },
        collisionFilter: {
          group: -1
        },
        isStatic: true
      }
    );

    Body.applyForce(
      this.body,
      { x: this.body.position.x, y: this.body.position.y },
      { x: 0, y: 0 }
    );
  }
}

export default Coin;
