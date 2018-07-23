/**
 * Created by Dinesh on 01/05/2017
 */

angular.module('pureSpectrumApp')
    .filter('splitAndJoinBy', function() {
        return function(input, splitChar, joinChar) {
            return input.split(splitChar).join(joinChar);
        }
    })
    .filter('suppConversion', function(){
        return function(value, condition1, condition2){
            if(condition1 && condition2){
                if(value > 100){
                    return '100%';
                }else{
                    return Math.round(value)+'%';
                }
            }else{
                return '-';
            }
        }
    })
    .filter('breakArrayAndJoin', function() {
        return function(input) {
            var retArr = [];
            var units = {
                "321" : '$', // USA Dollor
                "322" : '€', // Germany EURO
                "323" : '£', //UK Pond
                "324" : '$', //AU Dollor
                "325" : '¥', // Japan Yen
                "326" : '₱', // Phillipines peso
                "327" : '$', // Mexican Peso
                "328" : '$', // Argentina Peso
                "329" : '$', // Chile Peso
                "330" : '$', // Columbian Peso
                "331" : '¥', // Chinese Yuan
                "332" : '₹', // Indian Rupees
                "333" : 'zł', //Poland currency Polish Zloty
                "334" : '₩', //Korea currency
                "335" : '$', //Canadian Dollar
                "336" : "₦", // Nigerian Naira
                "337" : "Rp", // Indonesian rupiah
                "338" : "R$", // Brazilian Real
                "339" : "₫",  // Vietnami Dong
                "340" : "₴",   // Ukrainian Hryvnia
                "341" : "€",   // Ireland Euro
                "342" : "HK$",   // Hong Kong $
                "343" : "ر.س", // Saudi Riyal
                "344" : "NT$", // New Taiwan Dollar
                "345" : "د.إ", // AED Dirham UAE
                "346" : "RM", // malaysian Ringgit (MYR)
                "347" : "€", // netherlands Euro (EUR)
                "348" : "€", // Belgium Euro (EUR)
                "349" : "KR", // Norwegian krone (NOK)
                "350" : "KR", // Danish krone (DKK)
                "351" : "R", // Rand (ZAR)
                "352" : "KR", // Krona (SEK)
                "353" : "₺", // Turkish Lira (TRY)
                "311" : 'yr', // Years
                "312" : 'mth', // Months
                "313" : 'day', // Days,
                "314" : 'hr', // Hours
                "401" : 'movies', // movies
                "402" : 'tv hours', // hours
                "403" : 'nights',    // Hotel Nights
                "404" : 'trips'    // Hotel Nights
            }
            angular.forEach(input, function(item) {
               if(item.hasOwnProperty('name')) {
                    retArr.push(item.name);
               } else if(item.hasOwnProperty('from') && item.hasOwnProperty('to')){
                    if(parseInt(item.units) >= 321 && parseInt(item.units) <= 324){
                        retArr.push(units[item.units]+parseInt(item.from)+' - '+units[item.units]+parseInt(item.to));
                    }else{
                        retArr.push(parseInt(item.from)+' '+units[item.units]+' - '+parseInt(item.to)+' '+units[item.units]);
                    }
               }
            })
            return retArr.toString().split(',').join(', ');
        }
    })

    .filter('convertRangeWithUnits', function(){
        return function(rangeSet) {
            var retVal = new String();
            var units = {
                "321" : '$', // USA Dollor
                "322" : '€', // Germany EURO
                "323" : '£', //UK Pond
                "324" : '$', //AU Dollor
                "325" : '¥', // Japan Yen
                "326" : '₱', // Phillipines peso
                "327" : '$', // Mexican Peso
                "328" : '$', // Argentina Peso
                "329" : '$', // Chile Peso
                "330" : '$', // Columbian Peso
                "331" : '¥', // Chinese Yuan
                "332" : '₹', // Indian Rupees
                "333" : 'zł', //Poland currency Polish Zloty
                "334" : '₩', //Korea currency
                "335" : '$', //Canadian Dollar
                "336" : "₦", // Nigerian Naira
                "337" : "Rp", // Indonesian rupiah
                "338" : "R$", // Brazilian Real
                "339" : "₫",  // Vietnami Dong
                "340" : "₴",   // Ukrainian Hryvnia
                "341" : "€",   // Ireland Euro
                "342" : "HK$",   // Hong Kong $
                "343" : "ر.س", // Saudi Riyal
                "344" : "NT$", // New Taiwan Dollar
                "345" : "د.إ", // AED Dirham UAE
                "346" : "RM", // malaysian Ringgit (MYR)
                "347" : "€", // netherlands Euro (EUR)
                "348" : "€", // Belgium Euro (EUR)
                "349" : "KR", // Norwegian krone (NOK)
                "350" : "KR", // Danish krone (DKK)
                "351" : "R", // Rand (ZAR)
                "352" : "KR", // Krona (SEK)
                "353" : "₺", // Turkish Lira (TRY)
                "311" : 'yr', // Years
                "312" : 'mth', // Months
                "313" : 'day', // Days,
                "314" : 'hr', // Hours
                "401" : 'movies', // movies
                "402" : 'tv hours', // hours
                "403" : 'nights',    // Hotel Nights
                "404" : 'trips'    // Hotel Nights
            }
            if(parseInt(rangeSet.units) >= 321 && parseInt(rangeSet.units) <= 324){
                retVal = units[rangeSet.units]+parseInt(rangeSet.from)+' - '+units[rangeSet.units]+parseInt(rangeSet.to);
            }else{
                retVal = parseInt(rangeSet.from)+' '+units[rangeSet.units]+' - '+parseInt(rangeSet.to)+' '+units[rangeSet.units];
            }
            return retVal;
        }
    })

    .filter('rangeCharUnit', function() {
        return function(input) {
            var units = {
                "321" : '$', // USA Dollor
                "322" : '€', // Germany EURO
                "323" : '£', //UK Pond
                "324" : '$', //AU Dollor
                "325" : '¥', // Japan Yen
                "326" : '₱', // Phillipines peso
                "327" : '$', // Mexican Peso
                "328" : '$', // Argentina Peso
                "329" : '$', // Chile Peso
                "330" : '$', // Columbian Peso
                "331" : '¥', // Chinese Yuan
                "332" : '₹', // Indian Rupees
                "333" : 'zł', //Poland currency Polish Zloty
                "334" : '₩', //Korea currency
                "335" : '$', //Canadian Dollar
                "336" : "₦", // Nigerian Naira
                "337" : "Rp", // Indonesian rupiah
                "338" : "R$", // Brazilian Real
                "339" : "₫",  // Vietnami Dong
                "340" : "₴",   // Ukrainian Hryvnia
                "341" : "€",   // Ireland Euro
                "342" : "HK$",   // Hong Kong $
                "343" : "ر.س", // Saudi Riyal
                "344" : "NT$", // New Taiwan Dollar
                "345" : "د.إ", // AED Dirham UAE
                "346" : "RM", // malaysian Ringgit (MYR)
                "347" : "€", // netherlands Euro (EUR)
                "348" : "€", // Belgium Euro (EUR)
                "349" : "KR", // Norwegian krone (NOK)
                "350" : "KR", // Danish krone (DKK)
                "351" : "R", // Rand (ZAR)
                "352" : "KR", // Swedan Krona (SEK)
                "353" : "₺", // Turkish Lira (TRY)
                "311" : 'yr', // Years
                "312" : 'month', // Months
                "313" : 'day', // Days,
                "314" : 'hr', // Hours
                "401" : 'movies', // movies
                "402" : 'tv hours', // hours
                "403" : 'nights',    // Hotel Nights
                "404" : 'trips'    // Hotel Nights
            }
            if(input){
                return units[input.toString()];
            }
        }
    })
    .filter('isObjEmpty', [function() {
        return function(object) {
            return angular.equals({}, object);
    }}])

    .filter('removeUnderscore', [function(){
        return function(input){
            return input.replace(/_/g,' ');
        }
    }])

    .filter('isObjKeysEmpty', [function() {
        return function(object) {
            var empty = false;
            if(!angular.equals({}, object)){
                _.each(_.keys(object), function(key){
                    if(object[key].length > 0){
                        empty = true;
                    }
                });
                if(empty){
                    return false;
                }else{
                    return true;
                }
            }
    }}])

    .filter('convertArrToStr', function() {
        return function(object) {
            if(object)
            return object.toString();
        }
    })
    .filter('capitalize', function() {
        return function(input) {
          return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    })
    .filter('isNaNThenZero', function() {
        return function(object) {
            if(isNaN(object)){
                return 0;
            }else{
                return object;
            }
        }
    })
    .filter('commaSepratedNumber', function() {
        return function(numberVal) {
            
            if(isNaN(parseInt(numberVal))) {
                var returnNum = 0;
                return returnNum.toFixed(2);
            }
            else {
                numberVal = parseFloat(numberVal).toFixed(2);
                return numberVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        }
    });
