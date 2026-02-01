# AGENTS.md

# SuperApp Lynx - Project Guide

This is a **SuperApp project** built with the [Lynx](https://lynxjs.org/) framework - a cross-platform framework from ByteDance that uses React for the UI layer and renders native views on mobile platforms.

## Project Overview

This project demonstrates a SuperApp architecture where:

- A **native iOS container app** provides the shell and navigation
- **Mini-apps (modules)** are built as separate Lynx bundles that can be loaded dynamically
- **Hot update mechanism** allows updating mini-apps without app store releases
- Each mini-app is an independent ReactLynx application

### Mini-Apps Included

| Module | Description | Complexity |
|--------|-------------|------------|
| **Wallet** | Digital wallet with balance, payments, and transaction history | Simple - Single screen |
| **Shop** | Full e-commerce with product catalog, cart, checkout, auth | Complex - Multi-screen architecture |
| **Profile** | User profile with stats, menu, and authentication | Simple - Single screen |

## Technology Stack

### iOS Native Layer

- **Language**: Swift 5+
- **Platform**: iOS 10.0+
- **Build Tool**: Xcode, CocoaPods
- **Key Dependencies**:
  - `Lynx` 3.6.0 - Core Lynx framework
  - `LynxService` 3.6.0 - Image, Log, Http services
  - `SDWebImage` 5.15.5 - Image loading
  - `SDWebImageWebPCoder` 0.11.0 - WebP image support
  - `XElement` 3.6.0 - Extended UI elements (input, textarea, overlay)

### Mini-App Layer (Frontend)

- **Framework**: ReactLynx (React for Lynx)
- **Language**: TypeScript (strict mode)
- **Build Tool**: Rspeedy (Rspack-based)
- **Package Manager**: Bun (preferred) or npm
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
│   │   ├── DemoLynxProvider.swift      # Demo bundle provider
│   │   ├── ViewController.swift        # Legacy demo view
│   │   └── Info.plist
│   ├── Hello-LynxUITests/        # UI Integration Tests
│   │   ├── Pages/                # Page Object Models
│   │   │   ├── RootPage.swift
│   │   │   ├── WalletPage.swift
│   │   │   ├── ShopPage.swift
│   │   │   └── ProfilePage.swift
│   │   ├── Tests/                # Test suites
│   │   │   ├── WalletTests.swift
│   │   │   ├── ShopTests.swift
│   │   │   ├── ProfileTests.swift
│   │   │   ├── SuperAppEndToEndTests.swift
│   │   │   ├── Hello_LynxUITests.swift
│   │   │   └── Hello_LynxUITestsLaunchTests.swift
│   │   └── README.md
│   └── Podfile                   # CocoaPods dependencies
│
├── modules/                      # Lynx mini-apps
│   ├── wallet/                   # Wallet mini-app (simple)
│   ├── shop/                     # Shop mini-app (complex, full e-commerce)
│   │   ├── src/
│   │   │   ├── App.tsx           # Main component with navigation router
│   │   │   ├── App.css           # Component styles
│   │   │   ├── index.tsx         # Entry point
│   │   │   ├── store/            # Global state management
│   │   │   ├── screens/          # Screen components (Home, Cart, etc.)
│   │   │   ├── models/           # TypeScript interfaces
│   │   │   ├── services/         # API services
│   │   │   ├── utils/            # Storage and config utilities
│   │   │   ├── mocks/            # Mock data for offline mode
│   │   │   └── __tests__/        # Vitest tests
│   │   ├── package.json
│   │   ├── lynx.config.ts        # Rspeedy build config
│   │   ├── vitest.config.ts      # Test config
│   │   └── tsconfig.json
│   └── profile/                  # Profile mini-app (simple)
│
├── server/                       # Development bundle server
│   ├── server.sh                 # Start HTTP server (Python)
│   ├── manifest.json             # Module manifest with versions/hashes
│   ├── README.md                 # Server documentation
│   ├── wallet.lynx.bundle
│   ├── shop.lynx.bundle
│   └── profile.lynx.bundle
│
├── scripts/
│   └── build-all.sh              # Build all modules & update manifest
│
├── UI.md                         # Design system guidelines
└── .gitignore                    # Git ignore rules
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

**Note**: The build script uses `md5 -q` which is macOS-specific. For Linux, modify to use `md5sum`.

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

```bash
cd ios
pod install          # Install CocoaPods dependencies
```

Then open `ios/Hello-Lynx.xcworkspace` in Xcode and build.

## iOS App Architecture

### Key Components

#### SceneDelegate.swift

Entry point that:

- Initializes Lynx environment (`LynxEnv.sharedInstance()`)
- Sets up `ModuleRegistry` for mini-app management
- Starts `HotUpdateManager` for auto-updates
- Creates navigation stack with `RootViewController`

#### SuperAppLynxProvider

Implements `LynxTemplateProvider` for loading bundles with fallback strategy:

1. **Local app bundle** - For built-in modules (embedded in app)
2. **Cache directory** - For downloaded updates (`~/Library/Caches/lynx_modules/`)
3. **Remote URL fetch** - Downloads from development server
4. **Caches downloaded bundles** locally for offline use

#### HotUpdateManager

- Polls `manifest.json` every 30 seconds
- Downloads new versions when detected (based on version/hash change)
- Posts `moduleUpdated` notification
- Stores bundles in app cache directory

#### MiniAppViewController

- Presents each mini-app in full screen
- Creates `LynxView` with `SuperAppLynxProvider`
- Loads bundle from remote URL
- Provides back navigation

#### ModuleRegistry

- Registers mini-apps with loaders
- Manages module instances
- Handles version tracking
- Supports update listeners

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

### Complex Module Architecture (Shop)

The Shop module demonstrates a full-featured architecture:

```
shop/src/
├── App.tsx                 # Router and navigation
├── store/index.ts          # Global state (hooks-based)
├── screens/                # Screen components
│   ├── HomeScreen.tsx      # Product listing
│   ├── ProductDetailScreen.tsx
│   ├── CartScreen.tsx
│   ├── SearchScreen.tsx
│   ├── ProfileScreen.tsx
│   └── LoginScreen.tsx
├── models/                 # TypeScript interfaces
│   ├── Product.ts
│   └── User.ts
├── services/api.ts         # API clients
├── utils/
│   ├── storage.ts          # LocalStorage wrapper
│   └── config.ts           # API configuration
└── mocks/data.ts           # Mock data for offline mode
```

### Build Configuration

Each module's `lynx.config.ts`:

```typescript
import { defineConfig } from "@lynx-js/rspeedy";
import { pluginQRCode } from "@lynx-js/qrcode-rsbuild-plugin";
import { pluginReactLynx } from "@lynx-js/react-rsbuild-plugin";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";  // Shop module only

export default defineConfig({
  plugins: [
    pluginQRCode({
      schema(url) {
        return `${url}?fullscreen=true`;
      },
    }),
    pluginReactLynx(),
    pluginTypeCheck(),  // Optional: Type checking during build
  ],
  output: {
    filename: "<module-name>.[platform].bundle",
  },
});
```

## Testing

### Unit Tests (Mini-Apps)

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

### iOS Integration Tests (XCUITest)

Full UI integration tests using XCUITest framework. Tests cover:
- Navigation to all mini-apps
- UI element verification
- End-to-end user flows
- Performance metrics

**Setup:**
1. Open `ios/Hello-Lynx.xcworkspace` in Xcode
2. Add UI Testing Bundle target named `Hello-LynxUITests`
3. Add test files from `ios/Hello-LynxUITests/`

**Run Tests:**

In Xcode: `⌘+U` or Test Navigator (⌘+6)

Command line:
```bash
cd ios
xcodebuild test \
  -workspace Hello-Lynx.xcworkspace \
  -scheme Hello-Lynx \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  -only-testing:Hello-LynxUITests
```

**Test Structure:**
```
Hello-LynxUITests/
├── Pages/                    # Page Object Models
│   ├── RootPage.swift        # Root screen interactions
│   ├── WalletPage.swift      # Wallet mini-app page
│   ├── ShopPage.swift        # Shop mini-app page
│   └── ProfilePage.swift     # Profile mini-app page
└── Tests/
    ├── WalletTests.swift     # Wallet module tests
    ├── ShopTests.swift       # Shop module tests
    ├── ProfileTests.swift    # Profile module tests
    ├── SuperAppEndToEndTests.swift  # Cross-module E2E
    └── Hello_LynxUITests.swift      # General app tests
```

**Adding Accessibility Identifiers for Tests:**

Add `accessibility-id` attributes in Lynx code:
```tsx
<view className="Balance" accessibility-id="wallet-balance">
  <text>${balance}</text>
</view>
<button accessibility-id="wallet-send-btn">Send</button>
```

Then access in Swift tests:
```swift
let balanceLabel = app.staticTexts["wallet-balance"]
let sendButton = app.buttons["wallet-send-btn"]
```

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

| Platform | Base URL | Notes |
|----------|----------|-------|
| iOS Simulator | `http://localhost:8080/` | Same machine |
| Android Emulator | `http://10.0.2.2:8080/` | Emulator localhost alias |
| Physical Device | `http://<computer-ip>:8080/` | Same WiFi network |

## Code Style Guidelines

### TypeScript

- Strict mode enabled
- Interface definitions for data structures
- Functional components with hooks
- Path mapping: Use `.js` extension for imports (e.g., `import { X } from './file.js'`)

### iOS (Swift)

- Uses Swift 5+
- MARK comments for section organization
- Weak self in closures to prevent retain cycles
- Codable for JSON parsing
- **Accessibility identifiers for UI testing** (see Testing section)

### CSS/Styling

- BEM-like naming: `.ComponentName-element`
- Flexbox for layouts
- Consistent spacing units (4, 8, 16, 24)
- Border radius: 12-20px
- Soft shadows for cards

## Design System

See `UI.md` for detailed design guidelines:

- **Spacing scale**: 4, 8, 16, 24
- **Typography**: Large title, medium body, small caption
- **Border radius**: 12–20px
- **Card-based layout** with soft shadows
- **Style inspiration**: Apple App Store + Airbnb

## Adding a New Mini-App

1. Create new directory under `modules/`
2. Copy structure from existing module (e.g., `shop/` or `wallet/`)
3. Update `package.json` name field
4. Update `lynx.config.ts` output filename
5. Implement `src/App.tsx` with your UI
6. Add to build script and manifest generation
7. Register in iOS `SceneDelegate.swift`:
   ```swift
   moduleRegistry.register(name: "newapp", loader: { [weak self] in
       return self?.loadModule(named: "newapp")
   })
   ```
8. Add card in `RootViewController.swift`:
   ```swift
   createCard(icon: "🆕", title: "NewApp", module: "newapp")
   ```

## Important Notes

- **Node.js version**: >= 18 required
- **Bundle naming**: Must match `manifest.json` module names
- **Cache directory**: `~/Library/Caches/lynx_modules/` on iOS Simulator
- **Lynx Explorer**: Use for quick testing without building iOS app
- **Platform-specific bundles**: `[platform]` in filename becomes `lynx` at build time
- **Offline mode**: Shop module supports `MOCK_MODE` in `utils/config.ts`

## References

- Lynx Documentation: https://lynxjs.org/
- Lynx LLM Reference: https://lynxjs.org/next/llms.txt
- Rsbuild: https://rsbuild.rs/
- Rspack: https://rspack.rs/

---

# You are an expert in JavaScript, Rspeedy, and Lynx application development. You write maintainable, performant, and accessible code.

## Read in Advance

Read docs below in advance to help you understand the library or frameworks this project depends on.

- Lynx: [llms.txt](https://lynxjs.org/next/llms.txt), **REQUIRED**.
  While dealing with a Lynx task, an agent **MUST** read this doc because it is an entry point of all available docs about Lynx.

## Commands

- `npm run dev` - Start the dev server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally
- `npm exec rspeedy inspect` - Inspect the Rspeedy config and Rspack config of the project.

## Related Docs

- Rsbuild: <https://rsbuild.rs/llms.txt>
- Rspack: <https://rspack.rs/llms.txt>
