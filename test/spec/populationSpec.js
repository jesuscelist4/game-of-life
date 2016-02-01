describe("Game of life", function() {
  var status = [0,1];

  describe("Population constructor", function(){
    it("Return a new population", function() {
      var population = new Population(0,0);
      expect(population).not.toBe(null);
    });

    it("Return a valid population when population has at least 1 cell", function(){
      var population = new Population(1,1);
      expect(population.isValid()).toBe(true);
    });

    it("All cells in population should be dead", function() {
      var population = new Population(2,2);

      for (i = 0; i < population.numberOfRows(); i++){
        for (j=0; j < population.numberOfColumns(); j++){
          expect(population.cells[i][j]).toBe(0);
        }
      }
    });
  });

  describe("Invalid population is returned", function(){
    it("When negative number of rows", function(){
      var population = new Population(-1,3);
      expect(population.isValid()).toBe(false);
    });

    it("When negative number of columns", function(){
      var population = new Population(3,-1);
      expect(population.isValid()).toBe(false);
    });

    it("When empty populations", function(){
      var population = new Population(0,0);
      expect(population.isValid()).toBe(false);
    });

    it("When no rows", function(){
      var population = new Population(0,1);
      expect(population.isValid()).toBe(false);
    });

    it("When no columns", function(){
      var population = new Population(1,0);
      expect(population.isValid()).toBe(false);
    });
  });

  describe("Init a population", function(){
    it("With empty params generates a random population", function(){
      var population = new Population(1,1);
      spyOn(population, 'randomGeneration');

      population.firstGeneration();

      expect(population.randomGeneration).toHaveBeenCalled();
    });
  })

  describe("Random Generation", function(){
    var population;

    beforeEach(function(){
       population = new Population(2,2);
    });

    it("generate population with size random cells", function(){
      spyOn(population, 'setCell');
      spyOn(Math, 'random');
      population.randomGeneration();
      expect(population.setCell.calls.count()).toEqual(population.size());
      expect(Math.random.calls.count()).toEqual(population.size());
    });

    it("generate population with 0 or 1 values", function(){
      population.randomGeneration();
      for (i=0; i < population.numberOfRows(); i++){
        for (j=0; j < population.numberOfColumns(); j++){
          expect(status).toContain(population.cell(i,j));
        }
      }
    });
  });
  
  describe("Size of", function(){
    it("Invalid population return 0", function() {
      var population = new Population(0,0);
      expect(population.size()).toBe(0);
    });

    it("Valid population a value greater than 0", function() {
      var population = new Population(1,1);
      expect(population.size()).toBeGreaterThan(0);
    });
  });

  describe("Number of", function(){
    describe("Rows of", function(){
      it("Invalid population return 0", function() {
        var population = new Population(0,0);
        expect(population.numberOfRows()).toBe(0);
      });

      it("Valid population return a value greater than 0", function() {
        var population = new Population(1,1);
        expect(population.numberOfColumns()).toBeGreaterThan(0);
      });
    });

    describe("Columns of", function(){
      it("Invalid population return 0", function() {
        var population = new Population(0,0);
        expect(population.numberOfColumns()).toBe(0);
      });

      it("Valid population return a value greater than 0", function() {
        var population = new Population(1,1);
        expect(population.numberOfRows()).toBeGreaterThan(0);
      });
    });
  });
  
  describe("Is valid refence return", function(){
    var population;

    beforeEach(function(){
      population = new Population(2,2);
    });

    it("True when row and column are in bounds", function(){
      expect(population.isValidReference(1,1)).toBe(true);
    });

    describe("False when", function(){
      it("Row is negative", function(){
        expect(population.isValidReference(-1,1)).toEqual(false);
      });
      it("Row is out of bounds", function(){
        expect(population.isValidReference(3,1)).toEqual(false);
      });
      it("Column is negative", function(){
        expect(population.isValidReference(1,-1)).toEqual(false);
      });
      it("Column is out of bounds", function(){
        expect(population.isValidReference(1,2)).toEqual(false);
      });
    });
  });

  describe("Referencing a cell using", function(){
    var population;

    beforeEach(function(){
      population = new Population(1,1);
      population.firstGeneration();
    });

    it("Invalid row should return undefined", function(){
      expect(population.cell(-1,8)).toBeUndefined();
    });

    it("Valid row and column should return a valid value", function(){
      expect(status).toContain(population.cell(0,0));
    });
  });

  describe("Setting a cell using", function(){
    var population;

    beforeEach(function(){
      population = new Population(1,1);
    });

    it("Invalid row should return undefined", function(){
      expect(population.cell(-1,8)).toBeUndefined();
    });

    it("Valid row and column should return a valid value", function(){
      population.setCell(0,0,1);
      expect(population.cell(0,0)).toEqual(1);
    });
  });

  it("Nunber of alive cells return the number of adjacent alive cells", function(){
    var values, swap, population;

    for (numAlive=0; numAlive<9; numAlive++){
      population = initAliveCells(numAlive);

      if (numAlive < 5){
        expect(population.numberOfAliveCells(1,1)).toEqual(numAlive);
      } else {
        expect(population.numberOfAliveCells(1,1)).toEqual(numAlive-1);
      }
    }
  });


  describe("Next generation return", function(){
    var currentGeneration, nextPopulation;

    beforeEach(function(){
      currentGeneration = new Population(1,1);
      nextPopulation = currentGeneration.nextGeneration();
    });

    it("A new population", function(){
      expect(nextPopulation).not.toBe(null);
    });

    it("Next generation return a new population with same size of original population", function(){
      expect(nextPopulation.size()).toEqual(currentGeneration.size());
    });
  });

  describe("When generating a new generation", function(){
    var currentGeneration, nextPopulation;

    beforeEach(function(){
      currentGeneration = new Population(3,3);
    });

    it("A dead cell with 3 alive adjacent cells becomes alive", function(){
      currentGeneration.killCell(1,1);
      spyOn(currentGeneration, "numberOfAliveCells").and.returnValue(3)
      nextGeneration = currentGeneration.nextGeneration();
      expect(nextGeneration.cell(1,1)).toEqual(1);
    });

    it("An alive cell with 3 alive adjacent cells keep alive", function(){
      currentGeneration.reviveCell(1,1);
      spyOn(currentGeneration, "numberOfAliveCells").and.returnValue(3)
      nextGeneration = currentGeneration.nextGeneration();
      expect(nextGeneration.cell(1,1)).toEqual(1);
    });

    it("An alive cell with 2 alive adjacent cells keep alive", function(){
      currentGeneration.reviveCell(1,1);
      spyOn(currentGeneration, "numberOfAliveCells").and.returnValue(2)
      nextGeneration = currentGeneration.nextGeneration();
      expect(nextGeneration.cell(1,1)).toEqual(1);
    });

    it("A dead cell with 2 alive adjacent cells keeps dead", function(){
      currentGeneration.killCell(1,1);
      spyOn(currentGeneration, "numberOfAliveCells").and.returnValue(2)
      nextGeneration = currentGeneration.nextGeneration();
      expect(nextGeneration.cell(1,1)).toEqual(0);
    });

    it("A dead cell with less than 3 alive adjacent cells keeps dead", function(){
      for ( nCells=0; nCells < 3; nCells++){
        currentGeneration = new Population(3,3),
        currentGeneration.killCell(1,1);
        spyOn(currentGeneration, "numberOfAliveCells").and.returnValue(nCells)
        nextGeneration = currentGeneration.nextGeneration();
        expect(nextGeneration.cell(1,1)).toEqual(0);
      }
    });

    it("An alive cell with less than 2 alive adjacent cells becomes dead", function(){
      for ( nCells=0; nCells < 2; nCells++){
        currentGeneration = new Population(3,3),
        currentGeneration.reviveCell(1,1);
        spyOn(currentGeneration, "numberOfAliveCells").and.returnValue(nCells)
        nextGeneration = currentGeneration.nextGeneration();
        expect(nextGeneration.cell(1,1)).toEqual(0);
      }
    });

    it("A dead cell with more than 3 alive adjacent cells keeps dead", function(){
      for (nCells =4; nCells < 9; nCells++){
        currentGeneration = new Population(3,3);
        currentGeneration.killCell(1,1);
        spyOn(currentGeneration, "numberOfAliveCells").and.returnValue(nCells);
        nextGeneration = currentGeneration.nextGeneration();
        expect(nextGeneration.cell(1,1)).toEqual(0);
      }
    });

    it("An alive cell with more than 3 alive adjacent cells becomes dead", function(){
      for (nCells =4; nCells < 9; nCells++){
        currentGeneration = new Population(3,3);
        currentGeneration.reviveCell(1,1);
        spyOn(currentGeneration, "numberOfAliveCells").and.returnValue(nCells);
        nextGeneration = currentGeneration.nextGeneration();
        expect(nextGeneration.cell(1,1)).toEqual(0);
      }
    });
  });
});

function initAliveCells(numAliveCells){
  var row, column, currentValue,
      population = new Population(3,3);

  for(i=0; i<numAliveCells;i++){
    currentValue = 1;
    while(currentValue === 1){
      row = Math.floor(i/3);
      column  = i % 3;
      currentValue = population.cell(row, column);
    }
      
    if (i !== 4 ){
      population.setCell(row, column,1);
    }
  }
  return population;
}
