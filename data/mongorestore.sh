#!/bin/bash

# Export collection: mongodump --gzip --archive=/dump/Formshaker.dump

mongorestore --gzip --archive=./dump/Formshaker.dump
