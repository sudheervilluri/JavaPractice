#!/bin/bash

# Create 'coverage' folder if it does not exist
mkdir -p ./coverage

# Log file path
LOG_FILE=./coverage/unit-test-evidence.txt

echo Generating $LOG_FILE

# Print user/date/time/timezone information for ProcessIT
echo Executed by $USERNAME on `date` Timezone : `date +%Z` > $LOG_FILE

# Run Jest test script to execute unit tests and generate unit test evidence for ProcessIT
echo Executing JavaScript unit tests >> $LOG_FILE
echo >> $LOG_FILE
npm test >> $LOG_FILE

# Print unit test evidence report location
echo >> $LOG_FILE
echo Unit Test Evidence generated at : $LOG_FILE 