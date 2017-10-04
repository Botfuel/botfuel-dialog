#!/bin/bash

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

test_sample () {
  # go into samples dir
  cd ${SAMPLES_DIR}
  # get sample from arguments
  sample=$1
  # get sample name
  sample_name=$(echo ${sample} | cut -d'/' -f2)
  # clone repository
  echo "Cloning repository $sample"
  git clone ${sample}
  # move into sample name
  echo "Move into $sample_name"
  cd ${sample_name}
  # install dependencies
  echo "Install $sample_name dependencies"
  npm install
  # link sample to local bot-sdk2
  echo "Link $sample_name to bot-sdk2 local"
  npm link ../../
  # train bot model
  echo "Train $sample_name"
  npm run train -- shell_config
  # run tests and log
  log_file_path=../../${LOGS_DIR}/${sample_name}.log
  date > ${log_file_path}
  echo "Testing $sample_name ..."
  npm run test >> ${log_file_path} && echo "$sample_name tests : OK" || echo "$sample_name tests : KO"
}

# for each repo
for sample in ${SAMPLES[@]}
do
  # execute method to test sample in a sub shell
  (test_sample ${sample})
done

exit
