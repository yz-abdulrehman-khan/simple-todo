import { toArabicNumerals, formatNumber } from './number-formatter';

describe('number-formatter', () => {
  describe('toArabicNumerals', () => {
    describe('Basic functionality', () => {
      it('should convert single digit numbers', () => {
        expect(toArabicNumerals(0)).toBe('٠');
        expect(toArabicNumerals(1)).toBe('١');
        expect(toArabicNumerals(5)).toBe('٥');
        expect(toArabicNumerals(9)).toBe('٩');
      });

      it('should convert multi-digit numbers', () => {
        expect(toArabicNumerals(12)).toBe('١٢');
        expect(toArabicNumerals(99)).toBe('٩٩');
        expect(toArabicNumerals(123)).toBe('١٢٣');
      });

      it('should convert numbers with zeros', () => {
        expect(toArabicNumerals(10)).toBe('١٠');
        expect(toArabicNumerals(100)).toBe('١٠٠');
        expect(toArabicNumerals(101)).toBe('١٠١');
        expect(toArabicNumerals(1000)).toBe('١٠٠٠');
      });
    });

    describe('Edge cases', () => {
      it('should handle zero', () => {
        expect(toArabicNumerals(0)).toBe('٠');
      });

      it('should handle large numbers', () => {
        expect(toArabicNumerals(999999)).toBe('٩٩٩٩٩٩');
        expect(toArabicNumerals(1234567)).toBe('١٢٣٤٥٦٧');
      });

      it('should handle very large numbers', () => {
        const largeNum = 999999999999;
        expect(toArabicNumerals(largeNum)).toBe('٩٩٩٩٩٩٩٩٩٩٩٩');
      });

      it('should handle negative numbers by only converting digits', () => {
        // Note: We're not handling negative signs, just converting digits
        const result = toArabicNumerals(-123);
        expect(result).toContain('١');
        expect(result).toContain('٢');
        expect(result).toContain('٣');
      });

      it('should handle numbers with repeating digits', () => {
        expect(toArabicNumerals(111)).toBe('١١١');
        expect(toArabicNumerals(555)).toBe('٥٥٥');
        expect(toArabicNumerals(999)).toBe('٩٩٩');
      });

      it('should handle sequential numbers', () => {
        expect(toArabicNumerals(123456789)).toBe('١٢٣٤٥٦٧٨٩');
      });

      it('should handle palindrome numbers', () => {
        expect(toArabicNumerals(121)).toBe('١٢١');
        expect(toArabicNumerals(1221)).toBe('١٢٢١');
      });
    });

    describe('Boundary values', () => {
      it('should handle maximum safe integer', () => {
        const maxSafe = Number.MAX_SAFE_INTEGER; // 9007199254740991
        const result = toArabicNumerals(maxSafe);
        expect(result).toBe('٩٠٠٧١٩٩٢٥٤٧٤٠٩٩١');
      });

      it('should handle minimum safe integer', () => {
        const minSafe = Number.MIN_SAFE_INTEGER; // -9007199254740991
        const result = toArabicNumerals(minSafe);
        // Should contain the digits
        expect(result).toMatch(/٩|٠|٧|١|٢|٥|٤/);
      });

      it('should handle powers of 10', () => {
        expect(toArabicNumerals(10)).toBe('١٠');
        expect(toArabicNumerals(100)).toBe('١٠٠');
        expect(toArabicNumerals(1000)).toBe('١٠٠٠');
        expect(toArabicNumerals(10000)).toBe('١٠٠٠٠');
      });
    });

    describe('Realistic task counts', () => {
      it('should handle typical task counts', () => {
        expect(toArabicNumerals(0)).toBe('٠');
        expect(toArabicNumerals(1)).toBe('١');
        expect(toArabicNumerals(5)).toBe('٥');
        expect(toArabicNumerals(10)).toBe('١٠');
        expect(toArabicNumerals(25)).toBe('٢٥');
        expect(toArabicNumerals(50)).toBe('٥٠');
        expect(toArabicNumerals(100)).toBe('١٠٠');
      });

      it('should handle page numbers', () => {
        expect(toArabicNumerals(1)).toBe('١');
        expect(toArabicNumerals(2)).toBe('٢');
        expect(toArabicNumerals(3)).toBe('٣');
        expect(toArabicNumerals(10)).toBe('١٠');
        expect(toArabicNumerals(20)).toBe('٢٠');
      });
    });
  });

  describe('formatNumber', () => {
    describe('English locale', () => {
      it('should return Western numerals for English', () => {
        expect(formatNumber(0, 'en')).toBe('0');
        expect(formatNumber(5, 'en')).toBe('5');
        expect(formatNumber(123, 'en')).toBe('123');
        expect(formatNumber(999, 'en')).toBe('999');
      });

      it('should handle large numbers in English', () => {
        expect(formatNumber(1000, 'en')).toBe('1000');
        expect(formatNumber(999999, 'en')).toBe('999999');
      });
    });

    describe('Arabic locale', () => {
      it('should return Arabic numerals for Arabic', () => {
        expect(formatNumber(0, 'ar')).toBe('٠');
        expect(formatNumber(5, 'ar')).toBe('٥');
        expect(formatNumber(123, 'ar')).toBe('١٢٣');
        expect(formatNumber(999, 'ar')).toBe('٩٩٩');
      });

      it('should handle large numbers in Arabic', () => {
        expect(formatNumber(1000, 'ar')).toBe('١٠٠٠');
        expect(formatNumber(999999, 'ar')).toBe('٩٩٩٩٩٩');
      });
    });

    describe('Locale edge cases', () => {
      it('should default to Western numerals for unknown locale', () => {
        expect(formatNumber(123, 'fr')).toBe('123');
        expect(formatNumber(456, 'es')).toBe('456');
        expect(formatNumber(789, 'de')).toBe('789');
      });

      it('should handle empty string locale', () => {
        expect(formatNumber(123, '')).toBe('123');
      });

      it('should handle case variations of locale', () => {
        // Assuming we want exact match 'ar'
        expect(formatNumber(123, 'AR')).toBe('123'); // Not 'ar', so Western
        expect(formatNumber(123, 'aR')).toBe('123');
      });

      it('should handle locale with country code', () => {
        expect(formatNumber(123, 'ar-SA')).toBe('123'); // Not exact 'ar', so Western
        expect(formatNumber(123, 'en-US')).toBe('123');
      });

      it('should handle undefined/null-like locale', () => {
        expect(formatNumber(123, 'undefined')).toBe('123');
        expect(formatNumber(123, 'null')).toBe('123');
      });
    });

    describe('Number edge cases', () => {
      it('should handle zero in both locales', () => {
        expect(formatNumber(0, 'en')).toBe('0');
        expect(formatNumber(0, 'ar')).toBe('٠');
      });

      it('should handle single digits in both locales', () => {
        for (let i = 0; i <= 9; i++) {
          expect(formatNumber(i, 'en')).toBe(i.toString());
          expect(formatNumber(i, 'ar')).toBe(toArabicNumerals(i));
        }
      });

      it('should handle numbers with all same digits', () => {
        expect(formatNumber(111, 'en')).toBe('111');
        expect(formatNumber(111, 'ar')).toBe('١١١');
        expect(formatNumber(555, 'en')).toBe('555');
        expect(formatNumber(555, 'ar')).toBe('٥٥٥');
      });
    });

    describe('Real-world pagination scenarios', () => {
      it('should format page numbers correctly for both locales', () => {
        const pages = [1, 2, 3, 10, 25, 50, 100];

        pages.forEach((page) => {
          const enResult = formatNumber(page, 'en');
          const arResult = formatNumber(page, 'ar');

          expect(enResult).toBe(page.toString());
          expect(arResult).toBe(toArabicNumerals(page));
        });
      });

      it('should format task counts correctly for both locales', () => {
        const counts = [0, 1, 5, 10, 50, 100, 999];

        counts.forEach((count) => {
          const enResult = formatNumber(count, 'en');
          const arResult = formatNumber(count, 'ar');

          expect(enResult).toBe(count.toString());
          expect(arResult).toBe(toArabicNumerals(count));
        });
      });
    });

    describe('Performance edge cases', () => {
      it('should handle rapid successive calls', () => {
        for (let i = 0; i < 1000; i++) {
          const enResult = formatNumber(i, 'en');
          const arResult = formatNumber(i, 'ar');

          expect(enResult).toBe(i.toString());
          expect(arResult).toBe(toArabicNumerals(i));
        }
      });

      it('should handle alternating locales', () => {
        for (let i = 0; i < 100; i++) {
          const locale = i % 2 === 0 ? 'en' : 'ar';
          const result = formatNumber(i, locale);

          if (locale === 'en') {
            expect(result).toBe(i.toString());
          } else {
            expect(result).toBe(toArabicNumerals(i));
          }
        }
      });
    });
  });
});
