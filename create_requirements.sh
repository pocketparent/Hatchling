#!/bin/bash

# Create requirements.txt for backend
cd /home/ubuntu/hatchling-app/backend
source venv/bin/activate
pip freeze > requirements.txt

echo "Created requirements.txt for backend"
