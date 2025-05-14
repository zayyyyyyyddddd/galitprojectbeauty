
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    // This would normally connect to an API
    toast({
      title: "Thank you for subscribing!",
      description: "You'll receive our newsletter at " + email
    });
    
    setEmail("");
  };

  return (
    <section className="py-16 bg-gradient-to-r from-skin-mint/30 to-skin-rose/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-skin-gold uppercase tracking-wider font-medium">Join our community</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 mt-2">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-muted-foreground mb-8 mx-auto max-w-2xl">
            Subscribe to receive updates on new product launches, seasonal promotions, and skincare tips from our experts.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-grow focus-visible:ring-skin-gold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              className="bg-skin-gold hover:bg-amber-600 text-white"
            >
              Subscribe
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
