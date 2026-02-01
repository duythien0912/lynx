//
//  RootViewController.swift
//  Hello-Lynx
//
//  ShopeeFood/Baemin style home screen
//

import UIKit

struct MiniAppConfig {
    let icon: String
    let title: String
    let module: String
    let color: UIColor
}

class RootViewController: UIViewController {
    
    private let registry = ModuleRegistry()
    
    private let apps: [MiniAppConfig] = [
        MiniAppConfig(icon: "💳", title: "Wallet", module: "wallet", color: AppColors.wallet),
        MiniAppConfig(icon: "🛍️", title: "Shop", module: "shop", color: AppColors.shop),
        MiniAppConfig(icon: "👤", title: "Profile", module: "profile", color: AppColors.profile),
        MiniAppConfig(icon: "₿", title: "Crypto", module: "crypto-wallet", color: AppColors.crypto),
        MiniAppConfig(icon: "🤖", title: "AI", module: "ai-assistant", color: AppColors.ai),
    ]
    
    // MARK: - Views
    
    private lazy var headerView: UIView = {
        let view = UIView()
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }()
    
    private lazy var gradientLayer: CAGradientLayer = {
        let layer = CAGradientLayer()
        layer.colors = [AppColors.headerTop.cgColor, AppColors.headerBottom.cgColor]
        layer.locations = [0.0, 1.0]
        layer.startPoint = CGPoint(x: 0.5, y: 0.0)
        layer.endPoint = CGPoint(x: 0.5, y: 1.0)
        return layer
    }()
    
    private lazy var titleLabel: UILabel = {
        let label = UILabel()
        label.text = "SuperApp"
        label.font = AppTypography.title
        label.textColor = AppColors.textWhite
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    private lazy var searchBar: UIView = {
        let view = UIView()
        view.backgroundColor = AppColors.cardWhite
        view.layer.cornerRadius = 24
        view.layer.shadowColor = UIColor.black.cgColor
        view.layer.shadowOffset = CGSize(width: 0, height: 2)
        view.layer.shadowRadius = 8
        view.layer.shadowOpacity = 0.1
        view.translatesAutoresizingMaskIntoConstraints = false
        
        let icon = UIImageView(image: UIImage(systemName: "magnifyingglass"))
        icon.tintColor = AppColors.textSecondary
        icon.contentMode = .scaleAspectFit
        icon.translatesAutoresizingMaskIntoConstraints = false
        
        let label = UILabel()
        label.text = "Tìm kiếm mini-app..."
        label.font = AppTypography.body
        label.textColor = AppColors.textSecondary
        label.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(icon)
        view.addSubview(label)
        
        NSLayoutConstraint.activate([
            icon.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            icon.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            icon.widthAnchor.constraint(equalToConstant: 20),
            icon.heightAnchor.constraint(equalToConstant: 20),
            
            label.leadingAnchor.constraint(equalTo: icon.trailingAnchor, constant: 8),
            label.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            label.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
        ])
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(searchTapped))
        view.addGestureRecognizer(tap)
        
        return view
    }()
    
    private lazy var bannerView: UIView = {
        let view = UIView()
        view.backgroundColor = AppColors.dealRed
        view.layer.cornerRadius = 16
        view.translatesAutoresizingMaskIntoConstraints = false
        
        let label = UILabel()
        label.text = "🔥 Khuyến mãi hot"
        label.font = AppTypography.headline
        label.textColor = AppColors.textWhite
        label.translatesAutoresizingMaskIntoConstraints = false
        
        let sublabel = UILabel()
        sublabel.text = "Giảm đến 50% cho đơn đầu tiên"
        sublabel.font = AppTypography.caption
        sublabel.textColor = AppColors.textWhite.withAlphaComponent(0.9)
        sublabel.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(label)
        view.addSubview(sublabel)
        
        NSLayoutConstraint.activate([
            label.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            label.topAnchor.constraint(equalTo: view.topAnchor, constant: 16),
            
            sublabel.leadingAnchor.constraint(equalTo: label.leadingAnchor),
            sublabel.topAnchor.constraint(equalTo: label.bottomAnchor, constant: 4),
            sublabel.bottomAnchor.constraint(equalTo: view.bottomAnchor, constant: -16),
        ])
        
        return view
    }()
    
    private lazy var scrollView: UIScrollView = {
        let scroll = UIScrollView()
        scroll.showsVerticalScrollIndicator = false
        scroll.translatesAutoresizingMaskIntoConstraints = false
        return scroll
    }()
    
    private lazy var contentView: UIView = {
        let view = UIView()
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }()
    
    private lazy var gridView: UIView = {
        let view = UIView()
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }()
    
    private lazy var dealSection: UIView = {
        let view = UIView()
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }()
    
    // MARK: - Lifecycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupViews()
        setupGrid()
        setupDeals()
    }
    
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        gradientLayer.frame = headerView.bounds
    }
    
    // MARK: - Setup
    
    private func setupViews() {
        view.backgroundColor = AppColors.background
        
        headerView.layer.insertSublayer(gradientLayer, at: 0)
        
        view.addSubview(headerView)
        headerView.addSubview(titleLabel)
        headerView.addSubview(searchBar)
        
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        
        contentView.addSubview(bannerView)
        contentView.addSubview(gridView)
        contentView.addSubview(dealSection)
        
        NSLayoutConstraint.activate([
            headerView.topAnchor.constraint(equalTo: view.topAnchor),
            headerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            headerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            headerView.heightAnchor.constraint(equalToConstant: 180),
            
            titleLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 8),
            titleLabel.leadingAnchor.constraint(equalTo: headerView.leadingAnchor, constant: 20),
            
            searchBar.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 16),
            searchBar.leadingAnchor.constraint(equalTo: headerView.leadingAnchor, constant: 20),
            searchBar.trailingAnchor.constraint(equalTo: headerView.trailingAnchor, constant: -20),
            searchBar.heightAnchor.constraint(equalToConstant: 48),
            
            scrollView.topAnchor.constraint(equalTo: headerView.bottomAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor),
            
            bannerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 16),
            bannerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            bannerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            bannerView.heightAnchor.constraint(equalToConstant: 80),
            
            gridView.topAnchor.constraint(equalTo: bannerView.bottomAnchor, constant: 24),
            gridView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            gridView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            
            dealSection.topAnchor.constraint(equalTo: gridView.bottomAnchor, constant: 24),
            dealSection.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            dealSection.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            dealSection.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -20),
        ])
    }
    
    private func setupGrid() {
        let columns = 5
        let spacing: CGFloat = 8
        let itemWidth = (view.bounds.width - 32 - CGFloat(columns - 1) * spacing) / CGFloat(columns)
        
        var previousRow: UIView?
        
        for (index, app) in apps.enumerated() {
            let row = index / columns
            let col = index % columns
            
            let item = createAppItem(config: app)
            gridView.addSubview(item)
            
            item.translatesAutoresizingMaskIntoConstraints = false
            
            if col == 0 {
                // First column
                item.leadingAnchor.constraint(equalTo: gridView.leadingAnchor).isActive = true
                if let prev = previousRow {
                    item.topAnchor.constraint(equalTo: prev.bottomAnchor, constant: 16).isActive = true
                } else {
                    item.topAnchor.constraint(equalTo: gridView.topAnchor).isActive = true
                }
                previousRow = item
            } else {
                // Other columns
                if let sibling = gridView.subviews.dropLast().last {
                    item.leadingAnchor.constraint(equalTo: sibling.trailingAnchor, constant: spacing).isActive = true
                    item.topAnchor.constraint(equalTo: sibling.topAnchor).isActive = true
                }
            }
            
            item.widthAnchor.constraint(equalToConstant: itemWidth).isActive = true
            item.heightAnchor.constraint(equalToConstant: 80).isActive = true
        }
        
        if let last = gridView.subviews.last {
            last.bottomAnchor.constraint(equalTo: gridView.bottomAnchor).isActive = true
        }
    }
    
    private func createAppItem(config: MiniAppConfig) -> UIView {
        let container = UIView()
        container.isUserInteractionEnabled = true
        
        // Circle background
        let circle = UIView()
        circle.backgroundColor = config.color.withAlphaComponent(0.15)
        circle.layer.cornerRadius = 28
        circle.translatesAutoresizingMaskIntoConstraints = false
        
        let iconLabel = UILabel()
        iconLabel.text = config.icon
        iconLabel.font = UIFont.systemFont(ofSize: 28)
        iconLabel.textAlignment = .center
        iconLabel.translatesAutoresizingMaskIntoConstraints = false
        
        let titleLabel = UILabel()
        titleLabel.text = config.title
        titleLabel.font = AppTypography.caption
        titleLabel.textColor = AppColors.textPrimary
        titleLabel.textAlignment = .center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        circle.addSubview(iconLabel)
        container.addSubview(circle)
        container.addSubview(titleLabel)
        
        NSLayoutConstraint.activate([
            circle.topAnchor.constraint(equalTo: container.topAnchor),
            circle.centerXAnchor.constraint(equalTo: container.centerXAnchor),
            circle.widthAnchor.constraint(equalToConstant: 56),
            circle.heightAnchor.constraint(equalToConstant: 56),
            
            iconLabel.centerXAnchor.constraint(equalTo: circle.centerXAnchor),
            iconLabel.centerYAnchor.constraint(equalTo: circle.centerYAnchor),
            
            titleLabel.topAnchor.constraint(equalTo: circle.bottomAnchor, constant: 8),
            titleLabel.leadingAnchor.constraint(equalTo: container.leadingAnchor),
            titleLabel.trailingAnchor.constraint(equalTo: container.trailingAnchor),
            titleLabel.bottomAnchor.constraint(equalTo: container.bottomAnchor),
        ])
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(appTapped(_:)))
        container.addGestureRecognizer(tap)
        container.tag = apps.firstIndex(where: { $0.module == config.module }) ?? 0
        
        // Animation
        circle.transform = CGAffineTransform(scaleX: 0.9, y: 0.9)
        UIView.animate(withDuration: 0.3, delay: 0, usingSpringWithDamping: 0.5, initialSpringVelocity: 0.5) {
            circle.transform = .identity
        }
        
        return container
    }
    
    private func setupDeals() {
        let titleLabel = UILabel()
        titleLabel.text = "Ưu đãi đặc biệt"
        titleLabel.font = AppTypography.headline
        titleLabel.textColor = AppColors.textPrimary
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        dealSection.addSubview(titleLabel)
        
        NSLayoutConstraint.activate([
            titleLabel.topAnchor.constraint(equalTo: dealSection.topAnchor),
            titleLabel.leadingAnchor.constraint(equalTo: dealSection.leadingAnchor, constant: 20),
        ])
        
        let scrollView = UIScrollView()
        scrollView.showsHorizontalScrollIndicator = false
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        
        dealSection.addSubview(scrollView)
        
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 12),
            scrollView.leadingAnchor.constraint(equalTo: dealSection.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: dealSection.trailingAnchor),
            scrollView.heightAnchor.constraint(equalToConstant: 120),
            scrollView.bottomAnchor.constraint(equalTo: dealSection.bottomAnchor),
        ])
        
        let deals = [
            ("Deal 0Đ", AppColors.dealRed, "🎁"),
            ("Giảm 50%", AppColors.dealOrange, "🔥"),
            ("Freeship", AppColors.crypto, "🚚"),
            ("Cashback", AppColors.wallet, "💰"),
        ]
        
        var previousCard: UIView?
        
        for (title, color, icon) in deals {
            let card = createDealCard(title: title, color: color, icon: icon)
            scrollView.addSubview(card)
            
            if let prev = previousCard {
                card.leadingAnchor.constraint(equalTo: prev.trailingAnchor, constant: 12).isActive = true
            } else {
                card.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor, constant: 20).isActive = true
            }
            
            card.topAnchor.constraint(equalTo: scrollView.topAnchor).isActive = true
            card.widthAnchor.constraint(equalToConstant: 140).isActive = true
            card.heightAnchor.constraint(equalToConstant: 100).isActive = true
            
            previousCard = card
        }
        
        if let last = previousCard {
            last.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor, constant: -20).isActive = true
        }
    }
    
    private func createDealCard(title: String, color: UIColor, icon: String) -> UIView {
        let card = UIView()
        card.backgroundColor = color.withAlphaComponent(0.1)
        card.layer.cornerRadius = 12
        card.translatesAutoresizingMaskIntoConstraints = false
        
        let iconLabel = UILabel()
        iconLabel.text = icon
        iconLabel.font = UIFont.systemFont(ofSize: 32)
        iconLabel.translatesAutoresizingMaskIntoConstraints = false
        
        let titleLabel = UILabel()
        titleLabel.text = title
        titleLabel.font = AppTypography.headline
        titleLabel.textColor = color
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        card.addSubview(iconLabel)
        card.addSubview(titleLabel)
        
        NSLayoutConstraint.activate([
            iconLabel.topAnchor.constraint(equalTo: card.topAnchor, constant: 12),
            iconLabel.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 12),
            
            titleLabel.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 12),
            titleLabel.bottomAnchor.constraint(equalTo: card.bottomAnchor, constant: -12),
        ])
        
        return card
    }
    
    // MARK: - Actions
    
    @objc private func searchTapped() {
        Haptic.light()
    }
    
    @objc private func appTapped(_ sender: UITapGestureRecognizer) {
        Haptic.medium()
        
        guard let view = sender.view else { return }
        let index = view.tag
        guard index < apps.count else { return }
        
        let config = apps[index]
        let vc = MiniAppViewController(moduleName: config.module, registry: registry)
        vc.title = config.title
        navigationController?.pushViewController(vc, animated: true)
    }
}
