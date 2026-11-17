'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
export default function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { try { if (!localStorage.getItem('pz-consent')) setShow(true); } catch (e) {} }, []);
  const set = (v) => { try { localStorage.setItem('pz-consent', v); } catch (e) {} if (window.gtag) { const g = v === 'yes' ? 'granted' : 'denied'; window.gtag('consent', 'update', { ad_storage: g, analytics_storage: g, ad_user_data: g, ad_personalization: g }); } setShow(false); };
  if (!show) return null;
  return (
    <div className="cookie" role="dialog" aria-label="Cookie consent">
      <p>We use cookies for analytics and, once enabled, for ads. You can accept or decline; the site works either way. See our <Link href="/privacy-policy">privacy policy</Link>.</p>
      <button className="btn btn-sm" onClick={() => set('no')}>Decline</button>
      <button className="btn btn-primary btn-sm" onClick={() => set('yes')}>Accept</button>
    </div>
  );
}
