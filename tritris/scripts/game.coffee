state = true

class Board
  constructor: (@context) ->
    @xOffset = 10
    @yOffset = 10
    @score = 0
    @level = 1
    @currentPiece = [2]
    @currentColor = 2
    @nextPiece = [2]
    @nextColor = 2
    @pieces = [
      {dirs: [2], color: 6}
      {dirs: [2, 1, 1], color: 1}
      {dirs: [2, 1, 3, 2, 1], color: 1} #Big Triangle
      {dirs: [2, 1, 1, 1], color: 2} #>>>>
      {dirs: [1, 3, 2, 3], color: 3} #<<<<
      {dirs: [2, 1, 1, 2], color: 4} #Right C
      {dirs: [1, 3, 2, 2], color: 5} #Left C
      {dirs: [1, 3, 3, 2, 2, 3], color: 4} #Right claw
      {dirs: [2, 1, 3, 2, 1, 1], color: 5} #Left claw
    ]
    @levels = [2, 3, 5, 5, 7, 9, 9, 9, 9, 9, 9]
    @pieceX = 6
    @pieceY = 0
    @currentDir = 1
    @currentInc = 1
    @currentArr = []
    for i in [0...13]
      current = []
      for j in [0...16]
        current.push 0
      @currentArr.push current
    @expX = 0
    @count = 0
    @upInterval = 25
    @startFromUpTile = true
    @flipCount = 2
    @isGameOver = false
    @initButtons()
    @paused = false

  initButtons: () ->
    self = @

    changeGravity = () ->
      self.currentDir *= -1
    @gravityButton = new ToggleButton( canvas, context, scaling,
      TritrisImage.rightDir, TritrisImage.leftDir,
      270, 150,
      changeGravity, changeGravity
    )

    @rotateButton = new ClickButton(canvas, context, scaling,
      TritrisImage.rotateInactive, TritrisImage.rotateActive,
      265, 310,
      (() -> self.acceptKey(KeyBindings.rotate)), ->
    )

    @flipButton = new ClickButton(canvas, context, scaling,
      TritrisImage.flipInactive, TritrisImage.flipActive,
      340, 310,
      (() -> self.flip()),
      ->
    )

    @leftButton = new ClickButton(canvas, context, scaling,
      TritrisImage.leftInactive, TritrisImage.leftActive,
      265, 384,
      (() -> self.acceptKey(KeyBindings.left)),
      ->
    )

    @rightButton = new ClickButton(canvas, context, scaling,
      TritrisImage.rightInactive, TritrisImage.rightActive,
      340, 384,
      (() -> self.acceptKey(KeyBindings.right)),
      ->
    )

    @downButton = new ClickButton(canvas, context, scaling,
      TritrisImage.downInactive, TritrisImage.downActive,
      302, 458,
      (() -> self.acceptKey(KeyBindings.down)),
      ->
    )

    @pauseButton = new ToggleButton(canvas, context, scaling,
      TritrisImage.pause, TritrisImage.play,
      340, 552,
      (() -> self.paused = true),
      (() -> self.paused = false)
    )

    @buttons = [@gravityButton, @rotateButton, @flipButton, @leftButton, @downButton, @rightButton, @pauseButton]

  update: () ->
    if @checkSpace @currentPiece, @pieceX + @currentDir, @pieceY + 1, @startFromUpTile
      @pieceX += @currentDir
      @pieceY += 1
    else
      if @pieceY == 0 and @pieceX == 6
        @gameOver()
      else
        @currentArr = @insertCurrentPiece @currentArr, @currentPiece, @currentColor
        @pieceX = 6
        @pieceY = 0
        newIndex = Math.floor(Math.random() * @levels[@level])
        @currentPiece = @nextPiece
        @currentColor = @nextColor
        @nextPiece = @pieces[newIndex].dirs
        @nextColor = @pieces[newIndex].color
        @startFromUpTile = true
        @checkLines()

  getColorFromInt: (index) ->
    switch index
      when 1 then TritrisImage.green
      when 2 then TritrisImage.red
      when 3 then TritrisImage.orange
      when 4 then TritrisImage.blue
      when 5 then TritrisImage.purple
      when 6 then TritrisImage.yellow
      else
        TritrisImage.bgTile

  getDirectedTile: (tile, i, j) ->
    signOfDirection = Math.pow(-1, i + j) == 1
    imageToDraw = if signOfDirection then tile.up else tile.down

  drawArr: (arr) ->
    for line, i in arr
      for tile, j in arr[i]
        currentTileType = @getColorFromInt tile
        imageToDraw = @getDirectedTile currentTileType, i, j
        @context.drawImage imageToDraw, 18 * i + @xOffset, 32 * j + @yOffset

  insertCurrentPiece: (arr, directions, tileCode) ->
    x = @pieceX
    y = @pieceY
    isUpTile = @startFromUpTile
    newArr = []
    for i in arr    #deepcopy arr to newArr
      newArr.push (j for j in i)
    newArr[x][y] = tileCode
    for dir in directions
      switch dir
        when 1 then (if isUpTile then x-- else x--)
        when 2 then (if isUpTile then x++ else y--)
        when 3 then (if isUpTile then y++ else x++)
      newArr[x][y] = tileCode
      isUpTile = not isUpTile
    newArr

  draw: () ->
    context.fillStyle = "#777777"
    context.font = "30pt Retro Rescued"
    if not @isGameOver
      if @paused
        context.fillText "Paused", 50, 50
        @pauseButton.draw()
      else
        if @count == 0
          @update()
        try
          @context.drawImage TritrisImage.bg, 0, 0
        catch e
        @drawArr @currentArr
        @drawArr @insertCurrentPiece @currentArr, @currentPiece, @currentColor
        @drawNext()
        @count = if @count > @upInterval then 0 else @count + 1

        context.fillText "Score: " + @score, 25, 600
        button.draw() for button in @buttons
    else
      @gameOver()

  drawNext: () ->
    isUpTile = true
    i = 0
    j = 0
    tX = 350
    tY = 50
    tileType = @getColorFromInt @nextColor
    toBeDrawn = @getDirectedTile tileType, i, j
    @context.drawImage toBeDrawn, 0, 0, 32, 32, 9 * i + tX, 16 * j + tY, 16, 16
    for dir in @nextPiece
      switch dir
        when 1 then (if isUpTile then i-- else i--)
        when 2 then (if isUpTile then i++ else j--)
        when 3 then (if isUpTile then j++ else i++)
      toBeDrawn = TritrisImage.bgUp
      tileType = @getColorFromInt @nextColor
      toBeDrawn = @getDirectedTile tileType, i, j
      @context.drawImage toBeDrawn, 0, 0, 32, 32, 9 * i + tX, 16 * j + tY, 16, 16

      isUpTile = not isUpTile

  checkLines: () ->
    for line, i in @currentArr[0]
      filled = true
      for tile, j in @currentArr
        if Math.pow(-1, i + j) == -1 and not @currentArr[j][i]
          filled = false
      if filled
        @clearLine i
        console.log i

  nextLevel: () ->
    if @level < 10 then @level += 1
    @upInterval = 25 - 2 * @level

  clearLine: (toBeCleared) ->
    for column in @currentArr
      column[1..toBeCleared] = column[0...toBeCleared]
      column[0] = 0
    @score += 100
    if @score % 300 == 0 then @nextLevel()

  checkSpace: (pieceString, plannedX, plannedY, isFirstUpTile) ->
    isNextOpen = true
    x = plannedX
    y = plannedY
    isUpTile = isFirstUpTile
    if x < @currentArr.length and y < @currentArr[0].length and x >= 0 and y >= 0
      if @currentArr[x][y] != 0
        isNextOpen = false
    else
      isNextOpen = false
    for dir in pieceString
      switch dir
        when 1 then (if isUpTile then x-- else x--)
        when 2 then (if isUpTile then x++ else y--)
        when 3 then (if isUpTile then y++ else x++)
      if x < @currentArr.length and y < @currentArr[0].length and x >= 0 and y >= 0
        if @currentArr[x][y] != 0
          isNextOpen = false
      else
        isNextOpen = false
      isUpTile = not isUpTile
    isNextOpen
  gameOver: () ->
    Clear()
    context.fillStyle = "#777777"
    context.font = "30pt Retro Rescued"
    context.fillText "Final Score: " + @score, 50, 50
    @isGameOver = true

  rotate: () ->
    newDir = []
    for dir in @currentPiece
      newDir.push dir % 3 + 1
    if @checkSpace newDir, @pieceX, @pieceY, @startFromUpTile
      @currentPiece = newDir

  rotateSixtyDegrees: () ->
    switch @flipCount
      when 0
        @flipCount = 1
        @flip()
      when 1
        @flipCount = 2
        @rotate()
        @flip()
      when 2
        @flipCount = 0
        @rotate()
        @rotate()
        @flip()

  flip: () ->
    newDir = []
    for i in @currentPiece
      if i != 1
        newDir.push (if i == 2 then 3 else 2)
      else
        newDir.push 1
    if @checkSpace newDir, @pieceX, @pieceY + @currentInc, not @startFromUpTile
      @currentPiece = newDir
      @startFromUpTile = not @startFromUpTile
      @pieceY += @currentInc
      @currentInc *= -1
  acceptKey: (code) ->
    switch code
      when KeyBindings.changeGravity then @gravityButton.clicked()
      when KeyBindings.left then if (@checkSpace @currentPiece, @pieceX - 2, @pieceY, @startFromUpTile) then @pieceX -= 2
      when KeyBindings.right then if (@checkSpace @currentPiece, @pieceX + 2, @pieceY, @startFromUpTile) then @pieceX += 2
      when KeyBindings.rotate then @rotate()
      when KeyBindings.flip then @flip()
      when KeyBindings.down
        @count = 0
  releaseKey: (code) ->


class Menu
  constructor: (@context) ->
    @menuBg = new Image()
    @menuBg.src = "images/menu.png"
  draw: () ->
    @context.drawImage @menuBg, 0, 0

# Clear the Canvas
Clear = () ->
  context.fillStyle = '#000000'
  context.beginPath()
  context.rect 0, 0, width, height
  context.closePath()
  context.fill()

gameState = "AtMenu"

mouseListener = (e) ->
  if gameState == "AtMenu" then gameState = "StartGame"
  if gameState == "GameOver" then gameState = "AtMenu"
keyDown = (e) ->
  if gameState == "InGame"
    board.acceptKey(e.keyCode)
keyUp = (e) ->
  if gameState == "InGame"
    board.releaseKey(e.keyCode)
addKeyObservers = () ->
  document.addEventListener 'click', mouseListener, false
  document.addEventListener 'keydown', keyDown, false
  document.addEventListener 'keyup', keyUp, false

## Game Code
# Game Canvas Setup
width = 416
height = 658
widthScaling = window.innerWidth / width
heightScaling = window.innerHeight / height
scaling = Math.min(widthScaling, heightScaling)

canvas = document.getElementById 'gameCanvas'
canvas.width = width * scaling
canvas.height = height * scaling

context = canvas.getContext '2d'

hammerOptions = {
  preventDefault: true
}
hammer = new Hammer(canvas)
hammer.on 'dragleft', _.debounce((() -> board.acceptKey KeyBindings.left), 100)
hammer.on 'dragright', _.debounce((() -> board.acceptKey KeyBindings.right), 100)
hammer.on 'dragdown', _.debounce((() -> board.acceptKey KeyBindings.down), 100)


# Game Setup
gLoop = 0
points = 0

context.scale scaling, scaling
menu = new Menu(context)
board = new Board(context, scaling)
addKeyObservers()
waltzLoop = new buzz.sound([
  "sounds/WaltzLoop.ogg",
  "sounds/WaltzLoop.mp3",
  "sounds/WaltzLoop.aac",
  "sounds/WaltzLoop.wav"
]);
waltzLoop.play()
waltzLoop.loop()

GameLoop = () ->
  Clear()
  switch gameState
    when "StartGame"
      board = new Board(context, scaling)
      gameState = "InGame"
    when "AtMenu" then menu.draw()
    when "InGame"
      board.draw()
      waltzLoop.setSpeed(0.9 + 0.1 * board.level)
      if board.isGameOver then gameState = "GameOver"
    when "GameOver" then board.gameOver()
  if state is true
    gLoop = setTimeout GameLoop, 1000 / 50

GameLoop()