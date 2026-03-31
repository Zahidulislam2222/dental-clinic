import { useEffect, useRef } from 'react';

/**
 * Teal glow that follows cursor within a container
 */
const CursorGlow = ({ containerRef }) => {
  const glowRef = useRef(null);

  useEffect(() => {
    const container = containerRef?.current;
    const glow = glowRef.current;
    if (!container || !glow) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.opacity = '1';
      glow.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
    };

    const handleMouseLeave = () => {
      glow.style.opacity = '0';
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [containerRef]);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none absolute w-[400px] h-[400px] rounded-full opacity-0 transition-opacity duration-300"
      style={{
        background: 'radial-gradient(circle, rgba(0,191,166,0.12) 0%, rgba(0,191,166,0.04) 40%, transparent 70%)',
        willChange: 'transform',
      }}
    />
  );
};

export default CursorGlow;
