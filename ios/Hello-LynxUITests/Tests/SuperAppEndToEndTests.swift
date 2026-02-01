//
//  SuperAppEndToEndTests.swift
//  Hello-LynxUITests
//
//  End-to-end tests covering all mini-apps and navigation flows
//

import XCTest

/// End-to-end integration tests for the entire SuperApp
/// Tests cross-module navigation and complete user flows
final class SuperAppEndToEndTests: XCTestCase {
    
    var app: XCUIApplication!
    var rootPage: RootPage!
    
    override func setUpWithError() throws {
        continueAfterFailure = false
        
        app = XCUIApplication()
        
        // Configure for testing
        app.launchArguments = ["--uitesting"]
        app.launchEnvironment = [
            "TEST_SERVER_URL": "http://localhost:8080/"
        ]
        
        app.launch()
        rootPage = RootPage(app: app)
    }
    
    override func tearDownWithError() throws {
        if let failureCount = testRun?.failureCount, failureCount > 0 {
            let screenshot = XCUIScreen.main.screenshot()
            let attachment = XCTAttachment(screenshot: screenshot)
            attachment.name = "Failure Screenshot - \(name)"
            attachment.lifetime = .keepAlways
            add(attachment)
        }
        
        app.terminate()
        app = nil
    }
    
    // MARK: - Cross-Module Navigation Tests
    
    /// Tests visiting all mini-apps in sequence
    func testVisitAllMiniApps() throws {
        rootPage.verifyLoaded()
        
        let modules = [
            ("wallet", "Wallet"),
            ("shop", "Shop"),
            ("profile", "Profile")
        ]
        
        for (moduleId, title) in modules {
            // Tap on mini-app card
            rootPage.tapMiniApp(named: moduleId)
            
            // Verify navigation
            let navBar = app.navigationBars[title]
            XCTAssertTrue(navBar.waitForExistence(timeout: 10),
                         "\(title) navigation bar should appear")
            
            // Take screenshot
            let screenshot = XCUIScreen.main.screenshot()
            let attachment = XCTAttachment(screenshot: screenshot)
            attachment.name = "\(title) Screen"
            attachment.lifetime = .keepAlways
            add(attachment)
            
            // Go back
            app.buttons["Back"].tap()
            
            // Verify we're back on root
            XCTAssertTrue(rootPage.titleLabel.waitForExistence(timeout: 3),
                         "Should return to root after \(title)")
        }
    }
    
    /// Tests rapid switching between mini-apps
    func testRapidMiniAppSwitching() throws {
        rootPage.verifyLoaded()
        
        // Switch between apps multiple times
        for i in 0..<3 {
            // Open Wallet
            rootPage.tapWallet()
            sleep(1)
            app.buttons["Back"].tap()
            _ = rootPage.titleLabel.waitForExistence(timeout: 2)
            
            // Open Shop
            rootPage.tapShop()
            sleep(1)
            app.buttons["Back"].tap()
            _ = rootPage.titleLabel.waitForExistence(timeout: 2)
            
            // Open Profile
            rootPage.tapProfile()
            sleep(1)
            app.buttons["Back"].tap()
            _ = rootPage.titleLabel.waitForExistence(timeout: 2)
            
            print("Completed iteration \(i + 1)")
        }
        
        // Verify app is still stable
        rootPage.verifyLoaded()
    }
    
    // MARK: - Complete User Flow Tests
    
    /// Tests a complete user journey: Shop → Add to Cart → Profile → Wallet
    func testCrossModuleUserJourney() throws {
        rootPage.verifyLoaded()
        
        // Step 1: Browse Shop
        let shopPage = rootPage.tapShop()
        XCTAssertTrue(shopPage.verifyLoaded())
        sleep(3)
        
        // Try to add something to cart
        if shopPage.firstProduct.waitForExistence(timeout: 3) {
            shopPage.tapProduct(at: 0)
            sleep(1)
            
            if shopPage.addToCartButton.waitForExistence(timeout: 2) {
                shopPage.addToCart()
            }
        }
        
        // Go back to root
        shopPage.goBack()
        
        // Step 2: Check Profile (maybe view orders)
        let profilePage = rootPage.tapProfile()
        XCTAssertTrue(profilePage.verifyLoaded())
        sleep(2)
        
        if profilePage.myOrdersButton.waitForExistence(timeout: 2) {
            profilePage.tapMyOrders()
            sleep(1)
            app.buttons["Back"].tap()
        }
        
        profilePage.goBack()
        
        // Step 3: Check Wallet
        let walletPage = rootPage.tapWallet()
        XCTAssertTrue(walletPage.verifyLoaded())
        sleep(2)
        
        walletPage.takeScreenshot(name: "End of User Journey - Wallet")
        
        // Verify we completed the journey
        XCTAssertTrue(walletPage.isDisplayed,
                     "Should complete cross-module user journey")
    }
    
    // MARK: - Deep Link Simulation Tests
    
    /// Tests launching app and directly navigating to specific modules
    func testDirectModuleNavigation() throws {
        // Test each module can be opened directly
        let modules = ["wallet", "shop", "profile"]
        
        for module in modules {
            // Relaunch app for clean state
            app.terminate()
            app.launch()
            rootPage = RootPage(app: app)
            
            rootPage.verifyLoaded()
            rootPage.tapMiniApp(named: module)
            
            // Verify module loaded
            let navBar = app.navigationBars[module.capitalized]
            XCTAssertTrue(navBar.waitForExistence(timeout: 10),
                         "Should navigate directly to \(module)")
            
            sleep(2)
        }
    }
    
    // MARK: - Error Recovery Tests
    
    /// Tests app stability when navigating during loading
    func testNavigationDuringLoading() throws {
        rootPage.verifyLoaded()
        
        // Open Shop
        rootPage.tapShop()
        
        // Immediately go back (while loading)
        sleep(1)
        app.buttons["Back"].tap()
        
        // Verify we can navigate again
        XCTAssertTrue(rootPage.titleLabel.waitForExistence(timeout: 3))
        
        rootPage.tapWallet()
        XCTAssertTrue(app.navigationBars["Wallet"].waitForExistence(timeout: 10))
    }
    
    // MARK: - Memory/Performance Tests
    
    /// Tests app stability after opening many mini-apps
    func testMemoryStability() throws {
        rootPage.verifyLoaded()
        
        // Open each mini-app multiple times
        for _ in 0..<5 {
            for module in ["wallet", "shop", "profile"] {
                rootPage.tapMiniApp(named: module)
                sleep(1)
                app.buttons["Back"].tap()
                _ = rootPage.titleLabel.waitForExistence(timeout: 2)
            }
        }
        
        // Verify app is still responsive
        rootPage.verifyLoaded()
        
        // Final screenshot
        let screenshot = XCUIScreen.main.screenshot()
        let attachment = XCTAttachment(screenshot: screenshot)
        attachment.name = "Memory Test - Final State"
        attachment.lifetime = .keepAlways
        add(attachment)
    }
    
    // MARK: - UI Consistency Tests
    
    /// Tests consistent navigation patterns across all mini-apps
    func testConsistentNavigationPatterns() throws {
        rootPage.verifyLoaded()
        
        let modules = [
            ("wallet", "Wallet"),
            ("shop", "Shop"),
            ("profile", "Profile")
        ]
        
        for (moduleId, title) in modules {
            rootPage.tapMiniApp(named: moduleId)
            
            // Verify navigation bar exists
            let navBar = app.navigationBars[title]
            XCTAssertTrue(navBar.waitForExistence(timeout: 10),
                         "\(title) should have navigation bar")
            
            // Verify back button exists
            let backButton = app.buttons["Back"]
            XCTAssertTrue(backButton.exists,
                         "\(title) should have back button")
            
            // Verify title matches
            XCTAssertEqual(navBar.identifier, title,
                          "\(title) navigation bar should have correct title")
            
            // Go back
            backButton.tap()
            _ = rootPage.titleLabel.waitForExistence(timeout: 2)
        }
    }
    
    // MARK: - Launch Performance Test
    
    /// Measures overall app launch and first mini-app load time
    func testAppLaunchPerformance() throws {
        measure(metrics: [XCTApplicationLaunchMetric()]) {
            app.terminate()
            app.launch()
            rootPage = RootPage(app: app)
            _ = rootPage.titleLabel.waitForExistence(timeout: 5)
        }
    }
}
