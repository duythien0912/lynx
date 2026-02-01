# Hello-Lynx UI Tests

This directory contains XCUITest integration tests for the Hello-Lynx SuperApp.

## Structure

```
Hello-LynxUITests/
├── Pages/                          # Page Object Models
│   ├── RootPage.swift              # Root/home screen page object
│   ├── WalletPage.swift            # Wallet mini-app page object
│   ├── ShopPage.swift              # Shop mini-app page object
│   └── ProfilePage.swift           # Profile mini-app page object
├── Tests/                          # Test suites
│   ├── WalletTests.swift           # Wallet module tests
│   ├── ShopTests.swift             # Shop module tests
│   ├── ProfileTests.swift          # Profile module tests
│   ├── SuperAppEndToEndTests.swift # Cross-module E2E tests
│   ├── Hello_LynxUITests.swift     # General app tests
│   └── Hello_LynxUITestsLaunchTests.swift # Launch tests
├── Info.plist                      # Test bundle info
└── README.md                       # This file
```

## Setup Instructions

### 1. Add UI Test Target in Xcode

Since the Xcode project file needs to be modified to add the test target, follow these steps:

1. Open `ios/Hello-Lynx.xcworkspace` in Xcode
2. Select the project in the navigator
3. Click the **+** button at the bottom of the targets list
4. Select **UI Testing Bundle**
5. Configure:
   - **Product Name**: `Hello-LynxUITests`
   - **Team**: Your development team
   - **Target to be Tested**: `Hello-Lynx`
6. Click **Finish**

### 2. Add Test Files to Target

1. In the Project Navigator, right-click on `Hello-LynxUITests` folder
2. Select **Add Files to "Hello-Lynx"...**
3. Select all files from `ios/Hello-LynxUITests/` (except `Info.plist` and `README.md`)
4. Make sure **"Copy items if needed"** is unchecked
5. Ensure **"Hello-LynxUITests"** target is checked
6. Click **Add**

### 3. Build and Run Tests

**In Xcode:**
- Select the test scheme: `Hello-LynxUITests`
- Press `⌘+U` to run all tests
- Or use Test Navigator (⌘+6) to run individual tests

**From Command Line:**
```bash
cd ios
xcodebuild test \
  -workspace Hello-Lynx.xcworkspace \
  -scheme Hello-Lynx \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  -only-testing:Hello-LynxUITests
```

## Test Coverage

### WalletTests
- Navigation from root to Wallet
- Navigation bar and back button
- Content loading verification
- UI element accessibility
- Button interactions (Send, Receive)
- Launch performance
- Error handling with invalid server

### ShopTests
- Navigation from root to Shop
- Home screen loading
- Search functionality
- Product detail navigation
- Add to cart flow
- Cart screen and checkout
- Profile/login navigation
- Complete shopping flow
- Performance tests

### ProfileTests
- Navigation from root to Profile
- User info display
- User stats (orders, wishlist, points)
- Menu items and interactions
- Login prompt display
- Login/logout flows
- Logged in/out state verification
- Accessibility

### SuperAppEndToEndTests
- Visit all mini-apps in sequence
- Rapid switching between apps
- Cross-module user journeys
- Direct module navigation
- Navigation during loading
- Memory stability
- UI consistency

### Hello_LynxUITests
- App launch verification
- All mini-app cards visible
- Root screen UI elements
- Basic navigation to all modules
- Accessibility labels
- VoiceOver compatibility
- Offline behavior

### Hello_LynxUITestsLaunchTests
- App launch screenshot capture
- Launch with different configurations
- Launch performance metrics

## Page Object Pattern

The tests use the Page Object pattern for maintainability:

```swift
// Instead of direct element access:
app.buttons["wallet"].tap()
app.navigationBars["Wallet"].waitForExistence(timeout: 10)

// Use page objects:
let rootPage = RootPage(app: app)
let walletPage = rootPage.tapWallet()
walletPage.verifyLoaded()
```

Benefits:
- **Maintainability**: UI changes only require updates in page objects
- **Readability**: Tests read like user actions
- **Reusability**: Page methods can be shared across tests
- **Type Safety**: Compile-time checking of available actions

## Accessibility Identifiers

For the tests to interact with Lynx content, add accessibility identifiers in your React/Lynx code:

```tsx
// modules/wallet/src/App.tsx
<view className="Balance" accessibility-id="wallet-balance">
  <text>${balance}</text>
</view>

<button className="SendBtn" accessibility-id="wallet-send-btn">
  <text>Send</text>
</button>
```

Then access in tests:
```swift
var balanceLabel: XCUIElement {
    app.staticTexts["wallet-balance"]
}
```

## Environment Variables

Tests can use environment variables for configuration:

```swift
app.launchEnvironment = [
    "TEST_SERVER_URL": "http://localhost:8080/",
    "TEST_MODULE": "wallet"
]
```

## Screenshots

Tests automatically capture screenshots on failure. Manual screenshots:

```swift
let screenshot = XCUIScreen.main.screenshot()
let attachment = XCTAttachment(screenshot: screenshot)
attachment.name = "Custom Screenshot"
attachment.lifetime = .keepAlways
add(attachment)
```

## Best Practices

1. **Use Page Objects**: Keep test logic separate from UI structure
2. **Wait for Elements**: Always use `waitForExistence(timeout:)` instead of `sleep()`
3. **Skip Unavailable Features**: Use `throw XCTSkip()` for features not yet implemented
4. **Take Screenshots**: Capture visual state for debugging
5. **Test Independence**: Each test should be independent and self-contained
6. **Clean State**: Use `setUp()` to ensure clean app state

## Troubleshooting

### Tests fail to find elements
- Verify accessibility identifiers are set in Lynx code
- Check that the server is running (`cd server && ./server.sh`)
- Increase timeout values for slower simulators

### Lynx content not loading
- Ensure bundles are built (`./scripts/build-all.sh`)
- Verify server is accessible from simulator
- Check `TEST_SERVER_URL` environment variable

### Tests are flaky
- Add explicit waits for async operations
- Use `waitForExistence()` instead of checking `exists`
- Stabilize Lynx bundle loading before assertions
