import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Left side gradient background */}
      <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-br from-green-950 to-green-900 z-0" />
      
      {/* Right side image/video background */}
      <div className="absolute top-0 bottom-0 right-0 w-1/2 z-0">
        <div className="absolute inset-0 bg-black/50" /> {/* Overlay to darken the image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/path-to-your-image.jpg')" // Replace with your image path
          }}
        />
        {/* Alternative: Use video instead of image */}
        {/* 
        <video 
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay 
          muted 
          loop
        >
          <source src="/path-to-your-video.mp4" type="video/mp4" />
        </video>
        */}
      </div>
      
      
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-20" />
      </div>
      
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="text-white space-y-8 animate-fadeIn">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mt-2">
                  CONECI-RO
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
                Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus 
                rhoncus ut eleifend nibh porttitor.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 pt-8">
                <a 
                  href="#votacao" 
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white text-green-950 font-semibold rounded-full transition-all duration-300 hover:bg-green-50 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Participar da Votação
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a 
                  href="#sobre" 
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white rounded-full transition-all duration-300 hover:bg-white/5 backdrop-blur-sm"
                >
                  Saiba Mais
                </a>
              </div>
            </div>
            
            {/* Right side content - can be empty or contain additional elements */}
            <div className="relative animate-fadeInRight">
              {/* Optional: Add some foreground content on the right side */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/80 animate-bounce">
        <span className="text-sm font-medium mb-2">Scroll</span>
        <div className="w-1 h-12 bg-white/10 rounded-full">
          <div className="w-full h-1/2 bg-white/30 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;