import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../Hooks/useAuth';
import axiosNormal from '../Api/AxiosNormal';

export default function FoodPurchase() {
  const [formData, setFormData] = useState({ phone: '', address: '' });
  const [initialLoading, setInitialLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  // Fetch user data from MongoDB
  React.useEffect(() => {
    const fetchUserData = async (uid) => {
      setInitialLoading(true);
      try {
        const response = await axiosNormal.get(`/users/${uid}`);
        if (response.data) {
          const phone = response.data.phone || '';
          const address = response.data.address || '';
          setFormData(prev => ({ ...prev, phone, address }));
          // If either phone or address is empty, create them in MongoDB
          if (!phone || !address) {
            await axiosNormal.post('/users', {
              uid,
              phone,
              address
            });
          }
        } else {
          // User not found, create new entry
          await axiosNormal.post('/users', {
            uid,
            phone: '',
            address: ''
          });
        }
      } catch {
        // User might not exist in MongoDB yet, create new entry
        await axiosNormal.post('/users', {
          uid,
          phone: '',
          address: ''
        });
        console.log('User data not found in MongoDB, created new entry');
      } finally {
        setInitialLoading(false);
      }
    };
    if (user?.uid) fetchUserData(user.uid);
  }, [user]);
  // Expect food info passed via location.state
  const food = location.state?.food;
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!food) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200">
        <div className="text-center p-8 rounded-2xl shadow-2xl bg-white/80 backdrop-blur-lg">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Food Not Found</h2>
          <p className="text-gray-600 mb-4">No food selected for purchase.</p>
          <button onClick={() => navigate('/all-foods')} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-lg">Go Back</button>
        </div>
      </div>
    );
  }

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (quantity < 1 || quantity > food.quantityAvailable) {
      toast.error('Invalid quantity');
      return;
    }
    setLoading(true);
    try {
      // Always update MongoDB with phone and address (even if empty)
      if (user?.uid) {
        await axiosNormal.post('/users', {
          uid: user.uid,
          phone: formData.phone || '',
          address: formData.address || ''
        });
      }
      const order = {
        foodId: food._id,
        food: {
          image: food.image,
          name: food.name,
          price: food.price,
          owner: food.addedBy?.name,
          ownerEmail: food.addedBy?.email,
          ownerImg: food.addedBy?.photoURL,
        },
        buyer: {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          phone: formData.phone,
          address: formData.address,
        },
        quantity,
        totalPrice: food.price * quantity,
        createdAt: Date.now(),
      };
      await axiosNormal.post('/orders', order, { withCredentials: true });
      await axiosNormal.put(`/food/${food._id}/purchase`, { quantity }, { withCredentials: true });
      toast.success('Purchase successful!');
      navigate('/my-orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 flex items-center justify-center px-2 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-green-400 p-0 overflow-hidden flex flex-col md:flex-row">
          {/* Food Banner */}
          <div className="md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-green-600 p-8 relative">
            <img src={food.image} alt={food.name} className="h-32 w-32 object-cover rounded-2xl shadow-xl border-4 border-white mb-4" />
            <h2 className="text-xl font-extrabold text-white drop-shadow-lg mb-1 text-center tracking-tight">{food.name}</h2>
            <div className="text-lg font-bold text-yellow-200 drop-shadow mb-2">${food.price}</div>
            <div className="flex flex-col gap-1 items-center">
              <span className="bg-white/80 text-green-700 px-4 py-1 rounded-full font-semibold shadow text-xs">Available: {food.quantityAvailable}</span>
              <span className="bg-white/80 text-gray-700 px-4 py-1 rounded-full font-semibold shadow text-xs">Seller: {food.addedBy?.name}</span>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handlePurchase} className="md:w-1/2 p-8 grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold text-xs mb-1">Food Name</label>
                <input type="text" value={food.name} readOnly className="w-full px-3 py-2 rounded-lg border bg-gray-100 font-bold text-xs" />
              </div>
              <div>
                <label className="block text-gray-700 font-bold text-xs mb-1">Price</label>
                <input type="text" value={`$${food.price}`} readOnly className="w-full px-3 py-2 rounded-lg border bg-gray-100 font-bold text-xs" />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-bold text-xs mb-1">Quantity</label>
              <input type="number" min={1} max={food.quantityAvailable} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border font-bold text-xs" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold text-xs mb-1">Your Name</label>
                <input type="text" value={user.displayName} readOnly className="w-full px-3 py-2 rounded-lg border bg-gray-100 font-bold text-xs" />
              </div>
              <div>
                <label className="block text-gray-700 font-bold text-xs mb-1">Your Email</label>
                <input type="text" value={user.email} readOnly className="w-full px-3 py-2 rounded-lg border bg-gray-100 font-bold text-xs" />
              </div>
            </div>
            {/* Phone and Address in two rows, address is textarea */}
            <div>
              <label className="block text-gray-700 font-bold text-xs mb-1">Phone Number</label>
              <input type="text" value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-3 py-2 rounded-lg border font-bold text-xs" placeholder="Enter phone number" />
            </div>
            <div>
              <label className="block text-gray-700 font-bold text-xs mb-1">Address</label>
              <textarea value={formData.address} onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))} className="w-full px-3 py-2 rounded-lg border font-bold text-xs min-h-[60px]" placeholder="Enter address" />
            </div>
            <div>
              <label className="block text-gray-700 font-bold text-xs mb-1">Buying Date</label>
              <input type="text" value={new Date().toLocaleString()} readOnly className="w-full px-3 py-2 rounded-lg border bg-gray-100 font-bold text-xs" />
              <span className="text-xs text-gray-500">(Will be saved automatically)</span>
            </div>
            <button type="submit" disabled={loading || initialLoading} className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 disabled:bg-green-400 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-2xl">
              {loading || initialLoading ? 'Processing...' : 'Purchase'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
