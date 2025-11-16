import React, { useState, useEffect, useRef, useCallback } from "react";
import { DotButton, useDotButton } from "./MosaicDotButton";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./MosaicArrowButton";
import useEmblaCarousel from "embla-carousel-react";
import { getTotalDonations } from "../../../services/firestore.js";

const PIXELS_PER_IMAGE = 100; // 10x10 grid
const COST_PER_PIXEL = 10; // $10 per pixel
const TOTAL_COST_PER_IMAGE = PIXELS_PER_IMAGE * COST_PER_PIXEL; // $1000
const GRID_SIZE = 10;
const CANVAS_SIZE = 500; // size (px) for each square canvas

const MosaicFrame = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [totalDonations, setTotalDonations] = useState(0);
  const [processedImages, setProcessedImages] = useState([]);
  const canvasRefs = useRef([]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  // 1. Fetch total donations from Firestore
  // useEffect(() => {
  //   const fetchDonations = async () => {
  //     try {
  //       const data = await getTotalDonations();
  //       const amount = data?.total_amount;

  //       // If there is no valid amount, fallback to 1250 for POC
  //       if (typeof amount === "number" && !Number.isNaN(amount) && amount > 0) {
  //         setTotalDonations(amount);
  //       } else {
  //         setTotalDonations(1250); // example 1250
  //       }
  //     } catch (error) {
  //       console.error("Error fetching donations:", error);
  //       setTotalDonations(1250); // also fallback
  //     }
  //   };

  //   fetchDonations();
  //   const interval = setInterval(fetchDonations, 30000);
  //   return () => clearInterval(interval);
  // }, []);
  useEffect(() => {
    // test mosaic
    setTotalDonations(1250);
  }, []);

  // 2. Auto choose slide based on totalDonations
  useEffect(() => {
    if (totalDonations > 0 && emblaApi) {
      const currentImageIndex = Math.floor(
        totalDonations / TOTAL_COST_PER_IMAGE
      );
      const targetSlide = Math.min(currentImageIndex, slides.length - 1);

      emblaApi.scrollTo(targetSlide);
    }
  }, [totalDonations, emblaApi, slides.length]);

  // 3. Load images + create 2 canvas offscreen: original & blurred
  useEffect(() => {
    const loadImages = async () => {
      const processed = await Promise.all(
        slides.map((slide) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = slide.url;

            img.onload = () => {
              const size = Math.min(img.width, img.height);
              const sx = (img.width - size) / 2;
              const sy = (img.height - size) / 2;

              // Canvas original (sharp)
              const origCanvas = document.createElement("canvas");
              origCanvas.width = CANVAS_SIZE;
              origCanvas.height = CANVAS_SIZE;
              const origCtx = origCanvas.getContext("2d");
              origCtx.drawImage(
                img,
                sx,
                sy,
                size,
                size,
                0,
                0,
                CANVAS_SIZE,
                CANVAS_SIZE
              );

              // Canvas blurred
              const blurCanvas = document.createElement("canvas");
              blurCanvas.width = CANVAS_SIZE;
              blurCanvas.height = CANVAS_SIZE;
              const blurCtx = blurCanvas.getContext("2d");
              blurCtx.filter = "blur(12px)"; // adjust blur amount
              blurCtx.drawImage(origCanvas, 0, 0);

              resolve({
                name: slide.name,
                url: slide.url,
                origCanvas,
                blurCanvas,
              });
            };

            img.onerror = () => {
              console.error(`Failed to load image: ${slide.url}`);
              resolve(null);
            };
          });
        })
      );

      setProcessedImages(processed.filter(Boolean));
    };

    if (slides.length > 0) {
      loadImages();
    }
  }, [slides]);

  // 4. Calculate pixels revealed for each slide (memoized)
  const getPixelsRevealedForSlide = useCallback(
    (slideIndex) => {
      const totalPixelsRevealed = Math.floor(totalDonations / COST_PER_PIXEL);
      const pixelsBeforeThisSlide = slideIndex * PIXELS_PER_IMAGE;
      const pixelsForThisSlide = totalPixelsRevealed - pixelsBeforeThisSlide;

      return Math.max(0, Math.min(PIXELS_PER_IMAGE, pixelsForThisSlide));
    },
    [totalDonations]
  );

  // 5. Draw mosaic blur + sharp tiles on canvas whenever donations / images change
  useEffect(() => {
    processedImages.forEach((slide, index) => {
      const canvas = canvasRefs.current[index];
      if (!canvas || !slide) return;

      const ctx = canvas.getContext("2d");
      const { origCanvas, blurCanvas } = slide;

      const width = CANVAS_SIZE;
      const height = CANVAS_SIZE;
      canvas.width = width;
      canvas.height = height;

      const tileW = width / GRID_SIZE;
      const tileH = height / GRID_SIZE;

      // Base: draw full blurred image
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(blurCanvas, 0, 0, width, height);

      const pixelsRevealed = getPixelsRevealedForSlide(index);

      // Overlay: draw each sharp tile (original) for revealed pixels
      for (let i = 0; i < pixelsRevealed; i++) {
        const x = i % GRID_SIZE;
        const y = Math.floor(i / GRID_SIZE);

        ctx.drawImage(
          origCanvas,
          x * tileW,
          y * tileH,
          tileW,
          tileH,
          x * tileW,
          y * tileH,
          tileW,
          tileH
        );
      }

      // Optional: draw faint grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx <= GRID_SIZE; gx++) {
        ctx.beginPath();
        ctx.moveTo(gx * tileW, 0);
        ctx.lineTo(gx * tileW, height);
        ctx.stroke();
      }
      for (let gy = 0; gy <= GRID_SIZE; gy++) {
        ctx.beginPath();
        ctx.moveTo(0, gy * tileH);
        ctx.lineTo(width, gy * tileH);
        ctx.stroke();
      }
    });
  }, [processedImages, getPixelsRevealedForSlide]);

  // 6. Component render canvas + overlay text
  const renderBlurMosaicCanvas = (slide, index) => {
    const pixelsRevealed = getPixelsRevealedForSlide(index);

    return (
      <div className="pixelated-canvas-wrapper">
        <canvas
          ref={(el) => {
            if (el) {
              canvasRefs.current[index] = el;
            }
          }}
          style={{
            display: "block",
            maxWidth: "100%",
            height: "auto",
          }}
        />

        <div className="pixel-progress-overlay">
          <div className="pixel-count">
            {pixelsRevealed} / {PIXELS_PER_IMAGE} tiles revealed
          </div>
          <div className="pixel-percentage">
            {Math.round((pixelsRevealed / PIXELS_PER_IMAGE) * 100)}% complete
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="embla">
      {/* Total Progress Bar */}
      <div
        style={{
          marginBottom: "30px",
          textAlign: "center",
          padding: "0 20px",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            marginBottom: "12px",
            color: "#a493b5",
            fontWeight: "600",
          }}
        >
          Total Progress: ${totalDonations.toLocaleString()}
        </h3>
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            height: "12px",
            background: "#e0e0e0",
            borderRadius: "6px",
            overflow: "hidden",
            margin: "0 auto",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #a493b5, #b8a9c7)",
              width: `${Math.min(
                (totalDonations /
                  (TOTAL_COST_PER_IMAGE * Math.max(slides.length, 1))) *
                  100,
                100
              )}%`,
              transition: "width 0.5s ease",
              borderRadius: "6px",
            }}
          />
        </div>
        <p
          style={{
            marginTop: "8px",
            fontSize: "14px",
            color: "#666",
          }}
        >
          Image{" "}
          {Math.min(
            Math.floor(totalDonations / TOTAL_COST_PER_IMAGE) + 1,
            slides.length
          )}{" "}
          of {slides.length}
        </p>
      </div>

      {/* Slider */}
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {processedImages.map((slide, index) => (
            <div className="embla__slide" key={slide.name}>
              <div
                style={{
                  padding: "40px 20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <h4
                  style={{
                    fontSize: "20px",
                    color: "#333",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {slide.name}
                </h4>

                {renderBlurMosaicCanvas(slide, index)}

                {/* CTA text */}
                {getPixelsRevealedForSlide(index) < PIXELS_PER_IMAGE && (
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#666",
                      textAlign: "center",
                      maxWidth: "400px",
                    }}
                  >
                    Donate $
                    {TOTAL_COST_PER_IMAGE -
                      getPixelsRevealedForSlide(index) * COST_PER_PIXEL}{" "}
                    more to complete this image!
                  </p>
                )}

                {getPixelsRevealedForSlide(index) === PIXELS_PER_IMAGE && (
                  <p
                    style={{
                      fontSize: "18px",
                      color: "#a493b5",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Image Complete! Thank you!
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : ""
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MosaicFrame;
