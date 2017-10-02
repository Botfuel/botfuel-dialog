#!/usr/bin/env bash

LOGS_DIR='logs'
SAMPLES_DIR='samples'
SAMPLES_LIST_FILE='SAMPLES.txt'
SAMPLES=()

# check if samples.txt exists
if ! [ -f ${SAMPLES_LIST_FILE} ]
then
  echo "$SAMPLES_LIST_FILE don't exists, exit"
  exit
fi

# delete samples dir if exists
if [ -d ${SAMPLES_DIR} ]
then
  echo "delete $SAMPLES_DIR directory"
  rm -rf ${SAMPLES_DIR}
fi
# create samples dir
mkdir ${SAMPLES_DIR}

# create logs dir if not exists
if ! [ -d ${LOGS_DIR} ]
then
  echo "create $LOGS_DIR directory"
  mkdir ${LOGS_DIR}
fi

# loop over SAMPLE.txt to extract samples list
while IFS= read -r repository
do
    SAMPLES+=(${repository}) # Append line to the array
done < ${SAMPLES_LIST_FILE}

# move into samples folder
cd ${SAMPLES_DIR}

# for each repo
for sample in ${SAMPLES[@]}
do
    echo "Cloning repository $sample"
    # get sample name
    sample_name=$(echo ${sample} | cut -d'/' -f5)
    # clone
    git clone ${sample}
    # move into sample name
    cd ${sample_name}
    # install dependencies
    npm install
    # test and log
    npm run test > ../../${LOGS_DIR}/${sample_name}.log
    # go back to samples dir
    cd ..
done

exit
