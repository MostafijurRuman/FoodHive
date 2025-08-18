import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiLogOut, 
  FiPlus, 
  FiHeart,
  FiShoppingBag,
  FiHome,
  FiGrid,
  FiImage,
  FiEdit3
} from 'react-icons/fi';
import useAuth from '../Hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: FiHome },
    { to: '/all-foods', label: 'All Foods', icon: FiGrid },
    { to: '/gallery', label: 'Gallery', icon: FiImage }
  ];

  const profileMenuItems = [
    { to: '/edit-profile', label: 'Edit Profile', icon: FiEdit3 },
    { to: '/my-foods', label: 'My Foods', icon: FiHeart },
    { to: '/add-food', label: 'Add Food', icon: FiPlus },
    { to: '/my-orders', label: 'My Orders', icon: FiShoppingBag }
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-700 transition-colors duration-200">
              <span className="text-white font-bold text-lg font-heading">F</span>
            </div>
            <span className="text-xl font-bold text-gray-800 font-heading group-hover:text-green-600 transition-colors duration-200">
              FoodHive
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`
                }
                onClick={closeMobileMenu}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-8 h-8 rounded-full overflow-hidden bg-green-100 flex items-center justify-center"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-5 h-5 text-green-600" />
                    )}
                  </motion.div>
                  <span className="text-sm font-medium text-gray-700 max-w-20 truncate">
                    {user.displayName || 'User'}
                  </span>
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    >
                      {profileMenuItems.map((item, index) => (
                        <motion.div
                          key={item.to}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                        >
                          <Link
                            to={item.to}
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors duration-200"
                          >
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <item.icon className="w-4 h-4" />
                            </motion.div>
                            <span>{item.label}</span>
                          </Link>
                        </motion.div>
                      ))}
                      <hr className="my-1" />
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: profileMenuItems.length * 0.05, duration: 0.2 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Login
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
          >
            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Offcanvas Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 z-50"
            >
              {/* Blur Glass Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-white/20 backdrop-blur-md"
                onClick={closeMobileMenu}
              />

              {/* Offcanvas Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ 
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }}
                className="absolute right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-l border-white/20"
              >
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="flex items-center justify-between p-6 border-b border-gray-200/50"
                >
                  <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center"
                    >
                      <span className="text-white font-bold text-lg font-heading">F</span>
                    </motion.div>
                    <span className="text-xl font-bold text-gray-800 font-heading">FoodHive</span>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 transition-colors duration-200"
                  >
                    <FiX className="w-6 h-6" />
                  </motion.button>
                </motion.div>

                {/* User Info */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="p-6 border-b border-gray-200/50"
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-12 h-12 rounded-full overflow-hidden bg-green-100 flex items-center justify-center ring-2 ring-green-200"
                      >
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName || 'User'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiUser className="w-6 h-6 text-green-600" />
                        )}
                      </motion.div>
                      <div>
                        <p className="font-medium text-gray-800">{user.displayName || 'User'}</p>
                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Links */}
                <nav className="p-6 space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * (index + 3), duration: 0.3 }}
                    >
                      <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 p-3 rounded-lg font-medium transition-all duration-200 ${
                            isActive
                              ? 'text-green-600 bg-green-50/80 backdrop-blur-sm'
                              : 'text-gray-700 hover:text-green-600 hover:bg-gray-50/80 hover:backdrop-blur-sm'
                          }`
                        }
                        onClick={closeMobileMenu}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <link.icon className="w-5 h-5" />
                        </motion.div>
                        <span>{link.label}</span>
                      </NavLink>
                    </motion.div>
                  ))}

                  {/* Profile Menu Items (only show if logged in) */}
                  {user && (
                    <>
                      <motion.hr
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="my-4 origin-left"
                      />
                      <motion.h3
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                        className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-3 mb-2"
                      >
                        Profile
                      </motion.h3>
                      {profileMenuItems.map((item, index) => (
                        <motion.div
                          key={item.to}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * (index + 6), duration: 0.3 }}
                        >
                          <Link
                            to={item.to}
                            onClick={closeMobileMenu}
                            className="flex items-center space-x-3 p-3 rounded-lg font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50/80 hover:backdrop-blur-sm transition-all duration-200"
                          >
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <item.icon className="w-5 h-5" />
                            </motion.div>
                            <span>{item.label}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </>
                  )}
                </nav>

                {/* Auth Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="p-6 border-t border-gray-200/50 mt-auto"
                >
                  {user ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="flex items-center justify-center space-x-2 w-full bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                      <FiLogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </motion.button>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="flex items-center justify-center space-x-2 w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                      >
                        <FiUser className="w-5 h-5" />
                        <span>Login</span>
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
