import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import VerifiedIcon from '@mui/icons-material/Verified';
import GroupsIcon from '@mui/icons-material/Groups';
import FactoryIcon from '@mui/icons-material/Factory';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HandshakeIcon from '@mui/icons-material/Handshake';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StarIcon from '@mui/icons-material/Star';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const milestones = [
  { year: "1998", title: "Founded", description: "Started as a small industrial supplies shop in Chennai" },
  { year: "2005", title: "Expansion", description: "Opened our first warehouse and expanded product range" },
  { year: "2012", title: "Regional Growth", description: "Became the leading supplier in South India" },
  { year: "2018", title: "Digital Transformation", description: "Launched our online platform for seamless ordering" },
  { year: "2024", title: "Industry Leader", description: "Serving 10,000+ businesses across India" },
];

const values = [
  { icon: <VerifiedIcon sx={{ fontSize: 32 }} />, title: "Quality First", description: "We source only from certified manufacturers ensuring top-grade products" },
  { icon: <HandshakeIcon sx={{ fontSize: 32 }} />, title: "Trust & Integrity", description: "Building lasting relationships through honest and transparent business practices" },
  { icon: <TrendingUpIcon sx={{ fontSize: 32 }} />, title: "Innovation", description: "Continuously improving our services and adopting latest technologies" },
  { icon: <SupportAgentIcon sx={{ fontSize: 32 }} />, title: "Customer Focus", description: "Your success is our priority with dedicated support and customized solutions" },
];

const team = [
  { name: "Rajesh Kumar", role: "Founder & CEO", experience: "30+ years", image: null },
  { name: "Priya Sharma", role: "Operations Director", experience: "18 years", image: null },
  { name: "Arun Venkat", role: "Technical Head", experience: "15 years", image: null },
  { name: "Meera Krishnan", role: "Customer Relations", experience: "12 years", image: null },
];

const stats = [
  { value: "25+", label: "Years Experience", icon: <EmojiEventsIcon /> },
  { value: "10K+", label: "Happy Customers", icon: <GroupsIcon /> },
  { value: "50K+", label: "Orders Delivered", icon: <LocalShippingIcon /> },
  { value: "500+", label: "Product Categories", icon: <FactoryIcon /> },
];

const About = () => {
  const { darkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : ''}`}>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-brand-gold to-slate-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-secondary/20 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '50px 50px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <FactoryIcon sx={{ fontSize: 18 }} className="text-brand-secondary" />
              <span className="text-sm font-semibold text-white">About Our Company</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Powering Industries
              <span className="block mt-2 bg-gradient-to-r from-brand-secondary to-yellow-400 bg-clip-text text-transparent">
                Since 1998
              </span>
            </h1>
            <p className="text-xl text-white/70 mt-6 max-w-3xl mx-auto">
              From a small shop in Chennai to South India's leading industrial supplier - our journey is built on trust, quality, and unwavering commitment to our customers.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 relative -mt-12 ${darkMode ? 'bg-dark-bg' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 shadow-xl border text-center transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl ${
                  darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-slate-100'
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-2xl mb-4 text-brand-primary">
                  {stat.icon}
                </div>
                <p className={`text-3xl font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>{stat.value}</p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className={`py-24 ${darkMode ? 'bg-dark-card' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full mb-6">
                <WorkspacePremiumIcon sx={{ fontSize: 18 }} className="text-brand-primary" />
                <span className="text-sm font-semibold text-brand-primary">Our Story</span>
              </div>
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>
                From Humble Beginnings to Industry Leadership
              </h2>
              <div className={`space-y-4 leading-relaxed ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
                <p>
                  Shri Venkatesan Traders was founded in 1998 by Mr. Rajesh Kumar with a simple vision - to provide quality industrial supplies at fair prices with exceptional service.
                </p>
                <p>
                  Starting from a small shop in Chennai's industrial district, we've grown into one of South India's most trusted suppliers of pipes, motors, pumps, and industrial automation components.
                </p>
                <p>
                  Today, we serve over 10,000 businesses including manufacturers, contractors, and government organizations. Our success is built on three pillars: quality products, competitive pricing, and customer-first service.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm ${darkMode ? 'bg-dark-bg' : 'bg-white'}`}>
                  <VerifiedIcon className="text-green-500" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-dark-text' : ''}`}>ISO 9001:2015 Certified</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm ${darkMode ? 'bg-dark-bg' : 'bg-white'}`}>
                  <StarIcon className="text-yellow-500" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-dark-text' : ''}`}>4.9/5 Customer Rating</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-primary to-brand-secondary"></div>
                
                <div className="space-y-8">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="relative pl-20">
                      {/* Timeline Dot */}
                      <div className={`absolute left-6 top-1 w-5 h-5 border-4 border-brand-primary rounded-full shadow-lg ${darkMode ? 'bg-dark-card' : 'bg-white'}`}></div>
                      
                      <div className={`rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow ${darkMode ? 'bg-dark-bg border border-dark-border' : 'bg-white'}`}>
                        <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm font-bold rounded-full mb-2">
                          {milestone.year}
                        </span>
                        <h4 className={`font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>{milestone.title}</h4>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className={`py-24 ${darkMode ? 'bg-dark-bg' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-secondary/10 rounded-full mb-6">
              <HandshakeIcon sx={{ fontSize: 18 }} className="text-brand-secondary" />
              <span className="text-sm font-semibold text-brand-secondary">Our Values</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>
              What Drives Us Forward
            </h2>
            <p className={`mt-4 max-w-2xl mx-auto ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>
              Our core values guide every decision we make and every relationship we build
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className={`group rounded-2xl p-8 border transition-all duration-500 hover:-translate-y-2 ${
                  darkMode 
                    ? 'bg-dark-card border-dark-border hover:border-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/10' 
                    : 'bg-slate-50 hover:bg-white hover:shadow-xl border-transparent hover:border-slate-100'
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-gold rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  {value.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>{value.title}</h3>
                <p className={`leading-relaxed ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`py-24 ${darkMode ? 'bg-dark-card' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full mb-6">
              <GroupsIcon sx={{ fontSize: 18 }} className="text-brand-primary" />
              <span className="text-sm font-semibold text-brand-primary">Our Team</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>
              Meet the People Behind Our Success
            </h2>
            <p className={`mt-4 max-w-2xl mx-auto ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>
              Experienced professionals dedicated to serving your industrial needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className={`group rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 text-center ${
                  darkMode ? 'bg-dark-bg border border-dark-border' : 'bg-white'
                }`}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-brand-primary to-brand-gold rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                  {member.name.charAt(0)}
                </div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>{member.name}</h3>
                <p className="text-brand-primary font-medium text-sm mt-1">{member.role}</p>
                <p className={`text-sm mt-2 ${darkMode ? 'text-dark-muted' : 'text-slate-400'}`}>{member.experience} experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-brand-gold via-brand-primary to-brand-gold relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-secondary/10 rounded-full blur-[80px]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Partner with Us?
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Join thousands of businesses who trust Shri Venkatesan Traders for their industrial needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="px-8 py-4 bg-white text-brand-primary font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Browse Products
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
