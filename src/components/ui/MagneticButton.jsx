import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Magnetic button that subtly pulls toward cursor on hover
 */
const MagneticButton = ({ children, to, href, className = '', strength = 0.3, ...props }) => {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    setOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const style = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: offset.x === 0 ? 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'transform 0.15s ease-out',
  };

  const Tag = to ? Link : href ? 'a' : 'button';
  const linkProps = to ? { to } : href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={className}
      {...linkProps}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default MagneticButton;
