function initButtons(){
	$("#stopButton").button("toggle");
}

$('#playButton').click(function() {
	boardControl.setRunning(true);
	myBoard.setIsWon(false);
	setTimeout(function(){new recursiveTest(boardControl.getLastColumn())}, boardControl.getDropPause());
});

$('#stopButton').click(function() {
	boardControl.setRunning(false);
});

$('#speed').slider({
	reversed:true
});

var localSizeControl = function(){
	boardControl.setRunning(false);
	d3.selectAll("svg > *").remove();
	boardControl = GenerateBoardControl();
	var newSize = sizeSlider.getValue();
	boardControl.setDimension(newSize);
	var dim = boardControl.getDimension();
	myBoard.initBoard(dim);
	myBoard.drawBoard();
	initButtons();
	setTimeout(function(){
		myBoard.clearLines();
	}, boardControl.getDropPause());
}

var sizeSlider = $('#size').slider().on('slide', localSizeControl).data('slider');

var localSpeedControl = function(){
	boardControl.setSpeed(speedSlider.getValue());
}

var speedSlider = $('#speed').slider().on('slide', localSpeedControl).data('slider');

$('#resSpdButton').click(function() {
	speedSlider.setValue(768, true);
});

window.addEventListener('resize', function(event) {
	myBoard.redraw();
});