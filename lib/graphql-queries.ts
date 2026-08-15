export const GET_PRODUCTS = /* GraphQL */ `
  query GetProducts {
    products(first: 100) {
      id
      name
      slug
      price
      description
      choice
      copyright
      heroImage {
        id
        url
        fileName
      }
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
      price
      description
      choice
      copyright
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
      price
      choice
      copyright
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
      price
      linkToEtsy
      description
      choice
      copyright
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

export const GET_PRODUCTS_BY_SLUGS = /* GraphQL */ `
  query GetProductsBySlugs($slugs: [String!]) {
    products(where: { slug_in: $slugs }, first: 10) {
      id
      name
      slug
      price
      choice
      copyright
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

export const GET_PRODUCTS_BY_IDS = /* GraphQL */ `
  query GetProductsByIds($ids: [ID!]) {
    products(where: { id_in: $ids }, first: 100) {
      id
      name
      choice
      download {
        url
        fileName
      }
    }
  }
`;
