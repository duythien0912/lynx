// ViewController is replaced by RootViewController
// This file is kept for compatibility but not used

import UIKit

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        
        // Show placeholder - actual UI is in RootViewController
        let label = UILabel()
        label.text = "Loading SuperApp..."
        label.textAlignment = .center
        label.frame = view.bounds
        view.addSubview(label)
    }
}
