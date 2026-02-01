# SuperApp Lynx - Project Guide

This is a **SuperApp project** built with the [Lynx](https://lynxjs.org/) framework - a cross-platform framework from ByteDance that uses React for the UI layer and renders native views on mobile platforms.

## Project Overview

This project demonstrates a SuperApp architecture where:
- A **native iOS container app** provides the shell and navigation
- **Mini-apps (modules)** are built as separate Lynx bundles that can be loaded dynamically
- **Hot update mechanism** allows updating mini-apps without app store releases
- Each mini-app is an independent ReactLynx application

### Mini-Apps Included
- **Wallet** - Digital wallet with balance, payments, and transaction history
- **Shop** - E-commerce with product catalog, cart, and checkout
- **Profile** - User profile with stats, menu, and authentication

## Technology Stack

### iOS Native Layer
- **Language**: Swift
- **Platform**: iOS 10.0+
- **Build Tool**: Xcode, CocoaPods
- **Key Dependencies**:
  - `Lynx` 3.6.0 - Core Lynx framework
  - `LynxService` 3.6.0 - Image, Log, Http services
  - `SDWebImage` 5.15.5 - Image loading
  - `XElement` 3.6.0 - Extended UI elements

### Mini-App Layer (Frontend)
- **Framework**: ReactLynx (React for Lynx)
- **Language**: TypeScript
- **Build Tool**: Rspeedy (Rspack-based)
- **Package Manager**: Bun (preferred) or pnpm/npm
- **Testing**: Vitest with @lynx-js/react/testing-library

### Development Server
- Simple Python HTTP server for serving `.lynx.bundle` files
- JSON manifest for version tracking and hot updates

## Project Structure

```
.
├── ios/                          # iOS native application
│   ├── Hello-Lynx.xcodeproj/     # Xcode project
│   ├── Hello-Lynx.xcworkspace/   # CocoaPods workspace
│   ├── Hello-Lynx/               # Swift source files
│   │   ├── AppDelegate.swift
│   │   ├── SceneDelegate.swift   # Entry point, initializes Lynx
│   │   ├── RootViewController.swift    # Main menu with mini-app cards
│   │   ├── MiniAppViewController.swift # Container for each mini-app
│   │   ├── SuperAppLynxProvider.swift  # Bundle loading (local/remote/cache)
│   │   ├── HotUpdateManager.swift      # Checks for updates every 30s
│   │   ├── ModuleRegistry.swift        # Mini-app registration
│   │   └── Info.plist
│   └── Podfile                   # CocoaPods dependencies
│
├── modules/                      # Lynx mini-apps
│   ├── wallet/                   # Wallet mini-app
│   ├── shop/                     # Shop mini-app
│   └── profile/                  # Profile mini-app
│       ├── src/
│       │   ├── App.tsx           # Main component
│       │   ├── App.css           # Component styles
│       │   ├── index.tsx         # Entry point
│       │   └── __tests__/        # Vitest tests
│       ├── package.json
│       ├── lynx.config.ts        # Rspeedy build config
│       ├── vitest.config.ts      # Test config
│       └── tsconfig.json
│
├── server/                       # Development bundle server
│   ├── server.sh                 # Start HTTP server
│   ├── manifest.json             # Module manifest with versions/hashes
│   ├── wallet.lynx.bundle
│   ├── shop.lynx.bundle
│   └── profile.lynx.bundle
│
└── scripts/
    └── build-all.sh              # Build all modules & update manifest
```

## Build Commands

### Build All Mini-Apps
```bash
./scripts/build-all.sh
```
This will:
1. Install dependencies for each module (`bun install`)
2. Build each module (`bun run build`)
3. Copy bundles to `server/`
4. Generate `manifest.json` with MD5 hashes

### Build Individual Module
```bash
cd modules/<module-name>
bun install
bun run build
```

### Development Mode (Individual Module)
```bash
cd modules/<module-name>
bun run dev
```
This starts a dev server with QR code for LynxExplorer testing.

### Test Individual Module
```bash
cd modules/<module-name>
bun run test
```

### Start Bundle Server
```bash
cd server
./server.sh
```
Server runs on `http://localhost:8080`

### Build iOS App
Open `ios/Hello-Lynx.xcworkspace` in Xcode and build.

## iOS App Architecture

### Key Components

#### SceneDelegate.swift
Entry point that:
- Initializes Lynx environment
- Sets up `ModuleRegistry` for mini-app management
- Starts `HotUpdateManager` for auto-updates
- Creates navigation stack with `RootViewController`

#### SuperAppLynxProvider
Implements `LynxTemplateProvider` for loading bundles:
1. First checks local app bundle (for built-in modules)
2. Then checks cache directory (for downloaded updates)
3. Falls back to remote URL fetch
4. Caches downloaded bundles locally

#### HotUpdateManager
- Polls `manifest.json` every 30 seconds
- Downloads new versions when detected
- Posts `moduleUpdated` notification
- Stores bundles in app cache directory

#### MiniAppViewController
- Presents each mini-app in full screen
- Creates `LynxView` with `SuperAppLynxProvider`
- Loads bundle from remote URL

## Mini-App Development

### Lynx-Specific Conventions

#### JSX Elements
Use Lynx-specific elements (not HTML):
```tsx
<view>           <!-- Container (like div) -->
<text>           <!-- Text content -->
<image>          <!-- Images -->
<input>          <!-- Text input -->
<scroll-view>    <!-- Scrollable container -->
<page>           <!-- Root page container -->
```

#### Event Handling
```tsx
<view bindtap={() => handleClick()}>       <!-- Click/tap -->
<input bindinput={(e) => handleInput(e)}>  <!-- Text input -->
```

#### Styling
- Uses CSS with className (similar to React)
- Flexbox-based layout
- Styles in separate `.css` files or inline `style` prop

### Module Structure
Each mini-app follows this pattern:
```typescript
// src/App.tsx
import { useState, useCallback, useEffect } from '@lynx-js/react'

export function App(props: { onRender?: () => void }) {
  useEffect(() => {
    props.onRender?.()
  }, [])
  
  // Component logic...
  
  return (
    <view className='Container'>
      {/* JSX with Lynx elements */}
    </view>
  )
}
```

### Build Configuration
Each module's `lynx.config.ts`:
```typescript
import { defineConfig } from "@lynx-js/rspeedy";
import { pluginQRCode } from "@lynx-js/qrcode-rsbuild-plugin";
import { pluginReactLynx } from "@lynx-js/react-rsbuild-plugin";

export default defineConfig({
  plugins: [
    pluginQRCode({ schema: (url) => `${url}?fullscreen=true` }),
    pluginReactLynx(),
  ],
  output: {
    filename: "<module-name>.[platform].bundle",
  },
});
```

## Testing

### Unit Tests
Uses Vitest with Lynx testing library:
```typescript
import { test, expect } from 'vitest'
import { render } from '@lynx-js/react/testing-library'
import { App } from '../App.jsx'

test('App renders', () => {
  render(<App />)
  expect(elementTree.root).toMatchInlineSnapshot(...)
})
```

Run tests: `bun run test`

### Manual Testing
1. Build modules: `./scripts/build-all.sh`
2. Start server: `cd server && ./server.sh`
3. Run iOS app in Simulator
4. Tap mini-app cards to load bundles

## Hot Update Flow

1. Developer makes changes to module source
2. Run `./scripts/build-all.sh` to rebuild
3. New bundle copied to `server/`
4. `manifest.json` updated with new timestamp and hash
5. iOS app polls manifest every 30s
6. New version detected → Downloaded to cache
7. Next app launch uses cached version

## Environment URLs

| Platform | Base URL |
|----------|----------|
| iOS Simulator | `http://localhost:8080/` |
| Android Emulator | `http://10.0.2.2:8080/` |
| Physical Device | `http://<computer-ip>:8080/` |

## Code Style Guidelines

### TypeScript
- Strict mode enabled
- Interface definitions for data structures
- Functional components with hooks

### iOS (Swift)
- Uses Swift 5+
- MARK comments for section organization
- Weak self in closures to prevent retain cycles
- Codable for JSON parsing

### CSS/Styling
- BEM-like naming: `.ComponentName-element`
- Flexbox for layouts
- Consistent spacing units

## Adding a New Mini-App

1. Create new directory under `modules/`
2. Copy structure from existing module (e.g., `shop/`)
3. Update `package.json` name field
4. Update `lynx.config.ts` output filename
5. Implement `src/App.tsx` with your UI
6. Add to build script and manifest generation
7. Register in iOS `SceneDelegate.swift`
8. Add card in `RootViewController.swift`

## Important Notes

- **Node.js version**: >= 18 required
- **Bundle naming**: Must match `manifest.json` module names
- **Cache directory**: `~/Library/Caches/lynx_modules/` on iOS Simulator
- **Lynx Explorer**: Use for quick testing without building iOS app
- **Platform-specific bundles**: `[platform]` in filename becomes `lynx` at build time

## References

- Lynx Documentation: https://lynxjs.org/
- Lynx LLM Reference: https://lynxjs.org/next/llms.txt
- Rsbuild: https://rsbuild.rs/
- Rspack: https://rspack.rs/
