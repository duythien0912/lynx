#!/bin/bash

# Simple HTTP server to host .lynx.bundle files for testing
# Usage: ./server.sh

cd "$(dirname "$0")"

echo "=== SuperApp Bundle Server ==="
echo ""
echo "Serving .lynx.bundle files from: $(pwd)"
echo ""
echo "Available endpoints:"
echo "  http://localhost:8080/manifest.json"
echo "  http://localhost:8080/wallet.lynx.bundle"
echo "  http://localhost:8080/shop.lynx.bundle"
echo "  http://localhost:8080/profile.lynx.bundle"
echo ""
echo "This server can be used by:"
echo "  - iOS Simulator/Device"
echo "  - Android Emulator/Device"
echo "  - Web browsers (for testing)"
echo ""

# Check if python3 is available
if command -v python3 &> /dev/null; then
    echo "Starting server with Python 3..."
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    echo "Starting server with Python 2..."
    python -m SimpleHTTPServer 8080
else
    echo "❌ Python not found. Please install Python."
    exit 1
fi
