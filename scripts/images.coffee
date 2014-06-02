imagePath = "images/"

loadImage = (name) ->
	loadedImage = new Image()
	loadedImage.src = imagePath + name + ".png"
	loadedImage

window.TritrisImage =
	bg : loadImage("bg")

	greenUp: loadImage("TileGreenUp")
	greenDown: loadImage("TileGreenDown")
	redUp: loadImage("TileRedUp")
	redDown: loadImage("TileRedDown")
	blueUp: loadImage("TileBlueUp")
	blueDown: loadImage("TileBlueDown")
	orangeUp: loadImage("TileOrangeUp")
	orangeDown: loadImage("TileOrangeDown")
	purpleUp: loadImage("TilePurpleUp")
	purpleDown: loadImage("TilePurpleDown")
	yellowUp: loadImage("TileYellowUp")
	yellowDown: loadImage("TileYellowDown")

	
	bgUp : loadImage("TileBgUp")
	bgDown : loadImage("TileBgDown")
	
	leftDir : loadImage("LeftDirIndicator")
	rightDir : loadImage("RightDirIndicator")
