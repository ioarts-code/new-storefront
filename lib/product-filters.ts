import { Category, Product } from '@/lib/types';

const TSHIRT_CATEGORY_KEYS = new Set(['tshirt', 'tshirts']);

function normalizeCategoryValue(value?: string | null) {
  return (value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

export function isTShirtCategory(category: Category) {
  const normalizedName = normalizeCategoryValue(category.name);
  const normalizedSlug = normalizeCategoryValue(category.slug);

  return (
    TSHIRT_CATEGORY_KEYS.has(normalizedName) ||
    TSHIRT_CATEGORY_KEYS.has(normalizedSlug)
  );
}

export function filterProductsToTShirts(products: Product[]) {
  return products.filter((product) =>
    (product.categories ?? []).some((category) => isTShirtCategory(category))
  );
}
