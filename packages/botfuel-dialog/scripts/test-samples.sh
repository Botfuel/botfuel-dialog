#!/bin/bash

LOGS_DIR='logs'
SAMPLES_DIR='samples'
SAMPLES_LIST_FILE='SAMPLES.txt'
SAMPLES=()
RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
BLUE='\033[0;34m'
BLANK='\033[0m'

screen_output() {
  MESSAGE=$1
  PID=$2
  time=0
  while kill -0 $PID 2> /dev/null; do
    echo -ne "${ORANGE}${MESSAGE} (${time}s) \r"
    time=$((time + 1))
    sleep 1
  done
  TASK_TIME=$((TASK_TIME + time))
  echo -e "${GREEN}${MESSAGE} (${time}s) OK!    "
}

clone() {
  SAMPLE=$1
  git clone ${SAMPLE} &> /dev/null & PID=$!
  screen_output "Clone sample repository" ${PID}
}

install() {
  SAMPLE_NAME=$1
  cd ${SAMPLE_NAME}
  npm install &> /dev/null & PID=$!
  screen_output "Install dependencies" ${PID}
}

link() {
  npm link ../../ &> /dev/null & PID=$!
  screen_output "Link to local sdk" ${PID}
}

train() {
  ./node_modules/.bin/botfuel-train ../../../../shell_config &> /dev/null & PID=$!
  screen_output "Train sample" ${PID}
}

test_and_log() {
  SAMPLE_NAME=$1
  log_file_path=../../${LOGS_DIR}/${SAMPLE_NAME}.log
  ok_file_path=../../${LOGS_DIR}/${SAMPLE_NAME}.ok
  ko_file_path=../../${LOGS_DIR}/${SAMPLE_NAME}.ko
  date > ${log_file_path}

  npm run test >> ${log_file_path} && touch ${ok_file_path} || touch ${ko_file_path} &> /dev/null & PID=$!
  screen_output "Test sample" ${PID}

  if [ -f ${ok_file_path} ]
  then
    echo -e "${GREEN}Tests passed !${BLANK}"
  else
    echo -e "${RED}Tests failed !${BLANK}"
  fi
}

test_sample() {
  TASK_TIME=0
  # get sample from arguments
  SAMPLE=$1
  # get sample name
  SAMPLE_NAME=$(echo ${SAMPLE} | cut -d'/' -f2)
  echo "** $SAMPLE_NAME **" | tr /a-z/ /A-Z/
  # clone repository
  clone ${SAMPLE}
  # install dependencies
  install ${SAMPLE_NAME}
  # link sample to local botfuel-dialog
  link
  # train bot model
  train
  # run tests and log
  test_and_log ${SAMPLE_NAME}
  # print task time
  echo -e "\n${BLUE}Total time: ${TASK_TIME}s${BLANK}\n"
  # exit sub shell
  exit
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

# delete logs dir if exists
if [ -d ${LOGS_DIR} ]
then
  rm -rf ${LOGS_DIR}
fi
# create logs dir
mkdir ${LOGS_DIR}

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
