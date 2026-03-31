import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, padding = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -8, boxShadow: '0 20px 60px -15px rgba(0, 191, 166, 0.25)' } : {}}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${padding ? 'p-6 md:p-8' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
