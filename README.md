# Gravity
A small graivity simulation written in javascript.

[Click here to see it](https://thelowman.github.io/gravity/)

Gravity starts out with an empty canvas.  It adds in several random masses and turns on a gravity simulation.  As objects collide their mass is added together.  When the total number of objects drops below a certain point the process starts over.

This page was inspired by a Windows 95 screen saver.  It may have been called gravity, or gravitation, I can't remember.  The original drew asteroids, planets and stars but as I was working on this I thought it looked nicer just to have randomly colored balls.  I searched for the original program for a while but I've long since given up.

The physics calculations are based on Newton's equations but they've been simplified.  There is no complicated 3d math going on.  Objects and their attraction to one another wrap around the canvas at the edges.

One interesting thing is that the script uses a dedicated worker to handle the physics calculations, which helps it get away with more total objects that it otherwise could.