import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  FiStar,
  FiTruck,
  FiShield,
  FiHeadphones,
  FiArrowRight,
  FiMapPin,
  FiTrendingUp,
  FiTag,
  FiPackage,
} from "react-icons/fi";
import { BiLeaf } from "react-icons/bi";
import useTitle from "../hooks/useTitle";
import axiosNormal from "../Api/AxiosNormal";

// Mark motion as referenced so strict no-unused-vars linters don’t flag it
const _MOTION_REF = motion;

export default function Home() {
  // Page title
  useTitle("Home | FoodHive");

  // Simple animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.08 },
    },
  };
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  // Top Foods
  const [topFoods, setTopFoods] = useState([]);

  useEffect(() => {
    // Use relative path so Vite proxy can forward to your API in dev and avoid CORS/localhost issues on phones
    axiosNormal
      .get("/top-six-food")
      .then((res) => setTopFoods(res.data))
      .catch((err) => {
        console.error("Failed to load top foods:", err);
        setTopFoods([]);
      });
  }, []);

  // Testimonial data (Pixabay/Pexels images)
  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment:
        "Amazing food quality and super fast delivery! The pizza was still hot when it arrived.",
      image:
        "https://cdn.pixabay.com/photo/2016/03/23/04/01/woman-1274056_1280.jpg",
      location: "Downtown",
    },
    {
      name: "Mike Chen",
      rating: 5,
      comment:
        "Best delivery service in town. Fresh ingredients and excellent customer service!",
      image:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&dpr=2",
      location: "Midtown",
    },
    {
      name: "Emily Davis",
      rating: 4,
      comment:
        "Love the variety of cuisines available. The sushi platter was absolutely perfect!",
      image:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&dpr=2",
      location: "Uptown",
    },
  ];

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
    Italian: "bg-teal-600 text-white",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Banner: Swiper Slider */}
      <section className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop
          className="h-[80vh] md:h-[90vh] hero-swiper"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div
              className="h-full w-full bg-center bg-cover relative"
              style={{
                backgroundImage:
                  "url('https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590_1280.jpg')",
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="visible"
                  className="max-w-4xl"
                >
                  <motion.h1
                    variants={item}
                    className="text-4xl md:text-6xl font-bold text-white mb-4"
                  >
                    Discover Incredible Tastes
                  </motion.h1>
                  <motion.p
                    variants={item}
                    className="text-white/90 text-lg md:text-xl mb-8"
                  >
                    Fresh ingredients, fast delivery, and unforgettable flavors
                    from top restaurants.
                  </motion.p>
                  <motion.div variants={item}>
                    <Link
                      to="/all-foods"
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-lg transition-all duration-300"
                    >
                      Browse All Foods <FiArrowRight />
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div
              className="h-full w-full bg-center bg-cover relative"
              style={{
                backgroundImage:
                  "url('https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1')",
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="visible"
                  className="max-w-4xl"
                >
                  <motion.h2
                    variants={item}
                    className="text-4xl md:text-6xl font-bold text-white mb-4"
                  >
                    Fresh & Fast Delivery
                  </motion.h2>
                  <motion.p
                    variants={item}
                    className="text-white/90 text-lg md:text-xl mb-8"
                  >
                    Get your favorites delivered hot and on time, every time.
                  </motion.p>
                  <motion.div variants={item}>
                    <Link
                      to="/all-foods"
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-lg transition-all duration-300"
                    >
                      Browse All Foods <FiArrowRight />
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <div
              className="h-full w-full bg-center bg-cover relative"
              style={{
                backgroundImage:
                  "url('https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1')",
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="visible"
                  className="max-w-4xl"
                >
                  <motion.h2
                    variants={item}
                    className="text-4xl md:text-6xl font-bold text-white mb-4"
                  >
                    Order Now. Eat Better.
                  </motion.h2>
                  <motion.p
                    variants={item}
                    className="text-white/90 text-lg md:text-xl mb-8"
                  >
                    Handpicked menus that match your mood and moments.
                  </motion.p>
                  <motion.div variants={item}>
                    <Link
                      to="/all-foods"
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-lg transition-all duration-300"
                    >
                      Browse All Foods <FiArrowRight />
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Top Foods (6 items by purchase count) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={item} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our <span className="text-green-600">Top Foods</span>
            </h2>
            <p className="text-gray-600 mt-3">
              Popular picks loved by thousands—curated just for you.
            </p>
          </motion.div>
          {/* Top 6 Food Cards */}
          {topFoods.length > 0 && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {topFoods.map((food) => (
                  <motion.div
                    key={food._id}
                    variants={item}
                    className="group relative bg-white/90 border border-gray-200 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-transform duration-300 will-change-transform hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-full h-68 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                      <span
                        className={` absolute top-3 right-3 shadow-sm px-3 py-1 rounded-full text-sm font-medium ${
                          categoryColors[food.category]
                        }`}
                      >
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
                      <p className="text-sm text-gray-600 mb-3">
                        {food.description}
                      </p>
                      <div className="h-px bg-gray-100 my-4" />
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="inline-flex items-center gap-2">
                          <FiMapPin className="text-green-600" />
                          <span>{food.originCountry}</span>
                        </div>
                        <div className="inline-flex items-center gap-2">
                          <FiPackage className="text-green-600" />
                          <span>Qty: {food.quantityAvailable}</span>
                        </div>
                        <div className="inline-flex items-center gap-2">
                          <FiTrendingUp className="text-green-600" />
                          <span>{food.purchaseCount} sold</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/food-details/${food._id}`}
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors text-center shadow-sm group-hover:shadow"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div variants={item} className="text-center mt-10">
                <Link
                  to="/all-foods"
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-semibold px-6 py-3 rounded-md transition-colors"
                >
                  See All Foods <FiArrowRight />
                </Link>
              </motion.div>{" "}
            </div>
          )}
        </div>
      </motion.section>

      {/* Extra Section 1: Why Choose Us */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={item} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose <span className="text-green-600">FoodHive</span>?
            </h2>
            <p className="text-gray-600 mt-3">
              We bring speed, freshness, and safety together for a delightful
              experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FiTruck,
                title: "Fast Delivery",
                desc: "Get your food in under 30 minutes.",
              },
              {
                icon: BiLeaf,
                title: "Fresh Ingredients",
                desc: "Sourced daily from trusted partners.",
              },
              {
                icon: FiShield,
                title: "Secure Payments",
                desc: "Safe and multiple payment options.",
              },
              {
                icon: FiHeadphones,
                title: "24/7 Support",
                desc: "We’re here whenever you need us.",
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                variants={item}
                className="p-6 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-all text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                  <f.icon className="text-2xl text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {f.title}
                </h3>
                <p className="text-gray-600 mt-2 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Extra Section 2: Testimonials (Carousel) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div variants={item} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              What Our <span className="text-green-600">Customers Say</span>
            </h2>
            <p className="text-gray-600 mt-3">
              Real feedback from our happy customers across the city.
            </p>
          </motion.div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.name}>
                <div className="h-full bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-all">
                  <div className="flex items-center mb-4">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{t.name}</h4>
                      <p className="text-sm text-gray-500">{t.location}</p>
                      <div className="flex mt-1">
                        {[...Array(t.rating)].map((_, i) => (
                          <FiStar key={i} className="text-yellow-500 text-sm" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{t.comment}"</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </motion.section>
      {/* FAQ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
        className="py-16 bg-white"
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.div variants={item} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Frequently Asked <span className="text-green-600">Questions</span>
            </h2>
            <p className="text-gray-600 mt-3">
              Got questions? We've got answers to help you get the most out of
              FoodHive.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: "How fast is your delivery?",
                answer:
                  "We deliver most orders within 30 minutes or less. Delivery times may vary based on distance and peak hours.",
              },
              {
                question: "Do you have minimum order requirements?",
                answer:
                  "Yes, we have a minimum order of $15 for delivery. This helps us maintain quality service and fresh food delivery.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, debit cards, PayPal, Apple Pay, Google Pay, and cash on delivery.",
              },
              {
                question: "Can I track my order in real-time?",
                answer:
                  "Absolutely! Once your order is confirmed, you'll receive a tracking link to monitor your delivery status in real-time.",
              },
              {
                question: "What if my food arrives cold or damaged?",
                answer:
                  "We guarantee hot, fresh food. If there's any issue with your order, contact us immediately and we'll provide a full refund or replacement.",
              },
              {
                question: "Do you offer vegetarian and vegan options?",
                answer:
                  "Yes! We have a wide variety of vegetarian, vegan, and dietary-specific options from our partner restaurants.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={item}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-gray-900 group-open:text-green-600">
                      {faq.question}
                    </h3>
                    <span className="text-gray-500 group-open:rotate-180 transition-transform duration-200">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>

          <motion.div variants={item} className="text-center mt-10">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-md transition-colors"
            >
              Contact Support <FiHeadphones />
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
