imagePath = "images/"

loadImage = (name) ->
	loadedImage = new Image()
	loadedImage.src = imagePath + name + ".png"
	loadedImage

loadTile = (colorName) ->
	up: loadImage("Tile" + colorName + "Up")
	down: loadImage("Tile" + colorName + "Down")

window.TritrisImage =
	bg : loadImage("bg")

	green: loadTile("Green")
	red: loadTile("Blue")
	blue: loadTile("Blue")
	orange: loadTile("Orange")
	purple: loadTile("Purple")
	yellow: loadTile("Yellow")
	green: loadTile("Green")
	bgTile: loadTile("Bg")

	leftDir : loadImage("LeftDirIndicator")
	rightDir : loadImage("RightDirIndicator")
