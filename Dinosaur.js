let gameArea;
let myBackgorund;
let gameContext;
let T_Rex;
let isjump;
let myReq;
let message;
let gameover = false;
let cover;
let newScore = 0;
let startTime =  Date.now();
let bestScore = localStorage.getItem('RexTime') || -1;
let myStones = [];
let myCactus = [];
let keys = {};
let cactusCombination = [];

function myGame(){
    gameArea = new gameBoard();
    gameContext = gameArea.context; 
    T_Rex = new Component(50,60,'https://cdn.pixabay.com/photo/2019/11/07/23/40/tyrannosaurus-rex-4610151_1280.png',50,455,'image');
    cover = new Component(gameArea.canvas.width,gameArea.canvas.height,'rgba(0, 0, 0, 0.1)',0,0,'Rect');
    myBackgorund = new Component(gameArea.canvas.width,2,'#413939',0,500,'Rect');
    gameArea.start();
    setInterval(createObstacle,1000)
}

class gameBoard{
   constructor(){
   this.canvas = document.createElement('canvas');
   this.context = this.canvas.getContext('2d');
   this.canvas.width = 1350;
   this.canvas.height = 700; 
   document.body.appendChild(this.canvas);
  }
  start(){
   UpdateGame();
    window.addEventListener('keydown',(e) =>{
        keys[e.keyCode] = true;
        
        if(gameover && (keys[13] || keys[32] || keys[38])){
            setTimeout(restartGame,500)
            gameover = false;
        }
    })
    window.addEventListener('keyup',(e) =>{
     keys[e.keyCode] = false;
    })  
  }

stop(){
cancelAnimationFrame(myReq);
}

clear(){
   gameContext.clearRect(0,0,gameArea.canvas.width,gameArea.canvas.height);
}

}

class Component{
    constructor(width,heigth,color,x,y,type){
     this.width = width;
     this.height = heigth;
     this.color = color;
     this.type = type;
     this.x = x;
     this.y = y;
     this.gravity = 2.0;
     this.Speedy = 0;
     if(type === 'image'){
        this.image = new Image;
        this.image.src = color;
     }
    }
    Draw(){
        if(this.type === 'image'){
        gameContext.drawImage(this.image,this.x,this.y,this.width,this.height);
        }if(this.type === 'Rect'){
            gameContext.fillStyle = this.color;
            gameContext.fillRect(this.x,this.y,this.width,this.height); 
        }if(this.type === 'text'){
            gameContext.font = this.width + ' ' + this.height;
            gameContext.fillStyle = this.color;
            gameContext.fillText(this.design,this.x,this.y)
        }
            
    }
    newPosition() {
        this.y += this.Speedy;
        if(T_Rex.y >= 455){
            T_Rex.Speedy = 0;
            T_Rex.y = 455;
            isjump = true;
        }
    }
    crashWith(obstacle) {

   let objectLeft = this.x;
   let objectRigth = this.x + this.width;
   let objectBottom = this.y + this.height;
   let obstacleLeft = obstacle.x;
   let obstacleRigth = obstacle.x + obstacle.width;
   let obstacleTop = obstacle.y;

   let crash = true;

   if(objectRigth < obstacleLeft - 10 || objectLeft > obstacleRigth - 20 || objectBottom < obstacleTop + 20) {
   crash = false;
   }
     return crash;
    }

}

function createStone(){
    let y = getrandomCoordinate(509,520);
    let randomSize = getrandomCoordinate(1,3);
    let stone = new Component(randomSize,randomSize,'#413939',gameArea.canvas.width,y,'Rect');
    myStones.push(stone);

    for(let i = 0; i < myStones.length; ++i){
        
        myStones[i].Draw();
        myStones[i].x -= 12;
    }
     
}
function getrandomCoordinate(min,max) {
    return Math.floor(Math.random() * (max - min + 1 ) + min);
} 
function createObstacle(){

   let cactus = 'https://www.tynker.com/projects/images/8618bf3a606c43a20351e2d723772e0944920d33/cacti---cacti3.png';
    cactusCombination = [
         new Component(40,65,cactus,gameArea.canvas.width,450,'image'),//Large Cactus
         new Component(20,40,cactus,gameArea.canvas.width+45,475,'image'),//Small Cactus
         [
            new Component(40,65,cactus,gameArea.canvas.width,450,'image'),
            new Component(20,40,cactus,gameArea.canvas.width+45,475,'image')
        ],//LS Cactus
        [
            new Component(40,65,cactus,gameArea.canvas.width,450,'image'),
            new Component(40,65,cactus,gameArea.canvas.width + 45,450,'image'),
            new Component(40,65,cactus,gameArea.canvas.width + 90,450,'image'),
        ],//LLL Cactus
      [
        new Component(20,40,cactus,gameArea.canvas.width,475,'image'),
        new Component(20,40,cactus,gameArea.canvas.width+25,475,'image') 
      ], //SS Cactus
       [
            new Component(40,65,cactus,gameArea.canvas.width,450,'image'),
            new Component(40,65,cactus,gameArea.canvas.width + 45,450,'image'),
            new Component(20,40,cactus,gameArea.canvas.width+88,475,'image') ,
            new Component(40,65,cactus,gameArea.canvas.width + 110,450,'image'),
       ]//LLSL Cactus
    ];
    let randomCactus = cactusCombination[Math.floor(Math.random() * cactusCombination.length)];

    myCactus = myCactus.concat(randomCactus);

}


function Jump() {
    T_Rex.Speedy += T_Rex.gravity;
    if (T_Rex.y <= 350) {
        isjump = false;
    }
    if((keys[32] || keys[38]) && isjump === true){
      T_Rex.Speedy = -20;
    }

 }
 
 
function createScore(){
    let Score = new Component('25px','Arial','GREY',1100,50,'text');
    message = new Component('50px','Arial','Grey',gameArea.canvas.width/2 - 120,gameArea.canvas.height/2,'text');
    message.design = 'Game Over';

    newScore = Math.floor((Date.now() - startTime) /100);
    if (newScore > bestScore){
        bestScore = newScore;
        localStorage.setItem('RexTime',bestScore);
    }
    Score.design = 'HI: ' + localStorage.getItem('RexTime') + ' ' + newScore;
    Score.Draw();
}

function restartGame(){ 

  myCactus = [];
  startTime =  Date.now();
  UpdateGame();
 
}
 function UpdateGame() {
    
   gameArea.clear();
   myReq = requestAnimationFrame(UpdateGame); 

   myBackgorund.Draw();
   T_Rex.Draw();

   createScore();
   createStone();

   Jump();
   T_Rex.newPosition();
 

     for (let i = 0; i < myCactus.length; ++i) {

        if((T_Rex.crashWith(myCactus[i]))){
            gameArea.stop();
            cover.Draw();
            message.Draw();
            gameover = true;
        }
       myCactus[i].x -= 12;
       myCactus[i].Draw();
       
     }
   
}