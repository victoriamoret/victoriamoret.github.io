(function() {
    var currentPlayer = "player1";
    var column = $(".column");
    var slots = $(".slot");
    // var row = $(".row");
    // var colC = $(".c0, .c1, .c2, .c3, .c4, .c5, .c6"); // got the columns separated
    var button1 = $(".button1");
    var button2 = $(".button2");
    var button = $("button");
    var winner = $(".winner");
    var replay = $(".new-game");
    var restart = $(".restart");
    var board = $(".board");

    button1.on("click", function() {
        location.reload(true);
    });
    button2.on("click", function() {
        replay.html("Game over!");
        replay.css("animation", "blink 2s infinite");
        replay.css("color", "white");
        replay.css("background", "black");
        replay.css("width", "100vw");
        replay.css("font-size", "4rem");
        replay.css("line-height", "6rem");

        return;
    });

    slots.on("mouseover", function() {
        for (var m = 42; m >= 0; m--) {
            $(".hole")
                .eq(m)
                .css("transition", "transform 0.5s ease-out");
            $(".hole")
                .eq(m)
                .css("transform", "scale(0.75)");
        }
    });

    slots.on("mouseleave", function() {
        for (var m = 42; m >= 0; m--) {
            $(".hole")
                .eq(m)
                .css("transition", "transform 1s ease-out");
            $(".hole")
                .eq(m)
                .css("transform", "scale(1)");
        }
    });

    restart.on("click", function() {
        location.reload(true);
    });

    function diagonal() {
        for (var x = 0; x < solutions.length; x++) {
            if (
                slots.eq(solutions[x][0]).hasClass(currentPlayer) &&
                slots.eq(solutions[x][1]).hasClass(currentPlayer) &&
                slots.eq(solutions[x][2]).hasClass(currentPlayer) &&
                slots.eq(solutions[x][3]).hasClass(currentPlayer)
            ) {
                return true;
            }
        }
    }

    var solutions = [
        [0, 7, 14, 21],
        [7, 14, 21, 28],
        [14, 21, 28, 35],
        //
        [1, 8, 15, 22],
        [8, 15, 22, 29],
        //
        [2, 9, 16, 23],
        //
        [6, 13, 20, 27],
        [13, 20, 27, 34],
        [20, 27, 34, 41],
        //
        [12, 19, 26, 33],
        [19, 26, 33, 40],
        //
        [18, 25, 32, 39],
        //backwards

        //
        [3, 8, 13, 18],
        [4, 9, 14, 19],
        [9, 14, 19, 24],
        //
        [5, 10, 15, 20],
        [10, 15, 20, 25],
        [15, 20, 25, 30],
        //
        [11, 16, 21, 26],
        [16, 21, 26, 31],
        [21, 26, 31, 36],
        //
        [17, 22, 27, 32],
        [22, 27, 32, 37],
        //
        [23, 28, 33, 38]
    ];

    //SWITCH PLAYER
    function switchPlayers() {
        if (currentPlayer == "player1") {
            currentPlayer = "player2";
        } else {
            currentPlayer = "player1";
        }
    }

    //TO RESTART GAME reload the page
    // location.reload

    //CHECK FOR VICTORY
    function checkForVictory(argument) {
        var str = "";
        for (var i = 0; i < argument.length; i++) {
            if (argument.eq(i).hasClass(currentPlayer)) {
                str += "v";
            } else {
                str += "l";
            }
        }
        if (str.indexOf("vvvv") > -1) {
            return true;
        }
    }
    //MESSAGE VICTORY
    function showVictoryMessage() {
        setTimeout(function() {
            winner.prepend("<p>" + currentPlayer + " won the match!" + "</p>");
            $(".winner p").css("background", "black");
            $(".winner p").css("color", "white");
            winner.css("visibility", "visible");
            replay.css("visibility", "visible");
            replay.prepend("<p>" + "Do you want to replay?" + "</p>" + "<br>");
            $(".winner p").css("margin", "0 auto");
            $(".winner p").css("padding", "1rem");

            button.css("visibility", "visible");

            restart.css("margin-top", "150px");
            restart.css("transition", "margin 700ms");
        }, 2200);

        board.css("transform", "rotate(360deg)");
        board.css("transition", "transform 1s");
        board.css("transition-timing-function", "ease-out");
    }

    //COLUMN CLICK LISTENER
    column.on("click", function(e) {
        var slotsInColumn = $(e.currentTarget).find(".slot");
        for (var i = 5; i >= 0; i--) {
            if (
                !slotsInColumn.eq(i).hasClass("player1") &&
                !slotsInColumn.eq(i).hasClass("player2")
            ) {
                slotsInColumn.eq(i).addClass(currentPlayer);
                break;
            }
        }

        if (checkForVictory(slotsInColumn)) {
            showVictoryMessage();
        } else if (checkForVictory($(".row" + i))) {
            showVictoryMessage();
        } else if (diagonal()) {
            showVictoryMessage();
        }

        switchPlayers();
    });
})();
