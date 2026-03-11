import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import AnimatedBackground from "../../components/common/AnimatedBackground";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import BusinessIcon from '@mui/icons-material/Business';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const contactMethods = [
  {
    icon: <PhoneIcon sx={{ fontSize: 28 }} />,
    title: "Phone",
    details: ["+91 93608 25682"],
    action: "tel:+919360825682",
    actionText: "Call Now",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <EmailIcon sx={{ fontSize: 28 }} />,
    title: "Email",
    details: ["shrivenkatesan2022@gmail.com"],
    action: "mailto:shrivenkatesan2022@gmail.com",
    actionText: "Send Email",
    color: "from-brand-primary to-brand-dark"
  },
  {
    icon: <WhatsAppIcon sx={{ fontSize: 28 }} />,
    title: "WhatsApp",
    details: ["+91 93608 25682", "Quick Response"],
    action: "https://wa.me/919360825682",
    actionText: "Chat Now",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <LocationOnIcon sx={{ fontSize: 28 }} />,
    title: "Visit Us",
    details: ["Near Chellathamman Kovil", "Madurai-01"],
    action: "https://maps.google.com",
    actionText: "Get Directions",
    color: "from-brand-secondary to-orange-500"
  }
];

const departments = [
  { icon: <LocalShippingIcon />, name: "Sales & Orders", email: "shrivenkatesan2022@gmail.com", phone: "+91 93608 25682" },
  { icon: <SupportAgentIcon />, name: "Customer Support", email: "shrivenkatesan2022@gmail.com", phone: "+91 93608 25682" },
  { icon: <BuildIcon />, name: "Technical Queries", email: "shrivenkatesan2022@gmail.com", phone: "+91 93608 25682" },
  { icon: <BusinessIcon />, name: "Corporate & Bulk", email: "shrivenkatesan2022@gmail.com", phone: "+91 93608 25682" },
];

const faqs = [
  { q: "What are your delivery timelines?", a: "Standard delivery is 2-5 business days. Express delivery available for urgent orders." },
  { q: "Do you offer bulk order discounts?", a: "Yes! Orders above ₹50,000 qualify for up to 25% discount. Contact our sales team for custom quotes." },
  { q: "What payment methods do you accept?", a: "We accept UPI, Credit/Debit cards, Net Banking, and provide credit terms for registered businesses." },
  { q: "Can I return or exchange products?", a: "Yes, we have a 7-day return policy for defective or wrong items. Terms and conditions apply." },
];

const Contact = () => {
  const { darkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", company: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-700 ${darkMode ? 'bg-dark-bg' : 'bg-stone-100'}`}>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Contact Methods */}
      <section className={`py-10 sm:py-16 relative transition-colors duration-700 ${darkMode ? 'bg-dark-bg' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.action}
                target={method.action.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className={`group rounded-3xl p-6 shadow-xl border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-brand-primary/10'
                  } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 bg-brand-primary rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {method.icon}
                </div>
                <h3 className={`font-display font-bold text-lg mb-2 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>{method.title}</h3>
                {method.details.map((detail, i) => (
                  <p key={i} className={`text-sm font-display ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>{detail}</p>
                ))}
                <div className="mt-4 flex items-center gap-2 text-brand-primary font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>{method.actionText}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className={`py-12 sm:py-24 ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {/* Contact Form */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h2 className={`text-3xl font-display font-bold mb-2 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Send Us a Message</h2>
              <p className={`mb-8 font-display ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Fill out the form and we'll get back to you within 24 hours.</p>

              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center gap-3 text-green-400">
                  <CheckCircleIcon />
                  <span className="font-medium">Thank you! Your message has been sent successfully.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-5 py-3.5 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all ${darkMode ? 'bg-dark-card border-dark-border text-dark-text placeholder-dark-muted' : 'bg-white border-brand-primary/20'
                        }`}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-5 py-3.5 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all ${darkMode ? 'bg-dark-card border-dark-border text-dark-text placeholder-dark-muted' : 'bg-white border-brand-primary/20'
                        }`}
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-3.5 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all ${darkMode ? 'bg-dark-card border-dark-border text-dark-text placeholder-dark-muted' : 'bg-white border-brand-primary/20'
                        }`}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Company Name</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-3.5 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all ${darkMode ? 'bg-dark-card border-dark-border text-dark-text placeholder-dark-muted' : 'bg-white border-brand-primary/20'
                        }`}
                      placeholder="Your Company Ltd."
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-5 py-3.5 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all ${darkMode ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-white border-brand-primary/20'
                      }`}
                  >
                    <option value="">Select a subject</option>
                    <option value="quote">Request a Quote</option>
                    <option value="order">Order Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="bulk">Bulk Order</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className={`w-full px-5 py-3.5 border-2 rounded-3xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all resize-none ${darkMode ? 'bg-dark-card border-dark-border text-dark-text placeholder-dark-muted' : 'bg-white border-brand-primary/20'
                      }`}
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-brand-primary text-white font-bold rounded-full shadow-lg hover:bg-brand-secondary hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <SendIcon />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Side Info */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              {/* Business Hours */}
              <div className={`rounded-2xl p-8 shadow-lg border mb-8 ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-brand-primary/10'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
                    <AccessTimeIcon className="text-brand-primary" />
                  </div>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Business Hours</h3>
                </div>
                <div className="space-y-3">
                  <div className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-dark-border' : 'border-brand-primary/10'}`}>
                    <span className={darkMode ? 'text-dark-muted' : 'text-slate-600'}>Monday - Friday</span>
                    <span className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>9:00 AM - 7:00 PM</span>
                  </div>
                  <div className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-dark-border' : 'border-brand-primary/10'}`}>
                    <span className={darkMode ? 'text-dark-muted' : 'text-slate-600'}>Saturday</span>
                    <span className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className={darkMode ? 'text-dark-muted' : 'text-slate-600'}>Sunday</span>
                    <span className="font-semibold text-red-500">Closed</span>
                  </div>
                </div>
              </div>

              {/* Departments */}
              <div className={`rounded-2xl p-8 shadow-lg border ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-brand-primary/10'}`}>
                <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Contact Departments</h3>
                <div className="space-y-4">
                  {departments.map((dept, index) => (
                    <div key={index} className={`flex items-start gap-4 p-4 rounded-2xl transition-colors ${darkMode ? 'bg-dark-bg hover:bg-dark-hover' : 'bg-slate-50 hover:bg-brand-primary/5'}`}>
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary flex-shrink-0">
                        {dept.icon}
                      </div>
                      <div>
                        <h4 className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>{dept.name}</h4>
                        <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>{dept.email}</p>
                        <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>{dept.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-12 sm:py-24 ${darkMode ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Frequently Asked Questions</h2>
            <p className={darkMode ? 'text-dark-muted' : 'text-brand-slate'}>Quick answers to common questions</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden border transition-colors ${darkMode
                  ? 'bg-dark-bg border-dark-border hover:border-brand-primary/30'
                  : 'bg-slate-50 border-brand-primary/10 hover:border-brand-primary/20'
                  }`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>{faq.q}</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${darkMode ? 'text-dark-muted' : 'text-slate-400'} ${activeFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${activeFaq === index ? 'max-h-40' : 'max-h-0'}`}>
                  <p className={`px-6 pb-5 ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className={`py-12 sm:py-24 ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className={`rounded-3xl shadow-xl overflow-hidden ${darkMode ? 'bg-dark-card border border-dark-border' : 'bg-white'}`}>
            <div className="grid lg:grid-cols-3">
              <div className="p-8 lg:p-12 bg-gradient-to-br from-brand-gold to-brand-primary text-white">
                <h3 className="text-2xl font-bold mb-6">Visit Our Store</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <LocationOnIcon />
                    <div>
                      <h4 className="font-semibold mb-1">Main Office & Warehouse</h4>
                      <p className="text-white/80 text-sm">No: 52, Ground Floor<br />Parameswaran pillai Lane<br />Near Chellathamman Kovil<br />Madurai-01</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <PhoneIcon />
                    <div>
                      <h4 className="font-semibold mb-1">Call Us</h4>
                      <p className="text-white/80 text-sm">+91 93608 25682</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <EmailIcon />
                    <div>
                      <h4 className="font-semibold mb-1">Email Us</h4>
                      <p className="text-white/80 text-sm">shrivenkatesan2022@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`lg:col-span-2 h-80 lg:h-auto flex items-center justify-center ${darkMode ? 'bg-dark-bg' : 'bg-slate-200'}`}>
                <div className="text-center p-8">
                  <LocationOnIcon sx={{ fontSize: 48 }} className={`mb-4 ${darkMode ? 'text-dark-muted' : 'text-slate-400'}`} />
                  <p className={darkMode ? 'text-dark-muted' : 'text-brand-slate'}>Interactive map would be displayed here</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-brand-primary text-white rounded-2xl font-semibold hover:bg-brand-gold transition-colors"
                  >
                    Open in Google Maps
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

