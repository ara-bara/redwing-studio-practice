export type Product = {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  category: string;
  brand?: string;
  thumbnail: string;
  minimumOrderQuantity: number;
  description: string;
  images: string[];
  tags: string[];
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  availabilityStatus: string;
  shippingInformation: string;
  returnPolicy: string;
  warrantyInformation: string;
  reviews: ProductReview[];
};

export type ProductReview = {
  reviewerName: string;
  rating: number;
  comment: string;
};
