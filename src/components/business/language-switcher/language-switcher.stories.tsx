import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './language-switcher';

const meta = {
  title: 'Business/LanguageSwitcher',
  component: LanguageSwitcher,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The language switcher allows users to toggle between English and Arabic. Click the button to switch languages and see RTL/LTR direction changes.',
      },
    },
  },
};

// Wrapper needed to force language state since Storybook doesn't auto-detect language
const InEnglishWrapper = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage('en');
  }, [i18n]);

  return <LanguageSwitcher />;
};

export const InEnglish: Story = {
  render: () => <InEnglishWrapper />,
  parameters: {
    docs: {
      description: {
        story:
          'Language switcher when the app is in English. Shows "العربية" to indicate switching to Arabic.',
      },
    },
  },
};

const InArabicWrapper = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage('ar');
  }, [i18n]);

  return <LanguageSwitcher />;
};

export const InArabic: Story = {
  render: () => <InArabicWrapper />,
  parameters: {
    docs: {
      description: {
        story:
          'Language switcher when the app is in Arabic. Shows "English" to indicate switching to English. Note: You need to click the button first to see this state.',
      },
    },
  },
};
