//
//  WalletTests.swift
//  Hello-LynxUITests
//
//  Integration tests for the Wallet mini-app
//

import XCTest

/// Integration tests for the Wallet mini-app
/// Tests navigation, UI elements, and basic interactions
final class WalletTests: XCTestCase {
    
    var app: XCUIApplication!
    var rootPage: RootPage!
    
    override func setUpWithError() throws {
        continueAfterFailure = false
        
        app = XCUIApplication()
        
        // Configure for testing
        app.launchArguments = ["--uitesting", "--reset-state"]
        app.launchEnvironment = [
            "TEST_SERVER_URL": "http://localhost:8080/",
            "TEST_MODULE": "wallet"
        ]
        
        app.launch()
        rootPage = RootPage(app: app)
    }
    
    override func tearDownWithError() throws {
        // Take screenshot on failure
        if let failureCount = testRun?.failureCount, failureCount > 0 {
            let screenshot = XCUIScreen.main.screenshot()
            let attachment = XCTAttachment(screenshot: screenshot)
            attachment.name = "Failure Screenshot"
            attachment.lifetime = .keepAlways
            add(attachment)
        }
        
        app.terminate()
        app = nil
    }
    
    // MARK: - Navigation Tests
    
    /// Tests that the Wallet mini-app can be opened from the root screen
    func testWalletNavigationFromRoot() throws {
        // Verify root page is loaded
        rootPage.verifyLoaded()
        
        // Tap on Wallet card
        let walletPage = rootPage.tapWallet()
        
        // Verify Wallet page is loaded
        walletPage.verifyLoaded()
        
        // Take screenshot for verification
        walletPage.takeScreenshot(name: "Wallet Loaded")
        
        // Navigate back
        let root = walletPage.goBack()
        
        // Verify we're back on root
        XCTAssertTrue(root.isDisplayed, "Should return to root page")
    }
    
    /// Tests that the Wallet navigation bar is correctly displayed
    func testWalletNavigationBar() throws {
        rootPage.verifyLoaded()
        
        let walletPage = rootPage.tapWallet()
        
        // Verify navigation bar title
        XCTAssertTrue(walletPage.navigationBar.exists,
                     "Wallet navigation bar should exist")
        XCTAssertEqual(walletPage.navigationBar.identifier, "Wallet",
                      "Navigation bar title should be 'Wallet'")
        
        // Verify back button exists
        XCTAssertTrue(walletPage.backButton.exists,
                     "Back button should exist")
    }
    
    // MARK: - Content Loading Tests
    
    /// Tests that the Wallet Lynx bundle loads successfully
    func testWalletContentLoading() throws {
        rootPage.verifyLoaded()
        
        let walletPage = rootPage.tapWallet()
        walletPage.verifyLoaded()
        
        // Wait for Lynx content to load
        // Note: This test will pass even without accessibility identifiers
        // but works best when the Lynx code has them configured
        sleep(3) // Give time for bundle to load
        
        // Verify the view is still displayed (no crash)
        XCTAssertTrue(walletPage.isDisplayed,
                     "Wallet should still be displayed after loading")
        
        // Take screenshot to verify visual state
        walletPage.takeScreenshot(name: "Wallet Content Loaded")
    }
    
    // MARK: - UI Element Tests
    
    /// Tests that key Wallet UI elements are accessible
    /// Note: Requires accessibility identifiers in Lynx code
    func testWalletUIElements() throws {
        rootPage.verifyLoaded()
        
        let walletPage = rootPage.tapWallet()
        walletPage.verifyLoaded()
        
        // Wait for content
        sleep(2)
        
        // Check for key elements (if accessibility IDs are set)
        // These will be reported but not fail if not found
        if walletPage.balanceLabel.exists {
            XCTAssertFalse(walletPage.balanceLabel.label.isEmpty,
                          "Balance label should have text")
        }
        
        if walletPage.sendButton.exists {
            XCTAssertTrue(walletPage.sendButton.isHittable,
                         "Send button should be tappable")
        }
        
        if walletPage.receiveButton.exists {
            XCTAssertTrue(walletPage.receiveButton.isHittable,
                         "Receive button should be tappable")
        }
    }
    
    // MARK: - Interaction Tests
    
    /// Tests tapping on Wallet action buttons
    /// Note: Requires accessibility identifiers in Lynx code
    func testWalletButtonInteractions() throws {
        rootPage.verifyLoaded()
        
        let walletPage = rootPage.tapWallet()
        walletPage.verifyLoaded()
        
        sleep(2)
        
        // Test Send button if available
        if walletPage.sendButton.waitForExistence(timeout: 3) {
            walletPage.tapSend()
            sleep(1)
            // Verify some state change or navigation occurred
            walletPage.takeScreenshot(name: "Wallet After Send Tap")
        }
        
        // Test Receive button if available
        if walletPage.receiveButton.waitForExistence(timeout: 3) {
            walletPage.tapReceive()
            sleep(1)
            walletPage.takeScreenshot(name: "Wallet After Receive Tap")
        }
    }
    
    // MARK: - Performance Tests
    
    /// Measures the time to launch and load the Wallet mini-app
    func testWalletLaunchPerformance() throws {
        measure {
            // Navigate to Wallet
            rootPage.tapWallet()
            
            // Wait for load
            sleep(2)
            
            // Go back
            app.buttons["Back"].tap()
            
            // Wait for root
            _ = rootPage.titleLabel.waitForExistence(timeout: 2)
        }
    }
    
    // MARK: - Error Handling Tests
    
    /// Tests behavior when server is unavailable
    /// This test launches with an invalid server URL
    func testWalletWithInvalidServer() throws {
        // Terminate and relaunch with bad URL
        app.terminate()
        
        app.launchEnvironment = [
            "TEST_SERVER_URL": "http://invalid-server:9999/"
        ]
        app.launch()
        
        rootPage = RootPage(app: app)
        rootPage.verifyLoaded()
        
        let walletPage = rootPage.tapWallet()
        walletPage.verifyLoaded()
        
        // Wait to see error state
        sleep(3)
        
        // App should still be running (graceful error handling)
        XCTAssertTrue(walletPage.isDisplayed,
                     "Wallet should handle server errors gracefully")
        
        walletPage.takeScreenshot(name: "Wallet Error State")
    }
    
    // MARK: - Accessibility Tests
    
    /// Tests accessibility labels and traits
    func testWalletAccessibility() throws {
        rootPage.verifyLoaded()
        
        let walletPage = rootPage.tapWallet()
        walletPage.verifyLoaded()
        
        // Verify navigation bar is accessible
        XCTAssertTrue(walletPage.navigationBar.isAccessibilityElement,
                     "Navigation bar should be accessible")
        
        // Check if VoiceOver would work
        // This is a basic check - full a11y testing requires more setup
        walletPage.takeScreenshot(name: "Wallet Accessibility Check")
    }
}
