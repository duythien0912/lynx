# SuperApp Bundle Server

This folder contains the mini app bundles and a simple HTTP server for serving them to iOS/Android apps during development.

## Files

```
server/
├── server.sh              # Start the HTTP server
├── manifest.json          # Module manifest for hot updates
├── wallet.lynx.bundle     # Wallet mini app
├── shop.lynx.bundle       # Shop mini app
└── profile.lynx.bundle    # Profile mini app
```

## Usage

### 1. Start the Server

```bash
cd server
./server.sh
```

Server will start on `http://localhost:8080`

### 2. Access from Different Platforms

| Platform | URL | Notes |
|----------|-----|-------|
| iOS Simulator | `http://localhost:8080/` | Same machine |
| Android Emulator | `http://10.0.2.2:8080/` | Emulator localhost alias |
| Physical iOS | `http://<computer-ip>:8080/` | Same WiFi network |
| Physical Android | `http://<computer-ip>:8080/` | Same WiFi network |
| Browser | `http://localhost:8080/` | For testing |

### 3. Available Endpoints

- `http://localhost:8080/manifest.json` - Module manifest
- `http://localhost:8080/wallet.lynx.bundle` - Wallet mini app
- `http://localhost:8080/shop.lynx.bundle` - Shop mini app
- `http://localhost:8080/profile.lynx.bundle` - Profile mini app

## Rebuild Modules

After making changes to mini app source code:

```bash
cd ..
./scripts/build-modules.sh simple   # Quick rebuild
./scripts/build-modules.sh full     # Full compilation
```

## Hot Update

The iOS/Android app checks `manifest.json` every 30 seconds for updates. To trigger a hot update:

1. Rebuild modules: `./scripts/build-modules.sh`
2. The manifest.json timestamp will be updated
3. App will auto-detect and download new bundles

## Production

For production, host these files on your CDN:

```json
// manifest.json
{
  "version": "1.0.0",
  "modules": [
    {
      "name": "wallet",
      "version": "1.0.0",
      "url": "https://your-cdn.com/modules/wallet.lynx.bundle",
      "hash": "sha256:..."
    }
  ]
}
```

Update the `baseURL` in your app's `HotUpdateManager` to point to your production server.
