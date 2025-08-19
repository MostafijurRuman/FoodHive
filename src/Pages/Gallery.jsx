import React, { useMemo, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { motion } from 'framer-motion';
import useTitle from '../hooks/useTitle';
const _MOTION_REF_GALLERY = motion;

const Gallery = () => {
  useTitle('Gallery | FoodHive');

  // Curated, reliable images (Pexels/Pixabay)
  const images = useMemo(
    () => [
      // Landscape
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1600&dpr=1',
      'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=1600&dpr=1',
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600&dpr=1',
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1600&dpr=1',
      'https://images.pexels.com/photos/616404/pexels-photo-616404.jpeg?auto=compress&cs=tinysrgb&w=1600&dpr=1',
      'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg',
      // Portrait for masonry variety
      'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&dpr=1',
      'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&dpr=1',
      // More food
      'https://cdn.pixabay.com/photo/2017/10/15/11/41/sushi-2853382_1280.jpg',
      'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1600&dpr=1',
      'https://images.pexels.com/photos/1639563/pexels-photo-1639563.jpeg?auto=compress&cs=tinysrgb&w=1600&dpr=1',
      'https://images.pexels.com/photos/4109128/pexels-photo-4109128.jpeg?auto=compress&cs=tinysrgb&w=1600&dpr=1',
    ],
    []
  );

  const variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } }),
  };

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header with background image */}
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
                Gallery
              </h1>
              <p className="mt-3 text-white/90">Explore delicious moments from FoodHive</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 [column-fill:_balance]">
            {images.map((src, i) => (
              <motion.button
                key={src}
                type="button"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={variants}
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
                className="group relative mb-4 break-inside-avoid w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_6px_18px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all"
                aria-label={`Open image ${i + 1} in lightbox`}
              >
                <img
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((src) => ({ src }))}
        carousel={{ finite: false }}
        controller={{ closeOnBackdropClick: true }}
      />
    </div>
  );
};

export default Gallery;

