import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiClock,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiHeart,
  FiArrowUp,
  FiChevronRight,
  FiStar,
  FiAward,
  FiUsers,
  FiTruck
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Story', href: '/story' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' }
    ],
    services: [
      { label: 'All Foods', href: '/all-foods' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Food Delivery', href: '/delivery' },
      { label: 'Catering', href: '/catering' }
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faq' },
      { label: 'Live Chat', href: '/chat' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Refund Policy', href: '/refund' }
    ]
  };

  const socialLinks = [
    { icon: FiFacebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: FiTwitter, href: '#', label: 'Twitter', color: 'hover:text-sky-400' },
    { icon: FiInstagram, href: '#', label: 'Instagram', color: 'hover:text-pink-600' },
    { icon: FiYoutube, href: '#', label: 'YouTube', color: 'hover:text-red-600' },
    { icon: FiLinkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-700' }
  ];

  const stats = [
    { icon: FiUsers, value: 10000, suffix: '+', label: 'Happy Customers' },
    { icon: FiStar, value: 4.9, decimals: 1, label: 'Average Rating' },
    { icon: FiAward, value: 50, suffix: '+', label: 'Awards Won' },
    { icon: FiTruck, value: 24, suffix: '/7', label: 'Delivery Service' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <footer className="bg-gray-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent"></div>
      </div>

      <div className="relative z-10">
        {/* Stats Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="bg-green-600 py-12"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4"
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-3xl font-bold text-white mb-2"
                  >
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2.5}
                      delay={0.5}
                      decimals={stat.decimals || 0}
                      decimal="."
                      suffix={stat.suffix || ''}
                      enableScrollSpy
                      scrollSpyOnce
                    />
                  </motion.div>
                  <p className="text-green-100 text-sm font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-4 gap-12"
          >
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <Link to="/" className="flex items-center space-x-3 mb-6 group">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors duration-300"
                >
                  <span className="text-white font-bold text-xl font-heading">F</span>
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-heading">FoodHive</h3>
                  <p className="text-green-400 text-sm">Delicious Food Delivered</p>
                </div>
              </Link>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Experience the finest culinary delights delivered fresh to your doorstep. 
                We're passionate about bringing you the best food experience with quality ingredients and exceptional service.
              </p>

              
            </motion.div>

            {/* Links Sections */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Company Links */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-6 font-heading">Company</h4>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Link 
                          to={link.href}
                          className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center space-x-2 group"
                        >
                          <FiChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          <span>{link.label}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Services Links */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-6 font-heading">Services</h4>
                  <ul className="space-y-3">
                    {footerLinks.services.map((link, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Link 
                          to={link.href}
                          className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center space-x-2 group"
                        >
                          <FiChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          <span>{link.label}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Support Links */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-6 font-heading">Support</h4>
                  <ul className="space-y-3">
                    {footerLinks.support.map((link, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Link 
                          to={link.href}
                          className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center space-x-2 group"
                        >
                          <FiChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          <span>{link.label}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="mt-16 pt-12 border-t border-gray-700"
          >
            <motion.div variants={itemVariants} className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-white mb-4 font-heading">Stay Updated</h3>
              <p className="text-gray-300 mb-6">Subscribe to our newsletter for the latest food updates, special offers, and culinary tips!</p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Subscribe
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="mt-12 pt-8 border-t border-gray-700"
          >
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex flex-wrap justify-center gap-6 mb-6 sm:mb-0">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 ${social.color} hover:bg-gray-600 transition-all duration-200 hover:shadow-lg`}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                {footerLinks.legal.map((link, index) => (
                  <Link
                    key={index}
                    to={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="bg-gray-900 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-gray-400 text-sm text-center sm:text-left mb-4 sm:mb-0"
              >
                © {currentYear} FoodHive. Made with <FiHeart className="inline w-4 h-4 text-red-500 mx-1" /> Mostafijur Ruman
              </motion.p>

              {/* Back to Top Button */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors duration-200 group"
              >
                <span className="text-sm">Back to Top</span>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors duration-200">
                  <FiArrowUp className="w-4 h-4" />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
