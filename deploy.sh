#!/bin/bash
set -e

# ดึงโค้ดล่าสุดจาก Git
echo "Pulling latest code from Git repository..."
git pull origin main

# สร้างหรืออัปเดต Docker image และ container
echo "Building and restarting Docker containers..."
docker compose down
docker compose up --build -d

echo "Deployment complete!"
