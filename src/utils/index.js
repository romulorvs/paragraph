export const ifff = (value, truthy, falsy) => {
  if (typeof truthy === 'undefined') return undefined;
  if (value) {
    if (typeof truthy !== 'function') return truthy;
    return truthy(value);
  }

  if (typeof falsy === 'undefined') return undefined;
  if (typeof falsy !== 'function') return falsy;
  return falsy(value);
};
