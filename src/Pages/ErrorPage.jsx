import { motion } from 'framer-motion';
import { Link, useRouteError } from 'react-router-dom';
import { 
  FiHome, 
  FiRefreshCw, 
  FiArrowLeft, 
  FiAlertTriangle,
  FiWifi,
  FiServer,
  FiLock,
  FiHeart
} from 'react-icons/fi';

const ErrorPage = () => {
  const error = useRouteError();
  
  // Determine error type and details
  const getErrorDetails = () => {
    const status = error?.status || 404;
    
    switch (status) {
      case 404:
        return {
          code: '404',
          title: 'Page Not Found',
          message: "Oops! The delicious page you're looking for seems to have been eaten by our hungry servers.",
          icon: FiAlertTriangle,
          color: 'text-amber-500',
          bgColor: 'bg-amber-50',
          buttonText: 'Back to Home'
        };
      case 403:
        return {
          code: '403',
          title: 'Access Forbidden',
          message: "Sorry, this kitchen area is restricted. You don't have permission to access this recipe.",
          icon: FiLock,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          buttonText: 'Go Home'
        };
      case 500:
        return {
          code: '500',
          title: 'Server Error',
          message: "Our kitchen servers are having a tough time cooking up this page. Please try again later.",
          icon: FiServer,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          buttonText: 'Try Again'
        };
      case 503:
        return {
          code: '503',
          title: 'Service Unavailable',
          message: "We're temporarily closed for maintenance. Our chefs are working hard to serve you better!",
          icon: FiWifi,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          buttonText: 'Refresh Page'
        };
      default:
        return {
          code: status.toString(),
          title: 'Something Went Wrong',
          message: "We encountered an unexpected error while preparing your digital meal. Our team is on it!",
          icon: FiAlertTriangle,
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          buttonText: 'Go Home'
        };
    }
  };

  const errorDetails = getErrorDetails();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="h-screen bg-slate-50 font-sans flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent"></div>
      </div>

      <div className="w-full px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto"
        >
          {/* Status Icon - Compact */}
          <motion.div
            variants={itemVariants}
            className="mb-4"
          >
            <motion.div
              variants={pulseVariants}
              animate="animate"
              className={`inline-flex items-center justify-center w-16 h-16 ${errorDetails.bgColor} rounded-full shadow-lg mb-4`}
            >
              <errorDetails.icon className={`w-8 h-8 ${errorDetails.color}`} />
            </motion.div>
          </motion.div>

          {/* Error Code with GIF Background - Compact Version */}
          <motion.div
            variants={itemVariants}
            className="mb-4"
          >
            <div className="relative">
              {/* GIF Background - Reduced Height */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="h-[350px] bg-center bg-no-repeat bg-cover flex items-center justify-center rounded-xl shadow-xl overflow-hidden"
                style={{
                  backgroundImage: `url('/currentShort.gif')`,
                }}
              >
                {/* Error Code Overlay */}
                <motion.h1 
                  className="text-5xl md:text-6xl font-bold text-white font-heading leading-none drop-shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{
                    textShadow: '4px 4px 8px rgba(0,0,0,0.8), -2px -2px 4px rgba(255,255,255,0.1)'
                  }}
                >
                  {errorDetails.code}
                </motion.h1>
              </motion.div>
            </div>
          </motion.div>

          {/* Error Title - Compact */}
          <motion.div
            variants={itemVariants}
            className="mb-3"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-heading">
              {errorDetails.title}
            </h2>
          </motion.div>

          {/* Error Message - Compact */}
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <p className="text-base text-gray-600 leading-relaxed max-w-lg mx-auto">
              {errorDetails.message}
            </p>
          </motion.div>

          {/* Action Buttons - Compact */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/"
                className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiHome className="w-4 h-4" />
                <span>{errorDetails.buttonText}</span>
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="inline-flex items-center space-x-2 bg-white text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </motion.button>
          </motion.div>

          {/* Help Text - Compact */}
          <motion.div
            variants={itemVariants}
          >
            <motion.div className="flex justify-center items-center space-x-2 text-gray-400">
              <span className="text-sm">Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <FiHeart className="w-3 h-3 text-red-500" />
              </motion.div>
              <span className="text-sm">Mostafijur Ruman</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ErrorPage;