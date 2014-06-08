relMouseCoordsWithin = (event, canvas, x, y, width, height) ->
  totalOffsetX = 0
  totalOffsetY = 0
  canvasX = 0
  canvasY = 0
  currentElement = canvas

  totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft
  totalOffsetY += currentElement.offsetTop - currentElement.scrollTop
  while currentElement = currentElement.offsetParent
    totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft
    totalOffsetY += currentElement.offsetTop - currentElement.scrollTop

  canvasX = event.pageX - totalOffsetX
  canvasY = event.pageY - totalOffsetY
  if x <= canvasX and canvasX <= x + width
    if y <= canvasY and canvasY <= y + height
      return true
  return false

class window.CanvasButton
  constructor: (@canvas, @context, @scaling, @inactiveImg, @activeImg, @x, @y, @onEvent, @offEvent) ->
    @currentImage = inactiveImg
    @width = inactiveImg.width * scaling
    @height = inactiveImg.height * scaling
    @trueX = x * scaling
    @trueY = y * scaling
    self = @
    @mouseDownEvent = (ev) ->
      if relMouseCoordsWithin ev, self.canvas, self.trueX, self.trueY, self.width, self.height
        self.clicked()
    @mouseUpEvent = (ev) ->
      if relMouseCoordsWithin ev, self.canvas, self.trueX, self.trueY, self.width, self.height
        self.released()
    @canvas.addEventListener 'mousedown', @mouseDownEvent, false
    @canvas.addEventListener 'mouseup', @mouseUpEvent, false
  clicked: () ->
    return
  released: () ->
    return
  draw: () ->
    @context.drawImage @currentImage, @x, @y

class window.ToggleButton extends CanvasButton
  constructor: (@canvas, @context, @scaling, @inactiveImg, @activeImg, @x, @y, @onEvent, @offEvent) ->
    super @canvas, @context, @scaling, inactiveImg, activeImg, @x, @y, onEvent, offEvent
    @isToggled = false
  clicked: () ->
    @isToggled = not @isToggled
    @currentImage = if @isToggled then @activeImg else @inactiveImg
    if @isToggled then @onEvent() else @offEvent()

class window.ClickButton extends CanvasButton
  clicked: () ->
    @onEvent()
    @currentImage = @activeImg
    @draw()
  released: () ->
    @offEvent()
    @currentImage = @inactiveImg
    @draw()

