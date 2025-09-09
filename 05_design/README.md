# Product Management Frontend

A modern React frontend for product management with shopping cart functionality, built with Vite, TypeScript, and Tailwind CSS. Features a Figma-driven design system and real-time basket management.

## 🚀 Features

### Core Functionality
- **Product Catalog**: Card-based product display with intuitive navigation
- **Shopping Cart**: Real-time basket management with quantity controls
- **CRUD Operations**: Add, edit, delete products with modal dialogs
- **Toast Notifications**: User feedback system with smooth animations
- **Stock Validation**: Prevents adding out-of-stock items to basket

### UI/UX
- **Figma-Spec Design**: Custom Tailwind tokens matching design specifications
- **Responsive Layout**: Mobile-friendly interface with proper breakpoints
- **Smooth Animations**: Fade-in effects for toasts and interactive elements
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Technical
- **TypeScript**: Full type safety throughout the application
- **React Hooks**: Modern state management with hooks and context
- **API Integration**: RESTful API communication with error handling
- **Hot Reload**: Vite for fast development with instant updates

## 🛠️ Development

### Prerequisites
- Node.js 18+ with npm
- Backend API running on http://localhost:8000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` or `http://localhost:5174`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎨 Design System

### Tailwind Configuration
Custom design tokens defined in `tailwind.config.js`:

#### Colors
```javascript
colors: {
  muted: '#717182',
  destructive: '#D4183D',
  primary: { 50: '#f6f6f7', ..., 950: '#0b0b0d' },
  ink: { 900: '#0A0A0A', 950: '#030213' }
}
```

#### Border Radius
```javascript
borderRadius: {
  card: '12.75px',    // Main cards
  cardsm: '8.75px',   // Small cards
  btn: '6.75px'       // Buttons
}
```

#### Typography
```javascript
fontSize: {
  xs2: '11.3px',
  sm2: '12.8px',
  base2: '13.2px'
}
```

#### Animations
```javascript
animation: {
  'fade-in': 'fadeIn 0.3s ease-in-out'
}
```

### Component Styles
Utility classes in `src/styles.css`:
- `.btn-primary` - Primary button styling
- `.btn-outline` - Outline button styling
- `.btn-danger` - Destructive action styling
- `.icon-btn` - Icon button styling
- `.input` - Form input styling

## 📦 Components

### Core Components
- **ProductCards.tsx**: Product grid with add-to-basket functionality
- **Basket.tsx**: Fixed-position shopping cart widget
- **ProductForm.tsx**: Add/edit product modal form
- **Modal.tsx**: Reusable modal container component
- **Toast.tsx**: Individual toast notification component
- **ToastProvider.tsx**: Toast context and management

### Component Features
- **Product Cards**: Plus (+) button for adding to basket, view/edit/delete actions
- **Basket Widget**: Bottom-left fixed position, quantity controls, total calculation
- **Modal Dialogs**: 444px fixed width, custom close buttons, proper focus management
- **Toast System**: Auto-dismiss notifications with structured error handling

## 🔧 API Integration

### API Client (`api.ts`)
```typescript
// Product operations
getAllProducts(): Promise<Product[]>
addProduct(product: ProductCreate): Promise<Product>
updateProduct(id: number, product: ProductCreate): Promise<Product>
deleteProduct(id: number): Promise<void>

// Basket operations
getBasket(): Promise<BasketItem[]>
addToBasket(item: BasketItemCreate): Promise<BasketItem>
updateBasketItem(id: number, item: BasketItemUpdate): Promise<BasketItem>
removeFromBasket(id: number): Promise<void>
clearBasket(): Promise<void>
```

### Type Definitions (`types.ts`)
```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
}

interface BasketItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
}
```

## 🎯 State Management

### React Context
- **ToastProvider**: Global toast notification management
- **Local State**: Component-specific state with useState hooks
- **Refresh Keys**: Simple state invalidation for real-time updates

### Data Flow
1. User actions trigger API calls
2. Success/error responses show toast notifications
3. Refresh keys update to reload data
4. Components re-render with new data

## 🚦 Development Guidelines

### Code Organization
- Components in `/src/components/`
- Type definitions in `/src/types.ts`
- API functions in `/src/api.ts`
- Styles in `/src/styles.css`

### Best Practices
- Use TypeScript interfaces for all data structures
- Handle loading and error states appropriately
- Provide user feedback for all actions
- Follow Tailwind utility-first approach
- Maintain accessibility standards

## 🔍 Browser Support

- Modern browsers with ES2020+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## 🤝 Integration

### Backend Requirements
- FastAPI server running on http://localhost:8000
- CORS configured for Vite development ports
- Product and basket API endpoints available

### Deployment
```bash
npm run build    # Creates dist/ folder
npm run preview  # Test production build locally
```

The built files can be deployed to any static hosting service (Netlify, Vercel, etc.)
