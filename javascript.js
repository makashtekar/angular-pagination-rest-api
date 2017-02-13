//Instantiate angular application
var app = angular.module("TestApplication",['ui.bootstrap']);
//Define constant
app.constant("API_URL",'http://jsonplaceholder.typicode.com');
//Service for communicate with server API
app.service("RestApi",['$http','API_URL',function($http,API_URL){
  this.getPhotos = function(){
    return $http.get(API_URL+'/photos');
  }
}]);

//View Controller, Inject created RestApi service as dependency
app.controller("MainController",['$scope','RestApi',function($scope,RestApi){

  $scope.loadedAllPhotos =  [];
  //Records of photos
  $scope.photoRecords = [];
  //Loading photos flag
  $scope.photoLoadingStatus = true;

  //Private function for the current scope
  function loadPhotos(){
    //Use RestApi to get records from server
    RestApi.getPhotos().then(
       function(res){
         $scope.photoLoadingStatus = false;
         $scope.photoRecords = res.data;//Set records into scope of the application
         $scope.loadedAllPhotos = res.data;
         $scope.totalItems = $scope.photoRecords.length;
       },
       function(err){
         $scope.photoLoadingStatus = false;
         alert("Sorry Could not load Photos.. Please check your CORS...");
       }

    );
  }
  $scope.viewby = 10;
  $scope.totalItems = $scope.photoRecords.length;
  $scope.currentPage = 1;
  $scope.itemsPerPage = 10;
  $scope.maxSize = 5; //Number of pager buttons to show

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.currentPage);
  };

  $scope.setItemsPerPage = function(num) {
    $scope.itemsPerPage = num;
    $scope.currentPage = 1; //reset to first paghe
  }


$scope.searchPhoto = function(terms){


  var result = [];
  $scope.loadedAllPhotos.forEach(function(val, key){

    var regex = new RegExp( terms , 'gi');
    if(val.title.match(regex) != null){
      result.push( val  );
    }

  });

  $scope.photoRecords = result;
  $scope.totalItems = $scope.photoRecords.length;
}

//On page load initialization
function init(){
  loadPhotos();
}

init();


}]);
