"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type GoogleAdProps = {
  adSlot: string;
  className?: string;
};

const AD_CLIENT = "ca-pub-3741756679011128";

export default function GoogleAd({ adSlot, className = "" }: GoogleAdProps) {
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    const ins = insRef.current;
    if (!ins) return;

    const status = ins.getAttribute("data-adsbygoogle-status");
    if (status === "done" || ins.innerHTML.trim() !== "") return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, [adSlot]);

  return (
    <div className={className}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
