/**
 * Format a number so it can nicely be rendered
 * @param num the number to be formatted, this can be a number or a string representation of a number. It should be less than 1 quintillion (10^15)
 * @param decimals the number of decimals to keep after formatting, if not specified it will keep 2
 * @returns nicely formatted number, for example if number is 11023 this will return 1.10K
 */
export function formatNumber(num: number | string, decimals: number = 2): string {
  const suffixes = ["", "K", "M", "B", "T"];

  let formattedNum = num;

  // If it is represented as a sting, convert to number first
  if (typeof formattedNum === "string") {
    formattedNum = parseFloat(formattedNum);

    if (isNaN(formattedNum)) {
      return num as string; // It isn't a number
    }
  }

  let suffixIndex = Math.floor((formattedNum.toFixed(0).toString().length - 1) / 3);

  // Clamp to max suffix
  if (suffixIndex >= suffixes.length) {
    suffixIndex = 0;
  }

  formattedNum /= 10 ** (3 * suffixIndex);

  return formattedNum.toFixed(decimals).toString() + suffixes[suffixIndex];
}
