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
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: "250px" }}
          data-ad-format="fluid"
          data-ad-layout-key="-6j+cn+1d-2g+cj"
          data-ad-client="ca-pub-7739465360112931"
          data-ad-slot="3230443150"
        />
      </div>
    </div>
  );
};

export default AdFeedIn; 