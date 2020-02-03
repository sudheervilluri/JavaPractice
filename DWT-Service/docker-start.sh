# checking the environment type
if [ $DWT_ENV_TYPE == development ] || [ $DWT_ENV_TYPE == testing ]
then
dockerrepositoryname="docker-integration.cernerrepos.net/dwt/dwt-service"
elif [ $DWT_ENV_TYPE == production ]
then
dockerrepositoryname="docker-production.cernerrepos.net/dwt/dwt-service"
elif [ $DWT_ENV_TYPE == staging ]
then
dockerrepositoryname="docker-staging.cernerrepos.net/dwt/dwt-service"
else 
echo "DWT_ENV_TYPE environment variable is not set properly"
exit 
fi

# pull the docker image from artifactory 
docker pull $dockerrepositoryname

# if DWT_SSL_ENABLED is true ,application will run in https mode else the application will run in http mode.
if [ $DWT_SSL_ENABLED == true ]
then
docker run -v "$DSSPropertyLocation:c:/service/data" -v "$DWT_CERT_FOLDER_PATH:c:/service/certs" -e "DSSPropertyLocation=$DSSPropertyLocation" -e DWT_HOST_NAME=$COMPUTERNAME.$USERDNSDOMAIN  -e DWT_SSL_ENABLED=$DWT_SSL_ENABLED -e DWT_SERVICE_HTTPS_PORT=$DWT_SERVICE_HTTPS_PORT  -e DWT_ENV_TYPE=$DWT_ENV_TYPE -it -p 4001:$DWT_SERVICE_HTTPS_PORT $dockerrepositoryname
else
docker run -v "$DSSPropertyLocation:c:/service/data"  -e "DSSPropertyLocation=$DSSPropertyLocation" -e DWT_HOST_NAME=$COMPUTERNAME.$USERDNSDOMAIN -e DWT_SERVICE_HTTP_PORT=$DWT_SERVICE_HTTP_PORT -e DWT_SSL_ENABLED=$DWT_SSL_ENABLED -e DWT_ENV_TYPE=$DWT_ENV_TYPE -it -p 4000:$DWT_SERVICE_HTTP_PORT $dockerrepositoryname
fi
