document.addEventListener('DOMContentLoaded', function() {
    var myBoard = GenerateBoard();
    myBoard.drawBoard(8);
}, false);

function GenerateBoard() {
    var size;
    var queens = [];
    var DELTA_X = 80;
    var DELTA_Y = 80;
    
    //draws a board of size size - intialises the size variable;
    function drawBoard(size){
        this.size = size;
        for(i = 0; i< this.size; i++){
            queens[i] = [size];
        }
        d3.select("svg").attr("style","height: "+size*DELTA_Y+"px; width: "+size*DELTA_X+"px;");
        for(i = 0; i<this.size; i++){
            for(j = 0; j<this.size; j++){
                d3.select("svg")
                .append("rect")
                .attr("width", DELTA_X)
                .attr("height", DELTA_Y)
                .attr("x", function(){ return (i * DELTA_X);})
                .attr("y", function(){ return (j * DELTA_Y);})
                .style("fill", function(){return((i+j)%2 ==0)? "black": "white"})
                .style("troke", "black")
                .style("stroke-width", "1px");       
            }
        }   
    }
    
    //checks if a queen in position(i,j) is safe.  returns true or false
    function check(i, j){
        var clear = true;
        //check horizontal
        for(k = 0; k<size; k++){
            if ((queens[i][k] === 1) && (k!=j)){
                //hLine(k)
                clear = false;
            }
        }
        //check horizontal
        for(k = 0; k<size; k++){
            if ((queens[k][j] === 1) && (k!=i)){
                //vLine(k)
                clear = false;
            }
        }
        //check diagonal right
        if(i >= j){
            var diff = i - j;
            for(k = diff; k<size; k++){
                if ((queens[k][k-diff] === 1) && (k!=i)){
                    //drLine(i,j)
                    clear = false;
                }
            }
        } else {
            var diff = j - i;
            for(k = diff; k<size; k++){
                if ((queens[k-diff][k] === 1) && (k!=j)){
                    //dlLine(i,j)
                    clear = false;
                }
            }
        }
        //check diagonal left
        if((i+j)<size){
            var sum = i+j;
            for(k=0; k<=sum; k++){
                if((queens[k][sum-k] === 1) & (k!=i)){
                    //drline(i,j)
                    clear = false;
                }
            }
        } else {
            var sum = i+j-(size-1);
            for(k = sum; k<size; k++){
                if((queens[k][size-1-k] === 1) & (k!=i)){
                    //drline(i,j)
                    clear = false;
                }
            }
        }
        return clear;  
    }
    
    return{
        drawBoard: drawBoard,
        check: check
    }
}