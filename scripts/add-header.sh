#!/bin/bash

# defaults variables
HEADER="header.txt"
SCOPE="src"
FILES=()

# get scope arg if defined
if [ $1 ]; then
  SCOPE=$1
fi

# get scope files
if [ -d ${SCOPE} ]; then
  FILES=($(find ${SCOPE} -type f -name "*.js"))
elif [ -f ${SCOPE} ]; then
  if [ ${SCOPE: -3} == ".js" ]; then
    FILES+=(${SCOPE})
  else
    echo ${SCOPE} "is not a valid file, only js files are allowed"
  fi
else
  echo ${SCOPE} "is not valid"
  exit
fi

# method to check if file has a header
clean_header() {
  file=$1
  # get the first 5 lines of the file
  lines="$(sed -n '1,16p' < ${file})"
  # split lines to array
  IFS=$'\n' read -rd '' -a arr <<< "$lines"; unset IFS
  # verify header
  i=1
  has_header_term=0
  for current_line in "${arr[@]}"
  do
    if [[ ${current_line} == "/**" ]]
    then
      begin=${i}
    elif [[ begin && ${current_line} == *"Copyright"* ]]
    then
      has_header_term=1
    elif [[ begin && has_header_term && ${current_line} == " */" ]]
    then
      end=${i}
    fi
    ((i++))
  done
  # remove header + extra space if header is found
  if [[ ${begin} && ${has_header_term} == 1 && ${end} ]]
  then
    sed -e "${begin},$((end + 1))d" ${file} > temp.txt; mv temp.txt ${file}
  fi
}

# method to add a header to the beginning of a file
add_file_header() {
  file=$1
  echo "$(cat ${HEADER})\n" | cat - ${file} > temp.txt; mv temp.txt ${file}
}

# clean files header and add the header to the file
for current_file in "${FILES[@]}"
do
  clean_header ${current_file}
  add_file_header ${current_file}
done
