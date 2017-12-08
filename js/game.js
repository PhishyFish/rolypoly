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
  Runner
} from 'matter-js';
import decomp from 'poly-decomp';
import Player from './player';
import Coin from './coin';

global.decomp = decomp;


const Game = () => {
  // const restartGame = () => {
  //   Runner.stop(render);
  //   World.remove(engine.world, player.body);
  //   World.clear(engine.world);
  //   Engine.clear(engine);
  //   Engine.events = {};
  //   Game()
  //   player.body.position.x = 100;
  //   player.body.position.y = 100;
  //   Body.setVelocity(player.body, {x: 0, y: 0});
  // };

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
  let coins = [];

  let player = new Player();
  let forceY = -0.1;
  let jumpForce = -0.4;
  let ballGroundCol;
  let upwardForce = 0;
  let falling = true;

  const maxHeight = render.bounds.min.y - 1000;
  let jumpKeyPressed = false;

  const isColliding = (obj, idx, arr) => {
    return SAT.collides(player.body, obj).collided;
  };

  let speed = 0.0025;
  document.addEventListener('keydown', e => {
    // console.log(SAT.collides(player.body, currGround));
    let prevBallGroundCol = ballGroundCol;
    ballGroundCol = SAT.collides(player.body, currGround, prevBallGroundCol);
    // if (e.key === 'Enter') {
    //   restartGame();
    // }
    switch (e.key) {
      case 'ArrowUp':
      case ' ':
      e.preventDefault();
      if (grounds.some(isColliding)) {
          Body.applyForce(
            player.body,
            {x: player.body.position.x, y: player.body.position.y},
            {x: 0, y: jumpForce}
          );
        }
        jumpKeyPressed = true;
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

  document.addEventListener('keyup', e => {
    if (e.key === 'ArrowUp' || e.key === ' ') {
      Body.setVelocity(player.body, {x: player.body.velocity.x, y: 0});
    }
  });

  const randomBounds = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const circle = Bodies.circle(100, 100, 40, 10);
  // console.log('player: ', player);

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

  let score = 0;
  let ticks = 0;

  (function run() {
    let start = document.getElementById('start');
    start.classList.remove('open');
    ticks++;
    if (ticks % 100 === 0) {
      speed *= 1.1;
    }
    let scorebox = document.getElementById('score');
    let finalScore = document.getElementById('final-score');
    scorebox.innerHTML = `${score}`;
    finalScore.innerHTML = `Final score: ${score}`;
    // console.log('bodies', engine.world.bodies.length);
    // console.log(player.body.position.x < Math.abs(ballToEndThreshold - currGroundEnd));
    // console.log('player position x: ', player.body.position.x);
    // console.log('ballToEndThreshold', ballToEndThreshold);
    // console.log('currGroundEnd', currGroundEnd);

    // not falling and exceeded height
    if (!falling && (player.body.position.y <= maxHeight) || !jumpKeyPressed) {
      falling = true;
    }

    // fell onto ground
    if (grounds.some(isColliding) && falling) {
      falling = false;
    }

    // jump key was pressed and not released, height is within bounds, and not falling
    if (jumpKeyPressed && (player.body.position.y > maxHeight) && !falling) {
      upwardForce = forceY;
    }

    if (falling) {
      upwardForce = 0;
    }
    // console.log('player vel y', player.body.velocity.y);

    if (player.body.position.y <= maxHeight) {
      Body.setVelocity(player.body, {x: player.body.velocity.x, y: 0});
    }

    if (player.body.position.y > render.bounds.max.y + 100) {
      speed = 0;
      World.remove(engine.world, player.body);
      Engine.clear(engine);
      let end = document.getElementById('end');
      end.classList.add('open');
    }

    let needToSpawnGround = player.body.position.x > Math.abs(ballToEndThreshold - currGroundEnd);

    const spawnCoin = (world, _currGroundEnd, _groundGap, _currentGround) => {
      let coin;
      let evilCoin = randomBounds(0, 1);
      for (let i = 0; i < randomBounds(0, 8); i++) {

        let coinX = randomBounds(_currentGround.position.x, _currGroundEnd);
        let coinY = randomBounds(_currentGround.position.y - 400, _currentGround.position.y - currHeight);
        if (evilCoin) {
          coinX = randomBounds(_currentGround.position.x, _currGroundEnd);
          coin = new Coin(coinX, _currentGround.position.y - 175, true);
          coin.body.collisionFilter.group = 0;
          coin.body.render.fillStyle = '#333';
        } else {
          coinX = randomBounds(_currGroundEnd, _currGroundEnd + _groundGap + 100);
          coin = new Coin(coinX, coinY, false);
        }

        // console.log('coin', coin.collisionFilter);
        coins.push(coin);
        World.add(world, coin.body);
        coinX += 80;
      }
    };

    let coinsToRemove;
    const cleanCoins = () => {
      coinsToRemove = [];
      coins.forEach((coin, idx) => {
        if (coin.body.position.x < (render.bounds.min.x - coin.width)) {
          World.remove(engine.world, coin.body);
          coinsToRemove.push(idx);
        }
      });

      coinsToRemove.forEach(idx => {
        coins.splice(idx, 1);
      });
    };

    const processCollidedCoins = () => {
      coinsToRemove = [];
      coins.forEach((coin, idx) => {
        if (SAT.collides(player.body, coin.body).collided) {
          if (coin.evil) {
            // restartGame();
            Runner.stop(render);
            let end = document.getElementById('end');
            end.classList.add('open');
          }
          World.remove(engine.world, coin.body);
          coinsToRemove.push(idx);
          if (!coin.evil) {
            score += 10;
          }
        }
      });

      coinsToRemove.forEach(idx => {
        coins.splice(idx, 1);
      });
    };

    processCollidedCoins();
    cleanCoins();

    const spawnNewGround = (_grounds, world) => {
        currGround = Bodies.rectangle(
        currGroundEnd + groundGap, // x
        currGround.position.y, // y
        currWidth, // width
        currHeight, // height
        { isStatic: true } // options
      );

      _grounds.push(currGround);
      if (_grounds.length > 2) {
        let oldGround = _grounds.shift();
        World.remove(world, oldGround);
      }
      // console.log(currGroundEnd + groundGap);
      // console.log(currGround.position.y);
      // currGround = Bodies.rectangle(
      //   400, 250, 810, currHeight, { isStatic: true }
      // );
      currGroundEnd = currGround.position.x + currHeight;

      World.add(world, [currGround]);

      return currGround;
    };

    if (needToSpawnGround) {
      currGround = spawnNewGround(grounds, engine.world);
      spawnCoin(engine.world, currGroundEnd, groundGap, currGround);
    }

    // ground.position.x += 1;
    window.requestAnimationFrame(run);
    Engine.update(engine, 1000 / 60);
    let gravity = 0.02;
    Body.applyForce(
      player.body, // body
      {x: player.body.position.x, y: player.body.position.y}, // position
      {x: speed, y: gravity} // force
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
