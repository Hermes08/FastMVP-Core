'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface PexelsImageProps {
  searchQuery: string;
  caption?: string;
  altText?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down';
}

interface PexelsPhoto {
  id: number;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
  };
  photographer: string;
  photographer_url: string;
  alt: string;
}

const PexelsImage: React.FC<PexelsImageProps> = ({
  searchQuery,
  caption,
  altText,
  width = 800,
  height = 600,
  priority = false,
  className = '',
  objectFit = 'cover',
}) => {
  const [imageData, setImageData] = useState<PexelsPhoto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedCaption, setGeneratedCaption] = useState<string>('');
  const [dynamicAltText, setDynamicAltText] = useState<string>('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
        if (!apiKey) {
          throw new Error('Pexels API key not configured');
        }

        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=1`,
          {
            headers: {
              Authorization: apiKey,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Pexels API error: ${response.status}`);
        }

        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          const photo = data.photos[0];
          setImageData(photo);

          // Generar alt text dinámico
          const dynamicAlt =
            altText ||
            `${photo.alt || searchQuery} - Photo by ${photo.photographer}`;
          setDynamicAltText(dynamicAlt);

          // Generar caption automático
          const autoCaption =
            caption ||
            `${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)} - Photography by ${photo.photographer}`;
          setGeneratedCaption(autoCaption);
        } else {
          throw new Error('No images found for the search query');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Error fetching image:', err);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchImage();
    }
  }, [searchQuery, altText, caption]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`} style={{ width, height }}>
        <div className="text-gray-600">Loading image...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-100 ${className}`} style={{ width, height }}>
        <div className="text-red-600 text-center">
          <p>Error loading image</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!imageData) {
    return null;
  }

  return (
    <figure className={`w-full ${className}`}>
      <div
        className="relative overflow-hidden bg-gray-100"
        style={{
          width: '100%',
          aspectRatio: `${width} / ${height}`,
        }}
      >
        <Image
          src={imageData.src.large}
          alt={dynamicAltText}
          title={dynamicAltText}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            objectFit: objectFit,
            objectPosition: 'center',
          }}
          priority={priority}
          quality={85}
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setError('Failed to load image from Pexels')}
        />
      </div>
      {generatedCaption && (
        <figcaption className="text-sm text-gray-600 mt-2 text-center">
          {generatedCaption}
        </figcaption>
      )}
      <p className="text-xs text-gray-500 mt-1 text-center">
        <a
          href={imageData.photographer_url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 underline"
        >
          Photo by {imageData.photographer}
        </a>
        {' '}on{' '}
        <a
          href="https://www.pexels.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 underline"
        >
          Pexels
        </a>
      </p>
    </figure>
  );
};

export default PexelsImage;
