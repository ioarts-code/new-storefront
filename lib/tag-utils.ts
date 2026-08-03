import { Product, Tag } from '@/lib/types';

export function hasSelectedTag(productTags: Tag[] | undefined, selectedTagIds: string[]) {
  if (selectedTagIds.length === 0) {
    return true;
  }

  return (productTags ?? []).some((tag) => selectedTagIds.includes(tag.id));
}

export function toggleTagSelection(currentTagIds: string[], tagId: string) {
  if (currentTagIds.includes(tagId)) {
    return currentTagIds.filter((id) => id !== tagId);
  }

  return [...currentTagIds, tagId];
}

export function getVisibleProducts(products: Product[] | undefined, selectedTagIds: string[]) {
  if (!products) {
    return [];
  }

  return selectedTagIds.length > 0
    ? products.filter((product) => hasSelectedTag(product.tags, selectedTagIds))
    : products;
}
