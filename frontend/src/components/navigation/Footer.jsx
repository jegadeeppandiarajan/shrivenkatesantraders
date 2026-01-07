import { Link } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PaymentsIcon from '@mui/icons-material/Payments';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState(null);
  const { darkMode, toggleDarkMode } = useTheme();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribeStatus("success");
      setEmail("");
      setTimeout(() => setSubscribeStatus(null), 3000);
    }
  };

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", href: "/" },
        { name: "Products", href: "/products" },
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Categories",
      links: [
        { name: "Industrial Pipes", href: "/products" },
        { name: "Motors & Pumps", href: "/products" },
        { name: "Valves & Fittings", href: "/products" },
        { name: "Automation Parts", href: "/products" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Privacy Policy", href: "/" },
        { name: "Terms of Service", href: "/" },
        { name: "Shipping Info", href: "/" },
        { name: "FAQ", href: "/" },
      ],
    },
  ];

  const features = [
    { icon: <LocalShippingIcon />, title: "Free Shipping", desc: "On orders ₹10K+" },
    { icon: <SupportAgentIcon />, title: "24/7 Support", desc: "Expert assistance" },
    { icon: <PaymentsIcon />, title: "Secure Payment", desc: "Multiple options" },
    { icon: <VerifiedIcon />, title: "Quality Assured", desc: "ISO certified" },
  ];

  return (
    <footer className="bg-gradient-to-br from-amber-950 via-brand-dark to-amber-950 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg text-white relative overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-brand-primary/10 dark:bg-brand-secondary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-secondary/10 dark:bg-brand-primary/10 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-brand-primary/5 dark:border-brand-secondary/5 rounded-full animate-spin-slow"></div>
      
      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-honey dark:from-brand-secondary dark:via-brand-honey dark:to-brand-primary animate-gradient-x bg-[length:200%_100%]"></div>
      
      {/* Features Bar */}
      <div className="border-b border-brand-primary/20 dark:border-brand-secondary/20 relative">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white/5 dark:bg-dark-card/50 hover:bg-gradient-to-r hover:from-brand-primary/20 hover:to-brand-gold/20 dark:hover:from-brand-secondary/20 dark:hover:to-brand-honey/20 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brand-primary/20 dark:hover:shadow-brand-secondary/30 border border-brand-primary/10 dark:border-brand-secondary/20">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-brand-primary via-brand-gold to-brand-honey dark:from-brand-secondary dark:via-brand-honey dark:to-brand-primary rounded-2xl flex items-center justify-center text-white dark:text-dark-bg flex-shrink-0 shadow-lg shadow-brand-primary/30 dark:shadow-brand-secondary/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm sm:text-base group-hover:text-brand-secondary dark:group-hover:text-brand-honey transition-colors">{feature.title}</h4>
                  <p className="text-amber-200/70 dark:text-dark-muted text-xs sm:text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-brand-primary via-brand-gold to-brand-honey dark:from-brand-secondary dark:via-brand-honey dark:to-brand-primary text-white dark:text-dark-bg flex items-center justify-center font-extrabold text-xl sm:text-2xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-brand-primary/40 dark:shadow-brand-secondary/50">
                SV
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-brand-secondary dark:text-brand-honey font-extrabold">Est. 1998</p>
                <h3 className="text-base sm:text-lg font-extrabold leading-tight bg-gradient-to-r from-white via-brand-secondary to-brand-accent dark:from-brand-secondary dark:via-brand-honey dark:to-white bg-clip-text text-transparent">Shri Venkatesan Traders</h3>
              </div>
            </Link>
            <p className="text-amber-100/70 dark:text-dark-muted mb-6 leading-relaxed text-sm max-w-sm">
              Your trusted partner for premium industrial supplies. Serving South India's manufacturing sector with quality products for over 25 years.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a href="mailto:info@svtraders.com" className="flex items-center gap-3 text-amber-100/70 dark:text-dark-muted hover:text-brand-secondary dark:hover:text-brand-honey transition-all text-sm group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-gold/20 dark:from-brand-secondary/20 dark:to-brand-honey/20 flex items-center justify-center group-hover:bg-brand-primary/30 dark:group-hover:bg-brand-secondary/30 transition-all border border-brand-primary/20 dark:border-brand-secondary/30">
                  <EmailIcon sx={{ fontSize: 18 }} className="text-brand-secondary dark:text-brand-honey" />
                </div>
                <span className="group-hover:translate-x-1 transition-transform">info@svtraders.com</span>
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-3 text-amber-100/70 dark:text-dark-muted hover:text-brand-secondary dark:hover:text-brand-honey transition-all text-sm group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-gold/20 dark:from-brand-secondary/20 dark:to-brand-honey/20 flex items-center justify-center group-hover:bg-brand-primary/30 dark:group-hover:bg-brand-secondary/30 transition-all border border-brand-primary/20 dark:border-brand-secondary/30">
                  <PhoneIcon sx={{ fontSize: 18 }} className="text-brand-secondary dark:text-brand-honey" />
                </div>
                <span className="group-hover:translate-x-1 transition-transform">+91 98765 43210</span>
              </a>
              <div className="flex items-start gap-3 text-amber-100/70 dark:text-dark-muted text-sm group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-gold/20 dark:from-brand-secondary/20 dark:to-brand-honey/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-brand-primary/20 dark:border-brand-secondary/30">
                  <LocationOnIcon sx={{ fontSize: 18 }} className="text-brand-secondary dark:text-brand-honey" />
                </div>
                <span>123 Industrial Area, Chennai, Tamil Nadu 600001</span>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: FacebookIcon, label: "Facebook", color: "from-blue-600 to-blue-500", hoverShadow: "hover:shadow-blue-500/50" },
                { icon: LinkedInIcon, label: "LinkedIn", color: "from-blue-700 to-blue-600", hoverShadow: "hover:shadow-blue-600/50" },
                { icon: TwitterIcon, label: "Twitter", color: "from-sky-500 to-blue-500", hoverShadow: "hover:shadow-sky-500/50" },
                { icon: InstagramIcon, label: "Instagram", color: "from-pink-600 to-purple-600", hoverShadow: "hover:shadow-pink-500/50" },
                { icon: YouTubeIcon, label: "YouTube", color: "from-red-600 to-red-500", hoverShadow: "hover:shadow-red-500/50" },
              ].map((social) => {
                const IconComponent = social.icon;
                return (
                  <button
                    key={social.label}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/10 dark:bg-dark-hover hover:bg-gradient-to-r ${social.color} text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 group border border-white/10 hover:border-transparent shadow-lg ${social.hoverShadow}`}
                    title={social.label}
                  >
                    <IconComponent sx={{ fontSize: 20 }} className="group-hover:scale-110 transition-transform" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="sm:pl-4">
              <h4 className="font-extrabold text-white mb-4 sm:mb-5 text-sm sm:text-base flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gradient-to-b from-brand-primary via-brand-gold to-brand-honey dark:from-brand-secondary dark:via-brand-honey dark:to-brand-primary rounded-full"></span>
                {section.title}
              </h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-amber-100/70 dark:text-dark-muted hover:text-brand-secondary dark:hover:text-brand-honey transition-all text-sm hover:translate-x-2 inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-brand-secondary dark:bg-brand-honey rounded-full transition-all duration-300"></span>
                      <span className="group-hover:underline decoration-brand-secondary dark:decoration-brand-honey decoration-2 underline-offset-4">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-brand-primary/20 dark:border-brand-secondary/20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl">
              <h4 className="font-extrabold text-white mb-2 text-base sm:text-lg flex items-center gap-2">
                <span className="text-2xl animate-bounce">📬</span> Subscribe to our newsletter
              </h4>
              <p className="text-amber-100/70 dark:text-dark-muted text-sm mb-4">Get updates on new products and exclusive offers.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3.5 rounded-xl bg-white/10 dark:bg-dark-hover border-2 border-brand-primary/30 dark:border-brand-secondary/30 text-white placeholder-amber-200/50 dark:placeholder-dark-muted focus:outline-none focus:border-brand-primary dark:focus:border-brand-secondary focus:bg-white/15 dark:focus:bg-dark-card transition-all text-sm backdrop-blur-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-gradient-to-r from-brand-primary via-brand-gold to-brand-honey dark:from-brand-secondary dark:via-brand-honey dark:to-brand-primary text-white dark:text-dark-bg rounded-xl font-extrabold hover:shadow-xl hover:shadow-brand-primary/40 dark:hover:shadow-brand-secondary/50 transition-all flex items-center justify-center gap-2 text-sm hover:scale-105 group"
                >
                  <SendIcon sx={{ fontSize: 18 }} className="group-hover:translate-x-1 transition-transform" />
                  <span>Subscribe</span>
                </button>
              </form>
              {subscribeStatus === "success" && (
                <p className="mt-3 text-brand-secondary dark:text-brand-honey text-sm flex items-center gap-2 font-bold animate-pulse">
                  <VerifiedIcon sx={{ fontSize: 18 }} />
                  Thanks for subscribing! 🎉
                </p>
              )}
            </div>
            
            {/* Dark Mode Toggle in Footer */}
            <div className="flex justify-center lg:justify-end">
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 dark:bg-dark-hover hover:bg-white/20 dark:hover:bg-dark-card border border-brand-primary/30 dark:border-brand-secondary/30 transition-all duration-300 group hover:scale-105 hover:shadow-lg hover:shadow-brand-primary/30 dark:hover:shadow-brand-secondary/40"
              >
                {darkMode ? (
                  <>
                    <LightModeIcon sx={{ fontSize: 24 }} className="text-brand-secondary dark:text-brand-honey group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-white font-bold text-sm">Light Mode</span>
                  </>
                ) : (
                  <>
                    <DarkModeIcon sx={{ fontSize: 24 }} className="text-brand-secondary group-hover:-rotate-12 transition-transform duration-300" />
                    <span className="text-white font-bold text-sm">Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-primary/20 dark:border-brand-secondary/20 bg-black/30 dark:bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 text-center sm:text-left">
            <p className="text-amber-200/60 dark:text-dark-muted text-xs sm:text-sm">
              © {new Date().getFullYear()} <span className="font-bold text-white">Shri Venkatesan Traders</span>. All rights reserved.
            </p>
            <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 text-amber-200/60 dark:text-dark-muted text-xs sm:text-sm">
              <Link to="/" className="hover:text-brand-secondary dark:hover:text-brand-honey transition-colors font-medium hover:underline underline-offset-4">Privacy</Link>
              <span className="text-brand-primary/30 dark:text-brand-secondary/30">•</span>
              <Link to="/" className="hover:text-brand-secondary dark:hover:text-brand-honey transition-colors font-medium hover:underline underline-offset-4">Terms</Link>
              <span className="text-brand-primary/30 dark:text-brand-secondary/30">•</span>
              <Link to="/" className="hover:text-brand-secondary dark:hover:text-brand-honey transition-colors font-medium hover:underline underline-offset-4">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
