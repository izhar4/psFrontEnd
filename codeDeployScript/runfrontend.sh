#!/bin/bash
cd /mnt/datastore/nodeuser/frontend_platform
chown -R nodeuser:nodeuser .
npm install
gulp

if [ "$DEPLOYMENT_GROUP_NAME" == "Production-Frontend" ]; then
 service production-ui restart
 echo "starting production"
else
 service stage-ui restart 'staging' 'http://staging.purespectrum.com' 3000 "http://staging.purespectrum.com" 8000 'localhost' 28000 'stagingPureSpectrum'
 echo "starting staging"
fi