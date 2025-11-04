// src/components/SeoSchema.tsx
import React from "react";

export default function SeoSchema({ title, description }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: title,
    description
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
