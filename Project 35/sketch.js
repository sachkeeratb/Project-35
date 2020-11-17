//Create variables here
var dog, dogIMG, happyDog, database, foodS, foodStock, feed, addFood, fedTime, lastFed, foodOBJ;

function preload()
{
  //load images here
  
  dogIMG = loadImage("dogImg.png");

  happyDog = loadImage("dogImg1.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 1000);

  foodOBJ = new Food();
  
  foodStock=database.ref('Food');
  foodStock.on("value", readStock);

  dog = createSprite(800,200,150,150);
  dog.addImage(dogIMG);
  dog.scale = 0.15;

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {  
  background(46,139,87);

  foodOBJ.display();

  fedTime=database.ref('fedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  drawSprites();
  //add styles here
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM",350,30);
  } else if(lastFed===0){
    text("Last Feed : 12AM", 350,30);
  } else {
    text("Last Feed : "+ lastFed + " AM", 350, 30);
  }

  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodOBJ.updateFoodStock(foodS);
}

function addFoods() {
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog() {
  dog.addImage(happyDog);

  foodOBJ.updateFoodStock(foodOBJ.getFoodStock()-1);
  database.ref('/').update({
    Food:foodOBJ.getFoodStock(),
    fedTime:hour()
  });
}