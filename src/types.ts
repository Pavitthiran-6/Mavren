export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  image_url: string;
  category: string;
  tags: string[];
  affiliate_link: string;
  is_featured: boolean;
  curator_rating: number;
  curator_verdict?: string;
  highs?: string[];
  lows?: string[];
  pros?: string[];
  cons?: string[];
  cover_image_url?: string;
  gallery_images?: string;
  is_new_arrival: boolean;
  is_under_999: boolean;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
};

export type WishlistItem = {
  id: string;
  user_id: string;
  product_id: string;
  products?: Product;
};
export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
};
