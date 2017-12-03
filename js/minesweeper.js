function startGame() {
    var ctx = initContext();
    init(ctx);
    timer();
};

function initContext() {
    document.getElementById('g_canvas').style.visibility = "visible";
    var canvas = document.getElementById('g_canvas');
    var ctx = canvas.getContext('2d');
    var numOfBombs = parseInt(document.getElementById('number_of_bombs').value);
    if(numOfBombs < 5) {
        numOfBombs = 8;
    }
    ctx.numOfBombs = numOfBombs;
    ctx.rows = numOfBombs - 2;
    ctx.cols = numOfBombs - 2;
    ctx.cellSize = 30;
    ctx.time = 0;
    ctx.timeout = 0;
    ctx.width = ctx.rows * ctx.cellSize;
    ctx.height = ctx.cols * ctx.cellSize;
    ctx.clickedBoxes = [];
    ctx.rClickedBoxes = [];
    ctx.bombs = [];
    ctx.boxesToCheck = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
    ];
    var box = document.getElementById('box');
    var num = document.getElementById('num');
    var zero = document.getElementById('zero');
    var flag = document.getElementById('flag');
    ctx.box = box;
    ctx.num = num;
    ctx.zero = zero;
    ctx.flag = flag;
    canvas.width = ctx.width;
    canvas.height = ctx.height;
    canvas.addEventListener('click', controller);
    return ctx;
}

function getContext() {
    var canvas = getCanvas();
    return canvas.getContext('2d');
}

function getCanvas() {
    return document.getElementById('g_canvas');
}

function controller(e) {

    var ctx = getContext();
    var canvas = getCanvas();
    var rect = canvas.getBoundingClientRect();
    ctx.mX = e.clientX - rect.left;
    ctx.mY = e.clientY - rect.top;
    ctx.clickedX = 0;
    ctx.clickedY = 0;

    if (Math.floor(ctx.mX / ctx.cellSize) < ctx.cols && Math.floor(ctx.mY / ctx.cellSize) < ctx.rows) {
        ctx.clickedX = Math.floor(ctx.mX / ctx.cellSize);
        ctx.clickedY = Math.floor(ctx.mY / ctx.cellSize);
    }

    var clickedBomb = false;

    for (var i = 0; i < ctx.numOfBombs; i++) {
        if (ctx.clickedX === ctx.bombs[i][0] && ctx.clickedY === ctx.bombs[i][1]) {
            clickedBomb = true;
            lose();
        }
    }

    if (!clickedBomb  && ctx.mX < ctx.rows * ctx.cellSize && ctx.mY < ctx.cols * ctx.cellSize) {
        var totalClicked = ctx.clickedBoxes.length + ctx.rClickedBoxes.length;
        if (totalClicked === ctx.rows * ctx.cols) {
            win();
        }
        clickPass(ctx.clickedX, ctx.clickedY);
    }
};


window.oncontextmenu = function (e) {
    e.preventDefault();
    var ctx = getContext();
    var canvas = getCanvas();
    var rect = canvas.getBoundingClientRect();
    ctx.mX = e.clientX - rect.left;
    ctx.mY = e.clientY - rect.top;

    if (Math.floor(ctx.mX / ctx.cellSize) < ctx.cols && Math.floor(ctx.mY / ctx.cellSize) < ctx.rows) {
        ctx.rClickedX = Math.floor(ctx.mX / ctx.cellSize);
        ctx.rClickedY = Math.floor(ctx.mY / ctx.cellSize);
    }

    var inRClickedBoxes = [false, 0];

    for (i in ctx.rClickedBoxes) {
        if (ctx.rClickedBoxes[i][0] === ctx.rClickedX && ctx.rClickedBoxes[i][1] === ctx.rClickedY) {
            inRClickedBoxes = [true, i];
        }
    }

    if (!inRClickedBoxes[0]) {
        if (ctx.rClickedBoxes.length < ctx.numOfBombs) {

            var n = ctx.rClickedBoxes.length;
            ctx.rClickedBoxes[n] = [];
            ctx.rClickedBoxes[n][0] = ctx.rClickedX;
            ctx.rClickedBoxes[n][1] = ctx.rClickedY;
            var totalClicked = ctx.rClickedBoxes.length + ctx.clickedBoxes.length;
            if(totalClicked === ctx.cols * ctx.rows) {
                win();
            }
        }
    } else {
        ctx.rClickedBoxes.splice(inRClickedBoxes[1], 1);

    }
    drawCanvas(ctx);

};


function init(ctx) {
    for (var i = 0; i < ctx.numOfBombs; i++) {
        ctx.bombs[i] = [
            Math.floor(Math.random() * ctx.cols),
            Math.floor(Math.random() * ctx.rows)
        ]
    }
    drawCanvas(ctx);
}

function timer() {
    var ctx = getContext();
    ctx.timeout = setTimeout(function () {
        var ctx = getContext();
        var timerVal = document.getElementById('timer');
        var time = ctx.time;
        time++;
        ctx.time = time;
        timerVal.innerHTML = time;
        timer();
    }, 1000);

}

function drawCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.width, ctx.height);

    for (var i = 0; i < ctx.rows; i++) {
        for (var n = 0; n < ctx.cols; n++) {
            var x = n * ctx.cellSize;
            var y = i * ctx.cellSize;

            var beenClicked = [0, false];
            if (ctx.clickedBoxes.length > 0) {
                for (var k = 0; k < ctx.clickedBoxes.length; k++) {
                    if (ctx.clickedBoxes[k][0] === n && ctx.clickedBoxes[k][1] === i) {
                        beenClicked = [k, true];
                    }
                }
            }

            if (beenClicked[1]) {
                if (ctx.clickedBoxes[(beenClicked[0])][2] > 0) {
                    ctx.drawImage(ctx.num, x, y);
                } else {
                    ctx.drawImage(ctx.zero, x, y);
                }
            } else {
                var rBeenClicked = [0, false];
                if (ctx.rClickedBoxes.length > 0) {
                    for (var k = 0; k < ctx.rClickedBoxes.length; k++) {
                        if (ctx.rClickedBoxes[k][0] === n && ctx.rClickedBoxes[k][1] === i) {
                            rBeenClicked = [k, true];
                        }
                    }
                }

                if (rBeenClicked[1]) {
                    ctx.drawImage(ctx.flag, x, y);
                } else {
                    ctx.drawImage(ctx.box, x, y);
                }
            }
        }
    }
    for (i in ctx.clickedBoxes) {
        if (ctx.clickedBoxes[i][2] > 0) {
            ctx.fillText(ctx.clickedBoxes[i][2], ctx.clickedBoxes[i][0] * ctx.cellSize + ctx.cellSize / 2, ctx.clickedBoxes[i][1] * ctx.cellSize + ctx.cellSize / 2);
        }

    }
    if(ctx.rClickedBoxes.length > 0) {

        var bombsRemaining = document.getElementById('bombs_remaining');
        bombsRemaining.innerHTML = ctx.bombs.length - ctx.rClickedBoxes.length;
    }else {
        var bombsRemaining = document.getElementById('bombs_remaining');
        bombsRemaining.innerHTML = ctx.bombs.length;
    }

}

function clickPass(x, y) {
    var ctx = getContext();
    var boxesToCheck = ctx.boxesToCheck;
    var numOfBombsAround = 0;

    for (i in boxesToCheck) {
        for (var n = 0; n < ctx.numOfBombs; n++) {
            if (checkBomb(n, x + boxesToCheck[i][0], y + boxesToCheck[i][1]) === true) {
                numOfBombsAround++;
            }
        }
    }

    for(k in ctx.rClickedBoxes) {
        if(ctx.rClickedBoxes[k][0] === x && ctx.rClickedBoxes[k][1] ===y) {
            ctx.rClickedBoxes.splice(k, 1);
        }
    }

    var clicked = false;

    for(k in ctx.clickedBoxes) {
        if(ctx.clickedBoxes[k][0] === x && ctx.clickedBoxes[k][1] === y) {
            clicked = true;
        }
    }

    if(!clicked && x < ctx.rows && y < ctx.cols && y >=0 && x >= 0){
        ctx.clickedBoxes[(ctx.clickedBoxes.length)] = [x, y, numOfBombsAround];
    }


    if (numOfBombsAround === 0) {
        for (i in boxesToCheck) {
            if (x + boxesToCheck[i][0] >= 0 && x + boxesToCheck[i][0] < ctx.rows && y + boxesToCheck[i][1] >= 0 && y + boxesToCheck[i][1] < ctx.cols) {
                var x1 = x + boxesToCheck[i][0];
                var y1 = y + boxesToCheck[i][1];

                var alreadyClicked = false;
                for (n in ctx.clickedBoxes) {
                    if (ctx.clickedBoxes[n][0] === x1 && ctx.clickedBoxes[n][1] === y1) {
                        alreadyClicked = true;
                    }
                }
                if (!alreadyClicked) {
                    clickPass(x1, y1);
                }
            }
        }
    }

    drawCanvas(ctx);

}

function checkBomb(i, x, y) {
    var ctx = getContext();
    if (ctx.bombs[i][0] === x && ctx.bombs[i][1] === y) {
        return true;
    } else {
        return false;
    }
}


function lose() {
    alert('You lost, idiot');
    gameOver();
}

function win() {
    alert('u won!!!')

}

function gameOver() {
    document.getElementById("g_canvas").innerHTML = "";

    for (var i = 0; i <= 10000; i++) {
        clearTimeout(i);
    }
    var ctx = getContext();
    clearTimeout(ctx.timeout);
    ctx.timeout = 0;
    ctx.bombs = [];
    ctx.clickedBoxes = [];
    ctx.rClickedBoxes = [];
    ctx.rightClicks = 0;
    ctx.time = 0;
}

function newGame() {
    gameOver();
    startGame();
}

