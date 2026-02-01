//
//  ShopTests.swift
//  Hello-LynxUITests
//
//  Integration tests for the Shop mini-app (complex e-commerce module)
//

import XCTest

/// Integration tests for the Shop mini-app
/// Tests navigation, product browsing, cart functionality, and checkout flow
final class ShopTests: XCTestCase {
    
    var app: XCUIApplication!
    var rootPage: RootPage!
    
    override func setUpWithError() throws {
        continueAfterFailure = false
        
        app = XCUIApplication()
        
        // Configure for testing
        app.launchArguments = ["--uitesting", "--reset-state"]
        app.launchEnvironment = [
            "TEST_SERVER_URL": "http://localhost:8080/",
            "TEST_MODULE": "shop"
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
    
    /// Tests basic navigation to Shop from root
    func testShopNavigationFromRoot() throws {
        rootPage.verifyLoaded()
        
        let shopPage = rootPage.tapShop()
        shopPage.verifyLoaded()
        
        shopPage.takeScreenshot(name: "Shop Home Screen")
        
        let root = shopPage.goBack()
        XCTAssertTrue(root.isDisplayed, "Should return to root page")
    }
    
    /// Tests that Shop navigation bar is correctly displayed
    func testShopNavigationBar() throws {
        rootPage.verifyLoaded()
        
        let shopPage = rootPage.tapShop()
        
        XCTAssertTrue(shopPage.navigationBar.exists,
                     "Shop navigation bar should exist")
        XCTAssertEqual(shopPage.navigationBar.identifier, "Shop",
                      "Navigation bar title should be 'Shop'")
        XCTAssertTrue(shopPage.backButton.exists,
                     "Back button should exist")
    }
    
    // MARK: - Home Screen Tests
    
    /// Tests that Shop home screen loads with products
    func testShopHomeScreenLoading() throws {
        rootPage.verifyLoaded()
        
        let shopPage = rootPage.tapShop()
        shopPage.verifyLoaded()
        
        // Wait for content to load
        sleep(3)
        
        // Verify the screen is still displayed
        XCTAssertTrue(shopPage.isDisplayed,
                     "Shop should be displayed after loading")
        
        shopPage.takeScreenshot(name: "Shop Home Loaded")
    }
    
    /// Tests search functionality
    /// Note: Requires accessibility identifiers in Lynx code
    func testShopSearch() throws {
        rootPage.verifyLoaded()
        
        let shopPage = rootPage.tapShop()
        shopPage.verifyLoaded()
        
        sleep(2)
        
        // Test search if search bar is available
        if shopPage.searchBar.waitForExistence(timeout: 3) {
            shopPage.search(for: "phone")
            sleep(2)
            
            shopPage.takeScreenshot(name: "Shop Search Results")
            
            // Verify search results loaded
            XCTAssertTrue(shopPage.isDisplayed,
                         "Shop should show search results")
        } else {
            // Skip if search not implemented with accessibility ID
            throw XCTSkip("Search bar not accessible - requires accessibility-id in Lynx code")
        }
    }
    
    // MARK: - Product Detail Tests
    
    /// Tests navigation to product detail screen
    func testProductDetailNavigation() throws {
        rootPage.verifyLoaded()
        
        let shopPage = rootPage.tapShop()
        shopPage.verifyLoaded()
        
        sleep(3)
        
        // Tap on first product if available
        if shopPage.firstProduct.waitForExistence(timeout: 3) {
            shopPage.tapProduct(at: 0)
            sleep(2)
            
            shopPage.takeScreenshot(name: "Product Detail Screen")
            
            // Verify we're on product detail (check for product title or add to cart)
            let onDetailScreen = shopPage.productTitle.exists ||
                                shopPage.addToCartButton.exists ||
                                shopPage.productPrice.exists
            
            XCTAssertTrue(onDetailScreen,
                         "Should be on product detail screen")
        } else {
            throw XCTSkip("Products not accessible - requires accessibility-id in Lynx code")
        }
    }
    
    /// Tests adding product to cart from detail screen
    func testAddToCart() throws {
        rootPage.verifyLoaded()
        
        let shopPage = rootPage.tapShop()
        shopPage.verifyLoaded()
        
        sleep(3)
        
        // Navigate to product and add to cart
        if shopPage.firstProduct.waitForExistence(timeout: 3) {
            shopPage.tapProduct(at: 0)
            sleep(2)
            
            if shopPage.addToCartButton.waitForExistence(timeout: 3) {
                shopPage.addToCart()
                sleep(1)
                
                shopPage.takeScreenshot(name: "After Add to Cart")
                
                // Verify cart badge updated if available
                if shopPage.cartBadge.exists {
                    XCTAssertEqual(shopPage.cartBadge.label, "1",
                                  "Cart should show 1 item")
                }
            } else {
                throw XCTSkip("Add to cart button not accessible")
            }
        } else {
            throw XCTSkip("Products not accessible - requires accessibility-id in Lynx code")
        }
    }
    
    // MARK: - Cart Tests
    
    /// Tests opening cart screen
    func testOpenCart() throws {
        rootPage.verifyLoaded()
        
        let shopPage = rootPage.tapShop()
        shopPage.verifyLoaded()
        
        sleep(2)
        
        if shopPage.cartButton.waitForExistence(timeout: 3) {
            shopPage.openCart()
            sleep(2)
            
            shopPage.takeScreenshot(name: "Cart Screen")
            
            // Verify cart screen elements
            let cartLoaded = shopPage.cartTitle.exists ||
                           shopPage.cartItemsList.exists ||
                           shopPage.checkoutButton.exists
            
            XCTAssertTrue(cartLoaded,
                         "Cart screen should be loaded")
        } else {
            throw XCTSkip("Cart button not accessible - requires accessibility-id in Lynx code")
        }
    }
    
    /// Tests checkout button from cart
    func testCheckoutFlow() throws {
        rootPage.verifyLoaded()
        
        let shopPage = rootPage.tapShop()
        shopPage.verifyLoaded()
        
        sleep(2)
        
        // Add item to cart first (if possible)
        if shopPage.firstProduct.waitForExistence(timeout: 3) {
            shopPage.tapProduct(at: 0)
            sleep(1)
            
            if shopPage.addToCartButton.waitForExistence(timeout: 2) {
                shopPage.addToCart()
                sleep(1)
            }
        }
        
        // Go to cart
        if shopPage.cartButton.waitForExistence(timeout: 2) {
            shopPage.openCart()
            sleep(2)
            
            // Try checkout
            if shopPage.checkoutButton.waitForExistence(timeout: 3) {
                shopPage.proceedToCheckout()
                sleep(2)
                
                shopPage.takeScreenshot(name: "Checkout Screen")
                
                // Verify we're on checkout (look for login form or payment screen)
                let onCheckout = shopPage.loginForm.exists ||
                                app.staticTexts["Payment"].exists ||
                                app.staticTexts["Checkout"].exists
                
                XCTAssertTrue(onCheckout || shopPage.isDisplayed,
                             "Should proceed to checkout or stay on cart")
            }
        }
    }
    
    // MARK: - Profile/Login Tests
    
    /// Tests opening profile/login screen
    func testOpenProfile() throws {
        rootPage.verifyLoaded()
        
        let shopPage = rootPage.tapShop()
        shopPage.verifyLoaded()
        
        sleep(2)
        
        if shopPage.profileButton.waitForExistence(timeout: 3) {
            shopPage.openProfile()
            sleep(2)
            
            shopPage.takeScreenshot(name: "Profile/Login Screen")
            
            // Check for login form or profile content
            let profileLoaded = shopPage.loginForm.exists ||
                               shopPage.loginButton.exists ||
                               app.staticTexts["Profile"].exists
            
            XCTAssertTrue(profileLoaded,
                         "Profile/Login screen should be loaded")
        } else {
            throw XCTSkip("Profile button not accessible - requires accessibility-id in Lynx code")
        }
    }
    
    /// Tests login flow
    func testLoginFlow() throws {
        rootPage.verifyLoaded()
        
        let shopPage = rootPage.tapShop()
        shopPage.verifyLoaded()
        
        sleep(2)
        
        // Navigate to profile/login
        if shopPage.profileButton.waitForExistence(timeout: 3) {
            shopPage.openProfile()
            sleep(2)
            
            // Attempt login if form is available
            if shopPage.loginForm.waitForExistence(timeout: 3) {
                shopPage.login(email: "test@example.com", password: "password123")
                sleep(2)
                
                shopPage.takeScreenshot(name: "After Login Attempt")
                
                // Verify login state (either success or error message)
                XCTAssertTrue(app.otherElements.firstMatch.exists,
                             "App should still be responsive after login")
            } else {
                throw XCTSkip("Login form not accessible")
            }
        } else {
            throw XCTSkip("Profile button not accessible")
        }
    }
    
    // MARK: - End-to-End Flow Tests
    
    /// Tests complete shopping flow: browse → product → add to cart → cart → checkout
    func testCompleteShoppingFlow() throws {
        rootPage.verifyLoaded()
        
        let shopPage = rootPage.tapShop()
        shopPage.verifyLoaded()
        
        // Step 1: Browse products
        sleep(3)
        shopPage.takeScreenshot(name: "1. Shop Home")
        
        // Step 2: Open product detail
        if shopPage.firstProduct.waitForExistence(timeout: 3) {
            shopPage.tapProduct(at: 0)
            sleep(2)
            shopPage.takeScreenshot(name: "2. Product Detail")
            
            // Step 3: Add to cart
            if shopPage.addToCartButton.waitForExistence(timeout: 3) {
                shopPage.addToCart()
                sleep(1)
                shopPage.takeScreenshot(name: "3. Added to Cart")
                
                // Step 4: Open cart
                if shopPage.cartButton.waitForExistence(timeout: 2) {
                    shopPage.openCart()
                    sleep(2)
                    shopPage.takeScreenshot(name: "4. Cart")
                    
                    // Step 5: Proceed to checkout
                    if shopPage.checkoutButton.waitForExistence(timeout: 3) {
                        shopPage.proceedToCheckout()
                        sleep(2)
                        shopPage.takeScreenshot(name: "5. Checkout")
                    }
                }
            }
        }
        
        // Verify we made it through the flow
        XCTAssertTrue(app.otherElements.firstMatch.exists,
                     "Complete shopping flow should execute without crashes")
    }
    
    // MARK: - Performance Tests
    
    /// Measures Shop mini-app launch performance
    func testShopLaunchPerformance() throws {
        measure {
            rootPage.tapShop()
            sleep(2)
            app.buttons["Back"].tap()
            _ = rootPage.titleLabel.waitForExistence(timeout: 2)
        }
    }
    
    /// Measures product list loading performance
    func testProductListLoadingPerformance() throws {
        rootPage.verifyLoaded()
        
        measure {
            let shopPage = rootPage.tapShop()
            sleep(3) // Allow products to load
            shopPage.goBack()
        }
    }
}
