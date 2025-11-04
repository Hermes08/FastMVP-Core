// src/components/SeoImage.tsx
import React from "react";

export default function SeoImage({ url, alt }) {
  return (
    <>
      <meta property="og:image" content={url} />
      <meta property="og:image:alt" content={alt} />
      <meta name="twitter:image" content={url} />
      <meta name="twitter:image:alt" content={alt} />
    </>
  );
}
