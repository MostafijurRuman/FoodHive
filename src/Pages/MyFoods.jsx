import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiPlus, FiEdit3, FiTrash2, FiEye, FiMapPin, FiPackage, 
  FiTag, FiCalendar, FiArrowLeft, FiGrid, FiList 
} from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import useAuth from "../Hooks/useAuth";
import useTitle from "../hooks/useTitle";
import useAxiosSecure from '../Api/useAxiosSecure';
import Swal from 'sweetalert2';

const _MOTION = motion; // ESLint workaround

const MyFoods = () => {
  useTitle("My Foods | FoodHive");
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [viewMode, setViewMode] = useState('grid');
  
  // Fetch user's foods
  const fetchMyFoods = async () => {
    if (!user?.email) {
      throw new Error('User not authenticated');
    }
    const response = await axiosSecure.get(`/my-foods/${user.email}`);
    return response.data;
  };

  const { 
    data: myFoodsData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['my-foods', user?.uid],
    queryFn: fetchMyFoods,
    enabled: !!user?.uid,
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });

  const myFoods = myFoodsData?.foods || [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.5, staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

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

  // Handle delete food
  const handleDelete = async (foodId, foodName) => {
    Swal.fire({
      title: `Delete "${foodName}"?`,
      text: 'Are you sure you want to delete this food item? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16A34A', // Your green color
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        confirmButton: 'bg-green-600 text-white',
        cancelButton: 'bg-gray-200 text-gray-700',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/food/${foodId}`);
          toast.success('Food item deleted successfully!');
          refetch(); // Refresh the list
        } catch (error) {
          console.error('Error deleting food:', error);
          toast.error(error.response?.data?.message || 'Failed to delete food item');
        }
      }
    });
  };

  // Loading component
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-48 h-8 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="w-full h-48 bg-gray-300 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="w-3/4 h-5 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-1/2 h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="flex gap-2 pt-3">
                    <div className="flex-1 h-8 bg-gray-300 rounded animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <FiArrowLeft className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">My Food Items</h1>
                <p className="text-gray-600 mt-1">
                  Manage your added food items ({myFoods.length} total)
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                  } transition-colors`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                  } transition-colors`}
                >
                  <FiList />
                </button>
              </div>
              
              {/* Add Food Button */}
              <Link
                to="/add-food"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <FiPlus />
                Add New Food
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isError ? (
            <motion.div variants={itemVariants} className="text-center py-16">
              <div className="text-red-500 text-lg font-semibold mb-2">
                Error loading your foods
              </div>
              <p className="text-gray-600 mb-4">{error?.message || 'Something went wrong'}</p>
              <button 
                onClick={() => refetch()} 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          ) : myFoods.length === 0 ? (
            <motion.div variants={itemVariants} className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No food items yet</h3>
              <p className="text-gray-600 mb-6">Start by adding your first delicious food item!</p>
              <Link
                to="/add-food"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <FiPlus />
                Add Your First Food
              </Link>
            </motion.div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }>
              {myFoods.map((food) => (
                <motion.div
                  key={food._id}
                  variants={itemVariants}
                  className={viewMode === 'grid' 
                    ? "group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
                    : "group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden p-4"
                  }
                >
                  {viewMode === 'grid' ? (
                    <>
                      {/* Grid View */}
                      <div className="relative overflow-hidden">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Food+Image';
                          }}
                        />
                        <span className={`absolute top-3 right-3 shadow-sm px-2 py-1 rounded-full text-xs font-medium ${categoryColors[food.category] || 'bg-gray-500 text-white'}`}>
                          {food.category}
                        </span>
                        <div className="absolute top-3 left-3 bg-black/20 backdrop-blur-sm rounded-full p-1">
                          <span className="text-white text-xs font-medium px-2">
                            ${food.price}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
                            {food.name}
                          </h3>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <FiMapPin />
                            <span>{food.originCountry}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiPackage />
                            <span>Qty: {food.quantityAvailable}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                          <FiCalendar />
                          <span>Added: {new Date(food.dateAdded || food.createdAt).toLocaleDateString()}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Link
                            to={`/food-details/${food._id}`}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-center flex items-center justify-center gap-1"
                          >
                            <FiEye className="text-xs" />
                            View
                          </Link>
                          <Link
                            to={`/edit-food/${food._id}`}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-center"
                          >
                            <FiEdit3 />
                          </Link>
                          <button
                            onClick={() => handleDelete(food._id, food.name)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-center"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* List View */}
                      <div className="flex gap-4">
                        <div className="relative">
                          <img
                            src={food.image}
                            alt={food.name}
                            className="w-24 h-24 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/96x96?text=Food';
                            }}
                          />
                          <span className={`absolute -top-2 -right-2 shadow-sm px-2 py-1 rounded-full text-xs font-medium ${categoryColors[food.category] || 'bg-gray-500 text-white'}`}>
                            {food.category}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                                {food.name}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <div className="flex items-center gap-1">
                                  <FiTag />
                                  <span>${food.price}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FiMapPin />
                                  <span>{food.originCountry}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FiPackage />
                                  <span>Qty: {food.quantityAvailable}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FiCalendar />
                                  <span>{new Date(food.dateAdded || food.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 ml-4">
                              <Link
                                to={`/food-details/${food._id}`}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                              >
                                <FiEye />
                                View
                              </Link>
                              <Link
                                to={`/edit-food/${food._id}`}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1"
                              >
                                <FiEdit3 />
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(food._id, food.name)}
                                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1"
                              >
                                <FiTrash2 />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyFoods;
