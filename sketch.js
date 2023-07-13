let spaceship;
let spaceshipImg;
let bg;
let asteroids = [];
let asteroidImg;
let bullets = [];

function preload() {
  spaceshipImg = loadImage('spaceship.png');
  asteroidImg = loadImage('asteroid.png');
  bg = loadImage('background.png');
}

function setup() {
  createCanvas(800, 600);
  spaceship = new Spaceship();
  for(let i = 0; i < 10; i++) {
    asteroids.push(new Asteroid());
  }
}

function draw() {
  image(bg, 0, 0, width, height);

  spaceship.show();
  spaceship.move();

  for(let a of asteroids) {
    a.show();
    a.move();
    if(spaceship.hits(a)) {
      console.log("GAME OVER");
      noLoop();
    }
  }

  for(let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].show();
    bullets[i].move();

    // If bullet is out of canvas, remove it
    if(bullets[i].pos.x < 0 || bullets[i].pos.x > width || bullets[i].pos.y < 0 || bullets[i].pos.y > height) {
      bullets.splice(i, 1);
      continue;
    }

    for(let j = asteroids.length - 1; j >= 0; j--) {
      if(bullets[i] && bullets[i].hits(asteroids[j])) {
        asteroids.splice(j, 1);
        bullets.splice(i, 1);
        break;
      }
    }
  }

  if(asteroids.length === 0) {
    textSize(32);
    fill(255);
    text("YOU WIN", width / 2, height / 2);
    noLoop();
  }

}


function mousePressed() {
  let newBullet = new Bullet(spaceship.pos.copy(), createVector(mouseX, mouseY));
  bullets.push(newBullet);
  console.log("New bullet at:", newBullet.pos, "with velocity:", newBullet.vel);
}

class Spaceship {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.r = 60;
  }

  show() {
    image(spaceshipImg, this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }

  move() {
    if (mouseIsPressed) {
      this.pos.x = lerp(this.pos.x, mouseX, 0.05);
      this.pos.y = lerp(this.pos.y, mouseY, 0.05);
    }
  }

  hits(asteroid) {
    let d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    return d < this.r + asteroid.r;
  }
}

class Asteroid {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.r = 50;
  }

  show() {
    image(asteroidImg, this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }

  move() {
    this.pos.x += random(-1, 1);
    this.pos.y += random(-1, 1);
  }
}

class Bullet {
  constructor(pos, target) {
    this.pos = pos;
    this.vel = p5.Vector.sub(target, pos);
    this.vel.setMag(10);
    this.r = 8;
    console.log("Created bullet with position:", this.pos, "and velocity:", this.vel);
  }

  show() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

  move() {
    this.pos.add(this.vel);
  }

  hits(asteroid) {
    let d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    return d < this.r + asteroid.r;
  }
}
