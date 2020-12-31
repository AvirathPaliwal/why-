//Create variables here
    var dogimage,dog1image;
    var dog;
    var food;
    var database,mypos;
    var feed,addfood;
    var foodObj;
    var lastFed;
    var  gameState, readState;
    var  bedroomimg, gardenimg, washroomimg
    //var 
function preload()
{
  //load images here
  dogimage=loadImage("Dog.png");
  dog1image=loadImage("happydog.png");
  bedroom=loadImage("images/Bed Room.png");
  garden=loadImage("images/Garden.png");
  washroom=loadImage("images/Wash Room.png");
}

function setup() {
	createCanvas(900, 600);
  dog=createSprite(500,450,50,50)
  dog.addImage("d",dogimage);
  dog.scale=0.3

    

  foodObj =new Food()
  database=firebase.database();
     var foodStock=database.ref("Food");
     foodStock.on("value",read)

     feed=createButton("FEED THE DOG");
     feed.position(400,100);
     feed.mousePressed(feedDog);

     addfood=createButton("ADD FOOD");
     addfood.position(590,100);
     addfood.mousePressed(addfoods);

     fedTime=database.ref('FeedTime');
     fedTime.on("value",function(data){
       lastFed = data.val();
     });

     readState=database.ref('gameState');
     readState.on("value",function(data){
       gameState=data.val();
     });
}


function draw() {  
  background("green")
  

 currentTime=hour();
 if(currentTime==(lastFed+1)){
   update("playing");
   foodObj.garden();
 }
 else if(currentTime==(lastFed+2)){
   update("sleeping");
   foodObj.bedroom();
 }
 else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
   update("bathing");
   foodObj.washroom();
 }
 else{
   update("hungry")
   foodObj.display();
 }
   
 if(gameState!=="Hungry"){
  feed.hide();
  addfood.hide();
  dog.remove();
}
else{
 feed.show();
 addfood.show();
 dog.addImage(dog1image);
}
  
 
  drawSprites();
   
}

function read(data){
   foodS=data.val(); 
   foodObj.updateFoodStock(foodS); 
}
 
function feedDog(){
  dog.addImage(dog1image);
  
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref("/").update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour(),  // hous() is predefined to automatically get current time from your system
    gameState:"Hungry"
  })
}
function addfoods(){
  foodS++;
  database.ref("/").update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}

