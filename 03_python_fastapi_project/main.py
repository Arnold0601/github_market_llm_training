from contextlib import asynccontextmanager
from typing import List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from config import settings
from database import Product, BasketItem, create_tables, get_db


class ProductDTO(BaseModel):
    id: int
    name: str
    price: float
    description: str | None = None
    stock: int

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    name: str
    price: float
    description: str | None = None
    stock: int


class ProductUpdate(BaseModel):
    name: str | None = None
    price: float | None = None
    description: str | None = None
    stock: int | None = None


class BasketItemDTO(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductDTO

    class Config:
        from_attributes = True


class BasketItemCreate(BaseModel):
    product_id: int
    quantity: int = 1


class BasketItemUpdate(BaseModel):
    quantity: int


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    yield



app = FastAPI(title=settings.app_name, lifespan=lifespan)

# Allow CORS for local frontend (Vite default: http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI Template"}


@app.post("/products/", response_model=ProductDTO)
async def create_products(product: ProductCreate, db: AsyncSession = Depends(get_db)):
    db_product = Product(
        name=product.name,
        price=product.price,
        description=product.description,
        stock=product.stock,
    )
    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)
    return db_product


@app.get("/products/", response_model=List[ProductDTO])
async def get_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product))
    products = result.scalars().all()
    return products


@app.put("/products/{product_id}", response_model=ProductDTO)
async def update_product(
    product_id: int,
    product: ProductUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    db_product = result.scalar_one_or_none()

    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_product, key, value)

    await db.commit()
    await db.refresh(db_product)

    return db_product


@app.delete("/products/{product_id}", status_code=204)
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    await db.delete(product)
    await db.commit()


@app.get("/products/{product_id}", response_model=ProductDTO)
async def get_product_by_id(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# Basket endpoints
@app.post("/basket/", response_model=BasketItemDTO)
async def add_to_basket(basket_item: BasketItemCreate, db: AsyncSession = Depends(get_db)):
    # Check if product exists
    product_result = await db.execute(select(Product).where(Product.id == basket_item.product_id))
    product = product_result.scalar_one_or_none()
    
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if item already exists in basket
    existing_result = await db.execute(
        select(BasketItem).where(BasketItem.product_id == basket_item.product_id)
    )
    existing_item = existing_result.scalar_one_or_none()
    
    if existing_item:
        # Update quantity
        existing_item.quantity += basket_item.quantity
        await db.commit()
        await db.refresh(existing_item)
        
        # Load the product relationship
        result = await db.execute(
            select(BasketItem).options(selectinload(BasketItem.product)).where(BasketItem.id == existing_item.id)
        )
        return result.scalar_one()
    else:
        # Create new basket item
        db_basket_item = BasketItem(
            product_id=basket_item.product_id,
            quantity=basket_item.quantity
        )
        db.add(db_basket_item)
        await db.commit()
        await db.refresh(db_basket_item)
        
        # Load the product relationship
        result = await db.execute(
            select(BasketItem).options(selectinload(BasketItem.product)).where(BasketItem.id == db_basket_item.id)
        )
        return result.scalar_one()


@app.get("/basket/", response_model=List[BasketItemDTO])
async def get_basket(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(BasketItem).options(selectinload(BasketItem.product))
    )
    basket_items = result.scalars().all()
    return basket_items


@app.put("/basket/{item_id}", response_model=BasketItemDTO)
async def update_basket_item(
    item_id: int,
    basket_update: BasketItemUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(BasketItem).where(BasketItem.id == item_id))
    basket_item = result.scalar_one_or_none()
    
    if basket_item is None:
        raise HTTPException(status_code=404, detail="Basket item not found")
    
    basket_item.quantity = basket_update.quantity
    await db.commit()
    await db.refresh(basket_item)
    
    # Load the product relationship
    result = await db.execute(
        select(BasketItem).options(selectinload(BasketItem.product)).where(BasketItem.id == basket_item.id)
    )
    return result.scalar_one()


@app.delete("/basket/{item_id}", status_code=204)
async def remove_from_basket(item_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BasketItem).where(BasketItem.id == item_id))
    basket_item = result.scalar_one_or_none()
    
    if basket_item is None:
        raise HTTPException(status_code=404, detail="Basket item not found")
    
    await db.delete(basket_item)
    await db.commit()


@app.delete("/basket/", status_code=204)
async def clear_basket(db: AsyncSession = Depends(get_db)):
    await db.execute(delete(BasketItem))
    await db.commit()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
