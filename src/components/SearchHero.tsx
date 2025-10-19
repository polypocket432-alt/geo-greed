import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-shopping.jpg";

interface SearchHeroProps {
  onSearch: (query: string) => void;
}

export function SearchHero({ onSearch }: SearchHeroProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Shopping" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Find the <span className="text-primary">Best Prices</span> Near You
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Compare prices across local supermarkets and save money on every purchase
          </p>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="flex gap-2 p-2 bg-card rounded-xl shadow-hover">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for products (e.g., organic milk, bread, eggs)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button type="submit" size="lg" className="px-8">
                Search
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {["Organic Milk", "Bread", "Eggs"].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  onSearch(term);
                }}
                className="text-sm px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
