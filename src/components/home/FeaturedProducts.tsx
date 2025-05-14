
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";

// Featured product data
const featuredProducts = [
  {
    id: 1,
    name: "Hydrating Rose Serum",
    description: "24-hour moisture formula with rose extract",
    price: 38,
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg",
    category: "Serum"
  },
  {
    id: 2,
    name: "Brightening Vitamin C Cream",
    description: "Antioxidant-rich formula for radiant skin",
    price: 42,
    rating: 4.9,
    reviews: 96,
    image: "/placeholder.svg",
    category: "Moisturizer"
  },
  {
    id: 3,
    name: "Gentle Exfoliating Toner",
    description: "BHA & AHA blend for smooth, clear skin",
    price: 32,
    rating: 4.7,
    reviews: 78,
    image: "/placeholder.svg",
    category: "Toner"
  },
  {
    id: 4,
    name: "Replenishing Night Mask",
    description: "Overnight repair with peptide complex",
    price: 48,
    rating: 4.9,
    reviews: 112,
    image: "/placeholder.svg",
    category: "Mask"
  }
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Best Selling Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our most-loved premium skincare formulations for your daily routine
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden border border-border/50 hover:border-skin-gold transition-all duration-300">
              <div className="relative overflow-hidden pt-[100%]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-skin-mint px-3 py-1 rounded-full text-xs font-medium">
                  {product.category}
                </span>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-skin-gold text-skin-gold" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
                </div>
                
                <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">${product.price}</span>
                  <Button size="sm" className="bg-skin-gold hover:bg-amber-600">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" className="border-skin-gold text-skin-gold hover:bg-skin-gold hover:text-white">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
