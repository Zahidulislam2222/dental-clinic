import { useCounter } from '../../hooks/useCounter';
import { motion } from 'framer-motion';

const CounterStat = ({ end, suffix = '', prefix = '', label, labelBn, icon: Icon, decimal = false }) => {
  const { count, ref } = useCounter(end, 2000);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      {Icon && <Icon className="mx-auto mb-2 text-teal" size={28} />}
      <div className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white">
        {prefix}{decimal ? (count / 10).toFixed(1) : count.toLocaleString()}{suffix}
      </div>
      <p className="text-gray-300 mt-1 text-sm md:text-base">{label}</p>
    </motion.div>
  );
};

export default CounterStat;
