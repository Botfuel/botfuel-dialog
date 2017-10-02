#!/usr/bin/env bash

LOGS_DIR='logs'
SAMPLES_DIR='samples'
SAMPLES_LIST_FILE='SAMPLES.txt'
SAMPLES=()

# check if samples.txt exists
if ! [ -f ${SAMPLES_LIST_FILE} ]
then
  echo "$SAMPLES_LIST_FILE doesn't exist, exit"
  exit
fi

# delete samples dir if exists
if [ -d ${SAMPLES_DIR} ]
then
  rm -rf ${SAMPLES_DIR}
fi
# create samples dir
mkdir ${SAMPLES_DIR}
echo "$SAMPLES_DIR has been cleaned"

# delete logs dir if exists
if [ -d ${LOGS_DIR} ]
then
  rm -rf ${LOGS_DIR}
fi
# create logs dir
mkdir ${LOGS_DIR}
echo "$LOGS_DIR has been cleaned"

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
    log_file_path=../../${LOGS_DIR}/${sample_name}.log
    date > ${log_file_path}
    npm run test >> ${log_file_path}
    # go back to samples dir
    cd ..
done

exit
