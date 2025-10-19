import { Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-shopping.jpg";
import { CartButton } from "./CartButton";
import { LocationButton } from "./LocationButton";
import { SearchAutocomplete } from "./SearchAutocomplete";
import { useAuth } from "@/contexts/AuthContext";

interface SearchHeroProps {
  onSearch: (query: string) => void;
}

export function SearchHero({ onSearch }: SearchHeroProps) {
  const { signOut } = useAuth();
  
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <LocationButton />
        <CartButton />
        <Button
          variant="outline"
          size="icon"
          onClick={signOut}
          title="Sign Out"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
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
            Compare prices across local UK supermarkets and save money on your weekly shop
          </p>

          <SearchAutocomplete onSearch={onSearch} />

          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {["Milk", "Bread", "Eggs", "Chicken", "Cheese"].map((term) => (
              <button
                key={term}
                onClick={() => onSearch(term)}
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
