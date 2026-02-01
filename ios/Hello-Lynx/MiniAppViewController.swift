//
//  MiniAppViewController.swift
//  Hello-Lynx
//
//  Fixed back screen flash issue
//  Clean, simple navigation
//

import UIKit

// MARK: - Loading State View
class LoadingStateView: UIView {
    private let spinner = UIActivityIndicatorView(style: .large)
    private let label = UILabel()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupViews() {
        backgroundColor = AppColors.backgroundPrimary
        
        spinner.translatesAutoresizingMaskIntoConstraints = false
        spinner.color = AppColors.brandPrimary
        spinner.hidesWhenStopped = false
        addSubview(spinner)
        spinner.startAnimating()
        
        label.translatesAutoresizingMaskIntoConstraints = false
        label.text = "Loading..."
        label.font = AppTypography.bodyMedium
        label.textColor = AppColors.textSecondary
        label.textAlignment = .center
        addSubview(label)
        
        NSLayoutConstraint.activate([
            spinner.centerXAnchor.constraint(equalTo: centerXAnchor),
            spinner.centerYAnchor.constraint(equalTo: centerYAnchor, constant: -20),
            
            label.topAnchor.constraint(equalTo: spinner.bottomAnchor, constant: AppSpacing.lg),
            label.leadingAnchor.constraint(equalTo: leadingAnchor, constant: AppSpacing.lg),
            label.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -AppSpacing.lg)
        ])
    }
}

// MARK: - Mini App View Controller
class MiniAppViewController: UIViewController {
    
    // MARK: - Properties
    private let moduleName: String
    private let registry: ModuleRegistry
    private var lynxView: LynxView?
    private var loadingView: LoadingStateView?
    
    // MARK: - Initialization
    init(moduleName: String, registry: ModuleRegistry) {
        self.moduleName = moduleName
        self.registry = registry
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        loadModule()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(false, animated: animated)
        
        // Style navigation bar
        let appearance = UINavigationBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = AppColors.cardWhite
        appearance.shadowColor = nil
        
        navigationController?.navigationBar.standardAppearance = appearance
        navigationController?.navigationBar.scrollEdgeAppearance = appearance
        navigationController?.navigationBar.compactAppearance = appearance
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        navigationController?.setNavigationBarHidden(true, animated: animated)
    }
    
    // MARK: - UI Setup
    private func setupUI() {
        view.backgroundColor = AppColors.backgroundPrimary
        
        // Configure navigation bar
        title = displayTitle(for: moduleName)
        
        // Back button
        navigationItem.leftBarButtonItem = UIBarButtonItem(
            image: UIImage(systemName: "chevron.left"),
            style: .plain,
            target: self,
            action: #selector(backTapped)
        )
        navigationItem.leftBarButtonItem?.tintColor = AppColors.brandPrimary
        
        // Reload button
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            image: UIImage(systemName: "arrow.clockwise"),
            style: .plain,
            target: self,
            action: #selector(reloadTapped)
        )
        navigationItem.rightBarButtonItem?.tintColor = AppColors.brandPrimary
    }
    
    private func displayTitle(for module: String) -> String {
        return module
            .replacingOccurrences(of: "-", with: " ")
            .replacingOccurrences(of: "crypto", with: "Crypto")
            .replacingOccurrences(of: "ai", with: "AI")
            .capitalized
    }
    
    // MARK: - Module Loading
    private func loadModule() {
        // Remove existing
        lynxView?.removeFromSuperview()
        lynxView = nil
        
        // Show loading
        showLoading()
        
        // Create LynxView
        let lynxView = LynxView { [weak self] builder in
            builder.config = LynxConfig(provider: SuperAppLynxProvider())
            builder.screenSize = self?.view.bounds.size ?? UIScreen.main.bounds.size
            builder.fontScale = 1.0
        }
        
        lynxView.translatesAutoresizingMaskIntoConstraints = false
        lynxView.alpha = 0
        view.addSubview(lynxView)
        
        self.lynxView = lynxView
        
        NSLayoutConstraint.activate([
            lynxView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            lynxView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            lynxView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            lynxView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
        
        lynxView.preferredLayoutWidth = view.frame.size.width
        lynxView.preferredLayoutHeight = view.frame.size.height
        lynxView.layoutWidthMode = .exact
        lynxView.layoutHeightMode = .exact
        
        // Load
        let moduleURL = "http://localhost:8080/\(moduleName).lynx.bundle"
        lynxView.loadTemplate(fromURL: moduleURL, initData: nil)
        
        // Hide loading after delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) { [weak self] in
            self?.hideLoading()
            
            UIView.animate(withDuration: 0.3) {
                lynxView.alpha = 1
            }
        }
    }
    
    private func showLoading() {
        loadingView?.removeFromSuperview()
        
        let loading = LoadingStateView()
        loading.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(loading)
        
        NSLayoutConstraint.activate([
            loading.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            loading.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            loading.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            loading.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
        
        loadingView = loading
    }
    
    private func hideLoading() {
        UIView.animate(withDuration: 0.2, animations: {
            self.loadingView?.alpha = 0
        }) { _ in
            self.loadingView?.removeFromSuperview()
            self.loadingView = nil
        }
    }
    
    // MARK: - Actions
    @objc private func backTapped() {
        Haptic.light()
        
        // Simple pop - no custom animation that causes flash
        navigationController?.popViewController(animated: true)
    }
    
    @objc private func reloadTapped() {
        Haptic.medium()
        loadModule()
    }
}
