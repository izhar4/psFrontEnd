/**
 * Created by Raj on 5/7/2016.
 */

angular.module('pureSpectrumApp')
.directive('chldRow', ['$filter', '$document', '$compile', '$parse',function ($filter, $document, $compile, $parse) {

        return {
            restrict: 'AE',
            replace: true,
            template: '<tr><td>Have Children</td><td class="td-th-class"><input type="number" onKeyDown="if(this.value.length>1 && event.keyCode!=8) return false;" class=" text-line text-center"  placeholder="" onkeypress="return validateQty(event);" ng-model="chldTempArr.have[$index].min" ng-disabled="$index!=0" ng-class=" {  \'field-error_incmage\': chldTempArr.have[$index].min==undefined ||chldTempArr.have[$index].min==null ||chldTempArr.have[$index].min===\'\' || chldTempArr.have[$index].min>chldTempArr.have[$index].max || chldTempArr.have[$index].min<0}">&nbsp;&nbsp; &nbsp;<span>to</span>&nbsp;&nbsp; <input type="number" onKeyDown="if(this.value.length>1 && event.keyCode!=8) return false;" class=" text-line text-center"  placeholder="" onkeypress="return validateQty(event);" ng-model="chldTempArr.have[$index].max" ng-disabled="$index!=0" ng-class=" {  \'field-error_incmage\': !chldTempArr.have[$index].max || chldTempArr.have[$index].max<chldTempArr.have[$index].min || chldTempArr.have[$index].max<0}"> </td>' +
            '<td><div class="radio"><input type="radio" name="gender_{{$index}}" value="111" ng-model="chldTempArr.have[$index].gender" ng-disabled="$index!=0" id="Gender_Boy_{{$index}}"/><label  for="Gender_Boy_{{$index}}">Boy</label></div><div class="radio girl"><input type="radio" ng-disabled="$index!=0" name="gender_{{$index}}" value="112" checked="" ng-model="chldTempArr.have[$index].gender" ng-click="addGirl()" id="Gender_Girl_{{$index}}"/><label   for="Gender_Girl_{{$index}}">Girl</label></div><div class="radio either"><input type="radio" ng-disabled="$index!=0"  name="gender_{{$index}}" value="both" ng-model="chldTempArr.have[$index].gender" id="Gender_Both_{{$index}}"/><label  for="Gender_Both_{{$index}}">Either</label></div></td>'+
            '<td class="td-th-class"> <input type="number" class=" text-line" placeholder="" onkeypress="return validateQty(event);" ng-model="chldTempArr.have[$index].number" ng-keyup="chldNumberChange(chldTempArr, childQuotaFlag.chldFlxValue, $index)" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="text" class=" text-line" maxlength="3" onkeypress="return validateQty(event);" ng-model="chldTempArr.have[$index].per"  ng-keyup="chldPerChange(chldTempArr, childQuotaFlag.chldFlxValue, $index)" >% </td>' +
            '<td class="td-th-class"> <input type="number" class="text-line" onkeypress="return validateQty(event) " ng-model="chldTempArr.have[$index].minimum" ng-readonly="true" ></td> <td class="td-th-class"> <input type="number" class="text-line" onkeypress="return validateQty(event)" ng-model="chldTempArr.have[$index].maximum" ng-readonly="true"><span ng-if="$index==0"></td> <td class="td-th-class"> <input type="number" ng-if="srvId" class="text-line" onkeypress="return validateQty(event)" ng-model="chldTempArr.have[$index].achieved" ng-readonly="true"><span ng-if="$index==0"> <button class="btn btn-link btn-primary"  ng-click="addChldNewRow($index)"><span class="glyphicon glyphicon-plus"></span> Click to Add</button></span> <span ng-if="$index>0"> <button class="btn btn-link btn-default"  ng-click="removeChldNewRow($index)"><span class="glyphicon glyphicon-remove"></span></button></span></td></tr>',
            link:  function (scope, element, attrs) {
                //console.log('scope.units '+scope.units);
            }
            
        }

    }]);