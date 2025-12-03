#!/bin/bash

for file in `ls .`; do
  if [ -f ${file} ] && [ ${file##*.} == "proto" ]; then
    protoc --go_out=../../../ ${file}
  fi
done

