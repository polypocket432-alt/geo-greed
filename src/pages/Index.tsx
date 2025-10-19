import { useState } from "react";
import { SearchHero } from "@/components/SearchHero";
import { SearchResults } from "@/components/SearchResults";
import { RelatedProducts } from "@/components/RelatedProducts";
import { searchProduct, getRelatedProducts } from "@/data/mockData";
import { Product, RelatedProduct } from "@/types/product";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentProduct, setCurrentProduct] = useState<Product[] | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const product = searchProduct(query);
    setCurrentProduct(product);
    
    if (product) {
      const related = getRelatedProducts(query);
      setRelatedProducts(related);
    } else {
      setRelatedProducts([]);
    }
  };

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
