var gameOfLife = angular.module('gameOfLife', []);


function GenerationController($scope){

  $scope.population = new Population(100,100);
  $scope.population.firstGeneration();

  setTimeout(function(){
        document.getElementsByClassName('start-button')[0].click();
  }.bind(this), 1000);

  $scope.start = function(){
      $scope.population = $scope.population.nextGeneration();
      
      setTimeout(function(){
        document.getElementsByClassName('start-button')[0].click();
      }.bind(this), 100);
  }
}

gameOfLife.controller('GenerationController', GenerationController);
