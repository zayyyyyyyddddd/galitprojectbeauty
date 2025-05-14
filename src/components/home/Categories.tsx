
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Cleansers",
    description: "Gentle formulas that remove impurities",
    image: "/placeholder.svg",
    link: "/category/cleansers"
  },
  {
    id: 2,
    name: "Serums",
    description: "Targeted treatments for specific concerns",
    image: "/placeholder.svg",
    link: "/category/serums"
  },
  {
    id: 3,
    name: "Moisturizers",
    description: "Hydration for all skin types",
    image: "/placeholder.svg",
    link: "/category/moisturizers"
  },
  {
    id: 4,
    name: "Masks",
    description: "Intensive treatments for radiant skin",
    image: "/placeholder.svg",
    link: "/category/masks"
  }
];

const Categories = () => {
  return (
    <section className="py-16 bg-skin-beige">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Shop By Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the perfect products for your skincare routine
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              to={category.link} 
              key={category.id} 
              className="group relative overflow-hidden rounded-lg bg-white hover:shadow-md transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-serif font-medium mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                <div className="flex items-center text-skin-gold group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-medium">Browse Products</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
