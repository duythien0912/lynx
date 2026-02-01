//
//  ShopPage.swift
//  Hello-LynxUITests
//
//  Page Object for the Shop mini-app (complex multi-screen module)
//

import XCTest

/// Page Object representing the Shop mini-app screen
/// This is a complex module with multiple screens and navigation
class ShopPage {
    let app: XCUIApplication
    
    init(app: XCUIApplication) {
        self.app = app
    }
    
    // MARK: - UI Elements - Navigation
    
    /// Navigation bar with "Shop" title
    var navigationBar: XCUIElement {
        app.navigationBars["Shop"]
    }
    
    /// Back button in navigation bar
    var backButton: XCUIElement {
        app.buttons["Back"]
    }
    
    // MARK: - UI Elements - Home Screen
    
    /// Search bar (requires accessibility-id="shop-search" in Lynx)
    var searchBar: XCUIElement {
        app.textFields["shop-search"]
    }
    
    /// Search button
    var searchButton: XCUIElement {
        app.buttons["shop-search-btn"]
    }
    
    /// Home screen container (accessibility-id="shop-home-screen")
    var homeScreen: XCUIElement {
        app.otherElements["shop-home-screen"]
    }
    
    /// Search bar (accessibility-id="shop-search-bar")
    var searchBar: XCUIElement {
        app.otherElements["shop-search-bar"]
    }
    
    /// Search button (accessibility-id="shop-search-btn")
    var searchButton: XCUIElement {
        app.buttons["shop-search-btn"]
    }
    
    /// Product grid (accessibility-id="shop-products-grid")
    var productGrid: XCUIElement {
        app.otherElements["shop-products-grid"]
    }
    
    /// Gets a product card by index (accessibility-id="product-{index}")
    /// - Parameter index: Zero-based product index
    /// - Returns: The product card element
    func productCard(at index: Int) -> XCUIElement {
        app.otherElements["product-\(index)"]
    }
    
    /// First product card
    var firstProduct: XCUIElement {
        productCard(at: 0)
    }
    
    /// Cart button (accessibility-id="shop-cart-btn")
    var cartButton: XCUIElement {
        app.buttons["shop-cart-btn"]
    }
    
    /// Cart badge in header (accessibility-id="shop-floating-cart-count")
    var cartBadge: XCUIElement {
        app.staticTexts["shop-floating-cart-count"]
    }
    
    /// Profile/Account button (accessibility-id="shop-profile-btn")
    var profileButton: XCUIElement {
        app.buttons["shop-profile-btn"]
    }
    
    /// Floating cart button (accessibility-id="shop-floating-cart")
    var floatingCartButton: XCUIElement {
        app.buttons["shop-floating-cart"]
    }
    
    // MARK: - UI Elements - Product Detail Screen
    
    /// Product detail screen (accessibility-id="product-detail-screen")
    var productDetailScreen: XCUIElement {
        app.otherElements["product-detail-screen"]
    }
    
    /// Product title on detail screen (accessibility-id="product-title")
    var productTitle: XCUIElement {
        app.staticTexts["product-title"]
    }
    
    /// Current price on detail screen (accessibility-id="product-current-price")
    var productPrice: XCUIElement {
        app.staticTexts["product-current-price"]
    }
    
    /// Add to cart button on product detail (accessibility-id="product-add-to-cart-btn")
    var addToCartButton: XCUIElement {
        app.buttons["product-add-to-cart-btn"]
    }
    
    /// Buy now button on product detail (accessibility-id="product-buy-now-btn")
    var buyNowButton: XCUIElement {
        app.buttons["product-buy-now-btn"]
    }
    
    /// Back button on product detail (accessibility-id="product-back-btn")
    var productBackButton: XCUIElement {
        app.buttons["product-back-btn"]
    }
    
    // MARK: - UI Elements - Cart Screen
    
    /// Cart screen (accessibility-id="cart-screen")
    var cartScreen: XCUIElement {
        app.otherElements["cart-screen"]
    }
    
    /// Cart title (accessibility-id="cart-title")
    var cartTitle: XCUIElement {
        app.staticTexts["cart-title"]
    }
    
    /// Cart items section (accessibility-id="cart-items-section")
    var cartItemsSection: XCUIElement {
        app.otherElements["cart-items-section"]
    }
    
    /// Checkout button (accessibility-id="cart-checkout-btn")
    var checkoutButton: XCUIElement {
        app.buttons["cart-checkout-btn"]
    }
    
    /// Total amount in cart (accessibility-id="cart-total-amount")
    var cartTotal: XCUIElement {
        app.staticTexts["cart-total-amount"]
    }
    
    /// Get cart item by index
    func cartItem(at index: Int) -> XCUIElement {
        app.otherElements["cart-item-\(index)"]
    }
    
    // MARK: - UI Elements - Login Screen
    
    /// Login screen (accessibility-id="login-screen")
    var loginScreen: XCUIElement {
        app.otherElements["login-screen"]
    }
    
    /// Login form (accessibility-id="login-form")
    var loginForm: XCUIElement {
        app.otherElements["login-form"]
    }
    
    /// Username input field (accessibility-id="login-username-input")
    var usernameInput: XCUIElement {
        app.textFields["login-username-input"]
    }
    
    /// Password input field (accessibility-id="login-password-input")
    var passwordInput: XCUIElement {
        app.secureTextFields["login-password-input"]
    }
    
    /// Login submit button (accessibility-id="login-submit-btn")
    var loginButton: XCUIElement {
        app.buttons["login-submit-btn"]
    }
    
    // MARK: - Verification Methods
    
    /// Verifies the Shop page is fully loaded
    /// - Parameter timeout: Maximum wait time in seconds
    /// - Returns: True if navigation bar is present
    @discardableResult
    func verifyLoaded(timeout: TimeInterval = 10) -> Bool {
        XCTAssertTrue(navigationBar.waitForExistence(timeout: timeout),
                     "Shop navigation bar should exist")
        return true
    }
    
    /// Checks if the Shop page is currently displayed
    var isDisplayed: Bool {
        navigationBar.exists
    }
    
    /// Verifies the Shop home screen content is loaded
    /// - Parameter timeout: Maximum wait time in seconds
    func verifyHomeScreenLoaded(timeout: TimeInterval = 10) {
        let contentLoaded = productList.waitForExistence(timeout: timeout) ||
                           searchBar.waitForExistence(timeout: timeout) ||
                           firstProduct.waitForExistence(timeout: timeout)
        
        XCTAssertTrue(contentLoaded, "Shop home screen content should be loaded")
    }
    
    /// Verifies cart badge shows expected count
    /// - Parameter count: Expected item count
    func verifyCartBadge(count: Int) {
        XCTAssertTrue(cartBadge.waitForExistence(timeout: 3),
                     "Cart badge should exist")
        XCTAssertEqual(cartBadge.label, "\(count)",
                      "Cart badge should show \(count) items")
    }
    
    // MARK: - Navigation Actions
    
    /// Taps the back button to return to root
    /// - Returns: RootPage instance
    @discardableResult
    func goBack() -> RootPage {
        backButton.tap()
        return RootPage(app: app)
    }
    
    /// Taps on a product to open detail screen
    /// - Parameter index: Product index (default: 0)
    func tapProduct(at index: Int = 0) {
        let product = productCard(at: index)
        XCTAssertTrue(product.waitForExistence(timeout: 5),
                     "Product at index \(index) should exist")
        product.tap()
    }
    
    /// Opens the cart screen
    func openCart() {
        cartButton.tap()
    }
    
    /// Opens the profile/login screen
    func openProfile() {
        profileButton.tap()
    }
    
    /// Searches for a product
    /// - Parameter query: Search query string
    func search(for query: String) {
        searchBar.tap()
        searchBar.typeText(query)
        searchButton.tap()
    }
    
    // MARK: - Product Detail Actions
    
    /// Adds current product to cart
    func addToCart() {
        XCTAssertTrue(addToCartButton.waitForExistence(timeout: 5),
                     "Add to cart button should exist")
        addToCartButton.tap()
    }
    
    /// Taps buy now button
    func tapBuyNow() {
        buyNowButton.tap()
    }
    
    // MARK: - Cart Actions
    
    /// Proceeds to checkout
    func proceedToCheckout() {
        XCTAssertTrue(checkoutButton.waitForExistence(timeout: 5),
                     "Checkout button should exist")
        checkoutButton.tap()
    }
    
    // MARK: - Login Actions
    
    /// Performs login with credentials
    /// - Parameters:
    ///   - email: User email
    ///   - password: User password
    func login(email: String, password: String) {
        XCTAssertTrue(loginForm.waitForExistence(timeout: 5),
                     "Login form should exist")
        
        emailInput.tap()
        emailInput.typeText(email)
        
        passwordInput.tap()
        passwordInput.typeText(password)
        
        loginButton.tap()
    }
    
    // MARK: - Screenshot
    
    /// Takes a screenshot of the Shop screen
    /// - Parameter name: Name for the screenshot attachment
    func takeScreenshot(name: String = "Shop Screen") {
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
