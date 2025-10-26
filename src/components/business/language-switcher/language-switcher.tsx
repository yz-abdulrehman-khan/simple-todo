import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';
import { Languages } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation('languageSwitcher');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
    // Update text direction for RTL languages
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  // Show what language you'll switch TO, not the current one
  const nextLanguageLabel = i18n.language === 'en' ? t('arabic') : t('english');

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
      title={nextLanguageLabel}
    >
      <Languages className="w-4 h-4" />
      <span className="hidden sm:inline">{nextLanguageLabel}</span>
    </Button>
  );
};
