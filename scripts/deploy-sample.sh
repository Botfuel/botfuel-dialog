#!/bin/bash

SAMPLE_NAME=$1
SAMPLE_PATH="samples/$SAMPLE_NAME"

echo "Sample name : $SAMPLE_NAME"

if [ -z "$SAMPLE_NAME" ]
then
  echo "Sample name is not valid"
elif ! [ -d "$SAMPLE_PATH" ]
then
  echo "$SAMPLE_NAME is not a valid sample directory"
else
  echo "$SAMPLE_NAME is a valid sample directory."
  echo "Pushing to heroku App ..."
  git subtree push --prefix samples/$SAMPLE_NAME heroku master
  echo "OK"
fi

exit
