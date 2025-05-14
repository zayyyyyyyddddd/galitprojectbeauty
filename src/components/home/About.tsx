
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
                Clean Beauty for a <span className="text-skin-gold">Radiant You</span>
              </h2>
              <p className="text-muted-foreground">
                At GlowVogue, we believe skincare should be effective, sustainable, and a moment of self-care in your day. Our products are formulated with clean, premium ingredients that deliver real results.
              </p>
              <p className="text-muted-foreground">
                Founded in 2020, our mission is to create skincare that works in harmony with your skin's natural processes, not against them. Each product is dermatologist-tested and made without harmful chemicals.
              </p>
              <div className="grid grid-cols-3 gap-4 py-4">
                <div>
                  <h3 className="text-3xl font-serif font-bold text-skin-gold">100%</h3>
                  <p className="text-sm text-muted-foreground">Cruelty-Free Products</p>
                </div>
                <div>
                  <h3 className="text-3xl font-serif font-bold text-skin-gold">50+</h3>
                  <p className="text-sm text-muted-foreground">Natural Ingredients</p>
                </div>
                <div>
                  <h3 className="text-3xl font-serif font-bold text-skin-gold">15K+</h3>
                  <p className="text-sm text-muted-foreground">Happy Customers</p>
                </div>
              </div>
              <Button className="bg-skin-gold hover:bg-amber-600 text-white">
                Our Story
              </Button>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="absolute -top-5 -left-5 w-32 h-32 bg-skin-mint rounded-full opacity-50"></div>
            <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-skin-rose rounded-full opacity-50"></div>
            <img 
              src="/placeholder.svg" 
              alt="Our story" 
              className="w-full h-[400px] object-cover rounded-lg relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
