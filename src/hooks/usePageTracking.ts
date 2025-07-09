'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/utils/analytics';

export const usePageTracking = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    setHasConsent(consent === 'accepted');
  }, []);

  useEffect(() => {
    if (hasConsent) {
      const url = pathname + searchParams.toString();
      pageview(url);
    }
  }, [pathname, searchParams, hasConsent]);
}; 