document.addEventListener('DOMContentLoaded', function() {
    var myBoard = GenerateBoard();
    myBoard.drawBoard(8);
    myBoard.downQueen(1);
}, false);

function GenerateBoard() {
    var size;
    var board = [];
    var DELTA_X = 80;
    var DELTA_Y = 80;
    
    //draws a board of size size - intialises the size variable;
    function drawBoard(size){
        this.size = size;
        for(i = 0; i< this.size; i++){
            board[i] = [size];
        }
        d3.select("svg").attr("style","height: "+size*DELTA_Y+"px; width: "+size*DELTA_X+"px;");
        //draw boxes
        for(i = 0; i<this.size; i++){
            for(j = 0; j<this.size; j++){
                d3.select("svg")
                .append("rect")
                .attr("width", DELTA_X)
                .attr("height", DELTA_Y)
                .attr("x", function(){ return (i * DELTA_X);})
                .attr("y", function(){ return (j * DELTA_Y);})
                .style("fill", function(){return((i+j)%2 ==0)? "black": "white"})
                .style("stroke", "black")
                .style("stroke-width", "1px");       
            }
        }
        //draw hidden queens
        for(i=0; i<this.size; i++){
            d3.select("svg")
            .append("circle")
            .attr("id", "q"+i)
            .attr("r", DELTA_Y/2 + "px")
            .attr("cx", (i * DELTA_X) + (DELTA_X / 2))
            .attr("cy", -1*(DELTA_Y / 2))
            .style("fill", "blue");
        }
    }
    
    //checks if a queen in position(i,j) is safe.  returns true or false
    function check(i, j){
        var clear = true;
        //check horizontal
        for(k = 0; k<size; k++){
            if ((board[i][k] === 1) && (k!=j)){
                hLine(k)
                clear = false;
            }
        }
        //check vertical
        for(k = 0; k<size; k++){
            if ((board[k][j] === 1) && (k!=i)){
                vLine(k)
                clear = false;
            }
        }
        //check diagonal right
        if(i >= j){
            var diff = i - j;
            for(k = diff; k<size; k++){
                if ((board[k][k-diff] === 1) && (k!=i)){
                    //drLine(i,j)
                    clear = false;
                }
            }
        } else {
            var diff = j - i;
            for(k = diff; k<size; k++){
                if ((board[k-diff][k] === 1) && (k!=j)){
                    //dlLine(i,j)
                    clear = false;
                }
            }
        }
        //check diagonal left
        if((i+j)<size){
            var sum = i+j;
            for(k=0; k<=sum; k++){
                if((board[k][sum-k] === 1) & (k!=i)){
                    drline(i,j)
                    clear = false;
                }
            }
        } else {
            var sum = i+j-(size-1);
            for(k = sum; k<size; k++){
                if((board[k][size-1-k] === 1) & (k!=i)){
                    drline(i,j)
                    clear = false;
                }
            }
        }
        return clear;  
    }
    
    //draw a horizontal line across the board from point in row i.
    function hLine(i){
        var x1 = DELTA_X/2;
        var x2 = (size * DELTA_X) - (DELTA_X / 2);
        var y = (size * i * DELTA_Y) - (DELTA_Y / 2);
        
        drawLine(x1, x2, y, y);
    }
    
    //draw a vertical line across the board from point in column j.
    function vLine(j){
        var x = (size * i * DELTA_X) - (DELTA_X / 2);
        var y1 = DELTA_Y/2;
        var y2 = (size * DELTA_Y) - (DELTA_Y / 2);
        
        drawLine(x, x, y1, y2);
    }
    
    //draw a diagonal line moving down to the right
    function drLine(i, j){
        if(i >= j){
            var diff = i - j;
            var x1 = 0;
            var x2 = size - 1 - diff;
            var y1 = diff;
            var y2 = size-1;
            drawLine(x1, x2, y1, y2);
        } else {
            var diff = j - i;
            var x1 = diff;
            var x2 = size - 1;
            var y1 = 0;
            var y2 = size - 1 - diff;
            drawLine(x1, x2, y1, y2);
        }
    }
    
    //draw a diagonal line moving down to the left 
    function dlLine(i, j){
        if((i+j) < size){
            var sum = i + j;
            var x1 = 0;
            var y1 = sum;
            var x2 = sum;
            var y2 = 0;
            drawLine(x1, x2, y1, y2);
        } else {
            var sum = i + j;
            var x1 = sum - size + 1;
            var y1 = size - 1;
            var x2 = size - 1;
            var y2 = sum - size + 1;
            drawLine(x1, x2, y1, y2);
        }
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
        dr.select("svg").selectAll("line").remove();
    }
    
    //advances queen in column j down by 1, checks validity, returns true if clear and false if not clear
    function downQueen(j){
        var cy = d3.select("svg")
        .select("#q"+ j)
        .attr("cy");
        
        cy = parseInt(cy);
        
        //alert("y location:" + cy);
        
        cy += 80;
        
         //alert("y location:" + newCy);
        
        d3.select("svg")
        .select("#q" + j)
        .transition()
        .duration(500)
        .attr("cy", cy);
        
    }
    
    return{
        drawBoard: drawBoard,
        check: check,
        downQueen: downQueen
    }
}