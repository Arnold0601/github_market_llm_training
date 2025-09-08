mode: agent
Implement the basket system feature based on issue requirements.

## Project Context
This is a full-stack product management application with:
- Backend: FastAPI (03_python_fastapi_project)
- Frontend: React + Vite + TypeScript + Tailwind CSS (05_design)

## Figma Design Reference
Main design: https://figma.com/design/Cep7R0EjWIdbO4GEzcAkti/Product-Management-Mockup---Codespring-LLM-Training

Key pages:
- Main page: https://www.figma.com/design/Cep7R0EjWIdbO4GEzcAkti/Product-Management-Mockup---Codespring-LLM-Training?node-id=6-9&t=c7aloFftyE3jfzKN-0
- Add new product: https://www.figma.com/design/Cep7R0EjWIdbO4GEzcAkti/Product-Management-Mockup---Codespring-LLM-Training?node-id=11-158&t=c7aloFftyE3jfzKN-0
- Edit product dialog: https://www.figma.com/design/Cep7R0EjWIdbO4GEzcAkti/Product-Management-Mockup---Codespring-LLM-Training?node-id=11-193&t=c7aloFftyE3jfzKN-0
- Product details dialog: https://www.figma.com/design/Cep7R0EjWIdbO4GEzcAkti/Product-Management-Mockup---Codespring-LLM-Training?node-id=11-219&t=c7aloFftyE3jfzKN-0
- Delete product dialog: https://www.figma.com/design/Cep7R0EjWIdbO4GEzcAkti/Product-Management-Mockup---Codespring-LLM-Training?node-id=11-237&t=c7aloFftyE3jfzKN-0

## Implementation Requirements

### Basket System Functionality
- Add a Plus icon next to each product
- When the user clicks the Plus icon, the product is added to the basket
- Display the basket list in the bottom left corner of the screen

### Backend Requirements
1. Track the available quantity of each product
2. Track the quantity of each product added to the basket
3. Update the Product model to include quantity field if not present
4. Create basket/cart endpoints for:
   - Adding products to basket
   - Retrieving basket contents
   - Updating basket quantities
   - Removing items from basket

### Frontend Requirements
1. Display a Plus button next to every product in the product cards
2. Implement click handler for adding products to basket
3. Show the basket list in the bottom left corner of the screen
4. Update product cards to show available quantity
5. Handle basket state management (React state or context)
6. Display basket items with quantities and total count

## Implementation Steps
1. Review current codebase structure and existing models
2. Update backend Product model to include quantity field
3. Create basket/cart API endpoints in FastAPI
4. Update frontend types to include quantity
5. Add Plus button to ProductCards component
6. Implement basket state management
7. Create basket display component for bottom left corner
8. Add API integration for basket operations
9. Test the complete basket functionality
10. Ensure UI matches Figma design specifications

## Technical Notes
- Use async SQLAlchemy for database operations
- Follow existing patterns in main.py for new endpoints
- Use Tailwind CSS classes matching the existing design tokens
- Maintain TypeScript types consistency
- Follow the project's CORS configuration for API calls

## Testing Requirements
- Test adding products to basket
- Test basket display and quantity updates
- Verify UI components match Figma design
- Test API endpoints functionality
- Ensure proper error handling
