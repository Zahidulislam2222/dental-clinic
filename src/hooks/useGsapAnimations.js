import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP text split & stagger reveal animation
 * Splits text into words/chars and animates them in
 */
export const useTextReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { splitBy = 'words', delay = 0, duration = 0.8, stagger = 0.06, trigger = false } = options;

    const text = el.textContent;
    el.innerHTML = '';

    const units = splitBy === 'chars' ? text.split('') : text.split(/\s+/);

    units.forEach((unit, i) => {
      const span = document.createElement('span');
      span.textContent = unit + (splitBy === 'words' ? ' ' : '');
      span.style.display = 'inline-block';
      span.style.overflow = 'hidden';

      const inner = document.createElement('span');
      inner.textContent = unit + (splitBy === 'words' ? ' ' : '');
      inner.style.display = 'inline-block';
      inner.style.transform = 'translateY(110%)';
      inner.className = 'text-reveal-unit';

      span.innerHTML = '';
      span.appendChild(inner);
      el.appendChild(span);
    });

    const inners = el.querySelectorAll('.text-reveal-unit');

    const animConfig = {
      y: 0,
      duration,
      stagger,
      ease: 'power3.out',
      delay,
    };

    if (trigger) {
      gsap.to(inners, {
        ...animConfig,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    } else {
      gsap.to(inners, animConfig);
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  return ref;
};

/**
 * GSAP scroll-triggered fade-up reveal
 */
export const useScrollReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { y = 60, duration = 1, delay = 0, start = 'top 85%' } = options;

    gsap.fromTo(el,
      { y, opacity: 0, filter: 'blur(8px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  return ref;
};

/**
 * GSAP parallax effect on scroll
 */
export const useParallax = (speed = 0.3) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      y: () => speed * 200,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [speed]);

  return ref;
};

/**
 * GSAP stagger children reveal on scroll
 */
export const useStaggerReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { stagger = 0.1, y = 50, duration = 0.8, childSelector = ':scope > *' } = options;
    const children = el.querySelectorAll(childSelector);

    gsap.fromTo(children,
      { y, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  return ref;
};

/**
 * Counter flip animation
 */
export const useCounterFlip = (end, options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { duration = 2, decimal = false } = options;
    const obj = { val: 0 };

    gsap.to(obj, {
      val: end,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      onUpdate: () => {
        el.textContent = decimal
          ? (obj.val / 10).toFixed(1)
          : Math.floor(obj.val).toLocaleString();
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [end]);

  return ref;
};
