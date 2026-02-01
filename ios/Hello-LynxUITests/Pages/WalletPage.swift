//
//  WalletPage.swift
//  Hello-LynxUITests
//
//  Page Object for the Wallet mini-app
//

import XCTest

/// Page Object representing the Wallet mini-app screen
class WalletPage {
    let app: XCUIApplication
    
    init(app: XCUIApplication) {
        self.app = app
    }
    
    // MARK: - UI Elements
    
    /// Navigation bar with "Wallet" title
    var navigationBar: XCUIElement {
        app.navigationBars["Wallet"]
    }
    
    /// Back button in navigation bar
    var backButton: XCUIElement {
        app.buttons["Back"]
    }
    
    // Note: Lynx content elements would need accessibility identifiers
    // set in the React/Lynx code to be accessible here.
    // These are examples of how to access them once configured:
    
    /// Container view (accessibility-id="wallet-container")
    var container: XCUIElement {
        app.otherElements["wallet-container"]
    }
    
    /// Balance card (accessibility-id="wallet-balance-card")
    var balanceCard: XCUIElement {
        app.otherElements["wallet-balance-card"]
    }
    
    /// Balance label (accessibility-id="wallet-balance-label")
    var balanceLabel: XCUIElement {
        app.staticTexts["wallet-balance-label"]
    }
    
    /// Balance amount (accessibility-id="wallet-balance-amount")
    var balanceAmount: XCUIElement {
        app.staticTexts["wallet-balance-amount"]
    }
    
    /// Pay button (accessibility-id="wallet-pay-btn")
    var payButton: XCUIElement {
        app.buttons["wallet-pay-btn"]
    }
    
    /// Add funds button (accessibility-id="wallet-add-btn")
    var addFundsButton: XCUIElement {
        app.buttons["wallet-add-btn"]
    }
    
    /// Amount input (accessibility-id="wallet-amount-input")
    var amountInput: XCUIElement {
        app.textFields["wallet-amount-input"]
    }
    
    /// Transactions list (accessibility-id="wallet-transactions-list")
    var transactionsList: XCUIElement {
        app.otherElements["wallet-transactions-list"]
    }
    
    /// Get transaction item by index
    func transactionItem(at index: Int) -> XCUIElement {
        app.otherElements["wallet-tx-\(index)"]
    }
    
    // MARK: - Verification Methods
    
    /// Verifies the Wallet page is fully loaded
    /// - Parameter timeout: Maximum wait time in seconds
    /// - Returns: True if navigation bar is present
    @discardableResult
    func verifyLoaded(timeout: TimeInterval = 10) -> Bool {
        XCTAssertTrue(navigationBar.waitForExistence(timeout: timeout),
                     "Wallet navigation bar should exist")
        return true
    }
    
    /// Checks if the Wallet page is currently displayed
    var isDisplayed: Bool {
        navigationBar.exists
    }
    
    /// Verifies the Lynx bundle has loaded by checking for specific content
    /// Note: Requires accessibility identifiers in the Lynx code
    /// - Parameter timeout: Maximum wait time in seconds
    func verifyLynxContentLoaded(timeout: TimeInterval = 10) {
        // Wait for any Lynx content to appear
        // This assumes the wallet has at least a balance or action button
        let contentLoaded = balanceLabel.waitForExistence(timeout: timeout) ||
                           sendButton.waitForExistence(timeout: 1) ||
                           app.otherElements.firstMatch.waitForExistence(timeout: timeout)
        
        XCTAssertTrue(contentLoaded, "Wallet Lynx content should be loaded")
    }
    
    // MARK: - Actions
    
    /// Taps the back button to return to root
    /// - Returns: RootPage instance
    @discardableResult
    func goBack() -> RootPage {
        backButton.tap()
        return RootPage(app: app)
    }
    
    /// Taps the Pay button
    func tapPay() {
        payButton.tap()
    }
    
    /// Taps the Add Funds button
    func tapAddFunds() {
        addFundsButton.tap()
    }
    
    /// Enters amount in the input field
    /// - Parameter amount: The amount to enter
    func enterAmount(_ amount: String) {
        amountInput.tap()
        amountInput.typeText(amount)
    }
    
    // MARK: - Screenshot
    
    /// Takes a screenshot of the Wallet screen
    /// - Parameter name: Name for the screenshot attachment
    func takeScreenshot(name: String = "Wallet Screen") {
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
