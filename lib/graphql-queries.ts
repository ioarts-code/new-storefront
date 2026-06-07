export const GET_PRODUCTS = /* GraphQL */ `
  query GetProducts {
    products(first: 100) {
      id
      name
      slug
      description
      price
      download {
        url
        fileName
      }
      categories {
        id
        name
        slug
      }
      tags {
        id
        name
      }
      images {
        id
        url
        fileName
      }
    }
  }
`;

export const GET_PRODUCTS_BY_TAG = /* GraphQL */ `
  query GetProductsByTag($tagId: ID!) {
    products(first: 100, where: { tags_some: { id: $tagId } }) {
      id
      name
      slug
      description
      price
      download {
        url
        fileName
      }
      tags {
        id
        name
      }
      images {
        id
        url
        fileName
      }
    }
  }
`;

export const SEARCH_PRODUCTS = /* GraphQL */ `
  query SearchProducts($search: String!) {
    products(first: 100, where: { name_contains: $search }) {
      id
      name
      slug
      description
      price
      download {
        url
        fileName
      }
      tags {
        id
        name
      }
      images {
        id
        url
        fileName
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = /* GraphQL */ `
  query GetProductBySlug($slug: String!) {
    products(where: { slug: $slug }, first: 1) {
      id
      name
      slug
      description
      price
      download {
        url
        fileName
      }
      categories {
        id
        name
        slug
      }
      tags {
        id
        name
      }
      images {
        id
        url
        fileName
      }
    }
  }
`;
