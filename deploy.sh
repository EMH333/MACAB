#!/bin/bash

cd "$(dirname "$0")" || exit

# Build the project
npm run build

# Copy the build to the server
rsync -rzcv --chmod=F644 ./public/ malloy:/var/www/html/abday.ethohampton.com
