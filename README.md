# GitHub Market LLM Training - Product Management Application

A full-stack product management application with shopping cart functionality, built as a training project for LLM-assisted development. This project demonstrates modern web development practices with FastAPI backend and React frontend.

## 🚀 Features

### Backend (FastAPI)
- **Product Management**: Full CRUD operations for products
- **Shopping Cart/Basket**: Complete basket functionality with item management
- **Database**: Async SQLAlchemy with SQLite, auto-created tables
- **API Documentation**: Automatic OpenAPI/Swagger documentation
- **CORS**: Configured for frontend integration

### Frontend (React + Vite + Tailwind)
- **Modern UI**: Figma-driven design with custom Tailwind tokens
- **Product Catalog**: Card-based product display with search and filters
- **Shopping Cart**: Real-time basket management with quantity controls
- **Toast Notifications**: User feedback system with animations
- **Responsive Design**: Mobile-friendly interface
- **TypeScript**: Full type safety throughout the application

## 🏗️ Project Structure

```
├── 03_python_fastapi_project/    # Backend API
│   ├── main.py                   # FastAPI application
│   ├── database.py              # Database configuration
│   ├── config.py                # Environment settings
│   └── pyproject.toml           # Python dependencies
│
├── 05_design/                   # Frontend application
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── api.ts              # API client functions
│   │   ├── types.ts            # TypeScript interfaces
│   │   └── App.tsx             # Main application
│   ├── tailwind.config.js      # Tailwind configuration
│   └── package.json            # Node.js dependencies
│
└── issues/                     # Feature documentation
    ├── issue-1.md              # Figma design requirements
    └── issue-2.md              # Additional features
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.10+ with `uv` package manager
- Node.js 18+ with npm
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd 03_python_fastapi_project
```

2. Install dependencies using uv:
```bash
uv sync
```

3. Start the development server:
```bash
uv run uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd 05_design
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` or `http://localhost:5174`

## 📚 API Documentation

### Products API
- `GET /products/` - List all products
- `POST /products/` - Create a new product
- `GET /products/{id}` - Get product by ID
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Basket API
- `GET /basket/` - Get basket contents
- `POST /basket/` - Add item to basket
- `PUT /basket/{item_id}` - Update item quantity
- `DELETE /basket/{item_id}` - Remove item from basket
- `DELETE /basket/` - Clear entire basket

Visit `http://localhost:8000/docs` for interactive API documentation.

## 🎨 UI Components

### Key Features
- **Product Cards**: Display products with add-to-basket functionality
- **Basket Widget**: Fixed-position cart in bottom-left corner
- **Modal Dialogs**: Add/Edit/Delete product forms with Figma-spec styling
- **Toast Notifications**: Real-time feedback with fade-in animations
- **Form Validation**: Client-side validation with error handling

### Design System
- **Colors**: Custom palette with muted, destructive, and primary scales
- **Typography**: Custom font sizes (xs2, sm2, base2)
- **Border Radius**: Consistent radii (btn: 6.75px, card: 12.75px, cardsm: 8.75px)
- **Animations**: Smooth fade-in effects for toasts and interactions

## 🔧 Technical Implementation

### Database Models
```python
# Product model
class Product:
    id: int
    name: str
    price: float
    description: str
    stock: int

# Basket item model
class BasketItem:
    id: int
    product_id: int (Foreign Key)
    quantity: int
    product: Product (Relationship)
```

### State Management
- React hooks for local state management
- Toast provider context for notifications
- Real-time updates between basket and product components

### Error Handling
- Structured error responses with specific error codes
- Client-side validation and feedback
- Graceful degradation for network issues

## 🚦 Development Status

### ✅ Completed Features
- [x] Product CRUD operations
- [x] Shopping cart/basket functionality
- [x] Toast notification system
- [x] Figma-spec UI implementation
- [x] Real-time basket updates
- [x] Stock validation
- [x] Error handling improvements
- [x] Code quality optimizations

### 🔄 Recent Improvements
- Fixed duplicate toast implementations
- Improved ID generation using crypto.randomUUID()
- Added proper Tailwind animations
- Enhanced error handling with structured responses
- Removed redundant code comments

### 🎯 Current Branch
`feature/1-basket-feature` - Complete basket/cart functionality implementation

## 🧪 Testing

### Backend
```bash
cd 03_python_fastapi_project
uv run pytest
```

### Frontend
```bash
cd 05_design
npm run build  # Verify build passes
```

## 🤝 Contributing

This project follows modern development practices:

1. **Code Quality**: TypeScript for type safety, ESLint for linting
2. **Design Consistency**: Figma-driven UI with Tailwind design tokens
3. **API Design**: RESTful endpoints with proper HTTP status codes
4. **Error Handling**: Structured error responses and user feedback

## 📄 License

This project is for educational purposes as part of LLM training exercises.

## 🙏 Acknowledgments

- Built with modern tooling: FastAPI, React, Vite, Tailwind CSS
- Design specifications from Figma
- LLM-assisted development practices
- Async/await patterns throughout the stack
