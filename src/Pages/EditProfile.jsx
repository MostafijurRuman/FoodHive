import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiSave, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import useAuth from "../Hooks/useAuth";
import useTitle from "../hooks/useTitle";
import axiosNormal from '../Api/AxiosNormal';

const _MOTION = motion; // ESLint workaround

const EditProfile = () => {
  useTitle("Edit Profile | FoodHive");
  const { user, updateUserProfile } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    photoURL: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [photoPreview, setPhotoPreview] = useState('');

  // Initialize form with user data
  useEffect(() => {
    console.log('User state:', user); // Debug log
    
    // Set auth checking to false after a brief delay to handle Firebase Auth rehydration
    const timer = setTimeout(() => {
      setAuthChecking(false);
    }, 1000);
    
    if (user) {
      setFormData({
        name: user.displayName || '',
        email: user.email || '',
        phone: '',
        address: '',
        photoURL: user.photoURL || ''
      });
      setPhotoPreview(user.photoURL || '');
      
      // Fetch additional user data from MongoDB
      fetchUserData(user.uid);
      setAuthChecking(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [user]);

  // Fetch user data from MongoDB
  const fetchUserData = async (uid) => {
    setInitialLoading(true);
    try {
      const response = await axiosNormal.get(`/users/${uid}`);
      if (response.data) {
        setFormData(prev => ({
          ...prev,
          phone: response.data.phone || '',
          address: response.data.address || ''
        }));
      }
    } catch {
      // User might not exist in MongoDB yet, that's okay
      console.log('User data not found in MongoDB, will create on save');
    } finally {
      setInitialLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle photo URL change
  const handlePhotoChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      photoURL: value
    }));
    setPhotoPreview(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setLoading(true);
    
    try {
      // Update Firebase Auth profile (name and photo)
      await updateUserProfile({
        displayName: formData.name,
        photoURL: formData.photoURL
      });

      // Always update MongoDB with phone and address (even if empty)
      if (user?.uid) {
        await axiosNormal.post('/users', {
          uid: user.uid,
          phone: formData.phone || '',
          address: formData.address || ''
        });
      }
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid data provided');
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-3xl mx-auto px-4">
        {/* Show loading while checking authentication or initial data load */}
        {(authChecking || (user && initialLoading)) ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-6">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white/20 animate-pulse"></div>
                <div className="w-32 h-5 bg-white/20 rounded mt-3 animate-pulse"></div>
                <div className="w-24 h-4 bg-white/20 rounded mt-2 animate-pulse"></div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              ))}
              <div className="flex gap-3 pt-4">
                <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        ) : !user ? (
          // Show auth required message only after auth checking is complete
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center"
          >
            <FiUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to edit your profile.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              <FiArrowLeft /> Go to Home
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-3 font-medium transition-colors text-sm"
              >
                <FiArrowLeft /> Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 font-heading">Edit Profile</h1>
              <p className="text-gray-600 mt-1 text-sm">Update your personal information and preferences</p>
            </motion.div>

        {/* Profile Form */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
            {/* Profile Photo Section */}
            <motion.div variants={itemVariants} className="bg-gradient-to-r from-green-600 to-green-500 p-6">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={() => setPhotoPreview('')}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <FiUser className="w-7 h-7 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiCamera className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h2 className="text-lg font-semibold text-white mt-3">{formData.name || 'Your Name'}</h2>
                <p className="text-green-100 text-sm">{formData.email}</p>
              </div>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Photo URL - Full Width */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCamera className="inline mr-2" />
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handlePhotoChange}
                  placeholder="https://example.com/your-photo.jpg"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                />
              </motion.div>

              {/* Name and Email - 2 Columns */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiUser className="inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMail className="inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </motion.div>

              {/* Phone - Single Column */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiPhone className="inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                />
              </motion.div>

              {/* Address - Full Width */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMapPin className="inline mr-2" />
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Enter your address"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none text-sm"
                />
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave />
                      Save Changes
                    </>
                  )}
                </button>
                
                <Link
                  to="/"
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center text-sm"
                >
                  Cancel
                </Link>
              </motion.div>
            </form>

            {/* Profile Stats */}
            <motion.div variants={itemVariants} className="bg-gray-50 p-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Account Information</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-base font-semibold text-green-600">Member</div>
                  <div className="text-gray-500 text-xs">Account Type</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-semibold text-green-600">
                    {user?.metadata?.creationTime ? 
                      new Date(user.metadata.creationTime).getFullYear() : 
                      new Date().getFullYear()
                    }
                  </div>
                  <div className="text-gray-500 text-xs">Member Since</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-semibold text-green-600">Active</div>
                  <div className="text-gray-500 text-xs">Status</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center text-xs text-gray-500"
            >
              <p>Your information is secure and will only be used to improve your experience.</p>
              <p className="mt-1">Need help? <Link to="https://www.facebook.com/Mostafijur.Ruman.Officials" className="text-green-600 hover:text-green-700">Contact Support</Link></p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
