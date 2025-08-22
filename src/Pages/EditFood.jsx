import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiArrowLeft, FiSave, FiTag, FiDollarSign, FiPackage, FiMapPin, FiList, FiUser, FiFileText 
} from 'react-icons/fi';

import useTitle from "../hooks/useTitle";
import useAxiosSecure from '../Api/useAxiosSecure';

const _MOTION = motion;

const categoryColors = {
  Seafood: "bg-blue-500 text-white",
  Asian: "bg-red-500 text-white",
  "Fast Food": "bg-yellow-500 text-black",
  Salad: "bg-green-500 text-white",
  Mexican: "bg-orange-500 text-white",
  Bakery: "bg-pink-500 text-white",
  "Middle Eastern": "bg-amber-600 text-white",
  Dessert: "bg-purple-500 text-white",
  Beverages: "bg-cyan-500 text-white",
  Pizza: "bg-red-600 text-white",
  Pasta: "bg-rose-500 text-white",
  Vegetarian: "bg-lime-600 text-white",
  Vegan: "bg-emerald-600 text-white",
  "BBQ & Grill": "bg-stone-700 text-white",
  Breakfast: "bg-indigo-500 text-white",
  Indian: "bg-orange-700 text-white",
  Chinese: "bg-red-400 text-white",
  Italian: "bg-teal-600 text-white"
};

const categories = Object.keys(categoryColors);

const EditFood = () => {
  useTitle("Edit Food | FoodHive");
  const { id } = useParams();
  
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    image: '',
    category: '',
    price: '',
    quantityAvailable: '',
    originCountry: '',
    ingredients: '',
    description: '',
    madeBy: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await axiosSecure.get(`/food/${id}`);
        const food = response.data;
        setFormData({
          name: food.name || '',
          image: food.image || '',
          category: food.category || '',
          price: food.price || '',
          quantityAvailable: food.quantityAvailable || '',
          originCountry: food.originCountry || '',
          ingredients: Array.isArray(food.ingredients) ? food.ingredients.join(', ') : food.ingredients || '',
          description: food.description || '',
          madeBy: food.madeBy || ''
        });
      } catch (err) {
        toast.error('Failed to load food data');
        console.log(err)
        navigate('/my-foods');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchFood();
  }, [id, axiosSecure, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = {
        ...formData,
        price: parseFloat(formData.price),
        quantityAvailable: parseInt(formData.quantityAvailable),
        ingredients: formData.ingredients.split(',').map(i => i.trim()),
      };
      const response = await axiosSecure.put(`/food/${id}`, updateData);
      if (response.data.success) {
        toast.success('Food updated successfully!');
        navigate(`/food-details/${id}`); // Redirect to details page for instant update
      } else {
        toast.error(response.data.message || 'Failed to update food');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update food');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading food data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/my-foods" className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
              <FiArrowLeft className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Edit Food Item</h1>
              <p className="text-gray-600 mt-1">Update your food details below</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
              <input type="url" name="image" value={formData.image} onChange={handleChange} required placeholder="https://example.com/food.jpg" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm" />
              {formData.image && (
                <div className="mt-3">
                  <img src={formData.image} alt="Food preview" className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200" onError={e => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Food Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter food name" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm">
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD) *</label>
                <input type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleChange} required placeholder="0.00" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Quantity *</label>
                <input type="number" min="0" name="quantityAvailable" value={formData.quantityAvailable} onChange={handleChange} required placeholder="1" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Origin/Country *</label>
                <input type="text" name="originCountry" value={formData.originCountry} onChange={handleChange} required placeholder="e.g., Italy, China, Mexico" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Made By *</label>
                <input type="text" name="madeBy" value={formData.madeBy} onChange={handleChange} required placeholder="Chef name or restaurant" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients *</label>
              <textarea name="ingredients" value={formData.ingredients} onChange={handleChange} required rows="3" placeholder="List all ingredients separated by commas" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Describe your food item, cooking method, taste, etc." className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm resize-none" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Update Food
                  </>
                )}
              </button>
              <Link to="/my-foods" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center text-sm">Cancel</Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditFood;
