function initSelections(idTag, minVal, maxVal, defVal) {
  var selectionList = "";
  for (var j = minVal; j <= maxVal; j++) {
    selectionList += ("<option" + ((j == defVal) ? " selected = 'selected'" : "") + ">" + j + "</option>");
  };
  $(idTag).html(selectionList);
}

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

$('#slowerButton').click(function() {
	boardControl.slower();
});

$('#fasterButton').click(function() {
	boardControl.faster();
});

$('#resSpdButton').click(function() {
	boardControl.resetSpeed();
});