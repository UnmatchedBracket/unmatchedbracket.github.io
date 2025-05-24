#!/bin/bash
for i in $(ls $1); do
    echo $i
    bash extract-glitch.bash "$1/$i"
done
