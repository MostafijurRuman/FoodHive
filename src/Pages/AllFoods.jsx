import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTag, FiTrendingUp, FiMapPin, FiPackage,FiSearch } from 'react-icons/fi';
import useTitle from '../hooks/useTitle';
import axiosNormal from '../Api/AxiosNormal';
const _MOTION = motion;
const AllFoods = () => {
  useTitle('All Foods | FoodHive');
  const [foods, setFoods] = useState([]);
  const [allFoods,setAllFoods]=useState(0);
  const [currentPage,setCurrentPage]=useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query,setQuery]=useState('')

  
  

 
// For Pagination
  const limit = 9; //for show how many foods per page
  const totalPages = Math.ceil(allFoods / limit);
  const pages = [...Array(totalPages).keys()]
  
  useEffect(() => {
    setLoading(true);
    setError('');
    axiosNormal.get("/foods", {
    params: {
    page: currentPage,
    limit: limit,
    search: query,   // empty string = no search
    }
    })
    .then(res => {
      setFoods(res.data.filteredFood);
      setAllFoods(res.data.total); // use for pagination buttons
      console.log(res.data)
    })
      .catch((err) => {
        console.error('Failed to load foods', err);
      })
      .finally(() => setLoading(false));
      
  }, [currentPage, query]);

  const handelPrevious = () =>{
    if(currentPage > 1){
      const prv = (currentPage-1);
      setCurrentPage(prv)
    }
  }
  const handelNext = () =>{
    if(currentPage < totalPages){
      const prv = (currentPage+1);
      setCurrentPage(prv)
    }
  }
  
   // Framer Motion animation
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.35 } },
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Page Title banner */}
      <section className="relative">
        <div
          className="h-56 md:h-72 w-full bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1920&h=600&dpr=1')",
          }}
        >
          <div className="h-full w-full bg-black/50 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                All <span className="text-green-400">Foods</span>
              </h1>
              <p className="mt-3 text-white/90">Browse every item from our partner restaurants</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
        <section className="bg-white py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
          <FiSearch className="text-gray-500 text-xl" />
          <input 
            onChange={(e)=>setQuery(e.target.value)} 
            type="search" 
            className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-500" 
            required 
            placeholder="Search by name" 
          />
            </div>
            {query && (
          <p className="text-sm text-gray-500 mt-2">Showing results for "{query}"</p>
            )}
          </div>
        </section>

        {/* Grid */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="visible"
        className="py-10 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* States */}
                {loading && foods.length === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-1" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>
                  ))}
                </div>
                )}
                
                {error && !loading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="text-red-500 mb-4">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
                  <p className="text-gray-600 text-center max-w-md">{error}</p>
                  <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                  Try Again
                  </button>
                </div>
                )}
                
                {!loading && !error && foods.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="text-gray-400 mb-4">
                  <FiSearch className="w-16 h-16" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Foods Found</h3>
                  <p className="text-gray-500 text-center max-w-md mb-6">
                  {query 
                    ? `We couldn't find any foods matching "${query}". Try adjusting your search.`
                    : "No foods are available at the moment. Check back later!"
                  }
                  </p>
                  {query && (
                  <button 
                    onClick={() => setQuery('')}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <FiPackage className="w-4 h-4" />
                    Show All Foods
                  </button>
                  )}
                </div>
                )}

          {/* Cards */}
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" variants={container}>
            {foods.map((food) => {
              const qty = food.quantityAvailable ?? 0;
              return (
                <motion.div
                  key={food._id}
                  variants={item}
                  className="group relative bg-white/90 border border-gray-200 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-transform duration-300 will-change-transform hover:-translate-y-1 overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                    <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                      {food.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        {food.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-green-700 font-bold">
                        <FiTag /> ${food.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{food.description}</p>
                    <div className="h-px bg-gray-100 my-4" />
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="inline-flex items-center gap-2">
                        <FiMapPin className="text-green-600" />
                        <span>{food.originCountry || '—'}</span>
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <FiPackage className="text-green-600" />
                        <span>Qty: {qty}</span>
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <FiTrendingUp className="text-green-600" />
                        <span>{food.purchaseCount || 0} sold</span>
                      </div>
                    </div>
                    <Link
                      to={`/food-details/${food._id}`}
                      className="w-full inline-flex justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors text-center shadow-sm group-hover:shadow"
                    >
                      View Details
                    </Link>
                  </div>
        </motion.div>
              );
            })}
      </motion.div>
      {/* Pagination Button creation*/}
      {!loading && !error && foods.length > 0 && allFoods > limit && (
            <div className="join flex justify-center  mt-12">
        <button onClick={()=>handelPrevious()} disabled={currentPage === 1 || loading} className="join-item btn btn-outline">Previous</button>
            {pages.map(page => <button key={page} onClick={()=>setCurrentPage(page+1)} className={`btn btn-square ${currentPage === page + 1 ? 'bg-green-600 text-white' : ''}`}>{page+1}</button>)}
        <button onClick={()=>handelNext()}  disabled={currentPage === totalPages || loading} className="join-item btn btn-outline">Next</button>
      </div>
          )}
      

        </div>
      </motion.section>
    </div>
  );
};

export default AllFoods;
