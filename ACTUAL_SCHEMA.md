# Your Actual Hygraph Schema

This document reflects the exact Product and Category models from your Hygraph admin panel.

## Product Model Fields

These are the fields your Product model currently has in Hygraph:

### Core Fields (Required)
- **name** (Single line text) - Product name
- **slug** (Slug) - URL-friendly identifier  
- **price** (Number/Int) - Product price
- **choice** (Enumeration: `ProductTypeChoice`) - `digitalProduct` or `physicalProduct`

### Relationships (Multiple values)
- **categories** (Two-way reference to Category) - Product categories
- **images** (Asset picker, multiple) - Product images
- **variants** (Reference to Product Variant) - Size/color variants
- **collections** (Reference to Collection) - Collections this product belongs to
- **orderItems** (Reference to Order Item) - Order data
- **reviews** (Reference to Review) - Customer reviews

## What the App Uses

The store app currently displays products with:
- ✅ Product name and slug
- ✅ Product choice
- ✅ Product price (displayed in card)
- ✅ Categories (shown below product name)
- ✅ Images (displayed as gallery/carousel in card)
- ⏳ Variants, Collections, OrderItems, Reviews (for future use)

## GraphQL Queries

The app makes these GraphQL queries to fetch data:

**GET_PRODUCTS**
```graphql
query GetProducts {
  products(first: 100) {
    id
    name
    slug
    price
    choice
    categories {
      id
      name
      slug
    }
    images {
      id
      url
      fileName
    }
  }
}
```

**GET_PRODUCTS_BY_CATEGORY**
```graphql
query GetProductsByCategory($categoryId: ID!) {
  products(first: 100, where: { categories_some: { id: $categoryId } }) {
    id
    name
    slug
    price
    choice
    categories {
      id
      name
      slug
    }
    images {
      id
      url
      fileName
    }
  }
}
```

**SEARCH_PRODUCTS**
```graphql
query SearchProducts($search: String!) {
  products(first: 100, where: { name_contains: $search }) {
    id
    name
    slug
    price
    choice
    categories {
      id
      name
      slug
    }
    images {
      id
      url
      fileName
    }
  }
}
```

## API Configuration

1. Go to **Project Settings** → **API Access**
2. Copy your **Content API** endpoint
3. Add it to `.env.local` in the project root
4. Restart the app

That's it! The app will start fetching and displaying your products.
