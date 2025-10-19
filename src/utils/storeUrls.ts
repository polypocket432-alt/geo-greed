export const STORE_URLS: Record<string, string> = {
  "Tesco": "https://www.tesco.com/groceries/",
  "Sainsbury's": "https://www.sainsburys.co.uk/shop/gb/groceries",
  "Asda": "https://groceries.asda.com/",
  "Waitrose": "https://www.waitrose.com/ecom/shop/browse/groceries",
  "Morrisons": "https://groceries.morrisons.com/",
  "Aldi": "https://www.aldi.co.uk/",
  "Lidl": "https://www.lidl.co.uk/",
};

export function getStoreUrl(storeName: string): string | undefined {
  return STORE_URLS[storeName];
}
