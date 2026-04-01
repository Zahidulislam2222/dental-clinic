import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-teal text-white hover:bg-teal-600 shadow-lg hover:shadow-teal/30',
  outline: 'border-2 border-teal text-teal hover:bg-teal hover:text-white',
  navy: 'bg-navy text-white hover:bg-navy-400',
  gold: 'bg-gold text-navy hover:bg-gold-300',
  ghost: 'text-teal hover:bg-teal/10',
  white: 'bg-white text-navy hover:bg-gray-100 shadow-lg',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const Button = ({
  children, variant = 'primary', size = 'md', pulse = false,
  to, href, className = '', icon: Icon, iconRight: IconRight,
  loading = false, disabled = false, ...props
}) => {
  const baseClasses = `btn-shine btn-bite font-heading font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${pulse ? 'btn-glow' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  const content = (
    <span className="relative z-[2] inline-flex items-center gap-2">
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />
      ) : null}
      {children}
      {IconRight && <IconRight size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
    </span>
  );

  if (to) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
        <Link to={to} className={baseClasses} {...props}>{content}</Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
        <a href={href} className={baseClasses} target="_blank" rel="noopener noreferrer" {...props}>{content}</a>
      </motion.div>
    );
  }

  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} className={baseClasses} disabled={disabled || loading} {...props}>
      {content}
    </motion.button>
  );
};

export default Button;
