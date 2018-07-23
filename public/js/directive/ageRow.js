/**
 * Created by Parveen on 5/4/2016.
 */

angular.module('pureSpectrumApp')
.directive('ageRow', ['$filter', '$document', '$compile', '$parse',function ($filter, $document, $compile, $parse) {

        return {
            restrict: 'AE',
            replace: true,
            template: '<tr > <td class="td-th-class"><input type="text" maxlength="2" class=" text-line text-center"  placeholder="" onkeypress="return validateCompletes(event);" ng-blur="checkAgeMinQuotaModel(ageTempArr[$index].min, $index)" ng-model="ageTempArr[$index].min"  ng-class=" {  \'field-error_incmage\': !ageTempArr[$index].min || ageTempArr[$index].min>ageTempArr[$index].max || ageTempArr[$index].min<13}" ng-disabled="$index>0">&nbsp;&nbsp; &nbsp;<span>to</span>&nbsp;&nbsp; <input type="text" maxlength="2" class=" text-line text-center"  placeholder="" onkeypress="return validateCompletes(event);" ng-blur="checkAgeMaxQuotaModel(ageTempArr[$index].max, $index)" ng-model="ageTempArr[$index].max" ng-class=" {  \'field-error_incmage\': !ageTempArr[$index].max || ageTempArr[$index].max<ageTempArr[$index].min || ageTempArr[$index].max<13 }" ng-disabled="$index>0" ng-model-options="{ debounce: 700 }" ng-change="getAchievedForAgeIncome(srvId, \'age\', ageTempArr[$index].min, ageTempArr[$index].max, $index)"> </td>' +
            '<td class="td-th-class"> <input type="number" class=" text-line" placeholder="" onkeypress="return validateCompletes(event);" ng-model="ageTempArr[$index].number" ng-keyup="ageNumberChange(ageTempArr, ageQuotaFlag.ageFlxValue, $index)" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="text" class=" text-line" maxlength="3" onkeypress="return validateCompletes(event);" ng-model="ageTempArr[$index].per"   ng-keyup="agePerChange(ageTempArr, ageQuotaFlag.ageFlxValue, $index)">% </td>' +
            // '<td class="td-th-class"> <span><label class="status pull-left quota-flex-btn"><input type="checkbox" name="my-checkbox2" checked id="ag{{$index}}" ng-click="setAgeFlex($event,$index)" ><div class="slider round ager{{$index}}"></div></label>&nbsp; &nbsp; by &nbsp; &nbsp; <input type="text" class="text-line" maxlength="2"  onkeypress="return validateCompletes(event)" ng-model="ageTempArr[$index].flexPer" ng-keyup="agePercentageChange(ageTempArr[$index].flexPer,$index)" ng-readonly="!properties.numberOfCompletes || data.ageFlx == false"><span>% </span> </span> </td>' +
            '<td class="td-th-class"> <input type="number" class="text-line" onkeypress="return validateQty(event) " ng-model="ageTempArr[$index].minimum" ng-readonly="true" ng-disabled="$index>0"></td> <td class="td-th-class"> <input type="number" class="text-line" onkeypress="return validateCompletes(event)" ng-model="ageTempArr[$index].maximum" ng-readonly="true" ng-disabled="$index>0"></td> <td class="td-th-class"> <input type="number" ng-if="srvId" class="text-line" onkeypress="return validateCompletes(event)" ng-model="ageTempArr[$index].achieved" ng-readonly="true" ng-disabled="$index>0"><span ng-if="$index==0"> <button class="btn btn-link btn-primary"  ng-click="addAgeNewRow($index)"><span class="glyphicon glyphicon-plus"></span> Click to Add</button></span> <span ng-if="$index>0"> <button class="btn btn-link btn-default"  ng-click="removeAgeNewRow($index)"><span class="glyphicon glyphicon-remove"></span></button></span></td></tr>',
            link:  function (scope, element, attrs) {
            }
            
        }

    }]);