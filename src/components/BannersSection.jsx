import React, { useRef, useEffect } from 'react';

const BannersSection = ({ banners, loadingBanners }) => {
  const bannerRef = useRef(null);

  // Auto-scroll logic for banners
  useEffect(() => {
    let scrollInterval;
    if (banners?.length > 0 && bannerRef.current) {
      scrollInterval = setInterval(() => {
        const container = bannerRef.current;
        if (container) {
          const maxScroll = container.scrollWidth - container.clientWidth;
          if (container.scrollLeft >= maxScroll - 10) {
            // Reached the end, smooth scroll back to start
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Scroll right by roughly the width of one banner (approx 300px)
            container.scrollBy({ left: 320, behavior: 'smooth' });
          }
        }
      }, 2500);
    }
    return () => clearInterval(scrollInterval);
  }, [banners]);

  return (
    <div className="mb-10 w-full overflow-hidden">
      <h3 className="text-lg font-bold mb-6 text-[#333333]">Temukan promo menarik</h3>
      {loadingBanners ? (
        <div className="flex gap-6 overflow-hidden">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-[300px] h-[140px] shrink-0 bg-gray-200 animate-pulse rounded-2xl"></div>
           ))}
        </div>
      ) : (
        <div 
          ref={bannerRef}
          className="flex overflow-x-hidden gap-6 pb-4 scroll-smooth"
        >
          {banners.map((banner, idx) => (
            <div key={idx} className="shrink-0 w-auto">
              <img 
                src={banner.banner_image} 
                alt={banner.banner_name} 
                className="h-[140px] md:h-[160px] w-auto rounded-2xl shadow-sm object-cover" 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannersSection;
