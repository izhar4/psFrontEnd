/*
 *Created by Amar on 27/2/2017. PD-821
 */
 angular.module('pureSpectrumApp')

.directive('clickEdit',['$rootScope', '$timeout', 'createSurvey', 'notify', function($rootScope, $timeout, createSurvey, notify) {
    return {
        require: 'ngModel',
        scope: {
            model: '=ngModel',
            type: '@type',
            loader: '=loader'
        },
        replace: true,
        transclude: false,
        // includes our template
        template:
            '<div class="">'+
                '<div class="hover-edit-trigger" title="click to edit">'+
                    '<div class="hover-text-field" ng-show="!editState" ng-click="toggle()">{{model.current_target}}<div class="pencil-outer"><div class="edit-pencil glyphicon glyphicon-pencil"></div></div></div>'+
                    '<input class="inputText" type="inputText"  ng-model="localModel" ng-enter="save()" onkeypress="return validateqty(this, event);" ng-show="editState && type == \'inputText\'" />' +
                '</div>'+
                '<div class="edit-button-group" ng-show="editState">'+
                    '<div class="glyphicon glyphicon-ok"  ng-click="save()"></div>'+
                    '<div class="glyphicon glyphicon-remove" ng-click="cancel()"></div>'+
                '</div>'+
            '</div>',
        link: function (scope, element, attrs) {
            scope.editState = false;

            // make a local ref so we can back out changes, this only happens once and persists
            scope.localModel = scope.model.current_target;

            // apply the changes to the real model
            scope.save = function(){
                scope.loader = true;
                if(scope.model) {
                    //console.log('scope.model '+JSON.stringify(scope.model)+' '+JSON.stringify(scope.localModel));
                    if(!scope.localModel){
                        scope.localModel = scope.model.current_target
                        scope.toggle();
                        scope.loader = false;
                        return;
                    }else if(scope.localModel < scope.model.achieved){
                        notify({
                            message: 'Please set target more the the current achieved',
                            classes: 'alert-warning',
                            duration: 3000
                        });
                        scope.model.current_target = scope.model.achieved;
                        scope.localModel = scope.model.achieved;
                    }else{
                        scope.model.current_target =  scope.localModel;
                    }
                    scope.model.survey_id =  $rootScope.newId;
                    scope.model.oldValue = scope.preVal;
                    scope.model.newValue = scope.localModel;
                    createSurvey.updateCurrentlyOpenQuota(scope.model).then(function(res){
                        scope.loader = false;
                        var updatedValue = res.data.updateVal;
                        scope.model.currently_open = updatedValue.newCurrentOpen;
                        scope.model.sup_currently_open = updatedValue.newSupCurrentlyOpen;
                        scope.model.remaining = updatedValue.newRemaining;
                        scope.model.current_target = updatedValue.newCurrentTarget;
                        scope.toggle();
                    },
                    function(err) {
                        scope.loader = false;
                        console.log("err to update");
                    });
                }
            };

            // don't apply changes
            scope.cancel = function(){
                scope.localModel = scope.model.current_target;
                scope.toggle();
            }

            /*
             * toggles the editState of our field
             */
            scope.toggle = function () {
                scope.localModel = scope.model.current_target;
                scope.preVal = scope.model.current_target;
            
                scope.editState = !scope.editState;
                var x1 = element[0].querySelector("."+scope.type);
                console.log('scope.type '+scope.type);
                $timeout(function(){
                    // focus if in edit, blur if not. some IE will leave cursor without the blur
                    scope.editState ? x1.focus() : x1.blur();
                }, 0);
            }

        }
    }
}]);