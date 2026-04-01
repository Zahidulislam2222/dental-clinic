import { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

/**
 * Magnetic button that subtly pulls toward cursor on hover
 * Now with: shine sweep, bite press, mouthwash ripple, optional sparkle + glow
 */
const MagneticButton = ({
  children, to, href, className = '', strength = 0.3,
  glow = false, sparkle = false, ...props
}) => {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);

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

  const handleClick = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height);
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, size, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
  }, []);

  const style = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: offset.x === 0 ? 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'transform 0.15s ease-out',
  };

  const effectClasses = `btn-shine btn-bite btn-ripple ${glow ? 'btn-glow' : ''} ${sparkle ? 'btn-sparkle btn-micro-sparkles' : ''}`;

  const Tag = to ? Link : href ? 'a' : 'button';
  const linkProps = to ? { to } : href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={style}
      className={`${effectClasses} ${className}`}
      {...linkProps}
      {...props}
    >
      {/* Ripple circles */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple-circle"
          style={{
            left: r.x - r.size / 2,
            top: r.y - r.size / 2,
            width: r.size,
            height: r.size,
          }}
        />
      ))}
      {/* Micro sparkles for CTA buttons */}
      {sparkle && (
        <>
          <span className="micro-sparkle" />
          <span className="micro-sparkle" />
          <span className="micro-sparkle" />
        </>
      )}
      {/* Content */}
      <span className="relative z-[2]">{children}</span>
    </Tag>
  );
};

export default MagneticButton;
