#!/bin/bash
source ./setup.sh

cd backend
node bin/index.js &
cd ..

cd frontend
npm run dev &
cd ..

cd event-service
npm run start &
cd ..

