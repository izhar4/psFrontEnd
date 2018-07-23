angular.module('pureSpectrumApp')
.controller('advQuestionCtrl' ,['$scope', '$state', 'ngProgressLite', 'notify', 'localStorageService', 'config', 'questionService', 'createSurvey', 'companyService', 'commonApi', '$filter', function($scope, $state, ngProgressLite, notify, localStorageService, config, questionService, createSurvey, companyService, commonApi, $filter){
    var userInfo= localStorageService.get('logedInUser');

    $scope.loader = {show: false};
    $scope.advQuestion = new Object();
    // Question Type is single punch by default
    $scope.advQuestion.question_type = "singlepunch";

    $scope.advQuestion.class = "2";
    // Array that holds the screener question & answer payload to save
    $scope.advQuestion.options = new Array();
    //default value for company
    $scope.selectedCompany = {
        name : 'All',
        id : 0
    };
    $scope.rangeMode = false; 
    $scope.units = [
        {
            id    : 311,
            name  : 'Years'
        },
        {
            id    : 312,
            name  : 'Months'
        },
        {
            id    : 313,
            name  : 'Days'
        },
        {
            id    : 314,
            name  : 'Hours'
        },
        {
            id    : 401,
            name  : 'movies'
        },
        {
            id    : 402,
            name  : 'tv hours'
        },
        {
            id    : 403,
            name  : 'nights'
        },
        {
            id    : 404,
            name  : 'trips'
        }
    ]

    $scope.modes = {
        'add':false,
        'edit':false,
        'view': true
    }

    // Array
    $scope.multiOptions = new Array();
    $scope.page = 1;

    $scope.changeMode = function(mode){
       if(mode == "singlepunch" || mode == "multipunch") {
           $scope.rangeMode = false; 
       }else if(mode == "range"){
            $scope.rangeMode = true; 
       }
    }
    getBuyerCompany()
    getCountries()
    
    //list buyer companies
    function getBuyerCompany(){
        companyService.getBuyerCompany().success(function(res){
            //console.log("Buyer companies", JSON.stringify(res))
            $scope.cmpList = res.company;
            $scope.getAdvTargetingQues($scope.page);
        }).error(function (err) {
            notify({message: err.msg, classes: 'alert-danger', duration: 2000});
        });
    }
    //select company
    $scope.selectCompany = function(company) {
        if(company == 'all') {
            $scope.selectedCompany.name = 'All';
            $scope.advQuestion.cmp = 0;
        }else {
            $scope.selectedCompany.name = company.name;
            $scope.advQuestion.cmp = company.id;
        }
    };

    //list advance targeting question
    $scope.getAdvTargetingQues = function(page){
        //Start loader
        $scope.loader.show = true;
        questionService.getAdvTargetingQues(page).success(function(res){
            if(res.questions && res.pages){
                $scope.pages = new Array();
                for(var i = 1; i <= res.pages; i++){
                    $scope.pages.push(i);
                }
                $scope.page = page;
                $scope.questions = res.questions;
                $scope.activeMenu = $scope.questions[0].respondent_question_id;
                $scope.advQuesDetails = $scope.questions[0];
                var company = _.findWhere($scope.cmpList, {id:$scope.advQuesDetails.cmp});
                $scope.advQuesDetails.cmp_name = company ? company.name : "All";
                $scope.advQuesDetails.class_name = $scope.questions[0].class == 2 ? "Extended" : "Custom";
                $scope.advQuesDetails.question_category = $scope.advQuesDetails.question_category;
                $scope.loader.show = false;
            }
        }).error(function (err) {
            $scope.loader.show = false;
            notify({message: err.msg, classes: 'alert-danger', duration: 2000});
        });
    }

    //save question
    $scope.saveAdvQuestion = function(){
        if($scope.advQuestion.question_description && $scope.advQuestion.question_category && $scope.advQuestion.question_type && $scope.advQuestion.stem1 && $scope.advQuestion.buyer_text && $scope.advQuestion.options.length){
            //Start loader
            $scope.loader.show = true;
            //console.log(JSON.stringify($scope.advQuestion.question_category));
            
            // Pick the qualification id from stem1 and push in qualification id array
            if($scope.advQuestion.stem1.indexOf("%%respId%%") == -1){
                $scope.loader.show = false;
                return notify({
                    message: '%%respId%% required in stem',
                    classes: 'alert-warning',
                    duration: 2000
                });
            }

            // SinglePunch or Multipunch answers
            $scope.advQuestion.qualification_type = 'advance';
            questionService.addAdvQuestions($scope.advQuestion).success(function (response) {
                //console.log("response ",JSON.stringify(response));
                notify({
                    message: 'Successfully Added',
                    classes: 'alert-success',
                    duration: 2000
                });
                // Clearing the arrays
                $scope.advQuestion = {};
                $scope.advQuestion.question_type = "singlepunch";
                $scope.advQuestion.class = "2";
                $scope.advQuestion.options = new Array();
                $scope.rangeMode = false; 
                $scope.loader.show = false;
                $scope.getAdvTargetingQues($scope.page);
            }).error(function (err) {
                notify({message: err.msg, classes: 'alert-danger', duration: 2000});
                $scope.loader.show = false;
            });
        }else{
            notify({
                message: 'Enter all required fields',
                classes: 'alert-warning',
                duration: 2000
            });
        }
    };

    //update question
    $scope.updateAdvQuestion = function(){

        if($scope.advQuestion.respondent_question_id && $scope.advQuestion.question_description && $scope.advQuestion.question_category && $scope.advQuestion.question_type && $scope.advQuestion.stem1 && $scope.advQuestion.buyer_text && $scope.advQuestion.screener_text){
            //Start loader
            $scope.loader.show = true;
            //console.log(JSON.stringify($scope.advQuestion.question_category));
            
            // Pick the qualification id from stem1 and push in qualification id array
            $scope.advQuestion.qualification_id = new Array();
            var stem1QualifictionIds = $scope.advQuestion.stem1.match(/%%(\d*)%%+/g);
            stem1QualifictionIds = stem1QualifictionIds[0].replace(/%%/g,'');
            // Check for not pushing duplicate Ids
            if(_.indexOf($scope.advQuestion.qualification_id, stem1QualifictionIds) == -1){
                $scope.advQuestion.qualification_id.push(parseInt(stem1QualifictionIds));
            }
            //console.log(JSON.stringify($scope.advQuestion.qualification_id));
            // SinglePunch or Multipunch answers
            $scope.advQuestion.qualification_type = 'advance';
            //console.log('$scope.advQuestion '+JSON.stringify($scope.advQuestion));
            questionService.updateAdvQuestions($scope.advQuestion.respondent_question_id, $scope.advQuestion).success(function (response) {
                //console.log("response ",JSON.stringify(response));
                notify({
                    message: 'Successfully updated',
                    classes: 'alert-success',
                    duration: 2000
                });
                // Clearing the arrays
                $scope.getAdvTargetingQues($scope.page);
                $scope.loader.show = false;
            }).error(function (err) {
                notify({message: err.msg, classes: 'alert-danger', duration: 2000});
                $scope.loader.show = false;
            });
        }else{
            notify({
                message: 'Enter all required fields',
                classes: 'alert-warning',
                duration: 2000
            });
        }
    };

    //delete question
    $scope.deleteAdvQuestion = function(respondent_question_id){
        $scope.loader.show = true;
        //console.log('deleteAdvQuestion '+respondent_question_id)
        questionService.deleteAdvQuestions(respondent_question_id).success(function (response) {
            //console.log("response ",JSON.stringify(response));
            notify({
                message: 'Successfully deleted',
                classes: 'alert-success',
                duration: 2000
            });
            $scope.getAdvTargetingQues($scope.page);
            $scope.loader.show = false;
        }).error(function (err) {
            notify({message: err.msg, classes: 'alert-danger', duration: 2000});
            $scope.loader.show = false;
        });
    };

    //load adv question in edit form
    $scope.editAdvQues = function(qObj){
        //$scope.loader.show = true;
        $scope.advQuestion = qObj;
        var options = new Array()
        _.each(_.keys(qObj.answers_data), function(key){
            var tempOption = new Object()
            var locale = key.split('_');
            tempOption['language'] = locale[0];
            tempOption['country'] = locale[1];
            tempOption['placeholder'] = qObj['answers_data'][key]['answer_placeholder'] || '';
            tempOption['screener_text']  = qObj.screener_text[key]['question_text'];
            tempOption['multiOptions'] = (qObj.question_type != 'range') ? qObj['answers_data'][key]['answers'] : [];
            if(tempOption.multiOptions.length && tempOption['language'] != 'eng'){
                var masterDoc = qObj.master_data[locale[1]]['eng'];
                _.each(tempOption.multiOptions, function(singleOpt){
                    var transObj = _.findWhere(masterDoc, {id: singleOpt.id});
                    singleOpt['translation'] = transObj? transObj.name: '';
                })
            }
            options.push(tempOption);
        })
        $scope.advQuestion.options = options;
        $scope.advQuestion.qualification_id = qObj.qualification_id[0];
        $scope.advQuestion.class = qObj.class.toString();
        var company = _.findWhere($scope.cmpList, {id:qObj.cmp}) || 'all'
        $scope.selectCompany(company);
        if(qObj.question_type != 'range'){
            $scope.rangeMode = false;
        }else{
            $scope.rangeMode = true;
        }
    }

    //view adv question details
    $scope.viewAdvQuesDetails =  function(qObj){
        //console.log("qObj",JSON.stringify(qObj))
        var locale = "eng_US"
        var qId = qObj.qualification_id[0];
        $scope.advQuesDetails = qObj;
        var company = _.findWhere($scope.cmpList, {id: qObj.cmp});
        $scope.advQuesDetails.cmp_name = company ? company.name : "All";
        $scope.advQuesDetails.class_name = qObj.class == 2 ? "Extended" : "Custom";
        $scope.advQuesDetails.question_category = qObj.question_category;
        $scope.advQuesDetails.placeholder = qObj.answers_data;
        $scope.advQuesDetails.answers = qObj.answers_data;
        $scope.activeMenu = qObj.respondent_question_id;
    };
    
    $scope.goToAddMode = function(){
        $scope.modes.add = true;
        $scope.modes.view = false;
        $scope.modes.edit = false;
        $scope.advQuestion = new Object();
        $scope.advQuestion.question_type = "singlepunch";
        $scope.advQuestion.class = "2";
        $scope.advQuestion.cmp = 0;
        $scope.selectedCompany = {
            name : 'All',
            id : 0
        };
        $scope.rangeMode = false;
        $scope.multiOptions = new Array();
    };
    $scope.goToViewMode = function(){
        $scope.modes.add = false;
        $scope.modes.view = true;
        $scope.modes.edit = false;
    };
    $scope.goToEditMode = function(){
        $scope.modes.add = false;
        $scope.modes.view = false;
        $scope.modes.edit = true;
    };

    function getCountries() {
        commonApi.countries().success(function(data) {
            if (data.countries != null) {
                $scope.countries = data.countries.values;
            }
        }).error(function(err) {
            notify({
                message: err.msg,
                classes: 'alert-danger',
                duration: 2000
            });
        });
    }

}]);

