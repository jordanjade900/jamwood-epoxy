
export interface ProductOption {
  label: string;
  priceModifier: number; // Percentage or absolute? Let's use absolute for simplicity
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  additionalImages?: string[]; // Added to support product galleries
  startingPrice: string; // Keep string for display
  basePriceNum: number; // Added for calculations
  options?: ProductOption[];
  category: 'furniture' | 'decor' | 'custom';
  leadTimeWeeks: number; // Added to calculate delivery availability
}

export interface CartItem {
  cartId: string;
  productId: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
}
