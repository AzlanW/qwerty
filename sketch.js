var canvas;

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,obstacle;
var obstacle_con;
var obstacleImg;

var bg_img;
var avion,dragon;
var avionAnimation,dragonImg;
var attack,attackGroup,attackImg;

var gameState = "play";
var gameOver, wintext;

function preload()
{
  bg_img = loadImage('./assets/background.png');
  avionAnimation = loadAnimation("./assets/avion.png","./assets/avion2.png","./assets/avion3.png","./assets/avion4.png","./assets/avion5.png","./assets/avion6.png","./assets/avion7.png","./assets/avion8.png");
  dragonImg = loadImage("./assets/dragon.png");
  attackImg = loadImage("./assets/attack.png");
  gameOverImg = loadImage("./assets/Game Over.png");
  wintextImg = loadImage("./assets/wintext.png");
  //obstacleImg = loadImage("melon.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  avion = createSprite(200,200,20,20);
  avion.addAnimation("avion",avionAnimation);
  avion.scale = 1.1;
  dragon = createSprite(width-140,height/2-40,20,20);
  dragon.addImage("dragon",dragonImg);
  dragon.scale=0.4;

  attackGroup = new Group();
  rope = new Rope(7,{x:120,y:90});
  obstacle = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,obstacle);

  obstacle_con = new Link(rope,obstacle);

  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 2;
  gameOver.visible = false;

  wintext = createSprite(width/2,height/2- 50);
  wintext.addImage(wintextImg);
  wintext.scale = 5;
  wintext.visible = false;

}


function draw() 
{
  background(51);
  image(bg_img,0,0,width,height);

  imageMode(CENTER);
  if(obstacle!=null){
    image(obstacleImg,obstacle.position.x,obstacle.position.y,70,70);
  }
  pop();
  Engine.update(engine);
  rope.show();

  var invisibleBlock = createSprite(windowWidth/2,windowHeight-140,windowWidth,10)
  invisibleBlock.visible = false;
  avion.collide(invisibleBlock);
  var invisibleBlock2 = createSprite(windowWidth/2,30,windowWidth,10)
  invisibleBlock2.visible = false;
  avion.collide(invisibleBlock2);
  var invisibleBlock3 = createSprite(windowWidth-windowWidth/4,windowHeight/2,10,windowHeight)
  invisibleBlock3.visible = false;
  avion.collide(invisibleBlock3);
  
  edges = createEdgeSprites();
  avion.collide(edges);

  if (gameState === "play")
  {
    if (keyDown("UP_ARROW"))
    {
      avion.y = avion.y-5;
    }
    if (keyDown("RIGHT_ARROW"))
    {
      avion.x = avion.x+5;
    }
    if (keyDown("LEFT_ARROW"))
    {
      avion.x = avion.x -5; 
    }
    if (keyDown("DOWN_ARROW"))
    {
      avion.y = avion.y +5; 
    }
    spawnAttack();
  }
  drawSprites();

  if(collide(obstacle,avion,80)==true)
  {
    World.remove(engine.world,obstacle);
    obstacle = null;
  }
}

function spawnAttack()
{
  if (frameCount%200 === 0)
  {
    var attack = createSprite();
    attack.y = avion.y;
    attack.x = avion.x;
    attack.addImage(attackImg);
    attack.scale=1.5;
    attack.velocityX = 7;
    attack.lifetime = 150;
    attackGroup.add(attack);
  }
}

function drop()
{
  cut_sound.play();
  rope.break();
  obstacle_con.dettach();
  obstacle_con = null; 
}

function collide(body,sprite,x)
{
  if(body!=null)
  {
    var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
    if(d<=x)
    {
      return true; 
    }
    else
    {
      return false;
    }
  }
}

function airbaloon()
{
  Matter.Body.applyForce(obstacle,{x:0,y:0},{x:0,y:-0.03});
}