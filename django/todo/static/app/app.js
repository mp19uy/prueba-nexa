var app = angular.module('app', []);

app.constant('BASE_URL', '/todo/api/tasks/');

app.config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.defaults.headers.common['X-CSRFToken'] = csrftoken;
    });

app.controller('MainCtrl', ['$scope', '$http', 'Tasks', function ($scope, $http, Tasks) {

    
    $scope.getTasks = function() {
        Tasks.all().then(function(res){
            $scope.tasks = res.data;
        });
    };

    $scope.toggleDone = function(todo) {
        Tasks.update(todo);
    };

     $scope.removeTask = function (index, id) {
        Tasks.delete(id);
        $scope.tasks.splice(index, 1);
    };


    $scope.getTasks();

}]);  

app.controller('FormCtrl', ['$scope', 'Tasks', function($scope,  Tasks) {
    
    $scope.showForm = false;
    
    $scope.toggle = function() {
        $scope.showForm = !($scope.showForm);
    };

    $scope.hideForms = function() {
        $scope.showForm = false;
    };

    $scope.addTask = function(text) {
        newTask = {
            is_done: false,
            desc: text
        };
        Tasks.addOne(newTask);
        $scope.getTasks();
    };
    
}]);

app.service('Tasks', function($http, BASE_URL){
    var Tasks = {};

    Tasks.all = function(){
        return $http.get(BASE_URL);
    };

    Tasks.update = function(updatedTodo){
        return $http.put(BASE_URL + updatedTodo.id + '/', updatedTodo);
    };

    Tasks.delete = function(id){
        return $http.delete(BASE_URL + id + '/');
    };

    Tasks.addOne = function(newTodo){
        return $http.post(BASE_URL, newTodo)
    };

    return Tasks;
});


