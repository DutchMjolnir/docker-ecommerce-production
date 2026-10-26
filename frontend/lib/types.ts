export type Product = {
  id: number;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  is_active: boolean;
  category?: string;
  image?: string;
  badge?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderItem = {
  product_id: number;
  quantity: number;
};

export type Order = {
  id: number | string;
  status: string;
  total: number;
  created_at: string;
  items?: OrderItem[];
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type LoginResponse = {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
  token_type: string;
};
