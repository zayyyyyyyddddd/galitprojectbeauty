
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-skin-cream py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6 animate-fade-in">
            <span className="text-skin-gold uppercase tracking-wider font-medium">New Collection</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
              Discover Your Natural Beauty Glow
            </h1>
            <p className="text-lg text-foreground/80 max-w-md">
              Luxurious skincare products made with premium ingredients to help you achieve your best skin ever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-skin-gold hover:bg-amber-600 text-white border-none h-12 px-6">
                Shop Now <ArrowRight size={16} className="ml-2" />
              </Button>
              <Button variant="outline" className="border-skin-gold text-skin-gold hover:bg-skin-gold hover:text-white h-12 px-6">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative flex justify-center">
            <div className="rounded-full bg-skin-rose w-64 h-64 md:w-80 md:h-80 absolute opacity-30 animate-float"></div>
            <img 
              src="/placeholder.svg" 
              alt="Skin care products" 
              className="relative z-10 rounded-xl max-w-sm mx-auto"
            />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
