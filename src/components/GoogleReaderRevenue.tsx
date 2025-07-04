'use client';

import Script from 'next/script';

export default function GoogleReaderRevenue() {
  return (
    <>
      <Script
        src="https://news.google.com/swg/js/v1/swg-basic.js"
        strategy="afterInteractive"
      />
      <Script id="google-reader-revenue" strategy="afterInteractive">
        {`
          (self.SWG_BASIC = self.SWG_BASIC || []).push( basicSubscriptions => {
            basicSubscriptions.init({
              type: "NewsArticle",
              isPartOfType: ["Product"],
              isPartOfProductId: "CAow8e-2Cw:openaccess",
              clientOptions: { theme: "light", lang: "tr" },
            });
          });
        `}
      </Script>
    </>
  );
} 