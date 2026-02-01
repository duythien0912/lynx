#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULES_DIR="$SCRIPT_DIR/../modules"
SERVER_DIR="$SCRIPT_DIR/../server"

echo -e "${GREEN}=== SuperApp Module Builder ===${NC}"
echo ""

mkdir -p "$SERVER_DIR"

# Find all module directories
modules=$(find "$MODULES_DIR" -maxdepth 1 -mindepth 1 -type d | sort)

if [ -z "$modules" ]; then
    echo -e "${RED}✗ No modules found in $MODULES_DIR${NC}"
    exit 1
fi

echo -e "${YELLOW}Found modules:${NC}"
echo "$modules" | while read -r mod; do
    echo "  - $(basename "$mod")"
done
echo ""

# Build each module
failed=0
for module_path in $modules; do
    module_name=$(basename "$module_path")
    echo -e "${BLUE}▶ Building $module_name...${NC}"
    
    cd "$module_path"
    
    # Install dependencies
    if ! bun install; then
        echo -e "${RED}✗ $module_name: bun install failed${NC}"
        failed=1
        break
    fi
    
    # Build
    if ! bun run build; then
        echo -e "${RED}✗ $module_name: bun run build failed${NC}"
        failed=1
        break
    fi
    
    # Check for output bundle
    bundle_path="$module_path/dist/$module_name.lynx.bundle"
    if [ ! -f "$bundle_path" ]; then
        echo -e "${RED}✗ $module_name: Bundle not found at $bundle_path${NC}"
        failed=1
        break
    fi
    
    # Copy to server
    cp "$bundle_path" "$SERVER_DIR/$module_name.lynx.bundle"
    echo -e "${GREEN}✓ $module_name: Built and copied (${bundle_path})${NC}"
    echo ""
done

if [ $failed -eq 1 ]; then
    echo -e "${RED}=== BUILD FAILED ===${NC}"
    exit 1
fi

# Update manifest
echo -e "${YELLOW}Updating manifest.json...${NC}"
cd "$SERVER_DIR"

cat > manifest.json << EOF
{
  "version": "1.0.0",
  "timestamp": $(date +%s),
  "modules": [
$(find "$MODULES_DIR" -maxdepth 1 -mindepth 1 -type d | sort | while read -r mod; do
    name=$(basename "$mod")
    hash=$(md5 -q "$SERVER_DIR/$name.lynx.bundle" 2>/dev/null || echo "unknown")
    echo "    {"
    echo "      \"name\": \"$name\","
    echo "      \"version\": \"1.0.0\","
    echo "      \"url\": \"http://localhost:8080/$name.lynx.bundle\","
    echo "      \"hash\": \"$hash\""
    echo "    }$( [ "$name" != "$(basename $(find "$MODULES_DIR" -maxdepth 1 -mindepth 1 -type d | sort | tail -1))" ] && echo "," )"
done)
  ]
}
EOF

echo -e "${GREEN}✓ manifest.json updated${NC}"
echo ""
echo -e "${GREEN}=== BUILD SUCCESS ===${NC}"
echo ""
echo "Bundles in $SERVER_DIR:"
ls -lh "$SERVER_DIR"/*.bundle
echo ""
echo -e "${YELLOW}Start server: cd server && ./server.sh${NC}"
