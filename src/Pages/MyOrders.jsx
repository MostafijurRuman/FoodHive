import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import moment from 'moment';
import { FiArrowLeft, FiCalendar, FiTag } from 'react-icons/fi';
import useAuth from "../Hooks/useAuth";
import useTitle from "../hooks/useTitle";
import useAxiosSecure from '../Api/useAxiosSecure';

const _MOTION = motion;

const MyOrders = () => {
  useTitle("My Orders | FoodHive");
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch orders for logged-in user
  const fetchOrders = async () => {
    if (!user?.email) throw new Error('User not authenticated');
    const response = await axiosSecure.get(`/orders?email=${user.email}`);
    return response.data.orders || [];
  };

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['my-orders', user?.email],
    queryFn: fetchOrders,
    enabled: !!user?.email,
    staleTime: 30 * 1000,
    cacheTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/" className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
              <FiArrowLeft className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
              <p className="text-gray-600 mt-1">All food items you've ordered</p>
            </div>
          </div>
        </motion.div>
        {isError ? (
          <motion.div className="text-center py-16">
            <div className="text-red-500 text-lg font-semibold mb-2">Error loading orders</div>
            <p className="text-gray-600 mb-4">{error?.message || 'Something went wrong'}</p>
            <button onClick={() => refetch()} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">Try Again</button>
          </motion.div>
        ) : orders.length === 0 ? (
          <motion.div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">You haven't ordered any food items yet.</p>
            <Link to="/" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2">Order Now</Link>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-lg w-full">
            {/* Desktop/tablet table */}
            <div className="hidden sm:block overflow-x-auto scrollbar-hide">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Food</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Owner</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Total Price</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap flex items-center gap-3">
                        <img src={order.food.image} alt={order.food.name} className="w-16 h-16 object-cover rounded-lg border" />
                        <div>
                          <div className="font-semibold text-gray-900">{order.food.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1"><FiTag /> ${order.food.price}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img src={order.food.ownerImg || 'https://via.placeholder.com/32x32?text=User'} alt={order.food.owner} className="w-8 h-8 rounded-full object-cover border" />
                          <div>
                            <div className="font-medium text-gray-900">{order.food.owner}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap font-semibold text-green-700">{order.quantity}</td>
                      <td className="px-4 py-4 whitespace-nowrap font-semibold text-green-700">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-green-600" />
                          <span>{moment(order.createdAt).format('LLL')}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="sm:hidden space-y-4">
              {orders.map(order => (
                <div key={order._id} className="bg-white rounded-lg shadow p-3 flex flex-col gap-2">
                  <div className="flex gap-3 items-center">
                    <img src={order.food.image} alt={order.food.name} className="w-14 h-14 object-cover rounded-lg border" />
                    <div>
                      <div className="font-semibold text-gray-900">{order.food.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1"><FiTag /> ${order.food.price}</div>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <img src={order.food.ownerImg || 'https://via.placeholder.com/32x32?text=User'} alt={order.food.owner} className="w-7 h-7 rounded-full object-cover border" />
                    <span className="font-medium text-gray-900">{order.food.owner}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs mt-2">
                    <span className="font-semibold text-green-700">Qty: {order.quantity}</span>
                    <span className="font-semibold text-green-700">${order.totalPrice.toFixed(2)}</span>
                    <span className="flex items-center gap-1 text-gray-500"><FiCalendar className="text-green-600" />{moment(order.createdAt).format('LLL')}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
