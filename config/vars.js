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
        exports.APP_PORT = 8000;
        exports.SSL_ENABLED = false;

        break;

    case 'staging':
        exports.APP_PORT = 8000;
        exports.SSL_ENABLED = false;
        
        break;

    case 'production':
        exports.APP_PORT = 8000;
        exports.SSL_ENABLED = false;
        exports.SSL_CONFIG = {port:443,domain:'',options:{keyfile: 'd:\key.pem',
            certfile: 'd:\cert.pem'}};


        break;
}
