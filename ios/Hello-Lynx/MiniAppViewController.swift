//
//  MiniAppViewController.swift
//  Hello-Lynx
//
//  iOS 26 style - Glass morphism, floating buttons
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
        
        // iOS 26 style - Glass morphism navigation bar
        let appearance = UINavigationBarAppearance()
        appearance.configureWithTransparentBackground()
        
        // Glass effect background
        appearance.backgroundEffect = UIBlurEffect(style: .systemMaterial)
        appearance.backgroundColor = UIColor.systemBackground.withAlphaComponent(0.7)
        
        // Remove shadow line
        appearance.shadowColor = .clear
        
        // Large title style
        appearance.titleTextAttributes = [
            .font: UIFont.systemFont(ofSize: 20, weight: .semibold),
            .foregroundColor: UIColor.label
        ]
        
        // Large title for scroll edge
        appearance.largeTitleTextAttributes = [
            .font: UIFont.systemFont(ofSize: 34, weight: .bold),
            .foregroundColor: UIColor.label
        ]
        
        navigationController?.navigationBar.standardAppearance = appearance
        navigationController?.navigationBar.scrollEdgeAppearance = appearance
        navigationController?.navigationBar.compactAppearance = appearance
        
        // Enable large titles
        navigationController?.navigationBar.prefersLargeTitles = false
        
        // Show navigation bar
        navigationController?.setNavigationBarHidden(false, animated: animated)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        navigationController?.setNavigationBarHidden(true, animated: animated)
    }
    
    // MARK: - UI Setup
    private func setupUI() {
        view.backgroundColor = AppColors.backgroundPrimary
        
        // Title
        title = displayTitle(for: moduleName)
        
        // Mini style - Small floating back button (28x28)
        let backConfig = UIImage.SymbolConfiguration(pointSize: 11, weight: .medium)
        let backImage = UIImage(systemName: "chevron.left", withConfiguration: backConfig)
        
        let backButton = UIButton(type: .system)
        backButton.setImage(backImage, for: .normal)
        backButton.tintColor = .label
        backButton.backgroundColor = UIColor.white.withAlphaComponent(0.7)
        backButton.layer.cornerRadius = 14
        backButton.layer.cornerCurve = .continuous
        backButton.frame = CGRect(x: 0, y: 0, width: 28, height: 28)
        backButton.addTarget(self, action: #selector(backTapped), for: .touchUpInside)
        
        let backBarButton = UIBarButtonItem(customView: backButton)
        navigationItem.leftBarButtonItem = backBarButton

        // Mini style - Small reload button (28x28)
        let reloadConfig = UIImage.SymbolConfiguration(pointSize: 11, weight: .medium)
        let reloadImage = UIImage(systemName: "arrow.clockwise", withConfiguration: reloadConfig)
        
        let reloadButton = UIButton(type: .system)
        reloadButton.setImage(reloadImage, for: .normal)
        reloadButton.tintColor = .label
        reloadButton.backgroundColor = UIColor.white.withAlphaComponent(0.7)
        reloadButton.layer.cornerRadius = 14
        reloadButton.layer.cornerCurve = .continuous
        reloadButton.frame = CGRect(x: 0, y: 0, width: 28, height: 28)
        reloadButton.addTarget(self, action: #selector(reloadTapped), for: .touchUpInside)
        
        let reloadBarButton = UIBarButtonItem(customView: reloadButton)
        navigationItem.rightBarButtonItem = reloadBarButton
        navigationItem.rightBarButtonItem = reloadBarButton
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
        navigationController?.popViewController(animated: true)
    }
    
    @objc private func reloadTapped() {
        Haptic.medium()
        
        // Rotate animation
        if let button = navigationItem.rightBarButtonItem?.customView as? UIButton {
            UIView.animate(withDuration: 0.5) {
                button.transform = CGAffineTransform(rotationAngle: .pi * 2)
            } completion: { _ in
                button.transform = .identity
            }
        }
        
        loadModule()
    }
}
