(function() {
  var Board, Clear, GameLoop, Menu, addKeyObservers, board, canvas, context, gLoop, gameState, height, keyDown, keyUp, menu, mouseListener, points, state, waltzLoop, width;
  state = true;
  Board = (function() {
    function Board(context) {
      var current, i, j;
      this.context = context;
      this.xOffset = 10;
      this.yOffset = 10;
      this.bg = new Image();
      this.bg.src = "images/bg.png";
      this.greenUp = new Image();
      this.greenDown = new Image();
      this.greenUp.src = "images/TileGreenUp.png";
      this.greenDown.src = "images/TileGreenDown.png";
      this.redUp = new Image();
      this.redDown = new Image();
      this.redUp.src = "images/TileRedUp.png";
      this.redDown.src = "images/TileRedDown.png";
      this.orangeUp = new Image();
      this.orangeDown = new Image();
      this.orangeUp.src = "images/TileOrangeUp.png";
      this.orangeDown.src = "images/TileOrangeDown.png";
      this.blueUp = new Image();
      this.blueDown = new Image();
      this.blueUp.src = "images/TileBlueUp.png";
      this.blueDown.src = "images/TileBlueDown.png";
      this.purpleUp = new Image();
      this.purpleDown = new Image();
      this.purpleUp.src = "images/TilePurpleUp.png";
      this.purpleDown.src = "images/TilePurpleDown.png";
      this.yellowUp = new Image();
      this.yellowDown = new Image();
      this.yellowUp.src = "images/TileYellowUp.png";
      this.yellowDown.src = "images/TileYellowDown.png";
      this.bgUp = new Image();
      this.bgDown = new Image();
      this.bgUp.src = "images/TileBgUp.png";
      this.bgDown.src = "images/TileBgDown.png";
      this.leftDir = new Image();
      this.leftDir.src = "images/LeftDirIndicator.png";
      this.rightDir = new Image();
      this.rightDir.src = "images/RightDirIndicator.png";
      this.score = 0;
      this.level = 1;
      this.currentPiece = [2];
      this.currentColor = 2;
      this.nextPiece = [2];
      this.nextColor = 2;
      this.pieces = [
        {
          dirs: [2],
          color: 6
        }, {
          dirs: [2, 1, 1],
          color: 1
        }, {
          dirs: [2, 1, 3, 2, 1],
          color: 1
        }, {
          dirs: [2, 1, 1, 1],
          color: 2
        }, {
          dirs: [1, 3, 2, 3],
          color: 3
        }, {
          dirs: [2, 1, 1, 2],
          color: 4
        }, {
          dirs: [1, 3, 2, 2],
          color: 5
        }, {
          dirs: [1, 3, 3, 2, 2, 3],
          color: 4
        }, {
          dirs: [2, 1, 3, 2, 1, 1],
          color: 5
        }
      ];
      this.levels = [2, 3, 5, 5, 7, 9, 9, 9, 9, 9, 9];
      this.pieceX = 6;
      this.pieceY = 0;
      this.currentDir = 1;
      this.currentInc = 1;
      this.currentArr = [];
      for (i = 0; i < 13; i++) {
        current = [];
        for (j = 0; j < 16; j++) {
          current.push(0);
        }
        this.currentArr.push(current);
      }
      this.expX = 0;
      this.count = 0;
      this.upInterval = 25;
      this.startFromUpTile = true;
      this.flipCount = 2;
      this.isGameOver = false;
    }
    Board.prototype.update = function() {
      var newIndex;
      if (this.checkSpace(this.currentPiece, this.pieceX + this.currentDir, this.pieceY + 1, this.startFromUpTile)) {
        this.pieceX += this.currentDir;
        return this.pieceY += 1;
      } else {
        if (this.pieceY === 0 && this.pieceX === 6) {
          return this.gameOver();
        } else {
          this.currentArr = this.insertCurrentPiece(this.currentArr, this.currentPiece, this.currentColor);
          this.pieceX = 6;
          this.pieceY = 0;
          newIndex = Math.floor(Math.random() * this.levels[this.level]);
          this.currentPiece = this.nextPiece;
          this.currentColor = this.nextColor;
          this.nextPiece = this.pieces[newIndex].dirs;
          this.nextColor = this.pieces[newIndex].color;
          this.startFromUpTile = true;
          return this.checkLines();
        }
      }
    };
    Board.prototype.drawArr = function(arr) {
      var i, j, line, tile, _len, _results;
      _results = [];
      for (i = 0, _len = arr.length; i < _len; i++) {
        line = arr[i];
        _results.push((function() {
          var _len2, _ref, _results2;
          _ref = arr[i];
          _results2 = [];
          for (j = 0, _len2 = _ref.length; j < _len2; j++) {
            tile = _ref[j];
            _results2.push((function() {
              try {
                switch (tile) {
                  case 0:
                    return this.context.drawImage((Math.pow(-1, i + j) === 1 ? this.bgUp : this.bgDown), 18 * i + this.xOffset, 32 * j + this.yOffset);
                  case 1:
                    return this.context.drawImage((Math.pow(-1, i + j) === 1 ? this.greenUp : this.greenDown), 18 * i + this.xOffset, 32 * j + this.yOffset);
                  case 2:
                    return this.context.drawImage((Math.pow(-1, i + j) === 1 ? this.redUp : this.redDown), 18 * i + this.xOffset, 32 * j + this.yOffset);
                  case 3:
                    return this.context.drawImage((Math.pow(-1, i + j) === 1 ? this.orangeUp : this.orangeDown), 18 * i + this.xOffset, 32 * j + this.yOffset);
                  case 4:
                    return this.context.drawImage((Math.pow(-1, i + j) === 1 ? this.blueUp : this.blueDown), 18 * i + this.xOffset, 32 * j + this.yOffset);
                  case 5:
                    return this.context.drawImage((Math.pow(-1, i + j) === 1 ? this.purpleUp : this.purpleDown), 18 * i + this.xOffset, 32 * j + this.yOffset);
                  case 6:
                    return this.context.drawImage((Math.pow(-1, i + j) === 1 ? this.yellowUp : this.yellowDown), 18 * i + this.xOffset, 32 * j + this.yOffset);
                }
              } catch (e) {

              }
            }).call(this));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };
    Board.prototype.insertCurrentPiece = function(arr, directions, tileCode) {
      var dir, i, isUpTile, j, newArr, x, y, _i, _j, _len, _len2;
      x = this.pieceX;
      y = this.pieceY;
      isUpTile = this.startFromUpTile;
      newArr = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        i = arr[_i];
        newArr.push((function() {
          var _j, _len2, _results;
          _results = [];
          for (_j = 0, _len2 = i.length; _j < _len2; _j++) {
            j = i[_j];
            _results.push(j);
          }
          return _results;
        })());
      }
      newArr[x][y] = tileCode;
      for (_j = 0, _len2 = directions.length; _j < _len2; _j++) {
        dir = directions[_j];
        switch (dir) {
          case 1:
            if (isUpTile) {
              x--;
            } else {
              x--;
            }
            break;
          case 2:
            if (isUpTile) {
              x++;
            } else {
              y--;
            }
            break;
          case 3:
            if (isUpTile) {
              y++;
            } else {
              x++;
            }
        }
        newArr[x][y] = tileCode;
        isUpTile = !isUpTile;
      }
      return newArr;
    };
    Board.prototype.draw = function() {
      if (!this.isGameOver) {
        if (this.count === 0) {
          this.update();
        }
        try {
          this.context.drawImage(this.bg, 0, 0);
        } catch (e) {

        }
        this.drawArr(this.currentArr);
        this.drawArr(this.insertCurrentPiece(this.currentArr, this.currentPiece, this.currentColor));
        this.drawNext();
        this.drawDir();
        this.count = this.count > this.upInterval ? 0 : this.count + 1;
        context.fillStyle = "#777777";
        context.font = "40pt Retro Rescued";
        return context.fillText("Score: " + this.score, 50, 600);
      } else {
        return this.gameOver();
      }
    };
    Board.prototype.drawDir = function() {
      try {
        switch (this.currentDir) {
          case -1:
            return this.context.drawImage(this.leftDir, 270, 250);
          case 1:
            return this.context.drawImage(this.rightDir, 270, 250);
        }
      } catch (e) {

      }
    };
    Board.prototype.drawNext = function() {
      var dir, i, isUpTile, j, tX, tY, toBeDrawn, _i, _len, _ref, _results;
      isUpTile = true;
      i = 0;
      j = 0;
      tX = 350;
      tY = 50;
      toBeDrawn = this.bgUp;
      switch (this.nextColor) {
        case 1:
          toBeDrawn = (Math.pow(-1, i + j) === 1 ? this.greenUp : this.greenDown);
          break;
        case 2:
          toBeDrawn = (Math.pow(-1, i + j) === 1 ? this.redUp : this.redDown);
          break;
        case 3:
          toBeDrawn = (Math.pow(-1, i + j) === 1 ? this.orangeUp : this.orangeDown);
          break;
        case 4:
          toBeDrawn = (Math.pow(-1, i + j) === 1 ? this.blueUp : this.blueDown);
          break;
        case 5:
          toBeDrawn = (Math.pow(-1, i + j) === 1 ? this.purpleUp : this.purpleDown);
          break;
        case 6:
          toBeDrawn = (Math.pow(-1, i + j) === 1 ? this.yellowUp : this.yellowDown);
      }
      try {
        context.drawImage(toBeDrawn, 0, 0, 32, 32, 9 * i + tX, 16 * j + tY, 16, 16);
      } catch (e) {

      }
      _ref = this.nextPiece;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dir = _ref[_i];
        switch (dir) {
          case 1:
            if (isUpTile) {
              i--;
            } else {
              i--;
            }
            break;
          case 2:
            if (isUpTile) {
              i++;
            } else {
              j--;
            }
            break;
          case 3:
            if (isUpTile) {
              j++;
            } else {
              i++;
            }
        }
        toBeDrawn = this.bgUp;
        switch (this.nextColor) {
          case 1:
            toBeDrawn = (Math.pow(-1, i + j) === 1 ? this.greenUp : this.greenDown);
            break;
          case 2:
            toBeDrawn = (Math.pow(-1, i + j) === 1 ? this.redUp : this.redDown);
            break;
          case 3:
            toBeDrawn = (Math.pow(-1, i + j) === 1 ? this.orangeUp : this.orangeDown);
            break;
          case 4:
            toBeDrawn = (Math.pow(-1, i + j) === 1 ? this.blueUp : this.blueDown);
            break;
          case 5:
            toBeDrawn = (Math.pow(-1, i + j) === 1 ? this.purpleUp : this.purpleDown);
            break;
          case 6:
            toBeDrawn = (Math.pow(-1, i + j) === 1 ? this.yellowUp : this.yellowDown);
        }
        try {
          context.drawImage(toBeDrawn, 0, 0, 32, 32, 9 * i + tX, 16 * j + tY, 16, 16);
        } catch (e) {

        }
        _results.push(isUpTile = !isUpTile);
      }
      return _results;
    };
    Board.prototype.checkLines = function() {
      var filled, i, j, line, tile, _len, _len2, _ref, _ref2, _results;
      _ref = this.currentArr[0];
      _results = [];
      for (i = 0, _len = _ref.length; i < _len; i++) {
        line = _ref[i];
        filled = true;
        _ref2 = this.currentArr;
        for (j = 0, _len2 = _ref2.length; j < _len2; j++) {
          tile = _ref2[j];
          if (Math.pow(-1, i + j) === -1 && !this.currentArr[j][i]) {
            filled = false;
          }
        }
        _results.push(filled ? (this.clearLine(i), console.log(i)) : void 0);
      }
      return _results;
    };
    Board.prototype.nextLevel = function() {
      if (this.level < 10) {
        this.level += 1;
      }
      return this.upInterval = 25 - 2 * this.level;
    };
    Board.prototype.clearLine = function(toBeCleared) {
      var column, _i, _len, _ref, _ref2;
      _ref = this.currentArr;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        column = _ref[_i];
        [].splice.apply(column, [1, toBeCleared - 1 + 1].concat(_ref2 = column.slice(0, toBeCleared))), _ref2;
        column[0] = 0;
      }
      this.score += 100;
      if (this.score % 300 === 0) {
        return this.nextLevel();
      }
    };
    Board.prototype.checkSpace = function(pieceString, plannedX, plannedY, isFirstUpTile) {
      var dir, isNextOpen, isUpTile, x, y, _i, _len;
      isNextOpen = true;
      x = plannedX;
      y = plannedY;
      isUpTile = isFirstUpTile;
      if (x < this.currentArr.length && y < this.currentArr[0].length && x >= 0 && y >= 0) {
        if (this.currentArr[x][y] !== 0) {
          isNextOpen = false;
        }
      } else {
        isNextOpen = false;
      }
      for (_i = 0, _len = pieceString.length; _i < _len; _i++) {
        dir = pieceString[_i];
        switch (dir) {
          case 1:
            if (isUpTile) {
              x--;
            } else {
              x--;
            }
            break;
          case 2:
            if (isUpTile) {
              x++;
            } else {
              y--;
            }
            break;
          case 3:
            if (isUpTile) {
              y++;
            } else {
              x++;
            }
        }
        if (x < this.currentArr.length && y < this.currentArr[0].length && x >= 0 && y >= 0) {
          if (this.currentArr[x][y] !== 0) {
            isNextOpen = false;
          }
        } else {
          isNextOpen = false;
        }
        isUpTile = !isUpTile;
      }
      return isNextOpen;
    };
    Board.prototype.gameOver = function() {
      Clear();
      context.fillStyle = "#777777";
      context.font = "30pt Retro Rescued";
      context.fillText("Final Score: " + this.score, 50, 50);
      return this.isGameOver = true;
    };
    Board.prototype.rotate = function() {
      var dir, newDir, _i, _len, _ref;
      newDir = [];
      _ref = this.currentPiece;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dir = _ref[_i];
        newDir.push(dir % 3 + 1);
      }
      if (this.checkSpace(newDir, this.pieceX, this.pieceY, this.startFromUpTile)) {
        return this.currentPiece = newDir;
      }
    };
    Board.prototype.rotateSixtyDegrees = function() {
      switch (this.flipCount) {
        case 0:
          this.flipCount = 1;
          return this.flip();
        case 1:
          this.flipCount = 2;
          this.rotate();
          return this.flip();
        case 2:
          this.flipCount = 0;
          this.rotate();
          this.rotate();
          return this.flip();
      }
    };
    Board.prototype.flip = function() {
      var i, newDir, _i, _len, _ref;
      newDir = [];
      _ref = this.currentPiece;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if (i !== 1) {
          newDir.push((i === 2 ? 3 : 2));
        } else {
          newDir.push(1);
        }
      }
      if (this.checkSpace(newDir, this.pieceX, this.pieceY + this.currentInc, !this.startFromUpTile)) {
        this.currentPiece = newDir;
        this.startFromUpTile = !this.startFromUpTile;
        this.pieceY += this.currentInc;
        return this.currentInc *= -1;
      }
    };
    Board.prototype.acceptKey = function(code) {
      switch (code) {
        case 90:
          return this.currentDir *= -1;
        case 37:
          if (this.checkSpace(this.currentPiece, this.pieceX - 2, this.pieceY, this.startFromUpTile)) {
            return this.pieceX -= 2;
          }
          break;
        case 39:
          if (this.checkSpace(this.currentPiece, this.pieceX + 2, this.pieceY, this.startFromUpTile)) {
            return this.pieceX += 2;
          }
          break;
        case 38:
          return this.rotate();
        case 88:
          return this.flip();
        case 40:
          return this.count = 0;
      }
    };
    Board.prototype.releaseKey = function(code) {};
    return Board;
  })();
  Menu = (function() {
    function Menu(context) {
      this.context = context;
      this.menuBg = new Image();
      this.menuBg.src = "images/menu.png";
    }
    Menu.prototype.draw = function() {
      return this.context.drawImage(this.menuBg, 0, 0);
    };
    return Menu;
  })();
  Clear = function() {
    context.fillStyle = '#000000';
    context.beginPath();
    context.rect(0, 0, width, height);
    context.closePath();
    return context.fill();
  };
  gameState = "AtMenu";
  mouseListener = function(e) {
    if (e.pageY < 477 && e.pageY > 390 && gameState === "AtMenu") {
      gameState = "StartGame";
    }
    if (gameState === "GameOver") {
      return gameState = "AtMenu";
    }
  };
  keyDown = function(e) {
    if (gameState === "InGame") {
      return board.acceptKey(e.keyCode);
    }
  };
  keyUp = function(e) {
    if (gameState === "InGame") {
      return board.releaseKey(e.keyCode);
    }
  };
  addKeyObservers = function() {
    document.addEventListener('click', mouseListener, false);
    document.addEventListener('keydown', keyDown, false);
    return document.addEventListener('keyup', keyUp, false);
  };
  width = 416;
  height = 658;
  canvas = document.getElementById('gameCanvas');
  context = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  gLoop = 0;
  points = 0;
  menu = new Menu(context);
  board = new Board(context);
  addKeyObservers();
  waltzLoop = new buzz.sound(["sounds/WaltzLoop.ogg", "sounds/WaltzLoop.mp3", "sounds/WaltzLoop.aac", "sounds/WaltzLoop.wav"]);
  waltzLoop.play();
  waltzLoop.loop();
  GameLoop = function() {
    Clear();
    switch (gameState) {
      case "StartGame":
        board = new Board(context);
        gameState = "InGame";
        break;
      case "AtMenu":
        menu.draw();
        break;
      case "InGame":
        board.draw();
        waltzLoop.setSpeed(0.9 + 0.1 * board.level);
        if (board.isGameOver) {
          gameState = "GameOver";
        }
        break;
      case "GameOver":
        board.gameOver();
    }
    if (state === true) {
      return gLoop = setTimeout(GameLoop, 1000 / 50);
    }
  };
  GameLoop();
}).call(this);
