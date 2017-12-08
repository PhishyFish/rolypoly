import { Engine, World } from 'matter-js';
import Game from './game';

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      Game();
    }
  });
});
