/**
 * Generate all possible combinations of an array
 *
 * @param items
 * @param prefix
 * @returns
 */
export const generateCombinations = (items: any, prefix: any = []) => {
  if (!items.length) return [prefix];

  let combinations = [prefix];
  for (let i = 0; i < items.length; i++) {
    let current = items[i];
    let rest = items.slice(i + 1);
    combinations = combinations.concat(
      generateCombinations(rest, prefix.concat(current))
    );
  }
  return combinations;
};

/**
 * Return an English language string of a list of items
 * @param list
 * @returns
 */
export const listToString = (list: string[]) => {
  if (list.length === 1) {
    return list[0];
  } else if (list.length === 2) {
    return list.join(' and ');
  } else {
    const allButLast = list.slice(0, list.length - 1).join(', ');
    return `${allButLast} and ${list[list.length - 1]}`;
  }
};
