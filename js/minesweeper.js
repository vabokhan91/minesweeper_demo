var s = {
    rows: 10,
    cols: 10,
    width: 30,
    height: 30
};

var c;

var bombs = [];

var clickedBoxes = [];

window.onload = function () {
    var canvas = document.getElementById('g_canvas');
    c = canvas.getContext('2d');
    timer();
    init();
};

var mX;
var mY;
var clickedX;
var clickedY;
window.onclick = function (e) {
    mX = e.pageX;
    mY = e.pageY;

    if (Math.floor(mX / s.width) < s.cols && Math.floor(mY / s.height) < s.rows) {
        clickedX = Math.floor(mX / s.width);
        clickedY = Math.floor(mY / s.height);
    }

    var clickedBomb = false;

    for (var i = 0; i < 10; i++) {
        if (clickedX === bombs[i][0] && clickedY === bombs[i][1]) {
            clickedBomb = true;
            lose();
        }
    }

    if (!clickedBomb  && mX < s.rows * s.width && mY < s.cols * s.height) {
        var totalClicked = clickedBoxes.length + rClickedBoxes.length;
        if (totalClicked === 100) {
            win();
        }
        clickPass(clickedX, clickedY);
    }
};

var rClickedX;
var rClickedY;
var rClickedBoxes = [];
var rightClicks = 0;
window.oncontextmenu = function (e) {
    e.preventDefault();
    mX = e.pageX;
    mY = e.pageY;


    if (Math.floor(mX / s.width) < s.cols && Math.floor(mY / s.height) < s.rows) {
        rClickedX = Math.floor(mX / s.width);
        rClickedY = Math.floor(mY / s.height);
    }

    var inRClickedBoxes = [false, 0];

    for (i in rClickedBoxes) {
        if (rClickedBoxes[i][0] === rClickedX && rClickedBoxes[i][1] === rClickedY) {
            inRClickedBoxes = [true, i];
        }
    }

    if (!inRClickedBoxes[0]) {
        if (rClickedBoxes.length < 10) {

            var n = rClickedBoxes.length;
            rClickedBoxes[n] = [];
            rClickedBoxes[n][0] = rClickedX;
            rClickedBoxes[n][1] = rClickedY;

            var totalClicked = rClickedBoxes.length + clickedBoxes.length;
            if(totalClicked === 100) {
                win();
            }


        }
    } else {
        rClickedBoxes.splice(inRClickedBoxes[1], 1);

    }

    drawCanvas();

};

var box;
var num;
var zero;
var flag;

function init() {
    box = new Image();
    num = new Image();
    zero = new Image();
    flag = new Image();
    box.src = "box.png";
    num.src = "num.png";
    zero.src = "zero.png";
    flag.src = "logo.png";


    for (var i = 0; i < 10; i++) {
        bombs[i] = [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10)
        ]
    }

    drawCanvas();
}

var time = 0;

function timer() {
    setTimeout(function () {
        var timerVal = document.getElementById('timer');
        time++;
        timerVal.innerHTML = time;
        timer();
    }, 1000);

}

function drawCanvas() {
    c.clearRect(0, 0, 400, 400);

    for (var i = 0; i < s.rows; i++) {
        for (var n = 0; n < s.cols; n++) {
            var x = n * s.width;
            var y = i * s.height;

            var beenClicked = [0, false];
            if (clickedBoxes.length > 0) {
                for (var k = 0; k < clickedBoxes.length; k++) {
                    if (clickedBoxes[k][0] === n && clickedBoxes[k][1] === i) {
                        beenClicked = [k, true];
                    }
                }
            }

            if (beenClicked[1]) {
                if (clickedBoxes[(beenClicked[0])][2] > 0) {
                    c.drawImage(num, x, y);
                } else {
                    c.drawImage(zero, x, y);
                }
            } else {
                var rBeenClicked = [0, false];
                if (rClickedBoxes.length > 0) {
                    for (var k = 0; k < rClickedBoxes.length; k++) {
                        if (rClickedBoxes[k][0] === n && rClickedBoxes[k][1] === i) {
                            rBeenClicked = [k, true];
                        }
                    }
                }

                if (rBeenClicked[1]) {
                    c.drawImage(flag, x, y);
                } else {
                    c.drawImage(box, x, y);
                }
            }
        }
    }
    for (i in clickedBoxes) {
        if (clickedBoxes[i][2] > 0) {
            c.fillText(clickedBoxes[i][2], clickedBoxes[i][0] * s.width + s.width / 2, clickedBoxes[i][1] * s.height + s.height / 2);
        }

    }
}

function clickPass(x, y) {
    var boxesToCheck = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
    ];

    var numOfBombsAround = 0;

    for (i in boxesToCheck) {
        for (var n = 0; n < 10; n++) {
            if (checkBomb(n, x + boxesToCheck[i][0], y + boxesToCheck[i][1]) === true) {
                numOfBombsAround++;
            }
        }
    }

    for(k in rClickedBoxes) {
        if(rClickedBoxes[k][0] === x && rClickedBoxes[k][1] ===y) {
            rClickedBoxes.splice(k, 1);
        }
    }

    var clicked = false;

    for(k in clickedBoxes) {
        if(clickedBoxes[k][0] === x && clickedBoxes[k][1] === y) {
            clicked = true;
        }
    }

    if(!clicked){
        clickedBoxes[(clickedBoxes.length)] = [x, y, numOfBombsAround];
    }




    /*for(var i = 0 ; i< 10 ; i++){

// not adding duplicate bombs
        while(true){
            x = Math.floor ( Math.random()*10);
            y = Math.floor ( Math.random()*10);

            if( bombsFound[x][y] != -2){
                bombsFound[x][y] = -2;   // -2 means bomb is here in array
                bombs[i] = [x , y];
                break;
            }
            console.log("Almost added a duplicate!")
        }

    }﻿*/



    if (numOfBombsAround === 0) {
        for (i in boxesToCheck) {
            if (x + boxesToCheck[i][0] >= 0 && x + boxesToCheck[i][0] <= 9 && y + boxesToCheck[i][1] >= 0 && y + boxesToCheck[i][1] <= 9) {
                var x1 = x + boxesToCheck[i][0];
                var y1 = y + boxesToCheck[i][1];

                var alreadyClicked = false;
                for (n in clickedBoxes) {
                    if (clickedBoxes[n][0] === x1 && clickedBoxes[n][1] === y1) {
                        alreadyClicked = true;
                    }
                }
                if (!alreadyClicked) {
                    clickPass(x1, y1);
                }
            }
        }
    }

    drawCanvas();

}

function checkBomb(i, x, y) {
    if (bombs[i][0] === x && bombs[i][1] === y) {
        return true;
    } else {
        return false;
    }
}


function lose() {
    alert('You lost, idiot');
    newGame();
}

function win() {
    alert('u won!!!')

}

function newGame() {
    bombs = [];
    clickedBoxes = [];
    rClickedBoxes = [];
    rightClicks = 0;
    time = 0;
    init();
}