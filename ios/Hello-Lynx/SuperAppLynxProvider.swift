import Foundation

class SuperAppLynxProvider: NSObject, LynxTemplateProvider {
    private let cacheDirectory: URL
    private let fileManager = FileManager.default
    
    override init() {
        let urls = fileManager.urls(for: .cachesDirectory, in: .userDomainMask)
        cacheDirectory = urls[0].appendingPathComponent("lynx_modules")
        super.init()
    }
    
    func loadTemplate(withUrl url: String!, onComplete callback: LynxTemplateLoadBlock!) {
        let moduleName = url.replacingOccurrences(of: ".lynx.bundle", with: "")
        
        // 1. Try local file in bundle (for built-in modules)
        if let bundlePath = Bundle.main.path(forResource: moduleName, ofType: "bundle"),
           let data = try? Data(contentsOf: URL(fileURLWithPath: bundlePath)) {
            print("Loaded \(moduleName) from bundle")
            callback(data, nil)
            return
        }
        
        // 2. Try cache directory (for hot-updated modules)
        let cachedPath = cacheDirectory.appendingPathComponent("\(moduleName).bundle")
        if fileManager.fileExists(atPath: cachedPath.path),
           let data = try? Data(contentsOf: cachedPath) {
            print("Loaded \(moduleName) from cache")
            callback(data, nil)
            return
        }
        
        // 3. Fetch from remote server (works for iOS Simulator, Android Emulator, and physical devices)
        // iOS Simulator: http://localhost:8080/
        // Android Emulator: http://10.0.2.2:8080/
        // Physical Device: http://<computer-ip>:8080/
        guard let remoteURL = URL(string: url) else {
            let error = NSError(domain: "com.superapp", code: 400, userInfo: [NSLocalizedDescriptionKey: "Invalid URL"])
            callback(nil, error)
            return
        }
        
        print("Fetching \(moduleName) from: \(remoteURL)")
        
        URLSession.shared.dataTask(with: remoteURL) { [weak self] data, response, error in
            if let error = error {
                print("Failed to fetch \(moduleName): \(error)")
                callback(nil, error)
                return
            }
            
            guard let data = data else {
                let error = NSError(domain: "com.superapp", code: 404, userInfo: [NSLocalizedDescriptionKey: "No data"])
                callback(nil, error)
                return
            }
            
            // Cache the downloaded module
            try? self?.fileManager.createDirectory(at: self?.cacheDirectory ?? URL(fileURLWithPath: ""), withIntermediateDirectories: true)
            try? data.write(to: cachedPath)
            
            print("Fetched and cached \(moduleName)")
            callback(data, nil)
        }.resume()
    }
}
