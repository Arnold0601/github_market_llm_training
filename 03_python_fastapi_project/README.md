# FastAPI Product Management API

A FastAPI backend for product management with shopping cart functionality, built with async SQLAlchemy and SQLite.

## Features

- **Product Management**: Full CRUD operations for products
- **Shopping Cart/Basket**: Complete basket functionality with item management
- **Async Database**: SQLAlchemy ORM with SQLite using async engine
- **Auto-documentation**: Automatic OpenAPI/Swagger documentation
- **CORS Support**: Configured for frontend integration (Vite ports)
- **Environment Configuration**: Pydantic settings with .env support
- **Development Tools**: Testing and code formatting included

## Installation

This project uses `uv` for dependency management. Make sure you have `uv` installed:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Install dependencies:

```bash
uv sync
```

## Running the Application

### Development Mode (with auto-reload)

```bash
uv run uvicorn main:app --reload
```

### Production Mode

```bash
uv run uvicorn main:app --host 0.0.0.0 --port 8000
```

The application will be available at `http://localhost:8000`

## API Endpoints

### Root
- `GET /` - Welcome message and API info

### Products
- `GET /products/` - Get all products
- `POST /products/` - Create a new product
- `GET /products/{id}` - Get product by ID
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Basket/Cart
- `GET /basket/` - Get basket contents with product details
- `POST /basket/` - Add item to basket (handles quantity updates)
- `PUT /basket/{item_id}` - Update item quantity
- `DELETE /basket/{item_id}` - Remove specific item from basket
- `DELETE /basket/` - Clear entire basket

## Data Models

### Product
```python
{
  "id": 1,
  "name": "Product Name",
  "price": 29.99,
  "description": "Product description",
  "stock": 100
}
```

### Basket Item
```python
{
  "id": 1,
  "product_id": 1,
  "quantity": 2,
  "product": {
    "id": 1,
    "name": "Product Name",
    "price": 29.99,
    "description": "Product description",
    "stock": 100
  }
}
```

## Example Usage

### Create a product

```bash
curl -X POST "http://localhost:8000/products/" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Sample Product",
       "price": 29.99,
       "description": "A sample product for testing",
       "stock": 50
     }'
```

### Add item to basket

```bash
curl -X POST "http://localhost:8000/basket/" \
     -H "Content-Type: application/json" \
     -d '{
       "product_id": 1,
       "quantity": 2
     }'
```

### Get basket contents

```bash
curl -X GET "http://localhost:8000/basket/"
```

## Configuration

Create a `.env` file in the project root to customize settings:

```env
APP_NAME=Product Management API
DATABASE_URL=sqlite+aiosqlite:///./app.db
DEBUG=true
```

## Database

The application uses SQLite with async support via aiosqlite. The database file (`app.db`) and tables are created automatically when you first run the application through the lifespan event in `main.py`.

### Database Schema
- **products**: Product information and stock levels
- **basket_items**: Shopping cart items with foreign key to products

## Development

### Run tests

```bash
uv run pytest
```

### API Documentation

Visit `http://localhost:8000/docs` for interactive Swagger documentation, or `http://localhost:8000/redoc` for alternative documentation.

### Code Quality

Format code:
```bash
uv run black .
uv run isort .
```

Lint code:
```bash
uv run flake8 .
```

## CORS Configuration

The API is configured to accept requests from Vite development servers (ports 5173-5176) and other common development ports for seamless frontend integration.
