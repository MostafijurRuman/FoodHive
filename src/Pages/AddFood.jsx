import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiCamera, FiSave, FiArrowLeft, FiTag, FiDollarSign, 
  FiPackage, FiMapPin, FiList, FiUser, FiFileText 
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from "../Hooks/useAuth";
import useTitle from "../hooks/useTitle";
import useAxiosSecure from '../Api/useAxiosSecure';

const _MOTION = motion; // ESLint workaround

const AddFood = () => {
  useTitle("Add Food | FoodHive");
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    category: '',
    price: '',
    quantity: '',
    origin: '',
    ingredients: '',
    description: '',
    madeBy: ''
  });
  
  const [loading, setLoading] = useState(false);

  // Categories for the food items
  const categories = [
    'Seafood', 'Asian', 'Fast Food', 'Salad', 'Mexican', 'Bakery', 
    'Middle Eastern', 'Dessert', 'Beverages', 'Pizza', 'Pasta', 
    'Vegetarian', 'Vegan', 'BBQ & Grill', 'Breakfast', 'Indian', 
    'Chinese', 'Italian'
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.5, staggerChildren: 0.08 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to add food items');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const foodData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        addedBy: {
          uid: user.uid,
          name: user.displayName || 'Anonymous',
          email: user.email,
          photoURL: user.photoURL || ''
        }
      };

      // Use /foods endpoint instead of /foods
      const response = await axiosSecure.post('/foods', foodData);
      
      if (response.status === 201) {
        toast.success('Food item added successfully!');
        navigate('/my-foods'); 
      }
    } catch (error) {
      console.error('Error adding food:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to continue');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add food item');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Link 
              to="/" 
              className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FiArrowLeft className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Add New Food Item</h1>
              <p className="text-gray-600 mt-1">Share your delicious food with the community</p>
            </div>
          </div>
        </motion.div>

        {/* Main Form Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* User Info Header */}
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <FiUser className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold">{user?.displayName || 'Food Creator'}</h3>
                <p className="text-green-100 text-sm">{user?.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Food Image URL */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiCamera className="inline mr-2" />
                Food Image URL *
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                placeholder="https://example.com/your-food-image.jpg"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
              />
              {formData.image && (
                <div className="mt-3">
                  <img 
                    src={formData.image} 
                    alt="Food preview" 
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </motion.div>

            {/* Food Name and Category - 2 Columns */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiTag className="inline mr-2" />
                  Food Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter food name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiList className="inline mr-2" />
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Price and Quantity - 2 Columns */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiDollarSign className="inline mr-2" />
                  Price (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiPackage className="inline mr-2" />
                  Available Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  placeholder="1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                />
              </div>
            </motion.div>

            {/* Origin and Made By - 2 Columns */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMapPin className="inline mr-2" />
                  Origin/Country *
                </label>
                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Italy, China, Mexico"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="inline mr-2" />
                  Made By (Chef/Restaurant) *
                </label>
                <input
                  type="text"
                  name="madeBy"
                  value={formData.madeBy}
                  onChange={handleChange}
                  required
                  placeholder="Chef name or restaurant"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                />
              </div>
            </motion.div>

            {/* Ingredients */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiList className="inline mr-2" />
                Ingredients *
              </label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                required
                rows="3"
                placeholder="List all ingredients separated by commas"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none text-sm"
              />
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiFileText className="inline mr-2" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your food item, cooking method, taste, etc."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none text-sm"
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Adding Food...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Add Food Item
                  </>
                )}
              </button>
              
              <Link
                to="/"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center text-sm"
              >
                Cancel
              </Link>
            </motion.div>
          </form>

          {/* Info Footer */}
          <motion.div variants={itemVariants} className="bg-gray-50 p-4 border-t border-gray-200">
            <div className="text-center text-xs text-gray-500">
              <p>Your food item will be reviewed and made available to customers.</p>
              <p className="mt-1">Make sure all information is accurate and images are high quality.</p>
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
          <p>Need help adding your food? <Link to="/contact" className="text-green-600 hover:text-green-700">Contact Support</Link></p>
        </motion.div>
      </div>
    </div>
  );
};

export default AddFood;
