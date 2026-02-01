import Foundation

class HotUpdateManager {
    private var checkInterval: TimeInterval = 30.0
    private var timer: Timer?
    private var currentManifest: HotUpdateManifest?
    // Server URL - change based on your setup:
    // iOS Simulator: http://localhost:8080
    // Android Emulator: http://10.0.2.2:8080
    // Physical Device: http://<your-computer-ip>:8080
    private let baseURL = "http://localhost:8080"
    private let fileManager = FileManager.default
    private lazy var cacheDirectory: URL = {
        let urls = fileManager.urls(for: .cachesDirectory, in: .userDomainMask)
        return urls[0].appendingPathComponent("lynx_modules")
    }()
    
    func startChecking(registry: ModuleRegistry) {
        try? fileManager.createDirectory(at: cacheDirectory, withIntermediateDirectories: true)
        
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: checkInterval, repeats: true) { [weak self] _ in
            self?.checkForUpdates(registry: registry)
        }
        
        checkForUpdates(registry: registry)
    }
    
    func stopChecking() {
        timer?.invalidate()
        timer = nil
    }
    
    private func checkForUpdates(registry: ModuleRegistry) {
        let manifestURL = URL(string: "\(baseURL)/manifest.json")!
        
        URLSession.shared.dataTask(with: manifestURL) { [weak self] data, response, error in
            guard let self = self, let data = data else { return }
            
            do {
                let manifest = try JSONDecoder().decode(HotUpdateManifest.self, from: data)
                
                if let current = self.currentManifest {
                    for module in manifest.modules {
                        let currentModule = current.modules.first { $0.name == module.name }
                        if currentModule?.version != module.version {
                            self.downloadUpdate(for: module, registry: registry)
                        }
                    }
                }
                
                self.currentManifest = manifest
            } catch {
                print("Hot update check failed: \(error)")
            }
        }.resume()
    }
    
    private func downloadUpdate(for module: HotUpdateManifest.Module, registry: ModuleRegistry) {
        guard let url = URL(string: module.url) else { return }
        
        URLSession.shared.dataTask(with: url) { [weak self] data, response, error in
            guard let self = self, let data = data else { return }
            
            let modulePath = self.cacheDirectory.appendingPathComponent("\(module.name).\(module.version).bundle")
            
            do {
                try data.write(to: modulePath)
                
                DispatchQueue.main.async {
                    NotificationCenter.default.post(
                        name: .moduleUpdated,
                        object: nil,
                        userInfo: ["moduleName": module.name, "version": module.version]
                    )
                }
                
                print("Module \(module.name) updated to \(module.version)")
            } catch {
                print("Failed to save module \(module.name): \(error)")
            }
        }.resume()
    }
    
    func getCachedModulePath(name: String) -> URL? {
        guard let manifest = currentManifest,
              let module = manifest.modules.first(where: { $0.name == name }) else {
            return nil
        }
        
        let path = cacheDirectory.appendingPathComponent("\(name).\(module.version).bundle")
        return fileManager.fileExists(atPath: path.path) ? path : nil
    }
}

// MARK: - HotUpdateManifest
struct HotUpdateManifest: Codable {
    struct Module: Codable {
        let name: String
        let version: String
        let url: String
        let hash: String
    }
    
    let version: String
    let timestamp: TimeInterval
    let modules: [Module]
}

extension Notification.Name {
    static let moduleUpdated = Notification.Name("moduleUpdated")
}
