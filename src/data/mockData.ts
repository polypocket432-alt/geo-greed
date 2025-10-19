import { Product, RelatedProduct } from "@/types/product";

export const mockProducts: Record<string, Product> = {
  "organic milk": {
    id: "1",
    name: "Organic Whole Milk (1L)",
    category: "Dairy",
    averagePrice: 3.49,
    stores: [
      {
        id: "s1",
        storeName: "FreshMart",
        price: 2.99,
        distance: 1.2,
        address: "123 Main St",
        inStock: true,
        lastUpdated: new Date(),
      },
      {
        id: "s2",
        storeName: "GreenGrocer",
        price: 3.19,
        distance: 2.5,
        address: "456 Oak Ave",
        inStock: true,
        lastUpdated: new Date(),
      },
      {
        id: "s3",
        storeName: "SuperSave",
        price: 3.49,
        distance: 0.8,
        address: "789 Pine Rd",
        inStock: true,
        lastUpdated: new Date(),
      },
      {
        id: "s4",
        storeName: "MegaMart",
        price: 3.89,
        distance: 3.1,
        address: "321 Elm St",
        inStock: true,
        lastUpdated: new Date(),
      },
    ],
  },
  "bread": {
    id: "2",
    name: "Whole Wheat Bread",
    category: "Bakery",
    averagePrice: 2.49,
    stores: [
      {
        id: "s1",
        storeName: "FreshMart",
        price: 2.19,
        distance: 1.2,
        address: "123 Main St",
        inStock: true,
        lastUpdated: new Date(),
      },
      {
        id: "s3",
        storeName: "SuperSave",
        price: 2.29,
        distance: 0.8,
        address: "789 Pine Rd",
        inStock: true,
        lastUpdated: new Date(),
      },
      {
        id: "s2",
        storeName: "GreenGrocer",
        price: 2.69,
        distance: 2.5,
        address: "456 Oak Ave",
        inStock: true,
        lastUpdated: new Date(),
      },
      {
        id: "s4",
        storeName: "MegaMart",
        price: 2.79,
        distance: 3.1,
        address: "321 Elm St",
        inStock: true,
        lastUpdated: new Date(),
      },
    ],
  },
  "eggs": {
    id: "3",
    name: "Free Range Eggs (Dozen)",
    category: "Dairy",
    averagePrice: 4.99,
    stores: [
      {
        id: "s3",
        storeName: "SuperSave",
        price: 4.49,
        distance: 0.8,
        address: "789 Pine Rd",
        inStock: true,
        lastUpdated: new Date(),
      },
      {
        id: "s1",
        storeName: "FreshMart",
        price: 4.79,
        distance: 1.2,
        address: "123 Main St",
        inStock: true,
        lastUpdated: new Date(),
      },
      {
        id: "s2",
        storeName: "GreenGrocer",
        price: 5.29,
        distance: 2.5,
        address: "456 Oak Ave",
        inStock: true,
        lastUpdated: new Date(),
      },
      {
        id: "s4",
        storeName: "MegaMart",
        price: 5.49,
        distance: 3.1,
        address: "321 Elm St",
        inStock: false,
        lastUpdated: new Date(),
      },
    ],
  },
};

export const relatedProductsMap: Record<string, RelatedProduct[]> = {
  "organic milk": [
    { id: "r1", name: "Organic Greek Yogurt", category: "Dairy", lowestPrice: 4.99 },
    { id: "r2", name: "Organic Cheese", category: "Dairy", lowestPrice: 6.49 },
    { id: "r3", name: "Organic Butter", category: "Dairy", lowestPrice: 5.29 },
    { id: "r4", name: "Almond Milk", category: "Dairy Alternatives", lowestPrice: 3.99 },
  ],
  "bread": [
    { id: "r5", name: "Bagels", category: "Bakery", lowestPrice: 3.49 },
    { id: "r6", name: "English Muffins", category: "Bakery", lowestPrice: 2.99 },
    { id: "r7", name: "Pita Bread", category: "Bakery", lowestPrice: 2.79 },
    { id: "r8", name: "Croissants", category: "Bakery", lowestPrice: 4.49 },
  ],
  "eggs": [
    { id: "r9", name: "Organic Eggs", category: "Dairy", lowestPrice: 5.99 },
    { id: "r10", name: "Egg Whites", category: "Dairy", lowestPrice: 4.29 },
    { id: "r11", name: "Quail Eggs", category: "Specialty", lowestPrice: 6.99 },
  ],
};

export function searchProduct(query: string): Product | null {
  const normalizedQuery = query.toLowerCase().trim();
  return mockProducts[normalizedQuery] || null;
}

export function getRelatedProducts(query: string): RelatedProduct[] {
  const normalizedQuery = query.toLowerCase().trim();
  return relatedProductsMap[normalizedQuery] || [];
}
