const Badge = ({ children, variant = 'teal', className = '' }) => {
  const variants = {
    teal: 'bg-teal/10 text-teal border-teal/20',
    gold: 'bg-gold/10 text-gold border-gold/20',
    navy: 'bg-navy/10 text-navy border-navy/20',
    white: 'bg-white/20 text-white border-white/30',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
