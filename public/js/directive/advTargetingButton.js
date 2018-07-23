
angular.module('pureSpectrumApp')

.directive('ngAdvanceButton', ['$filter', '$document', '$compile', '$parse', '$timeout',

    function ($filter, $document, $compile, $parse, $timeout) {

        return {
            restrict: 'AE',
            template: '<div class="adv-outer">'+
                            '<button id="item.respondent_question_id" data-toggle="modal" data-target="#advanceTargetingModal" class="btn btn-default" type="button" ng-click="openAdvTargetModal(item)">'+
                                '{{item.question_description}}'+
                            '</button>'+
                            '<a ng-click="deleteAdvTarget(item.respondent_question_id, item.qualification_id[0])"><i class="fa fa-window-close" aria-hidden="true"></i></a>'+
                            '</div>'+
                            '<button type="button" class="btn btn-primary btn-link btn-xs" ng-click="getAdvRemaning(item.selected[item.qualification_id[0]].answer_data, item.hasQuota)" ng-show="item.selected[item.qualification_id[0]].answer_data.length > 0" style="width:100%;text-align:left;"><span ng-show="!item.hasQuota" data-toggle="modal" data-target="#advTargetModal{{item.qualification_id[0]}}">Add Quotas</span> <span ng-show="item.hasQuota" data-toggle="modal" data-target="#advTargetModal{{item.qualification_id[0]}}">Edit Quota</span> <span ng-show="item.hasQuota" class="pull-right" ng-click="delAdvQuota(item.qualification_id[0], item)">Delete Quotas</span>'+
                            '</button>'+
                            '<div id="advTargetModal{{item.qualification_id[0]}}" class="modal animated bounceIn quotas-modal advTargetModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" ng-if="properties.numberOfCompletes">'+

            '<div class="modal-dialog">'+
                '<div class="modal-content">'+
                    '<div class="modal-body">'+
                        '<div class="feasibility-header">'+
                            '<button id="ps-modal-close" class="btn btn-secondary" data-dismiss="modal" ng-click ="resetAdvModal(item)">'+
                                '<i class="fa fa-times" aria-hidden="true"></i>'+
                                '<span class="key_label">esc</span>'+
                            '</button>'+
                            '<div class="clearfix"></div>'+
                        '</div>'+
                        '<div class="row">'+
                            '<div class="col-xs-12 col-sm-6 col-md-6 col-md-offset-3  col-sm-offset-3">'+
                                '<h2 class="text-center">Quotas for {{item.question_description}}:</h2>'+
                            '</div>'+
                            '<div class="col-xs-12 col-md-6 col-sm-6 col-md-offset-3 col-sm-offset-3 text-center">'+
                                '<p>FLEXIBLE</p>'+
                                '<span><label class="status pull-middle quota-flex-btn"><input type="checkbox" checked id="{{item.qualification_id[0]}}"  ng-click ="setAdvFlex($event, item.selected[item.qualification_id[0]].answer_data, item.flxValue)" ng-init="item.flx = true" ng-model="item.flx"><div class="slider round genderr"></div></label>&nbsp; &nbsp; by &nbsp; &nbsp;<input type="text" class="text-line disabled-state" maxlength="2"  onkeypress="return validateQty(event);" ng-init="item.flxValue = 0" ng-model="item.flxValue" ng-keyup="quotaPercentageChange(item.selected[item.qualification_id[0]].answer_data, item.flxValue)" ng-readonly="!properties.numberOfCompletes || !item.flx"><span>%</span></span><br/><br/>'+

                                '<button class="btn btn-primary btn-md grupCondtion submit-btn" type="button" ng-click="AdvGrouping.check = !AdvGrouping.check; readyAdvGroupPayload(item)" ng-hide="AdvGrouping.check">Group Conditions</button>'+
                                '<button class="btn btn-primary btn-sm grupCondtion" type="button" ng-click="advanceGrouping(\'adavance\',item);AdvGrouping.check = !AdvGrouping.check" ng-show="AdvGrouping.check">Group</button>&nbsp; &nbsp;'+
                                '<button class="btn btn-primary btn-sm grupCondtion" type="button" ng-click="AdvGrouping.check = !AdvGrouping.check" ng-show="AdvGrouping.check">Cancel</button>'+
                            '</div>'+
                        '</div>'+
                        '<div class="col-xs-12 col-sm-8 col-md-8 col-md-offset-2">'+
                            '<div class="panel">'+
                                '<div class="panel-body">'+
                                    '<div class="table-responsive">'+
                                        '<table class="table" id="genderform">'+
                                            '<thead>'+
                                            '<tr >'+
                                                '<th></th>'+
                                                '<th ng-hide="AdvGrouping.check">{{properties.clickBalance == 0? "COMPLETES":"CLICKS"}}</th>'+
                                                '<th ng-hide="AdvGrouping.check">MIN</th>'+
                                                '<th ng-hide="AdvGrouping.check">MAX</th>'+
                                                '<th ng-if="liveSurveyEditingStep == \'editStep1\' && !AdvGrouping.check">FIELDED</th>'+
                                            '</tr>'+
                                            '</thead>'+
                                            '<tbody>'+

                                            '<tr ng-repeat="data in item.selected[item.qualification_id[0]].answer_data" ng-if="checkAdvancedata(data)" ng-mouseenter="trhovering=true" ng-mouseleave="trhovering=false" ng-class="{\'groupingselected\': data.setGrupActive ?data.setGrupActive : data.setGrupActive = false, \'selectGroup\': AdvGrouping.check == true? AdvGrouping.check : AdvGrouping.check = false}" ng-click="data.setGrupActive = (AdvGrouping.check == true? !data.setGrupActive : data.setGrupActive)" ">'+
                                                '<td class="td-th-class" ng-hide="data.condditionGroup && AdvGrouping.check"><br><i class="fa fa-chain-broken" aria-hidden="true" ng-click="ungroupedAdvanceQuota(data)" ng-show="data.condditionGroup" style="cursor: pointer; font-size: 20px;"></i>{{data.name}} &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;</td>'+
                                                '<td class="td-th-class" ng-hide="AdvGrouping.check || data.condditionGroup && AdvGrouping.check">'+
                                                    '<input type="number" class=" text-line" onkeypress="return validateCompletes(event);"" ng-model="data.number" ng-keyup="quotaNumberChange(data.id, item.selected[item.qualification_id[0]].answer_data , item.flxValue, item.qualification_id[0])" ng-keypress="clearNumberChange(item.selected[item.qualification_id[0]].answer_data, $index)" ng-class="{\'hoverTr-Text\':trhovering}">&nbsp;&nbsp;&nbsp;<input type="text" class=" text-line" maxlength="3" onkeypress="return validateCompletes(event);"" ng-model="data.per" ng-keyup="quotaPerChange(data.id, item.selected[item.qualification_id[0]].answer_data , item.flxValue, item.qualification_id[0])" ng-class="{\'hoverTr-Text\':trhovering}">%'+
                                                '</td>'+
                                                '<td class="td-th-class" ng-hide="AdvGrouping.check || data.condditionGroup && AdvGrouping.check">'+
                                                    '<input type="number" class="text-line" onkeypress="return validateQty(event);"  ng-model="data.minimum"  ng-readonly="true" ng-class="{\'hoverTr-Text\':trhovering}">'+
                                                '</td>'+
                                                '<td class="td-th-class" ng-hide="AdvGrouping.check || data.condditionGroup && AdvGrouping.check">'+
                                                    '<input type="number" class="text-line" onkeypress="return validateQty(event);"  ng-model="data.maximum"  ng-readonly="true" ng-class="{\'hoverTr-Text\':trhovering}">'+
                                                '</td>'+
                                                '<td class="td-th-class" ng-if="liveSurveyEditingStep == \'editStep1\' && !AdvGrouping.check"><input type="number" class="text-line" onkeypress="return validateQty(event);"  ng-model="data.achieved"  ng-readonly="true" ng-class="{\'hoverTr-Text\':trhovering}">'+
                                                '</td>'+
                                            '</tr>'+
                                            '</tbody>'+
                                        '</table>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="row">'+
                            '<div class="col-xs-12 text-center" >'+
                                '<div class="center-block">'+
                                    '<p><b>Total Remaining</b></p>'+
                                    '<p><b>'+
                                            '<span>{{quotaTotalRemRace}}</span>'+
                                        '</b>'+
                                    '</p>'+
                                '</div>'+
                                '<button class="btn btn-primary addQuotas-btn" ng-click="addAdvanceQuota(item, $event)" ng-disabled="quotaTotalRemRace !=0 || gndrAllocationsLessThanFielded" data-dismiss="modal">Apply</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
              '</div>'+
        '</div>',
            link: function ($scope, $element, $attrs) {
            }
        };
    }]);
