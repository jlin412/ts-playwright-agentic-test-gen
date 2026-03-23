#!/bin/bash
set -e

# Allow services time to initialize
sleep 5

echo "========================================"
echo "Running Traditional Playwright Specs (API + UI)"
echo "========================================"
npm run test

echo ""
echo "========================================"
echo "Running Playwright-BDD Specs (API + UI)"
echo "========================================"
npm run test:bdd
