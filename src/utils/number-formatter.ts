export const toArabicNumerals = (num: number): string => {
  // Maps Western digits (0-9) to Arabic-Indic numerals (٠-٩)
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return (
    num
      .toString()
      .split('')
      // Keep non-digits like decimal points and negative signs unchanged
      .map((digit) => (digit >= '0' && digit <= '9' ? arabicNumerals[parseInt(digit)] : digit))
      .join('')
  );
};

export const formatNumber = (num: number, locale: string): string => {
  return locale === 'ar' ? toArabicNumerals(num) : num.toString();
};
