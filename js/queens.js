var myBoard;

document.addEventListener('DOMContentLoaded', function() {
    myBoard = GenerateBoard();
    myBoard.drawBoard(8);
    recursiveTest(0);
}, false);

function recursiveDrop(i) {
    var DROPPAUSE = 700;
    var yDim = myBoard.getDimensionY();
    var halfYDim = yDim/2;
    var steps = myBoard.getSize();
    var cy = d3.select("svg")
    .select("#q"+i)
    .attr("cy");
    cy = parseInt(cy);
    cy = (cy-halfYDim)/yDim;
    if(cy <= steps){
        myBoard.downQueen(i);
        setTimeout(function(){new recursiveDrop(i)}, DROPPAUSE);
    } else {
        myBoard.resetQueen(i);
        setTimeout(function(){new recursiveDrop(i)}, DROPPAUSE);
        
    }

}

function recursiveTest(i) {
    var DROPPAUSE = 700;
    var yDim = myBoard.getDimensionY();
    var halfYDim = yDim/2;
    var steps = myBoard.getSize();
    var j = getPosition();
    
    if(j < steps){
        myBoard.downQueen(i);
        if(myBoard.check(i, j+1))
            setTimeout(function(){new recursiveTest(j+1)}, DROPPAUSE);
        else
            setTimeout(function(){new recursiveTest(j)}, DROPPAUSE);
    } else {
        myBoard.resetQueen(j);
        setTimeout(function(){new recursiveTest(j-1)}, DROPPAUSE);
        
    }
    
    function getPosition(){
        var cy = d3.select("svg")
        .select("#q"+j)
        .attr("cy");
        var i = parseInt(cy);
        i = (cy-halfYDim)/yDim;
        return i;
        
    }
    
    
}

function GenerateQueen() {
    var iPos;   //iPos.  remains permanent once instantiated
    var jPos;   //jPos.  frequently changes
    var delta;  //delta.  length/width of chess box

    function getI() {
        return iPos;
    }

    function getJ() {
        return jPos;
    }

    function drawQueen(i, j, delta) {
        iPos = i;
        jPos = j;
        this.delta = delta;

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

        var cy = jPos*(delta) + (delta/2); 

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

function GenerateBoard() {
    var boardSize;
    var board = [];
    var DELTA = 80;
    var DROPTIME = 500;
    
    function getSize(){
        return boardSize;
    }
    
    function getDimensionX() {
        return DELTA;
    }
    
    function getDimensionY() {
        return DELTA;
    }
    
    //draws a board of size size - intialises the size variable;
    function drawBoard(size){
        boardSize = size;
        for(j = 0; j< boardSize; j++){
            board[j] = [];
            for(i=0; i<boardSize; i++)
                board[j][i] = 0;
        };
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
        //draw hidden queens
        for(i=0; i<boardSize; i++){

            //draw queens to populate board array here

        }
    }
    
    //checks if a queen in position(i,j) is safe.  returns true or false
    function check(i, j){
        var isClear = true;
        //check horizontal
        for(k = 0; k<boardSize; k++){
            //console.log(board[k][i]);
            if ((board[k][i] == 1) && (k != j)){
                hLine(i);
                isClear = false;
            };
        };
        //check diagonal right
        if(i >= j){
            var diff = i - j;
            for(k = diff; k<boardSize; k++){
                if ((board[k-diff][k] == 1) && (k!=i)){
                    drLine(i,j);
                    isClear = false;
                }
            }
        } else {
            var diff = j - i;
            for(k = diff; k<boardSize; k++){
                if ((board[k][k-diff] == 1) && (k!=j)){
                    dlLine(i,j);
                    isClear = false;
                };
            };
        };
        //check diagonal left
        if((i+j)<boardSize){
            var sum = i+j;
            for(k=0; k<=sum; k++){
                if((board[k][sum-k] == 1) & (k!=j)){
                    dlLine(i,j);
                    isClear = false;
                };
            };
        } else {
            var sum = i + j;
            var start = sum - boardSize + 1;
            var end = boardSize - 1;
            // var end = boardSize-1;
            for(k = start; k<=end; k++){
                if((board[k][sum - k] == 1) & (k!=i)){
                    console.log("i:"+k+", j:"+(sum- k));
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
        var x2 = scaleUp(boardSize);
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
        d3.select("svg")
        .append("line")
        .attr("x1", x1)
        .attr("x2", x2)
        .attr("y1", y1)
        .attr("y2", y2)
        .style("stroke", "red")
        .style("stroke-width", "20px")
        .style("opacity", 50);
    }
    
    function clearLines(){
        d3.select("svg").selectAll("line").remove();
    }
    
    //advances queen in column j down by 1, checks validity, returns true if clear and false if not clear
    function downQueen(j){
        clearLines(); 
        var cy = d3.select("svg")
        .select("#q"+ j)
        .attr("cy");       
        cy = parseInt(cy);
        cy += DELTA;
        newSlot=(cy-(DELTA/2))/DELTA;

        d3.select("svg")
        .select("#q" + j)
        .transition()
        .duration(DROPTIME)
        .attr("cy", cy);
        
        if(newSlot > 0)                 //this is needed here somehow
            board[j][newSlot - 1] = 0;
        if(newSlot < boardSize)
            board[j][newSlot] = 1;  
        //console.log("board["+j+"]["+(newSlot)+"] = "+ board[j][newSlot]);
        
    }
    
    function resetQueen(j) {
        board[j] = [];
        d3.select("svg")
        .select("#q"+j)
        .remove();
        
        d3.select("svg")
            .append("circle")
            .attr("id", "q"+j)
            .attr("r", DELTA/2 + "px")
            .attr("cx", (j * DELTA) + (DELTA / 2))
            .attr("cy", -1*(DELTA / 2))
            .style("fill", "blue");
    }
    
    return{
        drawBoard: drawBoard,
        getSize: getSize,
        getDimensionX: getDimensionX,
        getDimensionY: getDimensionY,
        check: check,
        downQueen: downQueen,
        resetQueen: resetQueen
    }
}