$("#player1WinsPlayer2").hide();
$("#player2WinsPlayer1").hide();
setTimeout(function () {
    $("#player1VsPlayer2").hide();
}, 2000);

var $board = $(".board");
var $columns = $board.find(".column");
var $allCircles = $(".circle");
var currentPlayer = 1; // cats are player1, dogs are player2
var allDiags = [
    [2, 9, 16, 23],
    [1, 8, 15, 22, 29],
    [0, 7, 14, 21, 28, 35],
    [6, 13, 20, 27, 34, 41],
    [12, 19, 26, 33, 40],
    [18, 25, 32, 39],
    [23, 28, 33, 38],
    [17, 22, 27, 32, 37],
    [11, 16, 21, 26, 31, 36],
    [5, 10, 15, 20, 25, 30],
    [4, 9, 14, 19, 24],
    [3, 8, 13, 28],
];
var timeHideIntro = 1000;
var timeVictory = 4000;
var timeSpin = 1000;
var amountPlayer2Treat = 0;
var amountPlayer1Treat = 0;
var victoryTracker = false;

//calls functions for placing tile, checking victory and possibly victory when user selects column to place tile
$columns.on("click", function () {
    if (victoryTracker === false) {
        var $circles = $(this).find(".circle");
        var rowIndex = placeTile($circles);
        var verticalVictory = checkVictory($circles);
        var $row = $();
        $columns.each(function () {
            var $circle = $(this).find(".circle").eq(rowIndex);
            $row = $row.add($circle);
        });
        var horizontalVictory = checkVictory($row);
        var diagonalVictory = checkVictoryDiag();
        if (horizontalVictory || verticalVictory || diagonalVictory) {
            victory();
        }
        if (rowIndex > -1) {
            switchPlayers();
        }
    }
});

//restarts game
$(".resetButton").on("click", function () {
    location.reload();
});

// throws treat for player1, random player1 tile runs away, inserts player2 tile instead and calls check for player2 victory
$("#player1Treat").on("click", function () {
    if (
        currentPlayer === 2 &&
        amountPlayer1Treat < 1 &&
        $(".player1").length > 0
    ) {
        amountPlayer1Treat++;
        $("#player1Treat").addClass("thrown");
        var player1RunsAway = new Audio("media/WatermelonMeowMeowCut.mp3");
        player1RunsAway.play();
        var circlesWithClassPlayer1 = $(".player1");
        var randomNumber = Math.floor(
            Math.random() * circlesWithClassPlayer1.length
        );
        var col = circlesWithClassPlayer1.eq(randomNumber).parent();
        var replacement = $("<div>", {
            class: "relacement-circle",
        }).css({
            top: circlesWithClassPlayer1.eq(randomNumber).position().top,
        });
        setTimeout(function () {
            replacement.appendTo(col);
            circlesWithClassPlayer1.eq(randomNumber).addClass("runaway");
        }, 1000);
        setTimeout(function () {
            circlesWithClassPlayer1.eq(randomNumber).removeClass("runaway");
            circlesWithClassPlayer1.eq(randomNumber).removeClass("player1");
        }, 3000);
        setTimeout(function () {
            circlesWithClassPlayer1.eq(randomNumber).addClass("player2");
            player1RunsAway.pause();
            replacement.hide();
            checkTreatVictory();
            switchPlayers();
        }, 3200);
    }
});

// throws treat for player2, random player2 tile runs away, inserts player1 tile instead and calls check for player1 victory
$("#player2Treat").on("click", function () {
    if (
        currentPlayer === 1 &&
        amountPlayer2Treat < 1 &&
        $(".player2").length > 0
    ) {
        amountPlayer2Treat++;
        $("#player2Treat").addClass("thrown");
        var player2RunsAway = new Audio("media/WhoLetTheDogsOut.mp3");
        player2RunsAway.play();
        var circlesWithClassPlayer2 = $(".player2");
        var randomNumber = Math.floor(
            Math.random() * circlesWithClassPlayer2.length
        );
        var col = circlesWithClassPlayer2.eq(randomNumber).parent();
        var replacement = $("<div>", {
            class: "relacement-circle",
        }).css({
            top: circlesWithClassPlayer2.eq(randomNumber).position().top,
        });
        setTimeout(function () {
            replacement.appendTo(col);
            circlesWithClassPlayer2.eq(randomNumber).addClass("runaway");
        }, 1000);
        setTimeout(function () {
            circlesWithClassPlayer2.eq(randomNumber).removeClass("runaway");
            circlesWithClassPlayer2.eq(randomNumber).removeClass("player2");
        }, 3000);
        setTimeout(function () {
            circlesWithClassPlayer2.eq(randomNumber).addClass("player1");
            player2RunsAway.pause();
            replacement.hide();
            checkTreatVictory();
            switchPlayers();
        }, 3200);
    }
});

//places tile in selected column
function placeTile($circles) {
    for (var i = $circles.length - 1; i >= 0; i--) {
        if (
            $circles.eq(i).hasClass("player1") ||
            $circles.eq(i).hasClass("player2")
        ) {
            continue;
        } else {
            $circles.eq(i).addClass("player" + currentPlayer);
            return i;
        }
    }
    return -1;
}

//checks diagonal victory after tile was inserted
function checkVictoryDiag() {
    for (var j = 0; j < allDiags.length; j++) {
        var diag = allDiags[j];
        var count = 0;
        for (var i = 0; i < diag.length; i++) {
            if ($allCircles.eq(diag[i]).hasClass("player" + currentPlayer)) {
                count++;
                if (count === 4) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
    }
    return false;
}

//checks horizontal and vertical victory after tile was inserted
function checkVictory(param) {
    var count = 0;
    for (var i = 0; i < param.length; i++) {
        if (param.eq(i).hasClass("player" + currentPlayer)) {
            count++;
            if (count === 4) {
                return true;
            }
        } else {
            count = 0;
        }
    }
    return false;
}

//checks victory after treat was thrown
function checkTreatVictory() {
    for (var i = 0; i < $(".column").length; i++) {
        var $circles = $(".column").eq(i).find(".circle");
        var verticalVictory = checkVictory($circles);
        if (verticalVictory) {
            victory();
        }
    }
    for (var k = 0; k < $(".column").eq(0).find(".circle").length; k++) {
        var $row0 = $();
        for (var j = 0; j < $(".column").length; j++) {
            var $circleOfRow = $(".column").eq(j).find(".circle").eq(k);
            $row0 = $row0.add($circleOfRow);
            var horizontalVictory0 = checkVictory($row0);
            if (horizontalVictory0) {
                victory();
            }
        }
    }
    var diagonalVictory = checkVictoryDiag();
    if (diagonalVictory) {
        victory();
    }
}

//switches players
function switchPlayers() {
    if (currentPlayer === 1) {
        currentPlayer = 2;
    } else {
        currentPlayer = 1;
    }
}

//starts celebration for victory
function victory() {
    victoryTracker = true;
    setTimeout(function () {
        $board.addClass("spin");
    }, timeSpin);
    if (currentPlayer === 1) {
        var musicVictoryPlayer1 = new Audio("media/CoolForCatsCut.mp3");
        musicVictoryPlayer1.play();
        setTimeout(function () {
            $("#player1WinsPlayer2").show();
        }, timeVictory);
    } else {
        var musicVictoryPlayer2 = new Audio("media/ElBaileDelPerritoCut.mp3");
        musicVictoryPlayer2.play();
        setTimeout(function () {
            $("#player2WinsPlayer1").show();
        }, timeVictory);
    }
}
