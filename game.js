var canvas;
var canvasContext;
var ballX = 50;
var ballSpeedX = 10;
var ballY = 10;
var ballSpeedY = 4;
var paddle1Y = 250
const PADDLE_THICKNESS = 10
const PADDLE_HEIGHT = 100
var paddle2Y = 250
var player1Score =0;
var player2Score =0;
const WINING_SCORE = 5;
var showingWinScreen = false;

window.onload = function(){
canvas = document.getElementById('gamesCanvas');
canvasContext = canvas.getContext('2d');
var framesPerSecond = 30;

setInterval(function(){
			moveEveryThing();
			drawEveryThing();
			},1000/framesPerSecond); //wait 1000/fps ms before drawEveryThing is called everytime

		canvas.addEventListener('mousedown',handleMouseClickEvent);
		canvas.addEventListener('mousemove',function(evt){
		var mousePos = calculateMousePosition(evt);
		paddle1Y = mousePos.y - (PADDLE_HEIGHT/2); //subtracting height/2 to move paddle center on mouse move
		});

}

function handleMouseClickEvent (){
	if(showingWinScreen){
		player1Score = 0;
		player2Score = 0;
		showingWinScreen =false;
	}
}

function computerMovement(){

	var paddle2YCenter =  paddle2Y + (PADDLE_HEIGHT/2);
	if(paddle2YCenter<ballY-35){ //checking relative vertical position of right paddle wrt to ballY-35px
		paddle2Y = paddle2Y +6;
	}else if(paddle2YCenter>ballY+35){
		paddle2Y = paddle2Y -6;
	}
}

function callEveryThing(){

moveEveryThing();
drawEveryThing();

}

function moveEveryThing(){

	computerMovement();
	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;

	//when ball passes the right edge
	if(ballX>canvas.width){
		//ballSpeedX = -ballSpeedX;
		if(ballY>paddle2Y && ballY<(paddle2Y+PADDLE_HEIGHT)){ //to check if ball is between the top and bottom of the left paddle
		ballSpeedX = -ballSpeedX;
		var delta = ballY  - (paddle2Y+PADDLE_HEIGHT/2)//when ball hits the paddle to find how far below or above center of paddle is
		ballSpeedY = delta*0.35;//setting balls Y direction speed depending on how far it is from center i.e. speed is less when hit close to the center and more when hit far from center of the paddle
		}else{
		player1Score+=1;//must be before ball reset 
		ballReset();
		}
	}
	//when ball passes the left edge
	if(ballX<0){
		//ballSpeedX = -ballSpeedX;
		if(ballY>paddle1Y && ballY<(paddle1Y+PADDLE_HEIGHT)){ //to check if ball is between the top and bottom of the left paddle
		ballSpeedX = -ballSpeedX;
		var delta = ballY  - (paddle1Y+PADDLE_HEIGHT/2)//when ball hits the paddle to find how far below or above center of paddle is
		ballSpeedY = delta*0.35;//setting balls Y direction speed depending on how far it is from center
		}else{
		player2Score+=1;//when left player misses the ball (player 1 misses) --->must be before ball reset
		ballReset();
		 
		}
	}

	if(ballY>canvas.height){
		ballSpeedY = -ballSpeedY;
	}
	if(ballY<0){
		ballSpeedY = -ballSpeedY;
	}
}

function colorRect(leftX,topY,width,height,drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY,width,height);
}

function colorCircle(centerX,centerY,radius,drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true) //x,y coordinates of center of the ball , radius of circle , 0-2pi circle , true/false for clockwise and anticlockwise degree
	canvasContext.fill();

}

//draw a net
function drawNet(){
	for(var i = 0;i<canvas.height;i+=40){
		colorRect(canvas.width/2 -1,i,2,20,'white');
	}
}

function drawEveryThing(){
	//draw black screen
	colorRect(0,0,canvas.width,canvas.height,'black');
		// if any one of the player wins , stop the game until mouse clicked
		if(showingWinScreen){
			canvasContext.fillStyle = 'white';
			if(player1Score>=WINING_SCORE){
			canvasContext.fillText("Left player 1 Won!!!" ,350,200);
		
			}else if(player2Score>=WINING_SCORE){
			canvasContext.fillText("Left player 2 Won!!!" ,350,200);
			}
			
			canvasContext.fillText("Click to restart game" ,350,400);
			return;
		}
	drawNet();
	//drawing the left player tennis paddle
	colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
	
	//drawing the right player tennis paddle
	colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
	//drawing the ball
	colorCircle(ballX,ballY,10,'white');
	canvasContext.fillText(player1Score ,100,100);
	canvasContext.fillText(player2Score ,canvas.width - 100,100);

}

function calculateMousePosition(evt){ //getting an event
var rect = canvas.getBoundingClientRect(); //getting the canvas' boundry
var root = document.documentElement //returns the root element of the document like html element
var mouseX = evt.clientX - rect.left  - root.scrollLeft; //get mouse's x and y coordinates within the canvas
var mouseY = evt.clientY - rect.top  - root.scrollTop;
return {
x:mouseX,
y:mouseY
}
}

//reset the ball when ball crosses over to the edges
function ballReset(){
	if(player1Score>=WINING_SCORE || player2Score>=WINING_SCORE){
		showingWinScreen = true
	}
	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

