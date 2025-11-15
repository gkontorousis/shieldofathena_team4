import React, { useState, useEffect } from 'react';
import { getTotalDonations } from '../services/firestore';
import './PixelatedImage.css';

function PixelatedImage() {
  const [pixelsRevealed, setPixelsRevealed] = useState(500);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    fetchTotalDonations();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1000&h=1000&fit=crop';
    img.onload = () => {
      setImageLoaded(true);
      processImage(img);
    };
  }, []);

  const fetchTotalDonations = async () => {
    try {
      const data = await getTotalDonations();
      setPixelsRevealed(data.pixels_revealed);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const processImage = (img) => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 100, 100);
    const imageData = ctx.getImageData(0, 0, 100, 100);
    setImageData(imageData);
  };

  const renderPixelatedImage = () => {
    if (!imageData) return null;

    const pixels = [];
    const totalPixels = 10000;
    const pixelSize = 5;

    for (let i = 0; i < totalPixels; i++) {
      const x = i % 100;
      const y = Math.floor(i / 100);
      const index = (y * 100 + x) * 4;
      
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      const a = imageData.data[index + 3];

      const isRevealed = i < pixelsRevealed;
      const color = isRevealed 
        ? `rgba(${r}, ${g}, ${b}, ${a / 255})`
        : '#cccccc';

      pixels.push(
        <div
          key={i}
          className="pixel"
          style={{
            left: `${x * pixelSize}px`,
            top: `${y * pixelSize}px`,
            width: `${pixelSize}px`,
            height: `${pixelSize}px`,
            backgroundColor: color,
          }}
        />
      );
    }

    return (
      <div className="pixelated-image-container">
        <div className="pixelated-image" style={{ width: '500px', height: '500px' }}>
          {pixels}
        </div>
        <div className="pixel-progress">
          <p>
            {pixelsRevealed} / 10,000 pixels revealed ({Math.round((pixelsRevealed / 10000) * 100)}%)
          </p>
          <p className="pixel-encouragement">
            Donate $10 to reveal another pixel!
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="pixelated-image-wrapper">
      {imageLoaded ? renderPixelatedImage() : <div>Loading image...</div>}
    </div>
  );
}

export default PixelatedImage;

