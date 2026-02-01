import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?
    var moduleRegistry: ModuleRegistry!
    var hotUpdateManager: HotUpdateManager!

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        
        // Initialize Lynx environment
        LynxEnv.sharedInstance()
        
        // Initialize module registry and hot update
        moduleRegistry = ModuleRegistry()
        hotUpdateManager = HotUpdateManager()
        
        // Register mini apps
        moduleRegistry.register(name: "wallet", loader: { [weak self] in
            return self?.loadModule(named: "wallet")
        })
        moduleRegistry.register(name: "shop", loader: { [weak self] in
            return self?.loadModule(named: "shop")
        })
        moduleRegistry.register(name: "profile", loader: { [weak self] in
            return self?.loadModule(named: "profile")
        })
        moduleRegistry.register(name: "crypto-wallet", loader: { [weak self] in
            return self?.loadModule(named: "crypto-wallet")
        })
        moduleRegistry.register(name: "ai-assistant", loader: { [weak self] in
            return self?.loadModule(named: "ai-assistant")
        })
        
        // Start hot update checking
        hotUpdateManager.startChecking(registry: moduleRegistry)
        
        // Create window with scene
        window = UIWindow(windowScene: windowScene)
        let rootVC = RootViewController()
        let navController = UINavigationController(rootViewController: rootVC)
        navController.setNavigationBarHidden(true, animated: false)
        window?.rootViewController = navController
        window?.makeKeyAndVisible()
    }
    
    private func loadModule(named: String) -> LynxModule? {
        // Server URL reference:
        // iOS Simulator: http://localhost:8080/
        // Android Emulator: http://10.0.2.2:8080/
        // Physical Device: http://<computer-ip>:8080/
        let localURL = "http://localhost:8080/\(named).lynx.bundle"
        return LynxModule(name: named, sourceURL: localURL)
    }

    func sceneDidDisconnect(_ scene: UIScene) {}
    func sceneDidBecomeActive(_ scene: UIScene) {}
    func sceneWillResignActive(_ scene: UIScene) {}
    func sceneWillEnterForeground(_ scene: UIScene) {}
    func sceneDidEnterBackground(_ scene: UIScene) {}
}
