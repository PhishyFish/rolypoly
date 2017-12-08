import {
  Engine,
  World,
  Bodies,
  Body,
  Constraint,
  Composites,
  Events,
  Render,
  MouseConstraint,
  SAT,
} from 'matter-js';
import decomp from 'poly-decomp';
import Player from './player';
import Coin from './coin';

global.decomp = decomp;

const Game = () => {
  let canvas = document.getElementById('rolypoly');
  let ctx = canvas.getContext('2d');

  var engine = Engine.create();

  const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      width: 960,
      height: 540,
      background: 'url("./images/sky.png")',
      wireframes: false
    }
  });

  let currWidth = 810;
  let currHeight = 320;
  const ground = Bodies.rectangle(
    400,
    650,
    currWidth,
    currHeight,
    { isStatic: true }
  );
  let currGround = ground;
  let grounds = [currGround];

  let player = new Player();
  let forceY = -0.5;
  let ballGroundCol;

  let speed = 0.005;
  document.addEventListener('keydown', e => {
    console.log(SAT.collides(player.body, currGround));
    let prevBallGroundCol = ballGroundCol;
    ballGroundCol = SAT.collides(player.body, currGround, prevBallGroundCol);
    const isColliding = (obj, idx, arr) => {
      return SAT.collides(player.body, obj).collided;
    };

    switch (e.key) {
      case 'ArrowUp':
      case ' ':
        if (grounds.some(isColliding)) {
          Body.applyForce(
            player.body,
            {x: player.body.position.x, y: player.body.position.y},
            {x: 0, y: forceY}
          );
        }
        break;
      case 'ArrowRight':
        speed *= 1.1;
        if (speed > 0.01) {
          speed = 0.01;
        }
      //   Body.applyForce(
      //     player.body,
      //     {x: player.body.position.x, y: player.body.position.y},
      //     {x: 0.05, y: 0}
      //   );
      //   Body.setAngularVelocity(player.body, Math.PI/6);
        break;
      case 'ArrowLeft':
        speed *= 0.9;
        if (speed < 0.002) {
          speed = 0.002;
        }
        break;
      //   Body.setAngularVelocity(player.body, Math.PI/10);
    }
  });

  const randomBounds = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const circle = Bodies.circle(100, 100, 40, 10);
  console.log('player: ', player);

  engine.world.gravity = { x: 0, y: 0, scale: 0 };
  World.add(engine.world, [player.body, ground]);

  // Engine.run(engine);
  Render.run(render);

  render.options.hasBounds = true;
  let initEngBoundMaxX = render.bounds.max.x;
  let initEngBoundMaxY = render.bounds.max.y;

  let currGroundEnd = currGround.position.x + currHeight;
  let groundGap = 800;
  let ballToEndThreshold = 100;
  let groundRemoveThreshold = currHeight / 4;

  (function run() {
    console.log('bodies', engine.world.bodies.length);
    console.log(player.body.position.x < Math.abs(ballToEndThreshold - currGroundEnd));
    console.log('player position x: ', player.body.position.x);
    console.log('ballToEndThreshold', ballToEndThreshold);
    console.log('currGroundEnd', currGroundEnd);
    console.log(player.body.collisionFilter, ground.collisionFilter);

    if (player.body.position.y > render.bounds.max.y + 100) {
      speed = 0;
      World.remove(engine.world, player.body);
      Engine.clear(engine);
    }

    if (player.body.position.x > Math.abs(ballToEndThreshold - currGroundEnd)) {
      currGround = Bodies.rectangle(
        currGroundEnd + groundGap, // x
        currGround.position.y, // y
        currWidth, // width
        currHeight, // height
        { isStatic: true } // options
      );

      grounds.push(currGround);
      if (grounds.length > 2) {
        let oldGround = grounds.shift();
        World.remove(engine.world, oldGround);
      }
      // console.log(currGroundEnd + groundGap);
      // console.log(currGround.position.y);
      // currGround = Bodies.rectangle(
      //   400, 250, 810, currHeight, { isStatic: true }
      // );
      currGroundEnd = currGround.position.x + currHeight;

      let coinX = currGroundEnd + groundGap + 100;
      let coinY = currGround.position.y - 150;
      for (let i = 0; i < 4; i++) {
        let coin = new Coin(coinX, coinY);
        World.add(engine.world, coin);
        coinX += 30;
        coinY += 20;
      }

      World.add(engine.world, [currGround]);
    }
    // ground.position.x += 1;
    window.requestAnimationFrame(run);
    Engine.update(engine, 1000 / 60);
    Body.applyForce(
      player.body, // body
      {x: player.body.position.x, y: player.body.position.y}, // position
      {x: speed, y: 0.03} // force
    );
    // Body.applyForce(
    //   player.body,
    //   {x: player.body.position.x, y: player.body.position.y},
    //   {x: 0.005, y: 0}
    // );

    render.bounds.min.x = player.body.position.x - render.options.width / 2;
    render.bounds.max.x =
      player.body.position.x - render.options.width / 2 + initEngBoundMaxX;

    // render.bounds.min.y = player.body.position.y - render.options.height / 2;
    // render.bounds.max.y =
    //   player.body.position.y - render.options.height / 2 + initEngBoundMaxY;
  })();
};

export default Game;
