"use client";
import { useEffect } from "react";

const AdFeedIn = () => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Hata yönetimi (gizli)
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-4" aria-label="Feed İçi Reklam Alanı">
      <div className="w-full max-w-4xl min-h-[250px]">
        {/* Reklam kaldırıldı */}
      </div>
    </div>
  );
};

export default AdFeedIn; 