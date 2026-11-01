'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** Adds `is-visible` to `.reveal` elements as they enter the viewport. Content stays visible without JS. */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add('is-visible');
      else io.observe(el);
    });
    root.classList.add('reveal-ready');
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
