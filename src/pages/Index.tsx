import { useState } from "react";
import { SearchHero } from "@/components/SearchHero";
import { SearchResults } from "@/components/SearchResults";
import { RelatedProducts } from "@/components/RelatedProducts";
import { searchProduct, getRelatedProducts } from "@/data/mockData";
import { Product, RelatedProduct } from "@/types/product";
import { useLocation } from "@/contexts/LocationContext";
import { updateStoreDistances } from "@/utils/updateStoreDistances";
import { useEffect } from "react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentProduct, setCurrentProduct] = useState<Product[] | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const { userLocation } = useLocation();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    let product = searchProduct(query);
    
    // Update distances if user location is available
    if (product && userLocation) {
      product = updateStoreDistances(product, userLocation.latitude, userLocation.longitude);
    }
    
    setCurrentProduct(product);
    
    if (product) {
      const related = getRelatedProducts(query);
      setRelatedProducts(related);
    } else {
      setRelatedProducts([]);
    }
  };

  // Re-calculate distances when location changes
  useEffect(() => {
    if (currentProduct && userLocation) {
      const updated = updateStoreDistances(currentProduct, userLocation.latitude, userLocation.longitude);
      setCurrentProduct(updated);
    }
  }, [userLocation]);

  return (
    <main className="min-h-screen">
      <SearchHero onSearch={handleSearch} />
      <SearchResults product={currentProduct} searchQuery={searchQuery} />
      {currentProduct && (
        <RelatedProducts 
          products={relatedProducts} 
          onProductClick={handleSearch}
        />
      )}
    </main>
  );
};

export default Index;
