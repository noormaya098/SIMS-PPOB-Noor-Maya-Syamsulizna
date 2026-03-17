import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServicesSection = ({ services, loadingServices }) => {
  const navigate = useNavigate();

  if (loadingServices) {
    return (
      <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-12 md:gap-x-2 md:gap-y-6 lg:justify-between items-start mb-16 pb-4 md:pb-0 scrollbar-hide">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 shrink-0 w-20 md:w-auto">
            <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="w-16 h-3 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-12 md:gap-x-2 md:gap-y-6 lg:justify-between items-start mb-16 pb-4 md:pb-0 scrollbar-hide">
      {services.map((service, idx) => (
        <div 
          key={idx} 
          onClick={() => navigate('/payment', { state: { service } })}
          className="flex flex-col items-center shrink-0 w-20 md:w-auto cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img src={service.service_icon} alt={service.service_name} className="w-16 h-16 mb-2 object-contain" />
          <span className="text-xs text-center font-medium text-[#333333] break-words">
            {service.service_name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ServicesSection;
