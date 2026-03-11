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
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';

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
    <footer className="bg-brand-dark dark:bg-dark-bg text-white relative overflow-hidden transition-colors duration-500">
      {/* Subtle accent glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand-primary/5 dark:bg-brand-primary/3 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-brand-secondary/5 dark:bg-brand-primary/3 rounded-full blur-[120px]"></div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-primary"></div>

      {/* Features Bar */}
      <div className="border-b border-white/10 dark:border-dark-border relative">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white/5 dark:bg-dark-card hover:bg-white/10 dark:hover:bg-dark-hover border border-white/10 dark:border-dark-border transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-primary flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-all duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base group-hover:text-brand-primary transition-colors">{feature.title}</h4>
                  <p className="text-white/60 dark:text-dark-muted text-xs sm:text-sm">{feature.desc}</p>
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
              <img 
                src="/logo.svg" 
                alt="Shri Venkatesan Traders" 
                className="h-12 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <p className="text-white/70 dark:text-dark-muted mb-6 leading-relaxed text-sm max-w-sm">
              Your trusted partner for premium industrial supplies. Serving South India's manufacturing sector with quality products for over 25 years.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a href="mailto:info@svtraders.com" className="flex items-center gap-3 text-white/70 dark:text-dark-muted hover:text-brand-primary transition-all text-sm group">
                <div className="w-10 h-10 bg-white/10 dark:bg-dark-card flex items-center justify-center group-hover:bg-brand-primary/20 transition-all border border-white/10 dark:border-dark-border">
                  <EmailIcon sx={{ fontSize: 18 }} className="text-brand-primary" />
                </div>
                <span className="group-hover:translate-x-1 transition-transform font-medium">info@svtraders.com</span>
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-3 text-white/70 dark:text-dark-muted hover:text-brand-primary transition-all text-sm group">
                <div className="w-10 h-10 bg-white/10 dark:bg-dark-card flex items-center justify-center group-hover:bg-brand-primary/20 transition-all border border-white/10 dark:border-dark-border">
                  <PhoneIcon sx={{ fontSize: 18 }} className="text-brand-primary" />
                </div>
                <span className="group-hover:translate-x-1 transition-transform font-medium">+91 98765 43210</span>
              </a>
              <div className="flex items-start gap-3 text-white/70 dark:text-dark-muted text-sm group">
                <div className="w-10 h-10 bg-white/10 dark:bg-dark-card flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/10 dark:border-dark-border">
                  <LocationOnIcon sx={{ fontSize: 18 }} className="text-brand-primary" />
                </div>
                <span className="font-medium">123 Industrial Area, Chennai, Tamil Nadu 600001</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: FacebookIcon, label: "Facebook", color: "hover:bg-blue-600" },
                { icon: LinkedInIcon, label: "LinkedIn", color: "hover:bg-blue-700" },
                { icon: TwitterIcon, label: "Twitter", color: "hover:bg-sky-500" },
                { icon: InstagramIcon, label: "Instagram", color: "hover:bg-pink-600" },
                { icon: YouTubeIcon, label: "YouTube", color: "hover:bg-red-600" },
              ].map((social) => {
                const IconComponent = social.icon;
                return (
                  <button
                    key={social.label}
                    className={`w-10 h-10 sm:w-11 sm:h-11 bg-white/10 dark:bg-dark-card ${social.color} text-white flex items-center justify-center transition-all duration-300 hover:scale-105 group border border-white/10 dark:border-dark-border hover:border-transparent`}
                    title={social.label}
                  >
                    <IconComponent sx={{ fontSize: 18 }} className="group-hover:scale-110 transition-transform" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="sm:pl-4">
              <h4 className="font-bold text-white mb-4 sm:mb-5 text-sm sm:text-base flex items-center gap-2">
                <span className="w-1 h-5 bg-brand-primary"></span>
                {section.title}
              </h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-white/70 dark:text-dark-muted hover:text-brand-primary transition-all text-sm hover:translate-x-1 inline-flex items-center gap-2 group font-medium"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-brand-primary transition-all duration-300"></span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-white/10 dark:border-dark-border">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl">
              <h4 className="font-display font-bold text-white dark:text-white mb-2 text-base sm:text-lg flex items-center gap-2">
                <MarkEmailUnreadIcon className="text-brand-primary" sx={{ fontSize: 28 }} /> Subscribe to our newsletter
              </h4>
              <p className="text-gray-300 dark:text-dark-muted text-sm mb-4 font-display">Get updates on new products and exclusive offers.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3.5 bg-white/10 dark:bg-dark-hover border border-white/20 dark:border-dark-border text-white placeholder-gray-400 dark:placeholder-dark-muted focus:outline-none focus:border-brand-primary transition-all text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-brand-primary hover:bg-brand-secondary text-white font-semibold transition-all flex items-center justify-center gap-2 text-sm group"
                >
                  <SendIcon sx={{ fontSize: 18 }} className="group-hover:translate-x-1 transition-transform" />
                  <span>Subscribe</span>
                </button>
              </form>
              {subscribeStatus === "success" && (
                <p className="mt-3 text-brand-primary text-sm flex items-center gap-2 font-semibold">
                  <VerifiedIcon sx={{ fontSize: 18 }} />
                  Thanks for subscribing!
                </p>
              )}
            </div>

            {/* Dark Mode Toggle in Footer */}
            <div className="flex justify-center lg:justify-end">
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-3 px-6 py-3 bg-white/10 dark:bg-dark-hover hover:bg-white/20 dark:hover:bg-dark-card border border-white/20 dark:border-dark-border transition-all duration-300 group"
              >
                {darkMode ? (
                  <>
                    <LightModeIcon sx={{ fontSize: 24 }} className="text-brand-primary transition-transform duration-300" />
                    <span className="text-white font-semibold text-sm">Light Mode</span>
                  </>
                ) : (
                  <>
                    <DarkModeIcon sx={{ fontSize: 24 }} className="text-brand-primary transition-transform duration-300" />
                    <span className="text-white font-semibold text-sm">Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 dark:border-dark-border bg-black/20 dark:bg-black/30">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 text-center sm:text-left">
            <p className="text-white/60 dark:text-dark-muted text-xs sm:text-sm">
              © {new Date().getFullYear()} <span className="font-bold text-white">Shri Venkatesan Traders</span>. All rights reserved.
            </p>
            <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 text-gray-400 dark:text-dark-muted text-xs sm:text-sm">
              <Link to="/" className="hover:text-brand-primary transition-colors font-medium">Privacy</Link>
              <span className="text-white/20">|</span>
              <Link to="/" className="hover:text-brand-primary transition-colors font-medium">Terms</Link>
              <span className="text-white/20">|</span>
              <Link to="/" className="hover:text-brand-primary transition-colors font-medium">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

