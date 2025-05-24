#!/bin/bash
PROJECT_REGEX='(.+?)-[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{6}\.tgz'
FNAME="$(basename $1)"
if [[ $FNAME =~ $PROJECT_REGEX ]]; then
    PNAME="${BASH_REMATCH[1]}"
    mkdir $PNAME
    tar -xzf "$1" --strip-components=1 -C "$PNAME"
else
    echo pattern match fail
    exit 1
fi
