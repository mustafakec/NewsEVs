"use client";
import { useEffect } from "react";

const AdHorizontal = () => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Hata yönetimi (gizli)
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-4" aria-label="Reklam Alanı">
      <div className="w-full max-w-4xl min-h-[90px]">
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: "90px" }}
          data-ad-client="ca-pub-7739465360112931"
          data-ad-slot="3498886529"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

export default AdHorizontal; 