var myBoard;
var boardControl;

document.addEventListener('DOMContentLoaded', function() {
    myBoard = GenerateBoard();
    boardControl = GenerateBoardControl();
    myBoard.drawBoard(boardControl.getDimension());
    var dim = boardControl.getDimension();
    initSelections("#numSqrs", 1, 27, dim);
    initButtons();
    //boardControl.faster();
    //boardControl.faster();
    //boardControl.faster();
    boardControl.setRunning(false);
    recursiveTest(0);
}, false);

function recursiveTest(i) {
    boardControl.setLastColumn(i);
    steps = myBoard.getSize() - 1;
    if (boardControl.isRunning()){
        if (myBoard.getPositionQueen(i) < steps){
            if (myBoard.downQueen(i) && (i < steps)){
                setTimeout(function(){new recursiveTest(i + 1)}, boardControl.getDropPause());
            } else {
                setTimeout(function(){new recursiveTest(i)}, boardControl.getDropPause());
            }
        } else {
            myBoard.resetQueen(i);
            if(i>0) {
                setTimeout(function(){new recursiveTest(i - 1)}, boardControl.getDropPause());
            } else {
                boardControl.setRunning(false);
                setTimeout(function(){new recursiveTest(i)}, boardControl.getDropPause());
            }
        }
    } else {
        $("#stopButton").button("toggle");
    }

    if(myBoard.getIsWon()) {
        boardControl.setRunning(false);
    }
}

function GenerateQueen() {
    var iPos;   //iPos.  remains permanent once instantiated
    var jPos;   //jPos.  frequently changes
    var delta;  //delta.  length/width of chess box

    function getI() {   //possibly unused and can be deleted
        return iPos;
    }

    function getJ() {
        return jPos;
    }

    function drawQueen(i, j, del) {
        iPos = i;
        jPos = j;
        delta = del;

        d3.select("svg")
        .append("circle")
        .attr("id", "q"+iPos)
        .attr("r", delta/2 + "px")
        .attr("cx", (iPos * delta) + (delta / 2))
        .attr("cy", (jPos * delta) + (delta / 2))
        .style("fill", "blue");
    }

    function moveQueen(dropTime) {   //animates motion to present jPos
        myBoard.clearLines();

        var cy = (jPos * delta) + (delta / 2); 

        d3.select("svg")
        .select("#q" + iPos)
        .transition()
        .duration(dropTime)
        .attr("cy", cy);
    }

    function downQueen(dropTime) {  //sets new jPos, calls animation
        jPos += 1;
        moveQueen(dropTime);
    }

    function resetQueen(dropTime) { //resets jPos, calls animation
        jPos = -1;
        moveQueen(dropTime);
    }

    return {
        getI: getI,                 //returns i position
        getJ: getJ,                 //returns j position
        drawQueen: drawQueen,       //instantiates queen with i, j, delta
        downQueen: downQueen,       //drops queen one space
        resetQueen: resetQueen      //resets queen to top
    }
}

function GenerateBoardControl() {
    var running = false;
    var dimension = 4;
    var dropPause = 768;
    var dropTime = 512;
    var lastColumn = 0;

    function isRunning() {
        return running;
    }

    function getDimension() {
        return dimension;
    }

    function getDropPause() {
        return dropPause;
    }

    function getDropTime(){
        return dropTime;
    }

    function getLastColumn(){
        return lastColumn;
    }

    function setRunning(i) {
        running = i;
    }

    function setDimension(i) {
        dimension = i;
    }

    function setLastColumn(i) {
        lastColumn = i;
    }

    function faster() {
        dropPause/=2;
        dropTime/=2;
    }

    function slower() {
        dropPause*=2;
        dropTime*=2;
    }

    return {
        isRunning: isRunning,
        getDimension: getDimension,
        getDropPause: getDropPause,
        getDropTime: getDropTime,
        getLastColumn: getLastColumn,
        setRunning: setRunning,
        setDimension: setDimension,
        setLastColumn: setLastColumn,
        faster: faster,
        slower: slower
    }

}

function GenerateBoard() {
    var boardSize;
    var board = [];
    var MAXSIZE = 500;
    var DELTA;
    var LINEWIDTH;
    var DROPTIME = 500;
    var isWon;
    
    function getSize(){
        return boardSize;
    }
    
    function getDimensionBox() {
        return DELTA;
    }

    function getPositionQueen(i) {
        return board[i].getJ();
    }

    function getIsWon() {
        return isWon;
    }

    function setIsWon( won ) {
        isWon = won;
    }
    
    //draws a board of size size - intialises the size variable;
    function drawBoard(size){
        boardSize = size;   //set boardSize attribute
        DELTA = Math.floor(MAXSIZE /  boardSize);
        LINEWIDTH = Math.ceil(DELTA / 5);

        d3.select("svg").attr("style","height: "+size*DELTA+"px; width: "+size*DELTA+"px;");
        //draw boxes
        for(i = 0; i<boardSize; i++){
            for(j = 0; j<boardSize; j++){
                d3.select("svg")
                .append("rect")
                .attr("width", DELTA)
                .attr("height", DELTA)
                .attr("x", function(){ return (i * DELTA);})
                .attr("y", function(){ return (j * DELTA);})
                .style("fill", function(){return((i+j)%2 ==0)? "black": "white"})
                .style("stroke", "black")
                .style("stroke-width", "1px");       
            }
        }
        //populate board array with hidden queens
        for(i = 0; i < boardSize; i++){
            board[i] = new GenerateQueen();
            board[i].drawQueen(i, -1, DELTA);
        }
    }
    
    //checks if a queen in position(i,j) is safe.  returns true or false
    function check(i, j){
        var isClear = true;
        //check horizontal
        for(k = 0; k<boardSize; k++){
            if ((board[k].getJ() == j) && (k != i)){
                hLine(j);
                isClear = false;
            };
        };
        //check diagonal down-right
        if(i >= j){
            var diff = i - j;
            var start = diff;
            var end = boardSize - 1;
            for(k = start; k<=end; k++){
                if ((board[k].getJ() == (k - diff)) && (k!=i)){
                    drLine(i,j);
                    isClear = false;
                }
            }
        } else {
            var diff = j - i;
            var start = 0;
            var end = boardSize - diff - 1;
            for(k = start; k<=end; k++){
                if ((board[k].getJ() == (k + diff)) && (k!=i)){
                    drLine(i,j);
                    isClear = false;
                };
            };
        };
        //check diagonal down-left
        var sum = i + j;
        if( sum < boardSize){
            for(k=0; k<=sum; k++){
                if((board[k].getJ() == (sum - k)) & (k!=i)){
                    dlLine(i,j);
                    isClear = false;
                };
            };
        } else {
            var start = sum - boardSize + 1;
            var end = boardSize - 1;
            for(k = start; k<=end; k++){
                if((board[k].getJ() == (sum - k)) & (k!=i)){
                    dlLine(i,j);
                    isClear = false;
                };
            };
        };
        return isClear;  
    }
    
    //draw a horizontal line across the board from point in row i.
    function hLine(i){
        var x1 = scaleUp(0);
        var x2 = scaleUp(boardSize - 1);
        var y = scaleUp(i);        
        drawLine(x1, x2, y, y);
        //alert("i:" + i+ " x1:"+x1+ " x2:"+x2+" y1:"+y+ " y2:"+y);
    }
    
    //draw a diagonal line moving down to the right
    function drLine(i, j){
        if(i >= j){
            var diff = i - j;
            var x1 = scaleUp(diff);
            var y1 = scaleUp(0);
            var x2 = scaleUp(boardSize - 1);
            var y2 = scaleUp(boardSize - 1 - diff);
            drawLine(x1, x2, y1, y2);
        } else {
            var diff = j - i;
            var x1 = scaleUp(0);
            var y1 = scaleUp(diff);
            var x2 = scaleUp(boardSize - 1 - diff);
            var y2 = scaleUp(boardSize - 1);
            drawLine(x1, x2, y1, y2);
        }
    }
    
    //draw a diagonal line moving down to the left 
    function dlLine(i, j){
        if((i+j) < boardSize){
            var sum = i + j;
            var x1 = scaleUp(0);
            var y1 = scaleUp(sum);
            var x2 = scaleUp(sum);
            var y2 = scaleUp(0);
            drawLine(x1, x2, y1, y2);
        } else {
            var sum = i + j;
            var x1 = scaleUp(sum - boardSize + 1);
            var y1 = scaleUp(boardSize - 1);
            var x2 = scaleUp(boardSize - 1);
            var y2 = scaleUp(sum - boardSize + 1);
            drawLine(x1, x2, y1, y2);
        }
    }
    
    function scaleUp(val){
        val *= DELTA;
        val += DELTA/2;
        return val;
    }
    
    function drawLine(x1, x2, y1, y2){
        setTimeout(function(){
            d3.select("svg")
            .append("line")
            .attr("x1", x1)
            .attr("x2", x2)
            .attr("y1", y1)
            .attr("y2", y2)
            .style("stroke", "red")
            .style("stroke-width", LINEWIDTH + "px")
            .style("opacity", 0.8);
        }, (boardControl.getDropTime()/2));
    }
    
    function clearLines(){
        d3.select("svg").selectAll("line").remove();
    }
    
    //advances queen in column i down by 1, checks validity, returns true if clear and false if not clear
    function downQueen(i){
        board[i].downQueen(boardControl.getDropTime());
        if(((i+1)== boardSize) && check(i, board[i].getJ())) isWon = true;
        return check(i, board[i].getJ());
    }
    
    function resetQueen(i) {
        board[i].resetQueen(boardControl.getDropTime());
    }
    
    return{
        drawBoard: drawBoard,
        getSize: getSize,
        getDimensionBox: getDimensionBox,
        getPositionQueen: getPositionQueen,
        getIsWon: getIsWon,
        setIsWon: setIsWon,
        check: check,
        clearLines: clearLines,
        downQueen: downQueen,
        resetQueen: resetQueen
    }
}