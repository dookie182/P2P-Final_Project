#! /bin/bash
echo "Starting Ganache..."
ganache -p 8545 &
echo "Compiling Contracts..."
truffle compile 
echo "Deploying Contracts..."
truffle migrate --reset
echo "Starting App..."
npm run dev




