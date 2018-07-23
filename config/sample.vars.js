/**
 * File to set environment variables that can be used to switch between different environments, viz dev/staging/prod
 */

// Set the ENVIRONMENT variable to point to the right environment

exports.ENV = 'development';
//exports.ENV = 'staging';
//exports.ENV = 'production';

//switch the connection handles depending on the environment
switch(exports.ENV){
    case 'development':
        exports.MONGO_HOST= 'localhost';
        exports.MONGO_PORT = 27017;
        exports.MONGO_DBNAME = 'devPureSpectrum';
        exports.APP_PORT = 8000;
        exports.SSL_ENABLED = false;
        exports.SSL_CONFIG = {port:443,domain:'',options:{keyfile: 'd:\demokey.key',
            certfile: 'd:\demosite.crt'}};


        break;



    case 'staging':
        exports.MONGO_HOST= 'localhost';
        exports.MONGO_PORT = 27017;
        exports.MONGO_DBNAME = 'devPureSpectrum';
        exports.APP_PORT = 3001;
        exports.SSL_ENABLED = false;
        exports.SSL_CONFIG = {port:443,domain:'',options:{keyfile: 'd:\key.pem',
            certfile: 'd:\cert.pem'}};


        break;

    case 'production':
        exports.MONGO_HOST= 'localhost';
        exports.MONGO_PORT = 27017;
        exports.MONGO_DBNAME = 'devPureSpectrum';
        exports.APP_PORT = 3001;
        exports.SSL_ENABLED = false;
        exports.SSL_CONFIG = {port:443,domain:'',options:{keyfile: 'd:\key.pem',
            certfile: 'd:\cert.pem'}};


        break;
}
