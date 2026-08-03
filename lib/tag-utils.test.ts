import assert from 'node:assert/strict';
import test from 'node:test';

import { hasSelectedTag, toggleTagSelection } from './tag-utils';

test('returns true when no tag filters are selected', () => {
  assert.equal(hasSelectedTag([{ id: '1', name: 'Gaming' }], []), true);
});

test('matches products when any selected tag is present', () => {
  const productTags = [{ id: '1', name: 'Gaming' }, { id: '2', name: 'Film' }];
  assert.equal(hasSelectedTag(productTags, ['2']), true);
  assert.equal(hasSelectedTag(productTags, ['3']), false);
});

test('toggles tag selection without replacing existing selections', () => {
  assert.deepEqual(toggleTagSelection([], '1'), ['1']);
  assert.deepEqual(toggleTagSelection(['1'], '1'), []);
  assert.deepEqual(toggleTagSelection(['1'], '2'), ['1', '2']);
});
