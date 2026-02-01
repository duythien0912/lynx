import Foundation

typealias ModuleLoader = () -> LynxModule?

struct ModuleEntry {
    let name: String
    let loader: ModuleLoader
    var instance: LynxModule?
    let version: String
}

class ModuleRegistry {
    private var modules: [String: ModuleEntry] = [:]
    private var listeners: [(String, LynxModule) -> Void] = []
    
    func register(name: String, loader: @escaping ModuleLoader, version: String = "1.0.0") {
        modules[name] = ModuleEntry(name: name, loader: loader, instance: nil, version: version)
    }
    
    func load(name: String) -> LynxModule? {
        guard let entry = modules[name] else {
            print("Module \(name) not found")
            return nil
        }
        
        if let instance = entry.instance {
            return instance
        }
        
        guard let module = entry.loader() else {
            print("Failed to load module \(name)")
            return nil
        }
        
        var updatedEntry = entry
        updatedEntry.instance = module
        modules[name] = updatedEntry
        
        listeners.forEach { $0(name, module) }
        return module
    }
    
    func unload(name: String) {
        if var entry = modules[name] {
            entry.instance = nil
            modules[name] = entry
        }
    }
    
    func update(name: String, loader: @escaping ModuleLoader, version: String) {
        unload(name: name)
        register(name: name, loader: loader, version: version)
    }
    
    func getVersion(name: String) -> String? {
        return modules[name]?.version
    }
    
    func onUpdate(_ callback: @escaping (String, LynxModule) -> Void) {
        listeners.append(callback)
    }
    
    func getRegisteredModules() -> [String] {
        return Array(modules.keys)
    }
}

// MARK: - LynxModule
class LynxModule {
    let name: String
    let sourceURL: String
    var localData: Data?
    
    init(name: String, sourceURL: String) {
        self.name = name
        self.sourceURL = sourceURL
    }
}
