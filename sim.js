var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

var circles = [];
var numCircles = 12;
var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
            		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
            		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
            		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
            		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
            		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
            		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
            		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
            		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
            		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

function checkCollision(x, y, size) { // return index of circle if collision, otherwise return -1
  for (var i = 0; i < numCircles; i++) {
    var other = circles[i];
    if (other.x == x && other.y == y && other.size == size) {
      continue;
    }
    if (Math.pow(x - other.x, 2) + Math.pow(y - other.y, 2) <= Math.pow(size + other.size, 2)) {
      return i;
    }
  }
  return -1;
}

class Circle {
  constructor(x, y, size, vx, vy, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    c.fill();
  }

  update() {
    // update position
    this.x += this.vx;

    // bounce off wall
    if (this.x + this.size >= innerWidth || this.x - this.size <= 0) {
      this.vx *= -1;
      if (this.x + this.size >= innerWidth) {
        this.x = innerWidth - this.size - 1;
      }
      if (this.x - this.size <= 0) {
        this.x = this.size + 1;
      }
    }

    // update position
    this.y += this.vy;

    // bounce off wall
    if (this.y + this.size >= innerHeight || this.y - this.size <= 0) {
      this.vy *= -1;
      if (this.y + this.size >= innerHeight) {
        this.y = innerHeight - this.size - 1;
      }
      if (this.y - this.size <= 0) {
        this.y = this.size + 1;
      }
    }

    // collision with other circles
    var collide = checkCollision(this.x, this.y, this.size);
    if (collide != -1) { // if collision
      var circle = circles[collide];
      var thisCopyX = this.vx;
      var thisCopyY = this.vy; // formulas for collision below
      this.vx = (this.vx * (this.size - circle.size) + (2 * circle.size * circle.vx)) / (this.size + circle.size);
      this.vy = (this.vy * (this.size - circle.size) + (2 * circle.size * circle.vy)) / (this.size + circle.size);
      circle.vx = (circle.vx * (circle.size - this.size) + (2 * this.size * thisCopyX)) / (this.size + circle.size);
      circle.vy = (circle.vy * (circle.size - this.size) + (2 * this.size * thisCopyY)) / (this.size + circle.size);
      this.x += this.vx;
      this.y += this.vy; // ensure it doesn't get stuck
      circle.x += circle.vx;
      circle.y += circle.vy;
    }
  }
}

for (var i = 0; i < numCircles; i++) {
  var size = Math.floor(Math.random() * 40) + 20;
  var x = Math.floor(Math.random() * innerWidth);
  var y = Math.floor(Math.random() * innerHeight);
  var vx = Math.floor(Math.random() * 5) + 1; // generate random circles
  var vy = Math.floor(Math.random() * 5) + 1;
  var index = Math.floor(Math.random() * colorArray.length);
  var circle = new Circle(x, y, size, vx, vy, colorArray[index]);
  circles.push(circle);
}
animate();

function animate() {
  requestAnimationFrame(animate); // run animation
  c.clearRect(0, 0, innerWidth, innerHeight);
  for (var i = 0; i < numCircles; i++) {
    var circle = circles[i];
    circle.draw();
    circle.update();
  }
}
