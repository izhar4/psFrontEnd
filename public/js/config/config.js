/**
 * Created by Parveen on 3/3/2016.
 */
var config = config || {};
//PD-1523
var transStatus = [
   {name: "PS Drop", id: 11},
   {name: "PS QuotaFull Core", id: 12},
   {name: "PS Termination Core", id: 13},
   {name: "PS Side In Progress", id: 14},
   {name: "PS Quality", id: 15},
   {name: "Buyer side In Progress", id: 16},
   {name: "Buyer QuotaFull", id: 17},
   {name: "Buyer Termination", id: 18},
   {name: "Buyer Drop", id: 19},
   {name: "Buyer Quality Termination", id: 20},
   {name: "Complete", id: 21},
   {name: "PS Survey Closed Termination", id: 22},
   {name: "PS Survey Paused Termination", id: 23},
   {name: "PS Unopened Quota Term", id: 24},
   {name: "PS Supplier Allocation Full", id: 25},
   {name: "PS Past Participation Fail", id: 26},
   {name: "PS Supplier Quota Allocation Full", id: 27},
   {name: "PS_Invalid_Survey", id: 28},
   {name: "PS LOI Threshold Failure", id: 29},
   {name: "Buyer Security", id: 30},
   {name: "Buyer Hash Security", id: 31},
   {name: "PS Grouping Termination", id: 32},
   {name: "Buyer Reconciliation Reject", id: 33},
   {name: "PS Temp Exclusion", id: 34},
   {name: "PS No Matched Quotas", id: 35},
   {name: "PS Max Ip Throttling Termination", id: 36},
   {name: "PS Quota Throttling Termination", id: 37},
   {name: "PS PSID Geo Termination", id: 38},
   {name: "PS TrueSample Fail", id: 39},
   {name: "PS GeoIP Fail", id: 40},
   {name: "PS Bot Fail", id: 41},
   {name: "PS BlackList Fail", id: 42},
   {name: "PS Anonymous Fail", id: 43},
   {name: "PS Include Fail", id: 44},
   {name: "PS Termination Extended", id: 45},
   {name: "PS Termination Custom", id: 46},
   {name: "PS QuotaFull Extended", id: 47},
   {name: "PS QuotaFull Custom", id: 48},
]

config.development ={
    app: 'pureSpectrumApp-Dev',
    cmp: [19, 2, 4, 137, 141], //PD-1145
    overridCmp : [141, 189], //PD-1096
    //supplierAccordian : [141, 20], //PD-1227
    maxinProgress : [], //PD-1360 puresepctrum buyer
    pureSpecturm : {
        url:'http://localhost:3000',
        activityUrl:'http://localhost:7070',
        socketUrl:'http://localhost:8889',
        decipherUrl: 'http://localhost:3030'
    },
    feasibility: {
        url: 'http://localhost:7000'
    },
    advanceTarget : [], //PD-1344 critical mix, research now, ugam, smith_id, morpace, puresepctrum buyer, purespectrum demo buyer, marketCast
    bera : [], // ps_id, cm_id, morpace, suresh_id
    languageDefault: 1,
    countryDefault: 1,
    BSEC: 'a70mx8',
    CAPTCHA_KEY:'',
    childMasterQual:{
        gender: 220,
        age: 230,
        id: 218,
        noChildren : 111,
        haveChildren : 112,
        ageUnitYr: 311,
        ageUnitMnth: 312
    },
    zipcodesQual:{
        id:229
    },
    countryInQuals:{
        'gender':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','VN','RU','TH','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'SA', 'TW', 'AE', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'age':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','VN','RU','TH','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'SA', 'TW', 'AE', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'hhi':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'TW', 'AE', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'race':['US','CA'],
        'bera':['US','CA'],
        'relationship':['US','CA','IT','MX','AR','CL','CO','ES'],
        'children':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'TW', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'employment':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','VN','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'TW', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'education':['US','CA','IT','MX','AR','CL','CO','ES','VN', 'SA', 'AE'],
        'device':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','VN','RU','TH','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'SA', 'TW', 'AE', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'location':['US','CA','IN', 'UK'],
        'census':['US']
    },
    transStatus : transStatus,
    clickBal:[],
    incl_excl:[]
};


config.staging ={
    app: 'pureSpectrumApp-Staging',
    cmp: [4, 43, 33, 25],//PD-1145
    overridCmp : [4, 189], //PD-1096
    supplierAccordian : [4], //PD-1227
    maxinProgress : [25], //PD-1360 puresepctrum buyer
    pureSpecturm : {
        url:'http://staging.spectrumsurveys.com:3000',
        activityUrl:'http://staging.spectrumsurveys.com:7070',
        decipherUrl: 'http://decipher.spectrumsurveys.com:3030'
    },
    
    feasibility: {
        url: 'http://feasibility.dev.spectrumsurveys.com:7000'
    },
    advanceTarget : [43, 33, 25, 30], //PD-1344 critical mix, research now, PureSpectrum Buyer, PD-1438 SFE Buyer(30)
    bera : [], // ps_id, cm_id, morpace, suresh_id
    languageDefault: 1,
    countryDefault: 1,
    BSEC: 'a70mx8',
    CAPTCHA_KEY:'',
    childMasterQual:{
        gender: 220,
        age: 230,
        id: 218,
        noChildren : 111,
        haveChildren : 112,
        ageUnitYr: 311,
        ageUnitMnth: 312
    },
    zipcodesQual:{
        id:229
    },
    countryInQuals:{
        'gender':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','VN','RU','TH','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'SA', 'TW', 'AE', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'age':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','VN','RU','TH','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'SA', 'TW', 'AE', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'hhi':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'TW', 'AE', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'race':['US','CA'],
        'bera':['US','CA'],
        'relationship':['US','CA','IT','MX','AR','CL','CO','ES'],
        'children':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'TW', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'employment':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','VN','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'TW', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'education':['US','CA','IT','MX','AR','CL','CO','ES','VN', 'SA', 'AE'],
        'device':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','VN','RU','TH','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'SA', 'TW', 'AE', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'location':['US','CA','IN', 'UK'],
        'census':['US']
    },
    transStatus : transStatus,
    clickBal:[],
    incl_excl:[]
};

config.uat ={
    app: 'pureSpectrumApp-Staging',
    cmp: 4,
    pureSpecturm : {
        url:'http://uat.spectrumsurveys.com:3000',
        activityUrl:'http://staging.spectrumsurveys.com:7070',
        decipherUrl: 'http://decipher.spectrumsurveys.com:3030'
    },
     feasibility: {
        url: 'http://feasibility.dev.spectrumsurveys.com:7000'
    },
    advanceTarget : [], // ps_id, smith_id, morpace, suresh_id, sentient, marketCast
    bera : [], // ps_id, cm_id, morpace, suresh_id
    languageDefault: 1,
    countryDefault: 1,
    BSEC: 'a70mx8',
    CAPTCHA_KEY:'6LdGmwsUAAAAAKliArH73Xk8_V4QtfiuHMgatGIk',
    childMasterQual:{
        gender: 220,
        age: 230,
        id: 218,
        noChildren : 111,
        haveChildren : 112,
        ageUnitYr: 311,
        ageUnitMnth: 312
    },
    zipcodesQual:{
        id:229
    },
    countryInQuals:{
        'gender':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','VN','RU','TH','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'SA', 'TW', 'AE', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'age':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','VN','RU','TH','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'SA', 'TW', 'AE', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'hhi':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'TW', 'AE', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'race':['US','CA'],
        'bera':['US','CA'],
        'relationship':['US','CA','IT','MX','AR','CL','CO','ES'],
        'children':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'TW', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'employment':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','VN','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'TW', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'education':['US','CA','IT','MX','AR','CL','CO','ES','VN', 'SA', 'AE'],
        'device':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','VN','RU','TH','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'SA', 'TW', 'AE', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'location':['US','CA','IN', 'UK'],
        'census':['US']
    },
    transStatus : transStatus,
    clickBal:[],
    incl_excl:[]
};



config.production ={
    app: 'pureSpectrumApp-Prod',
    cmp: [19, 2, 4, 137, 141], //PD-1145
    overridCmp : [141, 39, 132, 171, 33, 56, 43, 116, 154, 98, 189, 235, 65], //PD-1096 PD-1361 Morning Consult API - 171, Smith Geiger Buyer, PS Support Lightspeed, PD-1439- EMI & FocusVision(43, 116), Climate Nexus(wyatt), Sentinent, MSW-ARS account, Snappy
    buyerClient : [20, 141],
    enableUrlTranfrmUsr : [141, 20, 163], //PD-1236, 1412(enable CM API Company)
    supplierAccordian : [141, 20, 163], //PD-1227, 1412(enable CM API Company)
    maxinProgress : [141], //PD-1360 puresepctrum buyer
    pureSpecturm : {
        url:'https://spectrumsurveys.com',
        activityUrl:'http://activity.spectrumsurveys.com:7070',
        decipherUrl: 'http://localhost:3030'
    },
    feasibility: {
        url: 'http://feasibility.spectrumsurveys.com:7000'
    },
    advanceTarget : [4, 2, 134, 33, 174, 141, 20, 39, 171, 192, 98, 20, 43, 116, 137, 17, 67, 132, 235, 248], //PD-1344 critical mix, research now, ugam, smith_id, morpace, puresepctrum buyer, purespectrum demo buyer, marketCast, morning consult, Simple Opinion, Sentient Decision Sciences, Suresh Buyer, PD-1439- EMI & FocusVision(43, 116), Ugam, Luth Research Buyer, Quest Mindshare, Bera, snappy
    bera : [145, 4, 174, 20, 132], // ps_id, cm_id, morpace, suresh_id, beraUser, Sentient Decision Sciences
    languageDefault: 1,
    countryDefault: 1,
    BSEC: 'a70mx8',
    CAPTCHA_KEY:'6LerGBEUAAAAABRFWHRxAtPDCBBcDll6JLl0u3B0',
    childMasterQual:{
        gender: 220,
        age: 230,
        id: 218,
        noChildren : 111,
        haveChildren : 112,
        ageUnitYr: 311,
        ageUnitMnth: 312
    },
    zipcodesQual:{
        id:229
    },
    countryInQuals:{
        'gender':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','VN','RU','TH','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'SA', 'TW', 'AE', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'age':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','VN','RU','TH','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'SA', 'TW', 'AE', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'hhi':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'TW', 'AE', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'race':['US','CA'],
        'bera':['US','CA'],
        'relationship':['US','CA','IT','MX','AR','CL','CO','ES'],
        'children':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'TW', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'employment':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','VN','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'TW', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'education':['US','CA','IT','MX','AR','CL','CO','ES','VN', 'SA', 'AE'],
        'device':['US','CA','AU','UK','FR','DE','JP','PH','BR','CN','IN','PL','KR','NG','ID','VN','RU','TH','UA','IE','HK','IT','MX','AR','CL','CO','ES', 'SA', 'TW', 'AE', 'MY', 'NL', 'BE', 'NO', 'DK', 'ZA', 'SE', 'TR'],
        'location':['US','CA','IN', 'UK'],
        'census':['US']
    },
    transStatus : transStatus,
    clickBal:[19,20,34,216,217,137,141,227, 99], //PureSpectrum, Purespectrum demo buyer, Soapboxsample buyer, Ugam, PureSpectrum Projects, Aite Group, C+R Research
    incl_excl:[141, 20, 132, 19] // puresepctrum buyer, purespectrum demo buyer, Bera
};

