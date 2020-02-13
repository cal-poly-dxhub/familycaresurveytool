#!/bin/bash

#Cal Poly Digital Transformation Hub
#Chase Peak
#2020/02/04

if ! which aws > /dev/null 2>&1
then
    echo "You must have the AWS CLI tools installed before you can use this tool"
    exit 1
fi

if [ $# -ne 1 ];
then
    echo "Error: enter the name of the target S3 bucket."
    exit 1
fi

zip -qr getSurvey.zip lambda/GetSurvey/ .
zip -qr postSurvey.zip lambda/PostSurvey/ .
zip -qr postResult.zip lambda/PostResult/ .

#puts object into specified bucket
aws s3 cp ./getSurvey.zip s3://$1/
aws s3 cp ./postSurvey.zip s3://$1/
aws s3 cp ./postResult.zip s3://$1/

rm getSurvey.zip
rm postSurvey.zip
rm postResult.zip

exit
