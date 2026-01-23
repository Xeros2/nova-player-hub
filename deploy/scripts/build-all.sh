#!/bin/bash
set -e

echo "Building all Nova Player apps..."

cd apps/website && npm run build && cd ../..
cd apps/user-panel && npm run build && cd ../..
cd apps/admin-panel && npm run build && cd ../..
cd apps/reseller-panel && npm run build && cd ../..
cd backend && npm run build && cd ..

echo "All builds completed!"
