#!/bin/bash

# Run backend tests
cd /home/ubuntu/hatchling-app/backend
source venv/bin/activate
python -m unittest discover -s tests

# Output test results
echo "Backend tests completed"
