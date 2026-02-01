import UIKit

class MiniAppViewController: UIViewController {
    private let moduleName: String
    private let registry: ModuleRegistry
    private var lynxView: LynxView?
    
    init(moduleName: String, registry: ModuleRegistry) {
        self.moduleName = moduleName
        self.registry = registry
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        loadModule()
    }
    
    private func setupUI() {
        view.backgroundColor = .white
        title = moduleName.capitalized
        
        // Back button
        navigationController?.navigationBar.isHidden = false
        navigationItem.leftBarButtonItem = UIBarButtonItem(
            title: "← Back",
            style: .plain,
            target: self,
            action: #selector(backTapped)
        )
    }
    
    private func loadModule() {
        // Create LynxView
        let lynxView = LynxView { builder in
            builder.config = LynxConfig(provider: SuperAppLynxProvider())
            builder.screenSize = self.view.frame.size
            builder.fontScale = 1.0
        }
        
        lynxView.preferredLayoutWidth = self.view.frame.size.width
        lynxView.preferredLayoutHeight = self.view.frame.size.height
        lynxView.layoutWidthMode = .exact
        lynxView.layoutHeightMode = .exact
        
        self.view.addSubview(lynxView)
        self.lynxView = lynxView
        
        // Load the module
        let moduleURL = "http://localhost:8080/\(moduleName).lynx.bundle"
        lynxView.loadTemplate(fromURL: moduleURL, initData: nil)
    }
    
    @objc private func backTapped() {
        navigationController?.popViewController(animated: true)
    }
}
