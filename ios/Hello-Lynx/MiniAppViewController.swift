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
        // Giữ View chính màu trắng để phần nền dưới AppBar không bị đen
        view.backgroundColor = .white
        title = moduleName.capitalized
        
        // Cấu hình AppBar luôn trắng và mờ (Standard iOS Look)
        let appearance = UINavigationBarAppearance()
        appearance.configureWithDefaultBackground()
        appearance.backgroundColor = .white
        
        navigationController?.navigationBar.standardAppearance = appearance
        navigationController?.navigationBar.scrollEdgeAppearance = appearance
        navigationController?.navigationBar.compactAppearance = appearance
        
        navigationController?.navigationBar.isHidden = false
        navigationItem.leftBarButtonItem = UIBarButtonItem(
            title: "← Back",
            style: .plain,
            target: self,
            action: #selector(backTapped)
        )
    }
    
    private func loadModule() {
        // 1. Khởi tạo LynxView với kích thước an toàn ban đầu
        let lynxView = LynxView { builder in
            builder.config = LynxConfig(provider: SuperAppLynxProvider())
            builder.screenSize = self.view.bounds.size
            builder.fontScale = 1.0
        }
        
        // 2. Tắt autoresizing để dùng Auto Layout
        lynxView.translatesAutoresizingMaskIntoConstraints = false
        self.view.addSubview(lynxView)
        self.lynxView = lynxView
        
        // 3. Constraints: Gắn LynxView vào Safe Area (Dưới AppBar, Trên Home Indicator)
        NSLayoutConstraint.activate([
            lynxView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            lynxView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            lynxView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            lynxView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
        
        // 4. Thiết lập chế độ đo lường cho Lynx Engine
        lynxView.preferredLayoutWidth = self.view.frame.size.width
        lynxView.preferredLayoutHeight = self.view.frame.size.height
        lynxView.layoutWidthMode = .exact
        lynxView.layoutHeightMode = .exact
        
        // Load the module
        let moduleURL = "http://localhost:8080/\(moduleName).lynx.bundle"
        lynxView.loadTemplate(fromURL: moduleURL, initData: nil)
    }
    
    @objc private func backTapped() {
        navigationController?.popViewController(animated: true)
    }
}
