import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { dentalLoadingAnimation } from '../../data/lottieAnimations';

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-navy flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Lottie dental loading animation */}
            <div className="w-24 h-24 mx-auto mb-4">
              <Lottie
                animationData={dentalLoadingAnimation}
                loop
                className="w-full h-full"
              />
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-heading text-2xl font-bold text-white mb-2"
            >
              Everyday Dental Surgery
            </motion.h2>

            {/* Animated progress bar */}
            <div className="w-48 h-1 bg-white/10 rounded-full mx-auto mt-4 overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                className="h-full rounded-full progress-bar"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-teal-300 mt-4 text-sm font-medium"
            >
              Crafting Healthy Smiles...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
