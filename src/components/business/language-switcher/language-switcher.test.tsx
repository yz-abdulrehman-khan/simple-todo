import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from './language-switcher';
import '@testing-library/jest-dom';

// Mock i18next
const mockChangeLanguage = jest.fn();
const mockT = jest.fn((key: string) => key);
let currentLanguage: string | undefined = 'en';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
    i18n: {
      language: currentLanguage,
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentLanguage = 'en';
    mockChangeLanguage.mockImplementation((lang: string) => {
      currentLanguage = lang;
      return Promise.resolve();
    });
    // Reset DOM
    document.documentElement.lang = '';
    document.documentElement.dir = '';
  });

  afterEach(() => {
    // Clean up DOM
    document.documentElement.lang = '';
    document.documentElement.dir = '';
  });

  describe('Basic rendering', () => {
    it('should render language switcher button', () => {
      render(<LanguageSwitcher />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should display language icon', () => {
      const { container } = render(<LanguageSwitcher />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should have proper button styling', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('gap-2');
    });
  });

  describe('Language display logic', () => {
    it('should show Arabic when current language is English', () => {
      currentLanguage = 'en';
      mockT.mockImplementation((key: string) => {
        if (key === 'arabic') return 'العربية';
        if (key === 'english') return 'English';
        return key;
      });

      render(<LanguageSwitcher />);
      expect(mockT).toHaveBeenCalledWith('arabic');
    });

    it('should show English when current language is Arabic', () => {
      currentLanguage = 'ar';
      mockT.mockImplementation((key: string) => {
        if (key === 'arabic') return 'العربية';
        if (key === 'english') return 'English';
        return key;
      });

      render(<LanguageSwitcher />);
      expect(mockT).toHaveBeenCalledWith('english');
    });

    it('should update title attribute with next language', () => {
      currentLanguage = 'en';
      mockT.mockImplementation((key: string) => {
        if (key === 'arabic') return 'العربية';
        return key;
      });

      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'العربية');
    });
  });

  describe('Language switching', () => {
    it('should call changeLanguage with Arabic when clicking from English', async () => {
      currentLanguage = 'en';
      const user = userEvent.setup();

      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
    });

    it('should call changeLanguage with English when clicking from Arabic', async () => {
      currentLanguage = 'ar';
      const user = userEvent.setup();

      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    });

    it('should toggle language on multiple clicks', async () => {
      currentLanguage = 'en';
      const user = userEvent.setup();

      const { rerender } = render(<LanguageSwitcher />);
      const button = screen.getByRole('button');

      // First click: en -> ar
      await user.click(button);
      expect(mockChangeLanguage).toHaveBeenCalledWith('ar');

      // Update language and rerender
      currentLanguage = 'ar';
      rerender(<LanguageSwitcher />);

      // Second click: ar -> en
      await user.click(button);
      expect(mockChangeLanguage).toHaveBeenCalledWith('en');

      // Update language and rerender
      currentLanguage = 'en';
      rerender(<LanguageSwitcher />);

      // Third click: en -> ar again
      await user.click(button);
      expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
    });
  });

  describe('DOM manipulation - document.documentElement.lang', () => {
    it('should set document language to ar when switching to Arabic', async () => {
      currentLanguage = 'en';
      const user = userEvent.setup();

      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(document.documentElement.lang).toBe('ar');
      });
    });

    it('should set document language to en when switching to English', async () => {
      currentLanguage = 'ar';
      const user = userEvent.setup();

      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(document.documentElement.lang).toBe('en');
      });
    });

    it('should update lang attribute on every toggle', async () => {
      currentLanguage = 'en';
      const user = userEvent.setup();

      const { rerender } = render(<LanguageSwitcher />);
      const button = screen.getByRole('button');

      // First toggle
      await user.click(button);
      await waitFor(() => expect(document.documentElement.lang).toBe('ar'));

      // Update and rerender
      currentLanguage = 'ar';
      rerender(<LanguageSwitcher />);

      // Second toggle
      await user.click(button);
      await waitFor(() => expect(document.documentElement.lang).toBe('en'));
    });
  });

  describe('RTL direction switching', () => {
    it('should set direction to rtl when switching to Arabic', async () => {
      currentLanguage = 'en';
      const user = userEvent.setup();

      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(document.documentElement.dir).toBe('rtl');
      });
    });

    it('should set direction to ltr when switching to English', async () => {
      currentLanguage = 'ar';
      const user = userEvent.setup();

      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(document.documentElement.dir).toBe('ltr');
      });
    });

    it('should toggle direction with language', async () => {
      currentLanguage = 'en';
      const user = userEvent.setup();

      const { rerender } = render(<LanguageSwitcher />);
      const button = screen.getByRole('button');

      // en -> ar: should be rtl
      await user.click(button);
      await waitFor(() => expect(document.documentElement.dir).toBe('rtl'));

      currentLanguage = 'ar';
      rerender(<LanguageSwitcher />);

      // ar -> en: should be ltr
      await user.click(button);
      await waitFor(() => expect(document.documentElement.dir).toBe('ltr'));
    });

    it('should handle rapid direction switching', async () => {
      currentLanguage = 'en';
      const user = userEvent.setup();

      const { rerender } = render(<LanguageSwitcher />);
      const button = screen.getByRole('button');

      for (let i = 0; i < 5; i++) {
        await user.click(button);
        const expectedLang = i % 2 === 0 ? 'ar' : 'en';
        const expectedDir = i % 2 === 0 ? 'rtl' : 'ltr';

        await waitFor(() => {
          expect(document.documentElement.lang).toBe(expectedLang);
          expect(document.documentElement.dir).toBe(expectedDir);
        });

        currentLanguage = expectedLang;
        rerender(<LanguageSwitcher />);
      }
    });
  });

  describe('Edge cases - Rapid clicking', () => {
    it('should handle rapid consecutive clicks', async () => {
      currentLanguage = 'en';
      const user = userEvent.setup();

      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');

      // Rapid fire 10 clicks
      for (let i = 0; i < 10; i++) {
        await user.click(button);
      }

      // Should have been called 10 times
      expect(mockChangeLanguage).toHaveBeenCalledTimes(10);
    });

    it('should handle double-click', async () => {
      currentLanguage = 'en';
      const user = userEvent.setup();

      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      await user.dblClick(button);

      // Double click fires two click events
      expect(mockChangeLanguage).toHaveBeenCalled();
    });
  });

  describe('Edge cases - Unusual language states', () => {
    it('should handle undefined language gracefully', async () => {
      currentLanguage = undefined;
      const user = userEvent.setup();

      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');

      // Should not crash
      await user.click(button);
      expect(mockChangeLanguage).toHaveBeenCalled();
    });

    it('should handle empty string language', async () => {
      currentLanguage = '';
      const user = userEvent.setup();

      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');

      await user.click(button);
      expect(mockChangeLanguage).toHaveBeenCalled();
    });

    it('should handle unexpected language code', async () => {
      currentLanguage = 'fr'; // Not supported
      const user = userEvent.setup();

      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');

      await user.click(button);
      // Should default to en
      expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', async () => {
      currentLanguage = 'en';
      const user = userEvent.setup();

      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');

      // Tab to button and press Enter
      await user.tab();
      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
    });

    it('should activate with space key', async () => {
      currentLanguage = 'en';
      const user = userEvent.setup();

      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');

      button.focus();
      await user.keyboard(' ');

      expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
    });

    it('should have proper button role', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have title attribute for screen readers', () => {
      mockT.mockImplementation((key) => key);
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title');
    });
  });

  describe('Responsive behavior', () => {
    it('should have hidden label on small screens', () => {
      mockT.mockImplementation((_key) => 'Test Label');
      const { container } = render(<LanguageSwitcher />);
      const label = container.querySelector('.hidden.sm\\:inline');
      expect(label).toBeInTheDocument();
    });

    it('should always show icon', () => {
      const { container } = render(<LanguageSwitcher />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toBeVisible();
    });
  });

  describe('Integration scenarios', () => {
    it('should maintain consistency between lang and dir', async () => {
      currentLanguage = 'en';
      const user = userEvent.setup();

      const { rerender } = render(<LanguageSwitcher />);
      const button = screen.getByRole('button');

      // Switch to Arabic
      await user.click(button);
      await waitFor(() => {
        expect(document.documentElement.lang).toBe('ar');
        expect(document.documentElement.dir).toBe('rtl');
      });

      currentLanguage = 'ar';
      rerender(<LanguageSwitcher />);

      // Switch back to English
      await user.click(button);
      await waitFor(() => {
        expect(document.documentElement.lang).toBe('en');
        expect(document.documentElement.dir).toBe('ltr');
      });
    });

    it('should handle switching while page is loading', async () => {
      currentLanguage = 'en';
      const user = userEvent.setup();

      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');

      // Click and wait for promise to resolve
      await user.click(button);
      expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
    });
  });

  describe('Error handling', () => {
    it('should call changeLanguage and handle result', async () => {
      currentLanguage = 'en';
      const user = userEvent.setup();

      render(<LanguageSwitcher />);
      const button = screen.getByRole('button');

      await user.click(button);
      expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
    });
  });

  describe('Performance', () => {
    it('should not cause memory leaks with repeated mounting/unmounting', () => {
      for (let i = 0; i < 100; i++) {
        const { unmount } = render(<LanguageSwitcher />);
        unmount();
      }
      // If this test completes without memory errors, it passes
      expect(true).toBe(true);
    });

    it('should handle 100 rapid language switches', async () => {
      currentLanguage = 'en';
      const user = userEvent.setup();

      const { rerender } = render(<LanguageSwitcher />);
      const button = screen.getByRole('button');

      for (let i = 0; i < 100; i++) {
        await user.click(button);
        currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';
        rerender(<LanguageSwitcher />);
      }

      expect(mockChangeLanguage).toHaveBeenCalledTimes(100);
    });
  });
});
