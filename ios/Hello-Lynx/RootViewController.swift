import UIKit

class RootViewController: UIViewController {
    private let registry: ModuleRegistry
    private var stackView: UIStackView!
    
    init(registry: ModuleRegistry) {
        self.registry = registry
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    private func setupUI() {
        view.backgroundColor = UIColor(red: 0.96, green: 0.96, blue: 0.96, alpha: 1.0)
        
        // Title
        let titleLabel = UILabel()
        titleLabel.text = "SuperApp"
        titleLabel.font = .boldSystemFont(ofSize: 32)
        titleLabel.textColor = .darkText
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(titleLabel)
        
        let subtitleLabel = UILabel()
        subtitleLabel.text = "Select a Mini App"
        subtitleLabel.font = .systemFont(ofSize: 16)
        subtitleLabel.textColor = .gray
        subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(subtitleLabel)
        
        // Cards container
        stackView = UIStackView()
        stackView.axis = .horizontal
        stackView.distribution = .fillEqually
        stackView.spacing = 16
        stackView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(stackView)
        
        // Create mini app cards
        createCard(icon: "💳", title: "Wallet", module: "wallet")
        createCard(icon: "🛍️", title: "Shop", module: "shop")
        createCard(icon: "👤", title: "Profile", module: "profile")
        
        // Layout
        NSLayoutConstraint.activate([
            titleLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 60),
            titleLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            
            subtitleLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 8),
            subtitleLabel.leadingAnchor.constraint(equalTo: titleLabel.leadingAnchor),
            
            stackView.topAnchor.constraint(equalTo: subtitleLabel.bottomAnchor, constant: 40),
            stackView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            stackView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            stackView.heightAnchor.constraint(equalToConstant: 120)
        ])
    }
    
    private func createCard(icon: String, title: String, module: String) {
        let card = UIButton(type: .system)
        card.backgroundColor = .white
        card.layer.cornerRadius = 16
        card.layer.shadowColor = UIColor.black.cgColor
        card.layer.shadowOffset = CGSize(width: 0, height: 2)
        card.layer.shadowOpacity = 0.1
        card.layer.shadowRadius = 8
        card.tag = module.hashValue
        card.addTarget(self, action: #selector(cardTapped(_:)), for: .touchUpInside)
        
        let iconLabel = UILabel()
        iconLabel.text = icon
        iconLabel.font = .systemFont(ofSize: 40)
        iconLabel.textAlignment = .center
        iconLabel.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(iconLabel)
        
        let titleLabel = UILabel()
        titleLabel.text = title
        titleLabel.font = .systemFont(ofSize: 14, weight: .semibold)
        titleLabel.textColor = .darkText
        titleLabel.textAlignment = .center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(titleLabel)
        
        NSLayoutConstraint.activate([
            iconLabel.centerXAnchor.constraint(equalTo: card.centerXAnchor),
            iconLabel.centerYAnchor.constraint(equalTo: card.centerYAnchor, constant: -10),
            
            titleLabel.centerXAnchor.constraint(equalTo: card.centerXAnchor),
            titleLabel.topAnchor.constraint(equalTo: iconLabel.bottomAnchor, constant: 8)
        ])
        
        // Store module name
        card.accessibilityIdentifier = module
        stackView.addArrangedSubview(card)
    }
    
    @objc private func cardTapped(_ sender: UIButton) {
        guard let moduleName = sender.accessibilityIdentifier else { return }
        
        let miniAppVC = MiniAppViewController(moduleName: moduleName, registry: registry)
        navigationController?.pushViewController(miniAppVC, animated: true)
    }
}
