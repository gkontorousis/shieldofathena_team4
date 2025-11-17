import React, { useState, useEffect, useRef, useCallback } from "react";
import { DotButton, useDotButton } from "./MosaicDotButton";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./MosaicArrowButton";
import useEmblaCarousel from "embla-carousel-react";
import { getTotalDonations } from "../../../services/firestore.js";

const GRID_SIZE = 20;
const COST_PER_PIXEL = 10; // $10 per pixel
const PIXELS_PER_IMAGE = GRID_SIZE * GRID_SIZE;
const TOTAL_COST_PER_IMAGE = PIXELS_PER_IMAGE * COST_PER_PIXEL;
const CANVAS_SIZE = 500; // size (px) for each square canvas

const TWEEN_FACTOR_BASE = 0.52;

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max);

const MosaicFrame = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [totalDonations, setTotalDonations] = useState(0);
  const [processedImages, setProcessedImages] = useState([]);
  const canvasRefs = useRef([]);

  // Tween refs
  const tweenFactor = useRef(0);
  const tweenNodes = useRef([]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  // 1. Fetch total donations from Firestore (real data)
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await getTotalDonations(); // from services/firestore
        const amount = data?.total_amount;

        if (typeof amount === "number" && !Number.isNaN(amount)) {
          setTotalDonations(amount);
        } else {
          setTotalDonations(0);
        }
      } catch (error) {
        console.error("Error fetching donations:", error);
        setTotalDonations(0); // fallback
      }
    };

    fetchDonations();

    // poll every 30s
    const interval = setInterval(fetchDonations, 30000);
    return () => clearInterval(interval);
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

  // 5. Draw mosaic: grey base + sharp tiles on canvas whenever donations / images change
  useEffect(() => {
    processedImages.forEach((slide, index) => {
      const canvas = canvasRefs.current[index];
      if (!canvas || !slide) return;

      const ctx = canvas.getContext("2d");
      const { origCanvas } = slide; // blurCanvas (dont use anymore but still keep it there)

      const width = CANVAS_SIZE;
      const height = CANVAS_SIZE;
      canvas.width = width;
      canvas.height = height;

      const tileW = width / GRID_SIZE;
      const tileH = height / GRID_SIZE;

      // Base: fill full grey background
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#d3d3d3"; // grey color for the unrevealed pixels
      ctx.fillRect(0, 0, width, height);

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

      // Draw faint grid lines
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

  // 6. Tween scale setup
  const setTweenNodes = useCallback((emblaApiInstance) => {
    // direct scale for .embla-slide
    tweenNodes.current = emblaApiInstance.slideNodes();
  }, []);

  const setTweenFactor = useCallback((emblaApiInstance) => {
    tweenFactor.current =
      TWEEN_FACTOR_BASE * emblaApiInstance.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback((emblaApiInstance) => {
    const scrollProgress = emblaApiInstance.scrollProgress();

    emblaApiInstance.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);

      // scale in range 0.85-1
      const scale = numberWithinRange(tweenValue, 0.85, 1).toString();

      const tweenNode = tweenNodes.current[snapIndex];
      if (tweenNode) {
        tweenNode.style.transform = `scale(${scale})`;
        tweenNode.style.transition = "transform 0.2s ease-out";
      }
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);

    emblaApi
      .on("reInit", (api) => {
        setTweenNodes(api);
        setTweenFactor(api);
        tweenScale(api);
      })
      .on("scroll", tweenScale)
      .on("select", tweenScale);
  }, [emblaApi, setTweenNodes, setTweenFactor, tweenScale]);

  // 7. Component render canvas + overlay text
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
      <div className="embla-progress">
        <h3>Total Progress: ${totalDonations.toLocaleString()}</h3>
        <div className="embla-progress-bar">
          <div
            className="embla-progress-bar-fill"
            style={{
              width: `${Math.min(
                (totalDonations /
                  (TOTAL_COST_PER_IMAGE * Math.max(slides.length, 1))) *
                  100,
                100
              )}%`,
            }}
          />
        </div>
        <p>
          Image{" "}
          {Math.min(
            Math.floor(totalDonations / TOTAL_COST_PER_IMAGE) + 1,
            slides.length
          )}{" "}
          of {slides.length}
        </p>
      </div>

      {/* Slider */}
      <div className="embla-viewport" ref={emblaRef}>
        <div className="embla-container">
          {processedImages.map((slide, index) => (
            <div className="embla-slide" key={slide.name}>
              <div className="embla-slide-content">
                <h4>{slide.name}</h4>

                {renderBlurMosaicCanvas(slide, index)}

                {/* CTA text */}
                {getPixelsRevealedForSlide(index) < PIXELS_PER_IMAGE && (
                  <p className="embla-slide-content-incompleted">
                    {/* Your support matters. $
                    {TOTAL_COST_PER_IMAGE -
                      getPixelsRevealedForSlide(index) * COST_PER_PIXEL}{" "}
                    more brings another pieces of this image to life. */}
                    Each contribution helps unlock another part of this shared
                    mosaic of hope.
                  </p>
                )}

                {getPixelsRevealedForSlide(index) === PIXELS_PER_IMAGE && (
                  <p className="embla-slide-content-completed">
                    Image Complete! Thank you!
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="embla-controls">
        <div className="embla-buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla-dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla-dot".concat(
                index === selectedIndex ? " embla-dot-selected" : ""
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MosaicFrame;
