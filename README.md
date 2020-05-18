# RUNNING LATE

A simple platform game using Vanilla JS.

Timmy is late to school on his first day! And they are very picky with punctuality: if Timmy is late he will suffer a punishment and if he is late five times he will be expelled! Timmy has to run!

On top of that, the place where he lives is a complete mess with huge boxes laying around everywhere! Can you help him avoid them and get him to school on time?

## DEMO

You can play the demo here: http://alvaro-garcia-f.github.io/Game

## HOW TO PLAY

Reach the goal before the clock reaches 0.

Left and Right arrows to move player left and right. Up arrow to jump.

Touching and obstacle will make the player stop advancing towards the goal (distance counter won't decrease).

Touchin the Beer Item will add +5secs to clock.

If clock reaches 0 before goal player loses an attempts. If goal reaches 0 before clock, the player wins and difficulty will increase on the next level.

## FEATURES
- Assets (audio and video) preloader
- Lateral and vertical collision detection between player and obstacles
- Player movement affected by collisions
- Random obstacle creator (2 models at the moment)
- Difficulty increased on winning conditions
- Goal and ending conditions depend on difficulty
- Item speed increased with difficulty

## PENDING FEATURES
- Level maps and design
- More types of obstacles, static and dynamic.
- Different game mechanics (dodge, duck, roll...)
- More variety to graphics
- More varietty to music

## CURRENT ISSUES & KNOWN BUGS

- Problems with collisions in certain still undetermined conditions. Sometimes the player lands on a box and it's not detected when he leaves it.
- Player movement unnatural when landing on obstacles close to the screen border.
- On the animateGoal() transition screen (after player reaches the goal on time) in some still undertermined conditions the background will stop scrolling left.

## ACKNOWLEDGEMENTS

- These guys provided the models that set the base for Timmy: https://craftpix.net/freebies/free-3-character-sprite-sheets-pixel-art/
- 8 Bit Universe provided the music: https://www.youtube.com/channel/UCn4HDI02U4f3VEsghRX7dRw
- Fonts by Chrequered Ink: https://chequered.ink/ 
