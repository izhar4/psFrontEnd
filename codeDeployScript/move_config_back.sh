#!/bin/bash
if sudo cp /mnt/datastore/nodeuser/config.js /mnt/datastore/nodeuser/frontend_platform/config/config.js
then
 echo "Success"
else
 echo "Failure, exit status $?"
fi