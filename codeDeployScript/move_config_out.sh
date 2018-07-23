#!/bin/bash
if sudo cp /mnt/datastore/nodeuser/frontend_platform/config/config.js /mnt/datastore/nodeuser/config.js
then
 echo "Success"
else
 echo "Failure, exit status $?"
fi