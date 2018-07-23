
angular.module('pureSpectrumApp')
.directive('incomeRow', ['$filter', '$document', '$compile', '$parse',function ($filter, $document, $compile, $parse) {

        return {
            restrict: 'AE',
            replace: true,
            template: '<tr> <td class="td-th-class"><input type="number" class=" text-line text-center"   placeholder="" onkeypress="return validateCompletes(event);" ng-blur="checkIncomeMinQuotaModel(incomeTempArr[$index].min, $index )" ng-model="incomeTempArr[$index].min" ng-class=" {  \'field-error_incmage\': incomeTempArr[$index].min>incomeTempArr[$index].max || incomeTempArr[$index].min.length>incomeTempArr[$index].max.length || incomeTempArr[$index].min<0}" ng-disabled="$index>0">&nbsp;&nbsp; &nbsp;<span>to</span>&nbsp;&nbsp; <input type="number" class=" text-line text-center"  placeholder="" onkeypress="return validateCompletes(event);" ng-model="incomeTempArr[$index].max" ng-blur="checkIncomeMaxQuotaModel(incomeTempArr[$index].max, $index )" ng-class=" {  \'field-error_incmage\': !incomeTempArr[$index].max || incomeTempArr[$index].min>incomeTempArr[$index].max || incomeTempArr[$index].max<0 || incomeTempArr[$index].max > houseHoldIncome.max}" ng-disabled="$index>0" ng-model-options="{ debounce: 700 }" ng-change="getAchievedForAgeIncome(srvId, \'hhi\', incomeTempArr[$index].min, incomeTempArr[$index].max, $index)"> </td>' +
            '<td class="td-th-class"> <input type="number" class=" text-line" placeholder="" onkeypress="return validateCompletes(event);" ng-model="incomeTempArr[$index].number" ng-keyup="incomeNumberChange(incomeTempArr, $index, incomeQuotaFlag.incomeFlxValue)" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="text" class=" text-line" maxlength="3" onkeypress="return validateCompletes(event);" ng-model="incomeTempArr[$index].per"   ng-keyup="incomePerChange(incomeTempArr[$index].number, $index, incomeQuotaFlag.incomeFlxValue)">% </td>' +
            // '<td class="td-th-class"> <span><label class="status pull-left quota-flex-btn"><input type="checkbox" name="my-checkbox" checked id="inc{{$index}}"  ng-click="setIncomeFlex($event,$index)"><div class="slider round incomer{{$index}}"></div></label>&nbsp; &nbsp; by &nbsp; &nbsp; <input type="text" class="text-line" maxlength="2"  onkeypress="return validateCompletes(event)" ng-model="incomeTempArr[$index].flexPer" ng-keyup="incomePercentageChange(incomeTempArr[$index].flexPer , $index)" ng-readonly="!properties.numberOfCompletes || data.incFlx == false"><span>%</span> </span> </td>' +
            '<td class="td-th-class"> <input type="number" class="text-line" onkeypress="return validateCompletes(event) " ng-model="incomeTempArr[$index].minimum" ng-readonly="true" ng-disabled="$index>0" > </td> <td class="td-th-class"> <input type="number" class="text-line" onkeypress="return validateCompletes(event)" ng-model="incomeTempArr[$index].maximum" ng-readonly="true" ng-disabled="$index>0"></td> <td class="td-th-class"><input type="number" ng-if="srvId" class="text-line" onkeypress="return validateQty(event)" ng-model="incomeTempArr[$index].achieved" ng-readonly="true" ng-disabled="$index>0"> <span ng-if="$index==0"> <button class="btn btn-link btn-primary"  ng-click="addIncomeNewRow($index)"><span class="glyphicon glyphicon-plus"></span> Click to Add</button></span> <span ng-if="$index>0"> <button class="btn btn-link btn-default"  ng-click="removeIncomeNewRow($index)"><span class="glyphicon glyphicon-remove"></span></button></span></td></tr>',
            link: function(scope, element, attrs) {

            }

        }

    }]);
