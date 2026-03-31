import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const SectionHeading = ({ title, titleBn, subtitle, subtitleBn, centered = true, light = false }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''}`}
    >
      <h2 className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${light ? 'text-white' : 'text-navy'}`}>
        {t({ en: title, bn: titleBn || title })}
      </h2>
      {subtitle && (
        <p className={`text-lg md:text-xl max-w-2xl ${centered ? 'mx-auto' : ''} ${light ? 'text-gray-300' : 'text-gray'}`}>
          {t({ en: subtitle, bn: subtitleBn || subtitle })}
        </p>
      )}
      <div className={`mt-4 h-1 w-20 rounded-full bg-teal ${centered ? 'mx-auto' : ''}`} />
    </motion.div>
  );
};

export default SectionHeading;
