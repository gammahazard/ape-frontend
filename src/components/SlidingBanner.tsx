"use client";

import React, { useEffect, useState } from 'react';

const SlidingBanner = () => {
  const [position, setPosition] = useState(0);
  
  const images = [
    { id: 1, url: '/nfts/nft-1.png', alt: 'NFT 1' },
    { id: 2, url: '/nfts/nft-1.png', alt: 'NFT 2' },
    { id: 3, url: '/nfts/nft-1.png', alt: 'NFT 3' },
    { id: 4, url: '/nfts/nft-1.png', alt: 'NFT 4' },
    { id: 5, url: '/nfts/nft-1.png', alt: 'NFT 5' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => prev - 1);
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const bannerStyles = {
    display: 'flex',
    flexDirection: 'row' as const,
    width: 'max-content',
    gap: '2rem',
    transform: `translateX(${position}px)`,
    transition: 'transform 0s linear'
  };

  const containerStyles = {
    width: '95%',
    maxWidth: '1600px',
    height: '400px',
    overflow: 'hidden',
    position: 'relative' as const,
    margin: '0 auto',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)',
    borderRadius: '1.5rem',
    padding: '1rem 0'
  };

  const imageStyles = {
    width: '350px',
    height: '350px',
    flexShrink: 0,
    objectFit: 'cover' as const,
    borderRadius: '1rem',
    boxShadow: '0 4px 30px rgba(0,0,0,0.4)'
  };

  return (
    <div style={containerStyles}>
      <div style={bannerStyles}>
        {images.map((image) => (
          <img
            key={image.id}
            src={image.url}
            alt={image.alt}
            style={imageStyles}
          />
        ))}
        {images.map((image) => (
          <img
            key={`dup-${image.id}`}
            src={image.url}
            alt={image.alt}
            style={imageStyles}
          />
        ))}
      </div>
    </div>
  );
};

export default SlidingBanner;