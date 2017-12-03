function startGame() {
    var canvas = document.getElementById('g_canvas');
    var ctx = canvas.getContext('2d');
    var numOfBombs = parseInt(document.getElementById('number_of_bombs').value);
    ctx.numOfBombs = numOfBombs;
    ctx.rows = numOfBombs - 2;
    ctx.cols = numOfBombs - 2;
    ctx.cellSize = 30;
    ctx.width = ctx.rows * ctx.cellSize;
    ctx.height = ctx.cols * ctx.cellSize;
    ctx.clickedBoxes = [];
    ctx.rClickedBoxes = [];
    ctx.clickedBoxes = [];
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
    canvas.width = ctx.width;
    canvas.height = ctx.height;
    canvas.addEventListener('click', controller);
    init(ctx);
}


function controller(e) {
    var canvas = document.getElementById('g_canvas');
    var ctx = canvas.getContext('2d');
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
            // lose();
        }
    }

    if (!clickedBomb  && ctx.mX < ctx.rows * ctx.cellSize && ctx.mY < ctx.cols * ctx.cellSize) {
        var totalClicked = ctx.clickedBoxes.length + ctx.rClickedBoxes.length;
        if (totalClicked === 100) {
            // win();
        }
        clickPass( ctx.clickedX, ctx.clickedY);
    }
};


function clickPass( x, y) {
    var canvas = document.getElementById('g_canvas');
    var ctx = canvas.getContext('2d');
    var numOfBombsAround = 0;

    for (i in ctx.boxesToCheck) {
        for (var n = 0; n <ctx.numOfBombs; n++) {
            if (checkBomb(n, x + ctx.boxesToCheck[i][0], y + ctx.boxesToCheck[i][1]) === true) {
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

    if(!clicked){
        ctx.clickedBoxes[(ctx.clickedBoxes.length)] = [x, y, numOfBombsAround];
    }

    if (numOfBombsAround === 0) {
        for (i in ctx.boxesToCheck) {
            if (x + ctx.boxesToCheck[i][0] >= 0 && x + ctx.boxesToCheck[i][0] < ctx.numOfBombs && y + ctx.boxesToCheck[i][1] >= 0 && y + ctx.boxesToCheck[i][1] < ctx.numOfBombs) {
                var x1 = x + ctx.boxesToCheck[i][0];
                var y1 = y + ctx.boxesToCheck[i][1];

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
    var canvas = document.getElementById('g_canvas');
    var ctx = canvas.getContext('2d');
    if (ctx.bombs[i][0] === x && ctx.bombs[i][1] === y) {
        return true;
    } else {
        return false;
    }
}




















function init(ctx) {
    var box= new Image();
    var num = new Image();
    var zero = new Image();
    var flag = new Image();
    box.src = "image/box.png";
    num.src = "image/num.png";
    zero.src = "image/zero.png";
    flag.src = "image/logo.png";
    ctx.box = box;
    ctx.num = box;
    ctx.zero = box;
    ctx.flag = box;


    for (var i = 0; i < ctx.numOfBombs; i++) {
        ctx.bombs[i] = [
            Math.floor(Math.random() * ctx.rows),
            Math.floor(Math.random() * ctx.cols)
        ]
    }
    drawCanvas(ctx);
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
}
