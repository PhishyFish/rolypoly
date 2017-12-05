# RolyPoly

## Overview
RolyPoly is a side scroller game where the user collects as many points possible while dodging obstacles as a continuously moving character.

## Functionality and MVPs

* User controls speed of character with left and right arrow keys
* User can jump with the up arrow or spacebar, controlling height depending on duration of keypress
* User accumulates points by touching certain objects
* Game is over when user hits an obstacle

## Wireframes

![site wireframe](https://github.com/PhishyFish/rolypoly/blob/master/site.png?raw=true)
The site will consist of the title/header at the top, along with external links to the GitHub repo and my LinkedIn. The game will be displayed in the center, and instructions will be included below.

![game wireframe](https://github.com/PhishyFish/rolypoly/blob/master/game.png?raw=true)
The player will control a character that is continuously rolling to the right. The natural speed of the game gradually increases as the player survives longer. To an extent, the player can also moderate the speed at which the character is rolling, though the game will still increase its natural speed independently. All gameplay is through the keyboard.

## Technologies

* Vanilla JavaScript for overall structure and game logic
* HTML5 Canvas for DOM manipulation and rendering
* Matter.js for the game physics engine
* Webpack to bundle and server up various scripts

## Implementation Timeline

**Day 1**
* Set up Webpack files
* Set up `Canvas` on `index.html`
* Learn fundamentals of Canvas and Matter.js

**Day 2**
* Create player character
* Implement basic controls for movement
* Implement perpetually accelerating scroll

**Day 3**
* Include gravity, momentum, other physics
* Spawn objects so player can obtain points

**Day 4**
* Add better graphics
* Style page

## Bonus Features

* Power-ups
* Moving enemies
* Sound effects
* Scoreboard
