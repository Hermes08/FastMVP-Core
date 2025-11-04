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

  // Generate dynamic alt text and caption
  const dynamicAltText = altText || `${searchQuery} - Professional stock photo`;
  const generatedCaption = caption || `Image illustrating ${searchQuery}`;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=1`,
          {
            headers: {
              Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY || '',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.photos && data.photos.length > 0) {
          setImageData(data.photos[0]);
        } else {
          setError('No images found for this search query');
        }
      } catch (err) {
        console.error('Error fetching Pexels image:', err);
        setError('Failed to load image from Pexels');
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchImage();
    }
  }, [searchQuery]);

  // Loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-pulse">
          <div
            className="bg-gray-200"
            style={{ width: `${width}px`, height: `${height}px` }}
          />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
        <div className="text-red-600 mb-2">⚠️</div>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  // No image data
  if (!imageData) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <p className="text-sm text-gray-600">No image available</p>
      </div>
    );
  }

  // Render image
  return (
    <figure className={className}>
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
