//
//  DesignSystem.swift
//  Hello-Lynx
//
//  ShopeeFood/Baemin style
//  Gradient header, round icons, vibrant colors
//

import UIKit

enum AppColors {
    // Header gradient (xanh ngọc như ShopeeFood)
    static let headerTop = UIColor(red: 0.0, green: 0.75, blue: 0.75, alpha: 1.0)
    static let headerBottom = UIColor(red: 0.0, green: 0.85, blue: 0.8, alpha: 1.0)
    
    // Background
    static let background = UIColor(red: 0.97, green: 0.97, blue: 0.98, alpha: 1.0)
    static let backgroundPrimary = UIColor(red: 0.97, green: 0.97, blue: 0.98, alpha: 1.0)
    static let cardWhite = UIColor.white
    
    // Brand
    static let brandPrimary = UIColor(red: 0.0, green: 0.75, blue: 0.75, alpha: 1.0)
    
    // Text
    static let textPrimary = UIColor(red: 0.1, green: 0.1, blue: 0.1, alpha: 1.0)
    static let textSecondary = UIColor(red: 0.4, green: 0.4, blue: 0.4, alpha: 1.0)
    static let textWhite = UIColor.white
    
    // App colors (vibrant)
    static let wallet = UIColor(red: 0.0, green: 0.6, blue: 1.0, alpha: 1.0)
    static let shop = UIColor(red: 1.0, green: 0.35, blue: 0.35, alpha: 1.0)
    static let profile = UIColor(red: 0.6, green: 0.3, blue: 0.9, alpha: 1.0)
    static let crypto = UIColor(red: 0.0, green: 0.75, blue: 0.55, alpha: 1.0)
    static let ai = UIColor(red: 1.0, green: 0.55, blue: 0.0, alpha: 1.0)
    
    // Deal/Tag colors
    static let dealRed = UIColor(red: 1.0, green: 0.2, blue: 0.3, alpha: 1.0)
    static let dealOrange = UIColor(red: 1.0, green: 0.6, blue: 0.0, alpha: 1.0)
}

enum AppTypography {
    static let title = UIFont.systemFont(ofSize: 22, weight: .bold)
    static let headline = UIFont.systemFont(ofSize: 16, weight: .semibold)
    static let body = UIFont.systemFont(ofSize: 14, weight: .regular)
    static let bodyMedium = UIFont.systemFont(ofSize: 14, weight: .medium)
    static let caption = UIFont.systemFont(ofSize: 12, weight: .regular)
    static let small = UIFont.systemFont(ofSize: 10, weight: .medium)
}

enum AppSpacing {
    static let xs: CGFloat = 4
    static let sm: CGFloat = 8
    static let md: CGFloat = 12
    static let lg: CGFloat = 16
    static let xl: CGFloat = 20
}

enum Haptic {
    static func light() {
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
    }
    static func medium() {
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
    }
}
