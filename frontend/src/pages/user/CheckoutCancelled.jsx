import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import CancelIcon from "@mui/icons-material/Cancel";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const CheckoutCancelled = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`min-h-screen py-12 px-4 ${darkMode ? 'bg-dark-bg' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      <div className="max-w-2xl mx-auto">
        <div className={`rounded-3xl shadow-xl overflow-hidden ${darkMode ? 'bg-dark-card border border-dark-border' : 'bg-white'}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-center text-white">
            <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <CancelIcon sx={{ fontSize: 56 }} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Payment Cancelled</h1>
            <p className="text-amber-100 text-lg">Your payment was not completed</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-amber-800 mb-2">Don't worry!</h3>
              <p className="text-amber-700">
                Your order has not been placed and no payment was charged. 
                Your cart items are still saved and you can complete your purchase whenever you're ready.
              </p>
            </div>

            <div className="mb-8">
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>What would you like to do?</h3>
              <ul className={`space-y-3 ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-brand-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-brand-primary text-sm font-bold">•</span>
                  </span>
                  <span>Return to your cart and try the payment again</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-brand-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-brand-primary text-sm font-bold">•</span>
                  </span>
                  <span>Update your cart items before checkout</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-brand-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-brand-primary text-sm font-bold">•</span>
                  </span>
                  <span>Contact support if you experienced any issues</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/cart"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-brand-primary to-brand-dark text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <ShoppingCartIcon />
                Return to Cart
              </Link>
              <Link
                to="/"
                className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 border-2 rounded-2xl font-semibold transition-colors ${darkMode ? 'border-dark-border text-dark-text hover:bg-dark-bg' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <HomeIcon />
                Go to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className={`mt-8 rounded-2xl shadow-sm p-6 ${darkMode ? 'bg-dark-card border border-dark-border' : 'bg-white'}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <SupportAgentIcon className="text-blue-600" />
            </div>
            <div>
              <h4 className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Need Help?</h4>
              <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>
                If you're having trouble completing your payment, our support team is here to help.
              </p>
            </div>
          </div>
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-dark-border' : 'border-brand-primary/10'}`}>
            <a 
              href="mailto:support@shrivenkatesantraders.com" 
              className="text-brand-primary hover:underline font-medium"
            >
              support@shrivenkatesantraders.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancelled;

