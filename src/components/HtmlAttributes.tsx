"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function HtmlAttributes() {
  const pathname = usePathname();

  useEffect(() => {
    const lang = pathname?.split('/')[1] || 'en';
    const isRTL = lang === 'ar';
    
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [pathname]);

  return null;
}