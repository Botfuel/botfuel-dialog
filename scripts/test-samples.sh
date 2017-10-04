#!/bin/bash

LOGS_DIR='logs'
SAMPLES_DIR='samples'
SAMPLES_LIST_FILE='SAMPLES.txt'
SAMPLES=()

exec_command() {
  echo "Running "$*
  eval $* & PID=$!
  printf "["
  # While process is running...
  while kill -0 $PID 2> /dev/null; do
    printf  "."
    sleep 1
  done
  printf "]\n"
}

test_sample () {
  # get sample from arguments
  SAMPLE=$1
  # clone repository
  GIT_COMMAND="git clone ${SAMPLE} &> /dev/null"
  exec_command $GIT_COMMAND
  # get sample name
  SAMPLE_NAME=$(echo ${SAMPLE} | cut -d'/' -f2)
  # move into sample name
  cd ${SAMPLE_NAME}
  # install dependencies
  NPM_INSTALL_COMMAND="npm install &> /dev/null"
  exec_command $NPM_INSTALL_COMMAND
  # link sample to local bot-sdk2
  NPM_LINK_COMMAND="npm link ../../ &> /dev/null"
  exec_command $NPM_LINK_COMMAND
  # train bot model
  NPM_TRAIN_COMMAND="npm run train -- shell_config &> /dev/null"
  exec_command $NPM_TRAIN_COMMAND
  # run tests and log
  log_file_path=../../${LOGS_DIR}/${SAMPLE_NAME}.log
  date > ${log_file_path}
  NPM_TEST_COMMAND="npm run test >> ${log_file_path} && echo 'OK' || echo 'KO'"
  exec_command $NPM_TEST_COMMAND
}

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
echo "Directory $SAMPLES_DIR has been cleaned"

# delete logs dir if exists
if [ -d ${LOGS_DIR} ]
then
  rm -rf ${LOGS_DIR}
fi
# create logs dir
mkdir ${LOGS_DIR}
echo "Directory $LOGS_DIR has been cleaned"

# loop over SAMPLE.txt to extract samples list
while IFS= read -r repository
do
  SAMPLES+=(${repository}) # Append line to the array
done < ${SAMPLES_LIST_FILE}

# go into samples dir
cd ${SAMPLES_DIR}
# for each repo
for sample in ${SAMPLES[@]}
do
  # execute method to test sample in a sub shell
  (test_sample ${sample})
done

exit
