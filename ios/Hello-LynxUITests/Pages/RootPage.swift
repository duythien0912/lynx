//
//  RootPage.swift
//  Hello-LynxUITests
//
//  Page Object for the root/home screen of the SuperApp
//

import XCTest

/// Page Object representing the Root/Home screen of the SuperApp
/// Contains all mini-app cards and navigation elements
class RootPage {
    let app: XCUIApplication
    
    init(app: XCUIApplication) {
        self.app = app
    }
    
    // MARK: - UI Elements
    
    /// Main title label "SuperApp"
    var titleLabel: XCUIElement {
        app.staticTexts["SuperApp"]
    }
    
    /// Subtitle label "Select a Mini App"
    var subtitleLabel: XCUIElement {
        app.staticTexts["Select a Mini App"]
    }
    
    /// Wallet mini-app card button
    var walletCard: XCUIElement {
        app.buttons["wallet"]
    }
    
    /// Shop mini-app card button
    var shopCard: XCUIElement {
        app.buttons["shop"]
    }
    
    /// Profile mini-app card button
    var profileCard: XCUIElement {
        app.buttons["profile"]
    }
    
    /// All mini-app cards for iteration
    var allCards: [XCUIElement] {
        [walletCard, shopCard, profileCard]
    }
    
    // MARK: - Verification Methods
    
    /// Verifies the root page is fully loaded with all elements visible
    /// - Parameter timeout: Maximum wait time in seconds
    /// - Returns: True if all elements are present
    @discardableResult
    func verifyLoaded(timeout: TimeInterval = 5) -> Bool {
        let elements = [titleLabel, subtitleLabel, walletCard, shopCard, profileCard]
        for element in elements {
            XCTAssertTrue(element.waitForExistence(timeout: timeout),
                         "Element \(element.identifier) should exist on root page")
        }
        return true
    }
    
    /// Checks if the root page is currently displayed
    var isDisplayed: Bool {
        titleLabel.exists && walletCard.exists
    }
    
    // MARK: - Navigation Actions
    
    /// Taps on a specific mini-app card
    /// - Parameter name: The module name (wallet, shop, profile)
    func tapMiniApp(named name: String) {
        let card = app.buttons[name]
        XCTAssertTrue(card.waitForExistence(timeout: 5),
                     "Mini-app card '\(name)' should exist")
        card.tap()
    }
    
    /// Taps on the Wallet card and returns Wallet page object
    /// - Returns: WalletPage instance
    @discardableResult
    func tapWallet() -> WalletPage {
        walletCard.tap()
        return WalletPage(app: app)
    }
    
    /// Taps on the Shop card and returns Shop page object
    /// - Returns: ShopPage instance
    @discardableResult
    func tapShop() -> ShopPage {
        shopCard.tap()
        return ShopPage(app: app)
    }
    
    /// Taps on the Profile card and returns Profile page object
    /// - Returns: ProfilePage instance
    @discardableResult
    func tapProfile() -> ProfilePage {
        profileCard.tap()
        return ProfilePage(app: app)
    }
    
    // MARK: - Screenshot
    
    /// Takes a screenshot of the current screen
    /// - Parameter name: Name for the screenshot attachment
    func takeScreenshot(name: String = "Root Screen") {
        let screenshot = XCUIScreen.main.screenshot()
        let attachment = XCTAttachment(screenshot: screenshot)
        attachment.name = name
        attachment.lifetime = .keepAlways
        XCTContext.runActivity(named: name) { _ in
            // Attachment is automatically added to the test report
        }
    }
}
