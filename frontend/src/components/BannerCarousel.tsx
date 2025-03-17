import { useState, useEffect, useRef } from "react";

const BannerCarousel = () => {
  const banners = [
    {
      image:
        "https://images.pexels.com/photos/169214/pexels-photo-169214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      alt: "Elegant Venues",
      title: "Elegant Venues",
      description: "Experience luxury and comfort",
    },
    {
      image:
        "https://images.pexels.com/photos/3835638/pexels-photo-3835638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      alt: "Modern Spaces",
      title: "Modern Spaces",
      description: "Contemporary and chic venues",
    },
    {
      image:
        "https://images.pexels.com/photos/933118/pexels-photo-933118.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      alt: "Rustic Charm",
      title: "Rustic Charm",
      description: "Warm and inviting ambience",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const timeoutRef = useRef<number | null>(null);
  const transitionRef = useRef<number | null>(null);

  useEffect(() => {
    const startTimer = () => {
      timeoutRef.current = window.setTimeout(() => {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, 5000) as unknown as number;
    };

    startTimer();

    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      if (transitionRef.current !== null)
        window.clearTimeout(transitionRef.current);
    };
  }, [currentIndex, banners.length]);

  useEffect(() => {
    if (isTransitioning) {
      transitionRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
      }, 700) as unknown as number;
    }
  }, [isTransitioning]);

  const goToSlide = (index: number) => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(index);
    }
  };

  const goToPrevSlide = () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? banners.length - 1 : prevIndex - 1
      );
    }
  };

  const goToNextSlide = () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-xl shadow-lg">
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-all duration-700 ease-in-out transform ${
              index === currentIndex
                ? "opacity-100 translate-x-0"
                : index < currentIndex ||
                  (currentIndex === 0 && index === banners.length - 1)
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            }`}
            aria-hidden={index !== currentIndex}
          >
            <img
              src={banner.image}
              alt={banner.alt}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                  Find Your Perfect Venue
                </h1>
                <p className="text-xl md:text-2xl mb-6 max-w-2xl mx-auto drop-shadow-md">
                  Discover unique venues for your next event, carefully curated
                  for unforgettable experiences
                </p>
                <h2 className="text-2xl font-semibold mb-2 drop-shadow-lg">
                  {banner.title}
                </h2>
                <p className="text-lg mb-8 max-w-lg mx-auto drop-shadow-md">
                  {banner.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={goToPrevSlide}
        disabled={isTransitioning}
        className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-3 z-10 transition-all duration-300 cursor-pointer ${
          isTransitioning ? "opacity-50 cursor-not-allowed" : "opacity-100"
        }`}
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={goToNextSlide}
        disabled={isTransitioning}
        className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-3 z-10 transition-all duration-300 cursor-pointer ${
          isTransitioning ? "opacity-50 cursor-not-allowed" : "opacity-100"
        }`}
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 bg-white"
                : "w-2.5 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
