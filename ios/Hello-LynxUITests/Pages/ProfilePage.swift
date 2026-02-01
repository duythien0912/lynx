//
//  ProfilePage.swift
//  Hello-LynxUITests
//
//  Page Object for the Profile mini-app
//

import XCTest

/// Page Object representing the Profile mini-app screen
class ProfilePage {
    let app: XCUIApplication
    
    init(app: XCUIApplication) {
        self.app = app
    }
    
    // MARK: - UI Elements
    
    /// Navigation bar with "Profile" title
    var navigationBar: XCUIElement {
        app.navigationBars["Profile"]
    }
    
    /// Back button in navigation bar
    var backButton: XCUIElement {
        app.buttons["Back"]
    }
    
    // MARK: - UI Elements - User Info
    
    /// Profile container (accessibility-id="profile-container")
    var container: XCUIElement {
        app.otherElements["profile-container"]
    }
    
    /// User avatar (accessibility-id="profile-avatar")
    var avatarImage: XCUIElement {
        app.otherElements["profile-avatar"]
    }
    
    /// User name label (accessibility-id="profile-name")
    var userNameLabel: XCUIElement {
        app.staticTexts["profile-name"]
    }
    
    /// User email label (accessibility-id="profile-email")
    var userEmailLabel: XCUIElement {
        app.staticTexts["profile-email"]
    }
    
    /// Member since label (accessibility-id="profile-member-since")
    var memberSinceLabel: XCUIElement {
        app.staticTexts["profile-member-since"]
    }
    
    // MARK: - UI Elements - Stats
    
    /// Stats row container (accessibility-id="profile-stats")
    var statsRow: XCUIElement {
        app.otherElements["profile-stats"]
    }
    
    /// Orders count stat (accessibility-id="profile-orders-count")
    var ordersCountLabel: XCUIElement {
        app.staticTexts["profile-orders-count"]
    }
    
    /// Points count stat (accessibility-id="profile-points-count")
    var pointsCountLabel: XCUIElement {
        app.staticTexts["profile-points-count"]
    }
    
    // MARK: - UI Elements - Menu Items
    
    /// Menu container (accessibility-id="profile-menu")
    var menuContainer: XCUIElement {
        app.otherElements["profile-menu"]
    }
    
    /// My orders menu item (accessibility-id="profile-orders-menu")
    var myOrdersButton: XCUIElement {
        app.otherElements["profile-orders-menu"]
    }
    
    /// Wishlist menu item (accessibility-id="profile-wishlist-menu")
    var wishlistButton: XCUIElement {
        app.otherElements["profile-wishlist-menu"]
    }
    
    /// Settings menu item (accessibility-id="profile-settings-menu")
    var settingsButton: XCUIElement {
        app.otherElements["profile-settings-menu"]
    }
    
    /// Help & Support menu item (accessibility-id="profile-help-menu")
    var helpButton: XCUIElement {
        app.otherElements["profile-help-menu"]
    }
    
    /// Logout button (accessibility-id="profile-logout-btn")
    var logoutButton: XCUIElement {
        app.buttons["profile-logout-btn"]
    }
    
    // MARK: - UI Elements - Login Prompt (when not logged in)
    
    /// Login prompt container (accessibility-id="profile-login-prompt")
    var loginPrompt: XCUIElement {
        app.otherElements["profile-login-prompt"]
    }
    
    /// Login button in prompt (accessibility-id="profile-login-btn")
    var loginButton: XCUIElement {
        app.buttons["profile-login-btn"]
    }
    
    /// Login title (accessibility-id="profile-login-title")
    var loginTitle: XCUIElement {
        app.staticTexts["profile-login-title"]
    }
    
    // MARK: - Verification Methods
    
    /// Verifies the Profile page is fully loaded
    /// - Parameter timeout: Maximum wait time in seconds
    /// - Returns: True if navigation bar is present
    @discardableResult
    func verifyLoaded(timeout: TimeInterval = 10) -> Bool {
        XCTAssertTrue(navigationBar.waitForExistence(timeout: timeout),
                     "Profile navigation bar should exist")
        return true
    }
    
    /// Checks if the Profile page is currently displayed
    var isDisplayed: Bool {
        navigationBar.exists
    }
    
    /// Verifies the Profile content is loaded (logged in state)
    /// - Parameter timeout: Maximum wait time in seconds
    func verifyLoggedInState(timeout: TimeInterval = 5) {
        let contentLoaded = userNameLabel.waitForExistence(timeout: timeout) ||
                           avatarImage.waitForExistence(timeout: timeout) ||
                           editProfileButton.waitForExistence(timeout: timeout)
        
        XCTAssertTrue(contentLoaded, "Profile should show logged in state")
    }
    
    /// Verifies the Profile shows login prompt (logged out state)
    /// - Parameter timeout: Maximum wait time in seconds
    func verifyLoggedOutState(timeout: TimeInterval = 5) {
        XCTAssertTrue(loginPrompt.waitForExistence(timeout: timeout) ||
                     loginButton.waitForExistence(timeout: timeout),
                     "Profile should show login prompt for logged out state")
    }
    
    /// Verifies user information is displayed correctly
    /// - Parameters:
    ///   - name: Expected user name
    ///   - email: Expected user email
    func verifyUserInfo(name: String, email: String) {
        XCTAssertTrue(userNameLabel.waitForExistence(timeout: 3),
                     "User name label should exist")
        XCTAssertTrue(userEmailLabel.waitForExistence(timeout: 3),
                     "User email label should exist")
        
        XCTAssertEqual(userNameLabel.label, name,
                      "User name should match")
        XCTAssertEqual(userEmailLabel.label, email,
                      "User email should match")
    }
    
    // MARK: - Navigation Actions
    
    /// Taps the back button to return to root
    /// - Returns: RootPage instance
    @discardableResult
    func goBack() -> RootPage {
        backButton.tap()
        return RootPage(app: app)
    }
    
    /// Taps Edit Profile
    func tapEditProfile() {
        editProfileButton.tap()
    }
    
    /// Taps My Orders
    func tapMyOrders() {
        myOrdersButton.tap()
    }
    
    /// Taps Addresses
    func tapAddresses() {
        addressesButton.tap()
    }
    
    /// Taps Payment Methods
    func tapPaymentMethods() {
        paymentMethodsButton.tap()
    }
    
    /// Taps Settings
    func tapSettings() {
        settingsButton.tap()
    }
    
    /// Taps Help & Support
    func tapHelp() {
        helpButton.tap()
    }
    
    /// Taps Logout
    func tapLogout() {
        logoutButton.tap()
    }
    
    /// Taps Login button (when logged out)
    func tapLogin() {
        loginButton.tap()
    }
    
    /// Taps Sign Up button (when logged out)
    func tapSignUp() {
        signUpButton.tap()
    }
    
    // MARK: - Screenshot
    
    /// Takes a screenshot of the Profile screen
    /// - Parameter name: Name for the screenshot attachment
    func takeScreenshot(name: String = "Profile Screen") {
        let screenshot = XCUIScreen.main.screenshot()
        let attachment = XCTAttachment(screenshot: screenshot)
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }
    
    private func add(_ attachment: XCTAttachment) {
        XCTContext.runActivity(named: attachment.name ?? "Screenshot") { _ in
            // Attachment is automatically added
        }
    }
}
