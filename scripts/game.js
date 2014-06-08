// Generated by CoffeeScript 1.7.1
(function() {
  var Board, Clear, GameLoop, Menu, addKeyObservers, board, canvas, context, gLoop, gameState, hammer, hammerOptions, height, heightScaling, keyDown, keyUp, menu, mouseListener, points, scaling, state, waltzLoop, width, widthScaling;

  state = true;

  Board = (function() {
    function Board(context) {
      var current, i, j, _i, _j;
      this.context = context;
      this.xOffset = 10;
      this.yOffset = 10;
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
      for (i = _i = 0; _i < 13; i = ++_i) {
        current = [];
        for (j = _j = 0; _j < 16; j = ++_j) {
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
      this.initButtons();
    }

    Board.prototype.initButtons = function() {
      var changeGravity, self;
      self = this;
      changeGravity = function() {
        return self.currentDir *= -1;
      };
      this.gravityButton = new ToggleButton(canvas, context, scaling, TritrisImage.rightDir, TritrisImage.leftDir, 270, 150, changeGravity, changeGravity);
      this.rotateButton = new ClickButton(canvas, context, scaling, TritrisImage.rotateInactive, TritrisImage.rotateActive, 265, 310, (function() {
        return self.acceptKey(KeyBindings.rotate);
      }), function() {});
      this.flipButton = new ClickButton(canvas, context, scaling, TritrisImage.flipInactive, TritrisImage.flipActive, 340, 310, (function() {
        return self.flip();
      }), function() {});
      this.leftButton = new ClickButton(canvas, context, scaling, TritrisImage.leftInactive, TritrisImage.leftActive, 265, 384, (function() {
        return self.acceptKey(KeyBindings.left);
      }), function() {});
      this.rightButton = new ClickButton(canvas, context, scaling, TritrisImage.rightInactive, TritrisImage.rightActive, 340, 384, (function() {
        return self.acceptKey(KeyBindings.right);
      }), function() {});
      this.downButton = new ClickButton(canvas, context, scaling, TritrisImage.downInactive, TritrisImage.downActive, 302, 458, (function() {
        return self.acceptKey(KeyBindings.down);
      }), function() {});
      return this.buttons = [this.gravityButton, this.rotateButton, this.flipButton, this.leftButton, this.downButton, this.rightButton];
    };

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

    Board.prototype.getColorFromInt = function(index) {
      switch (index) {
        case 1:
          return TritrisImage.green;
        case 2:
          return TritrisImage.red;
        case 3:
          return TritrisImage.orange;
        case 4:
          return TritrisImage.blue;
        case 5:
          return TritrisImage.purple;
        case 6:
          return TritrisImage.yellow;
        default:
          return TritrisImage.bgTile;
      }
    };

    Board.prototype.getDirectedTile = function(tile, i, j) {
      var imageToDraw, signOfDirection;
      signOfDirection = Math.pow(-1, i + j) === 1;
      return imageToDraw = signOfDirection ? tile.up : tile.down;
    };

    Board.prototype.drawArr = function(arr) {
      var currentTileType, i, imageToDraw, j, line, tile, _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = arr.length; _i < _len; i = ++_i) {
        line = arr[i];
        _results.push((function() {
          var _j, _len1, _ref, _results1;
          _ref = arr[i];
          _results1 = [];
          for (j = _j = 0, _len1 = _ref.length; _j < _len1; j = ++_j) {
            tile = _ref[j];
            currentTileType = this.getColorFromInt(tile);
            imageToDraw = this.getDirectedTile(currentTileType, i, j);
            _results1.push(this.context.drawImage(imageToDraw, 18 * i + this.xOffset, 32 * j + this.yOffset));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Board.prototype.insertCurrentPiece = function(arr, directions, tileCode) {
      var dir, i, isUpTile, j, newArr, x, y, _i, _j, _len, _len1;
      x = this.pieceX;
      y = this.pieceY;
      isUpTile = this.startFromUpTile;
      newArr = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        i = arr[_i];
        newArr.push((function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = i.length; _j < _len1; _j++) {
            j = i[_j];
            _results.push(j);
          }
          return _results;
        })());
      }
      newArr[x][y] = tileCode;
      for (_j = 0, _len1 = directions.length; _j < _len1; _j++) {
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
      var button, e, _i, _len, _ref, _results;
      if (!this.isGameOver) {
        if (this.count === 0) {
          this.update();
        }
        try {
          this.context.drawImage(TritrisImage.bg, 0, 0);
        } catch (_error) {
          e = _error;
        }
        this.drawArr(this.currentArr);
        this.drawArr(this.insertCurrentPiece(this.currentArr, this.currentPiece, this.currentColor));
        this.drawNext();
        this.count = this.count > this.upInterval ? 0 : this.count + 1;
        context.fillStyle = "#777777";
        context.font = "40pt Retro Rescued";
        context.fillText("Score: " + this.score, 50, 600);
        _ref = this.buttons;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          button = _ref[_i];
          _results.push(button.draw());
        }
        return _results;
      } else {
        return this.gameOver();
      }
    };

    Board.prototype.drawNext = function() {
      var dir, i, isUpTile, j, tX, tY, tileType, toBeDrawn, _i, _len, _ref, _results;
      isUpTile = true;
      i = 0;
      j = 0;
      tX = 350;
      tY = 50;
      tileType = this.getColorFromInt(this.nextColor);
      toBeDrawn = this.getDirectedTile(tileType, i, j);
      this.context.drawImage(toBeDrawn, 0, 0, 32, 32, 9 * i + tX, 16 * j + tY, 16, 16);
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
        toBeDrawn = TritrisImage.bgUp;
        tileType = this.getColorFromInt(this.nextColor);
        toBeDrawn = this.getDirectedTile(tileType, i, j);
        this.context.drawImage(toBeDrawn, 0, 0, 32, 32, 9 * i + tX, 16 * j + tY, 16, 16);
        _results.push(isUpTile = !isUpTile);
      }
      return _results;
    };

    Board.prototype.checkLines = function() {
      var filled, i, j, line, tile, _i, _j, _len, _len1, _ref, _ref1, _results;
      _ref = this.currentArr[0];
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        line = _ref[i];
        filled = true;
        _ref1 = this.currentArr;
        for (j = _j = 0, _len1 = _ref1.length; _j < _len1; j = ++_j) {
          tile = _ref1[j];
          if (Math.pow(-1, i + j) === -1 && !this.currentArr[j][i]) {
            filled = false;
          }
        }
        if (filled) {
          this.clearLine(i);
          _results.push(console.log(i));
        } else {
          _results.push(void 0);
        }
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
      var column, _i, _len, _ref, _ref1;
      _ref = this.currentArr;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        column = _ref[_i];
        [].splice.apply(column, [1, toBeCleared - 1 + 1].concat(_ref1 = column.slice(0, toBeCleared))), _ref1;
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
        case KeyBindings.changeGravity:
          return this.gravityButton.clicked();
        case KeyBindings.left:
          if (this.checkSpace(this.currentPiece, this.pieceX - 2, this.pieceY, this.startFromUpTile)) {
            return this.pieceX -= 2;
          }
          break;
        case KeyBindings.right:
          if (this.checkSpace(this.currentPiece, this.pieceX + 2, this.pieceY, this.startFromUpTile)) {
            return this.pieceX += 2;
          }
          break;
        case KeyBindings.rotate:
          return this.rotate();
        case KeyBindings.flip:
          return this.flip();
        case KeyBindings.down:
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
    if (gameState === "AtMenu") {
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

  widthScaling = window.innerWidth / width;

  heightScaling = window.innerHeight / height;

  scaling = Math.min(widthScaling, heightScaling);

  canvas = document.getElementById('gameCanvas');

  canvas.width = width * scaling;

  canvas.height = height * scaling;

  context = canvas.getContext('2d');

  hammerOptions = {
    preventDefault: true
  };

  hammer = new Hammer(canvas);

  hammer.on('dragleft', function(e) {
    return board.acceptKey(KeyBindings.left);
  });

  hammer.on('dragright', function(e) {
    return board.acceptKey(KeyBindings.right);
  });

  hammer.on('dragdown', function(e) {
    return board.acceptKey(KeyBindings.down);
  });

  gLoop = 0;

  points = 0;

  context.scale(scaling, scaling);

  menu = new Menu(context);

  board = new Board(context, scaling);

  addKeyObservers();

  waltzLoop = new buzz.sound(["sounds/WaltzLoop.ogg", "sounds/WaltzLoop.mp3", "sounds/WaltzLoop.aac", "sounds/WaltzLoop.wav"]);

  waltzLoop.play();

  waltzLoop.loop();

  GameLoop = function() {
    Clear();
    switch (gameState) {
      case "StartGame":
        board = new Board(context, scaling);
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

//# sourceMappingURL=game.map
