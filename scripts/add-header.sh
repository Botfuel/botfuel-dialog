#!/bin/bash

# defaults variables
LICENSE_TERMS_REGEX="(LICENSE|Copyright)"
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
  FILES+=(${SCOPE})
else
  echo ${SCOPE} "is not valid"
  exit
fi

# method to check if file have a header
file_has_header() {
  file=$1
  match=$(grep -E ${LICENSE_TERMS_REGEX} ${file})
  if (($(echo ${#match}) > 0)); then echo 1; else echo 0; fi
}

# method to add a header to the beginning of a file
add_file_header() {
  file=$1
  echo "$(cat ${HEADER})\n" | cat - ${file} > temp.txt; mv temp.txt ${file}
}

# add header to files that have no header
for current_file in "${FILES[@]}"
do
  if [[ "$(file_has_header ${current_file})" == "0" ]]
  then
    echo "${current_file} have no header, adding a header ..."
    add_file_header ${current_file}
  else
    echo "${current_file} have header"
  fi
done
