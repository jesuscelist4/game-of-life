function Population(rows, columns) {
  if(!rows || !columns || rows < 0 || columns < 0){
    return;
  }
   
  this.cells = new Array(rows);
  for (var i = 0; i < rows; i++) {
    this.cells[i] = new Array(columns);
    
    for (var j = 0; j < columns; j++){
      this.killCell(i,j);
    }
  }
};

Population.prototype.isValid = function() {
  if (this.cells && this.cells.length && this.cells[0].length ){
    return true;
  }
  return false;
};

Population.prototype.firstGeneration = function(value) {
  if (!this.isValid()){
    return;
  }

  this.randomGeneration();
};

Population.prototype.randomGeneration = function(){
  for (i=0; i<this.numberOfRows(); i++){
    for (j=0; j<this.numberOfColumns(); j++){
      this.setCell(i,j,Math.round(Math.random()));
    }
  }
};

Population.prototype.size = function() {
  if (!this.isValid()){
    return 0;
  }

  return this.numberOfRows() * this.numberOfColumns();
};

Population.prototype.numberOfRows = function(){
  if (!this.isValid()){
    return 0;
  }

  return this.cells.length;
};

Population.prototype.numberOfColumns = function(){
  if (!this.isValid()){
    return 0;
  }

  return this.cells[0].length;
};

Population.prototype.isValidReference = function(row, column){
  var isValidRow = row >= 0 && row < this.numberOfRows(),
      isValidColumn = column >= 0 && column < this.numberOfColumns();
  return isValidRow && isValidColumn
};

Population.prototype.cell = function(row, column){
  if (this.isValidReference(row, column)){
    return this.cells[row][column];
  }
};

Population.prototype.setCell = function(row, column, value){
   if (this.isValidReference(row, column)){
     this.cells[row][column]=value;
   }
};

Population.prototype.killCell= function(row, column){
  this.setCell(row,column,0);
};

Population.prototype.reviveCell = function(row, column){
  this.setCell(row,column,1);
};

Population.prototype.nextGeneration = function(){
  var nextGeneration = new Population(this.numberOfRows(), this.numberOfColumns());

  for(var i = 0; i < this.numberOfRows(); i++){
    for(var j = 0; j < this.numberOfColumns(); j++){
      if (this.numberOfAliveCells(i,j)===2){
        nextGeneration.setCell(i,j,this.cell(i,j));
      } else if(this.numberOfAliveCells(i,j)===3){
        nextGeneration.reviveCell(i,j);
      } else {
        nextGeneration.killCell(i,j);
      }
    }
   }
   return nextGeneration;
};

Population.prototype.numberOfAliveCells = function(row, column){
   var aliveCells = 0,
       upperRow = row - 1,
       lowerRow = row + 1,
       leftColumn = column -1,
       rightColumn= column + 1;

   if (!this.isValidReference(row, column)){
      return;
   }

   for (var i = upperRow; i <= lowerRow; i++){
      for (var j = leftColumn; j <= rightColumn; j++){
         if(this.isValidReference(i, j)){
            aliveCells += this.cell(i, j);
         }
      }
   }

   return aliveCells - this.cell(row,column);
}
