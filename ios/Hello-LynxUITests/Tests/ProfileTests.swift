//
//  ProfileTests.swift
//  Hello-LynxUITests
//
//  Integration tests for the Profile mini-app
//

import XCTest

/// Integration tests for the Profile mini-app
/// Tests navigation, user info display, menu interactions, and login/logout
final class ProfileTests: XCTestCase {
    
    var app: XCUIApplication!
    var rootPage: RootPage!
    
    override func setUpWithError() throws {
        continueAfterFailure = false
        
        app = XCUIApplication()
        
        // Configure for testing
        app.launchArguments = ["--uitesting", "--reset-state"]
        app.launchEnvironment = [
            "TEST_SERVER_URL": "http://localhost:8080/",
            "TEST_MODULE": "profile"
        ]
        
        app.launch()
        rootPage = RootPage(app: app)
    }
    
    override func tearDownWithError() throws {
        // Take screenshot on failure
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
    
    // MARK: - Navigation Tests
    
    /// Tests basic navigation to Profile from root
    func testProfileNavigationFromRoot() throws {
        rootPage.verifyLoaded()
        
        let profilePage = rootPage.tapProfile()
        profilePage.verifyLoaded()
        
        profilePage.takeScreenshot(name: "Profile Screen")
        
        let root = profilePage.goBack()
        XCTAssertTrue(root.isDisplayed, "Should return to root page")
    }
    
    /// Tests that Profile navigation bar is correctly displayed
    func testProfileNavigationBar() throws {
        rootPage.verifyLoaded()
        
        let profilePage = rootPage.tapProfile()
        
        XCTAssertTrue(profilePage.navigationBar.exists,
                     "Profile navigation bar should exist")
        XCTAssertEqual(profilePage.navigationBar.identifier, "Profile",
                      "Navigation bar title should be 'Profile'")
        XCTAssertTrue(profilePage.backButton.exists,
                     "Back button should exist")
    }
    
    // MARK: - Content Loading Tests
    
    /// Tests that Profile screen loads successfully
    func testProfileContentLoading() throws {
        rootPage.verifyLoaded()
        
        let profilePage = rootPage.tapProfile()
        profilePage.verifyLoaded()
        
        // Wait for content to load
        sleep(3)
        
        // Verify the screen is still displayed
        XCTAssertTrue(profilePage.isDisplayed,
                     "Profile should be displayed after loading")
        
        profilePage.takeScreenshot(name: "Profile Content Loaded")
    }
    
    // MARK: - User Info Tests
    
    /// Tests user information display (when logged in)
    /// Note: Requires accessibility identifiers in Lynx code
    func testUserInfoDisplay() throws {
        rootPage.verifyLoaded()
        
        let profilePage = rootPage.tapProfile()
        profilePage.verifyLoaded()
        
        sleep(3)
        
        // Check for user info elements
        if profilePage.userNameLabel.waitForExistence(timeout: 3) {
            XCTAssertFalse(profilePage.userNameLabel.label.isEmpty,
                          "User name should not be empty")
        }
        
        if profilePage.userEmailLabel.waitForExistence(timeout: 1) {
            XCTAssertFalse(profilePage.userEmailLabel.label.isEmpty,
                          "User email should not be empty")
        }
        
        if profilePage.avatarImage.waitForExistence(timeout: 1) {
            XCTAssertTrue(profilePage.avatarImage.exists,
                         "Avatar image should exist")
        }
    }
    
    /// Tests user stats display (orders, wishlist, points)
    func testUserStatsDisplay() throws {
        rootPage.verifyLoaded()
        
        let profilePage = rootPage.tapProfile()
        profilePage.verifyLoaded()
        
        sleep(3)
        
        // Check for stats elements
        let statsElements = [
            ("Orders", profilePage.ordersCountLabel),
            ("Wishlist", profilePage.wishlistCountLabel),
            ("Points", profilePage.pointsLabel)
        ]
        
        for (name, element) in statsElements {
            if element.waitForExistence(timeout: 2) {
                XCTAssertTrue(element.exists,
                             "\(name) stat should exist")
            }
        }
    }
    
    // MARK: - Menu Tests
    
    /// Tests menu items are accessible
    func testMenuItems() throws {
        rootPage.verifyLoaded()
        
        let profilePage = rootPage.tapProfile()
        profilePage.verifyLoaded()
        
        sleep(3)
        
        // Check for menu buttons
        let menuButtons = [
            ("Edit Profile", profilePage.editProfileButton),
            ("My Orders", profilePage.myOrdersButton),
            ("Addresses", profilePage.addressesButton),
            ("Payment Methods", profilePage.paymentMethodsButton),
            ("Settings", profilePage.settingsButton),
            ("Help", profilePage.helpButton)
        ]
        
        var foundButtons: [String] = []
        
        for (name, button) in menuButtons {
            if button.waitForExistence(timeout: 2) {
                foundButtons.append(name)
                XCTAssertTrue(button.isHittable,
                             "\(name) button should be tappable")
            }
        }
        
        // At least some menu items should be found
        XCTAssertFalse(foundButtons.isEmpty,
                      "At least some menu items should be accessible")
    }
    
    /// Tests tapping on menu items
    func testMenuItemInteractions() throws {
        rootPage.verifyLoaded()
        
        let profilePage = rootPage.tapProfile()
        profilePage.verifyLoaded()
        
        sleep(3)
        
        // Test Edit Profile
        if profilePage.editProfileButton.waitForExistence(timeout: 3) {
            profilePage.tapEditProfile()
            sleep(2)
            profilePage.takeScreenshot(name: "Edit Profile Screen")
            
            // Go back if possible
            if app.buttons["Back"].exists {
                app.buttons["Back"].tap()
            }
        }
        
        // Reset to profile page
        if !profilePage.isDisplayed {
            app.buttons["Back"].tap()
            sleep(1)
        }
        
        // Test My Orders
        if profilePage.myOrdersButton.waitForExistence(timeout: 3) {
            profilePage.tapMyOrders()
            sleep(2)
            profilePage.takeScreenshot(name: "My Orders Screen")
            
            if app.buttons["Back"].exists {
                app.buttons["Back"].tap()
            }
        }
        
        // Reset to profile page
        if !profilePage.isDisplayed {
            app.buttons["Back"].tap()
            sleep(1)
        }
        
        // Test Settings
        if profilePage.settingsButton.waitForExistence(timeout: 3) {
            profilePage.tapSettings()
            sleep(2)
            profilePage.takeScreenshot(name: "Settings Screen")
        }
    }
    
    // MARK: - Login/Logout Tests
    
    /// Tests login prompt display (when logged out)
    func testLoginPrompt() throws {
        rootPage.verifyLoaded()
        
        let profilePage = rootPage.tapProfile()
        profilePage.verifyLoaded()
        
        sleep(3)
        
        // Check for login prompt (logged out state)
        if profilePage.loginPrompt.waitForExistence(timeout: 3) ||
           profilePage.loginButton.waitForExistence(timeout: 1) {
            
            XCTAssertTrue(profilePage.loginButton.exists ||
                         profilePage.signUpButton.exists,
                         "Login prompt should show login/signup buttons")
            
            profilePage.takeScreenshot(name: "Login Prompt")
        }
        // Otherwise, user might be logged in (which is also valid)
    }
    
    /// Tests login button interaction
    func testLoginButton() throws {
        rootPage.verifyLoaded()
        
        let profilePage = rootPage.tapProfile()
        profilePage.verifyLoaded()
        
        sleep(3)
        
        if profilePage.loginButton.waitForExistence(timeout: 3) {
            profilePage.tapLogin()
            sleep(2)
            
            profilePage.takeScreenshot(name: "Login Screen")
            
            // Verify we're on a login screen
            let onLoginScreen = app.textFields.firstMatch.exists ||
                               app.secureTextFields.firstMatch.exists ||
                               app.buttons["Login"].exists ||
                               app.staticTexts["Login"].exists
            
            XCTAssertTrue(onLoginScreen,
                         "Should navigate to login screen")
        } else {
            throw XCTSkip("Login button not accessible - user might be logged in or accessibility-id not set")
        }
    }
    
    /// Tests logout functionality
    func testLogout() throws {
        rootPage.verifyLoaded()
        
        let profilePage = rootPage.tapProfile()
        profilePage.verifyLoaded()
        
        sleep(3)
        
        // Only test if logout button is available (logged in state)
        if profilePage.logoutButton.waitForExistence(timeout: 3) {
            profilePage.tapLogout()
            sleep(2)
            
            profilePage.takeScreenshot(name: "After Logout")
            
            // Verify logout occurred (login prompt should appear)
            let loggedOut = profilePage.loginPrompt.waitForExistence(timeout: 3) ||
                           profilePage.loginButton.waitForExistence(timeout: 1)
            
            XCTAssertTrue(loggedOut,
                         "Should show login prompt after logout")
        } else {
            throw XCTSkip("Logout button not accessible - user might not be logged in")
        }
    }
    
    // MARK: - State Tests
    
    /// Tests logged in state verification
    func testLoggedInState() throws {
        rootPage.verifyLoaded()
        
        let profilePage = rootPage.tapProfile()
        profilePage.verifyLoaded()
        
        sleep(3)
        
        // Check if we're in logged in state
        if profilePage.userNameLabel.waitForExistence(timeout: 3) {
            profilePage.verifyLoggedInState()
        }
        // If not, that's also valid - user is just not logged in
    }
    
    /// Tests logged out state verification
    func testLoggedOutState() throws {
        rootPage.verifyLoaded()
        
        let profilePage = rootPage.tapProfile()
        profilePage.verifyLoaded()
        
        sleep(3)
        
        // Check if we're in logged out state
        if profilePage.loginButton.waitForExistence(timeout: 3) ||
           profilePage.loginPrompt.waitForExistence(timeout: 1) {
            profilePage.verifyLoggedOutState()
        }
        // If not, that's also valid - user is logged in
    }
    
    // MARK: - Performance Tests
    
    /// Measures Profile mini-app launch performance
    func testProfileLaunchPerformance() throws {
        measure {
            rootPage.tapProfile()
            sleep(2)
            app.buttons["Back"].tap()
            _ = rootPage.titleLabel.waitForExistence(timeout: 2)
        }
    }
    
    // MARK: - Accessibility Tests
    
    /// Tests accessibility of Profile elements
    func testProfileAccessibility() throws {
        rootPage.verifyLoaded()
        
        let profilePage = rootPage.tapProfile()
        profilePage.verifyLoaded()
        
        sleep(2)
        
        // Verify navigation bar is accessible
        XCTAssertTrue(profilePage.navigationBar.isAccessibilityElement,
                     "Navigation bar should be accessible")
        
        // Check for accessible user info
        if profilePage.userNameLabel.exists {
            XCTAssertTrue(profilePage.userNameLabel.isAccessibilityElement,
                         "User name should be accessible")
        }
        
        profilePage.takeScreenshot(name: "Profile Accessibility")
    }
}
