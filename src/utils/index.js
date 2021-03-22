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

export function configDebounce(time = 600) {
  let timeoutObj = null;

  function debounce(func) {
    debounce.clear();

    if (typeof func !== 'function' || typeof time !== 'number') return;
    timeoutObj = setTimeout(func, time);
  }

  debounce.clear = () => {
    if (timeoutObj !== null) clearTimeout(timeoutObj);
  };

  return debounce;
}
