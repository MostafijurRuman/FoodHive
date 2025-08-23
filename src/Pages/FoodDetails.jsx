import React, { useState } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiArrowLeft, FiShoppingCart, FiTag, FiPackage, FiMapPin, 
  FiUser, FiCalendar, FiStar, FiShare2, FiClock,
  FiCheckCircle, FiTrendingUp
} from 'react-icons/fi';

import useAuth from "../Hooks/useAuth";
import useTitle from "../hooks/useTitle";

const _MOTION = motion; // ESLint workaround

export default function FoodDetails() {
  const food = useLoaderData();
  const { user } = useAuth();
  const navigate = useNavigate();
  // Removed wishlist functionality
  const [quantity, setQuantity] = useState(1);
  // Removed purchase modal state

  useTitle(`${food?.name || 'Food Details'} | FoodHive`);

  // Category badge colors
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.6, staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  // Handle purchase (open modal)
  const handlePurchase = () => {
    // Navigate to FoodPurchase page, passing food info
    navigate('/food-purchase', { state: { food } });
  };

  // Confirm purchase in modal
  // Removed confirmPurchase logic

  // Handle wishlist toggle
  // Removed wishlist functionality

  // Handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: food.name,
          text: food.description,
          url: window.location.href,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!food) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Food Not Found</h2>
          <p className="text-gray-600 mb-4">The food item you're looking for doesn't exist.</p>
          <Link to="/" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/all-foods" 
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <FiArrowLeft className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-800 line-clamp-1">{food.name}</h1>
                <p className="text-sm text-gray-500">Food Details</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleShare}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <FiShare2 />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left Column - Image */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="relative">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x500?text=Food+Image';
                }}
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-lg ${categoryColors[food.category] || 'bg-gray-500 text-white'}`}>
                  {food.category}
                </span>
                {food.isActive && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
                    <FiCheckCircle className="text-xs" />
                    Available
                  </span>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiTrendingUp className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{food.purchaseCount || 0}</p>
                    <p className="text-sm text-gray-600">Times Purchased</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiPackage className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{food.quantityAvailable}</p>
                    <p className="text-sm text-gray-600">Available</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{food.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-green-600">${food.price}</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} className="text-yellow-400 fill-current text-sm" />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">(4.8)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{food.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <FiMapPin className="text-green-600" />
                  <span className="font-medium text-gray-900">Origin</span>
                </div>
                <p className="text-gray-600">{food.originCountry}</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <FiUser className="text-green-600" />
                  <span className="font-medium text-gray-900">Made By</span>
                </div>
                <p className="text-gray-600">{food.madeBy}</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <FiCalendar className="text-green-600" />
                  <span className="font-medium text-gray-900">Added</span>
                </div>
                <p className="text-gray-600">{new Date(food.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <FiClock className="text-green-600" />
                  <span className="font-medium text-gray-900">Updated</span>
                </div>
                <p className="text-gray-600">{new Date(food.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(food.ingredients) ? 
                  food.ingredients.map((ingredient, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {ingredient}
                    </span>
                  )) : 
                  food.ingredients.split(',').map((ingredient, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {ingredient.trim()}
                    </span>
                  ))
                }
              </div>
            </div>

            {/* Added By */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Added By</h3>
              <div className="flex items-center gap-4">
                <img
                  src={food.addedBy?.photoURL || 'https://via.placeholder.com/48x48?text=User'}
                  alt={food.addedBy?.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <p className="font-medium text-gray-900">{food.addedBy?.name}</p>
                  <p className="text-sm text-gray-600">{food.addedBy?.email}</p>
                </div>
              </div>
            </div>

            {/* Purchase Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Purchase This Food</h3>
              
              {food.quantityAvailable > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="font-medium text-gray-700">Quantity:</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(food.quantityAvailable, quantity + 1))}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        disabled={quantity >= food.quantityAvailable}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-600">
                      (Max: {food.quantityAvailable})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total Price:</span>
                    <span className="text-green-600">${(food.price * quantity).toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handlePurchase}
                    disabled={user?.uid === food.addedBy?.userId}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <FiShoppingCart />
                    {user?.uid === food.addedBy?.userId ? 'Cannot Purchase Own Item' : 'Purchase Now'}
                  </button>
                  
                  {user?.uid === food.addedBy?.userId && (
                    <p className="text-sm text-gray-600 text-center">
                      This is your own food item. You cannot purchase it.
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-red-600 font-medium mb-2">Out of Stock</p>
                  <p className="text-sm text-gray-600">This item is currently unavailable</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}
