psApp.directive('clickBalancing', ['$filter', '$document', '$compile', '$parse', '$timeout', 'notify', function($filter, $document, $compile, $parse, $timeout, notify){

	return {
		restrict : 'AE',
		scope:{
			balancingSwitch: '=balancingSwitch',
			completes: "=completes",
			incidence : "=incidence",
			totalClicks: "=totalClicks",
			completesNeeded: '=completesNeeded',
			quotaUpdate: '&quotaUpdate',
			liveEdit: '=liveEdit',
			toShow : '=toShow'
		},
		template: '<div class="survey-form custom-toggle text-center" ng-show="toShow">'+
					'<span>Completes</span>'+
					'<div class="custom-toggle-inner"><input type="checkbox" id="switch" ng-model="balancingSwitch" ng-change="calculateTotal()" ng-disabled="!completes || !incidence || liveEdit == \'editStep1\'" ng-true-value="1" ng-false-value="0"  /><label for="switch">Toggle</label>'+
						'<p>Entrants: {{totalClicks?totalClicks:"NA"}}</span></p>'+
					'</div>'+
                    '<span>Clicks</span>'+
                  '</div>',
		link: function($scope, $element, $attrs){
			$scope.totalClicks = 0;
			$scope.calculateTotal = function(){
				if($scope.balancingSwitch){
					console.log('$scope.completes ',$scope.completes);
					console.log('$scope.incidence ',$scope.incidence);
					if($scope.completes && $scope.incidence){
						$scope.totalClicks = Math.round(($scope.completes * 100)/$scope.incidence);
						$scope.completesNeeded  = $scope.totalClicks;
						//Update Quotas
						$timeout(function(){
							$scope.quotaUpdate();
						}, 10);
						
					}else{
						notify({
			                message: 'Please enter completes and incidence',
			                classes: 'alert-warning',
			                duration: 2000
			            });
					}
				}else{
					$scope.totalClicks = 0;
					$scope.completesNeeded = $scope.completes;
					//Update Quotas
					$timeout(function(){
						$scope.quotaUpdate();
					}, 10);
				}
			}

			$scope.$on('calculateTotalCliks',function(event, data){
	            $scope.calculateTotal();
	        });
		}
	}

}]);