// VYRO E-Commerce Platform Types

export type Role = 'CUSTOMER' | 'ADMIN' | 'COMPLIANCE_OFFICER';

export type CommerceMode = 'DEMO_INFORMATIONAL' | 'SANDBOX_COMMERCE' | 'LIVE_AUTHORIZED';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  isAgeVerified: boolean;
  ageVerifiedAt?: string;
  phone?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  itemCount?: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  priceDelta: number;
  stockCount: number;
  colorCode?: string;
  finishName?: string;
}

export interface ProductSpecifications {
  dimensions?: string;
  weight?: string;
  materials?: string;
  batteryCapacity?: string;
  chargingRate?: string;
  podCapacity?: string;
  coilResistance?: string;
  powerOutput?: string;
  airflow?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  editorialHighlight?: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  isPublished: boolean;
  isFeatured: boolean;
  stock: number;
  compatibility?: string;
  specifications: ProductSpecifications;
  images: {
    url: string;
    altText: string;
    isPrimary?: boolean;
  }[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
}

export type OrderStatus =
  | 'PENDING_AGE_VERIFICATION'
  | 'AGE_VERIFIED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  variantTitle?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerEmail: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  currency: string;
  ageVerifiedSnapshot: boolean;
  ageVerifiedMethod: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
  paymentMethod: string;
  isDemoTransaction: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  details: string;
  userEmail: string;
  timestamp: string;
}

export interface SiteSettings {
  storeName: string;
  commerceMode: CommerceMode;
  minimumAge: number;
  enableAgeGate: boolean;
  restrictedRegions: string[];
  announcementText: string;
  complianceDisclaimer: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}
