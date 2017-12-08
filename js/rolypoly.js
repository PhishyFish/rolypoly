import { Engine, World } from 'matter-js';
import Game from './game';

document.addEventListener('DOMContentLoaded', () => {
  let start = document.getElementById('start');
  start.classList.add('open');
  document.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      Game();
    }
  });
});
