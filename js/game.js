import Matter from 'matter-js';
import { Render } from 'matter-js';

const Game = () => {
  let canvas = document.getElementById('rolypoly');
  let ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.rect(0, 0, 960, 540);
  ctx.fillStyle = '#BCDDEF';
  ctx.fill();
  ctx.closePath();

  const Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Constraint = Matter.Constraint,
    Composites = Matter.Composites,
    Events = Matter.Events,
    MouseConstraint = Matter.MouseConstraint;

  const engine = Engine.create();

  const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      width: 960,
      height: 540,
      wireframes: false
    }
  });

  const boxA = Bodies.rectangle(400, 200, 80, 80);
  const ballA = Bodies.circle(380, 100, 40, 10);
  const ballB = Bodies.circle(460, 10, 40, 10);
  const ground = Bodies.rectangle(400, 380, 810, 60, { isStatic: true });

  World.add(engine.world, [boxA, ballA, ballB, ground]);

  Engine.run(engine);

  Render.run(render);
};

export default Game;
