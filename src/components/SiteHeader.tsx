'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { products } from '@/content/products';
import { sectors } from '@/content/applications';
import { Wordmark } from './Wordmark';
import { ArrowRight } from './Icons';
import { useCart } from './shop/CartProvider';

const links = [
  { href: '/shop', label: 'Shop' },
  { href: '/applications', label: 'Applications' },
  { href: '/company', label: 'Company' },
  { href: '/service', label: 'Service' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsRef = useRef<HTMLLIElement>(null);
  const { count, ready } = useCart();

  useEffect(() => {
    setMenuOpen(false);
    setProductsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProductsOpen(false);
        setMenuOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (productsRef.current && !productsRef.current.contains(e.target as Node)) setProductsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  const isActive = (href: string) => (href.startsWith('/#') ? false : pathname === href || pathname.startsWith(href + '/'));

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Wordmark />

        <nav className="site-nav" aria-label="Primary">
          <ul>
            <li ref={productsRef} className="site-nav__products">
              <button
                type="button"
                aria-expanded={productsOpen}
                aria-controls="products-menu"
                className={isActive('/products') ? 'is-active' : ''}
                onClick={() => setProductsOpen((o) => !o)}
              >
                Products
                <svg viewBox="0 0 12 8" aria-hidden="true">
                  <path d="M1 1.5l5 5 5-5" />
                </svg>
              </button>
              <div id="products-menu" className="mega" hidden={!productsOpen}>
                <div className="mega__col mega__col--products">
                  <p className="label">Product range</p>
                  <ul>
                    {products.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/products/${p.slug}`}>
                          <span className="mega__idx">{p.index}</span>
                          <span>
                            <span className="mega__name">{p.name}</span>
                            <span className="mega__sum">{p.summary}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mega__col">
                  <p className="label">By application</p>
                  <ul className="mega__apps">
                    {sectors.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/applications#${s.slug}`}>{s.name}</Link>
                      </li>
                    ))}
                  </ul>
                  <Link href="/products" className="link-arrow mega__all">
                    Compare all categories <ArrowRight />
                  </Link>
                </div>
              </div>
            </li>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={isActive(l.href) ? 'is-active' : ''} aria-current={isActive(l.href) ? 'page' : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/cart" className="cart-link" aria-label={ready && count ? `Cart, ${count} ${count === 1 ? 'item' : 'items'}` : 'Cart'}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M2 3h2.2l2 10h9.3l1.8-7H5.3" />
            <circle cx="8" cy="16.5" r="1.3" />
            <circle cx="14.5" cy="16.5" r="1.3" />
          </svg>
          {ready && count > 0 && <span className="cart-link__count">{count > 99 ? '99+' : count}</span>}
        </Link>

        <Link href="/contact#enquiry" className="btn btn--primary site-header__cta">
          Request a quote
        </Link>

        <button type="button" className="menu-btn" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((o) => !o)}>
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          <span className="menu-btn__bars" aria-hidden="true" />
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!menuOpen}>
        <nav aria-label="Mobile" className="container">
          <p className="label">Products</p>
          <ul className="mobile-menu__products">
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={`/products/${p.slug}`}>
                  <span className="mega__idx">{p.index}</span> {p.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/products">All products</Link>
            </li>
          </ul>
          <ul className="mobile-menu__links">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setMenuOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact#enquiry" className="btn btn--primary" onClick={() => setMenuOpen(false)}>
            Request a quote <ArrowRight />
          </Link>
        </nav>
      </div>
    </header>
  );
}
