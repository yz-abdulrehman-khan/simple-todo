// Collocated translations - each component keeps its translations next to its code instead of a centralized locale folder
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import taskHeaderEn from '@/components/business/task-header/task-header.en.json';
import taskHeaderAr from '@/components/business/task-header/task-header.ar.json';

import taskStatsEn from '@/components/business/task-stats/task-stats.en.json';
import taskStatsAr from '@/components/business/task-stats/task-stats.ar.json';

import taskListEn from '@/components/business/task-list/task-list.en.json';
import taskListAr from '@/components/business/task-list/task-list.ar.json';

import taskModalEn from '@/components/business/task-modal/task-modal.en.json';
import taskModalAr from '@/components/business/task-modal/task-modal.ar.json';

import taskItemEn from '@/components/business/task-item/task-item.en.json';
import taskItemAr from '@/components/business/task-item/task-item.ar.json';

import todoPageEn from '@/pages/todo-page/todo-page.en.json';
import todoPageAr from '@/pages/todo-page/todo-page.ar.json';

import languageSwitcherEn from '@/components/business/language-switcher/language-switcher.en.json';
import languageSwitcherAr from '@/components/business/language-switcher/language-switcher.ar.json';

const resources = {
  en: {
    taskHeader: taskHeaderEn,
    taskStats: taskStatsEn,
    taskList: taskListEn,
    taskModal: taskModalEn,
    taskItem: taskItemEn,
    todoPage: todoPageEn,
    languageSwitcher: languageSwitcherEn,
  },
  ar: {
    taskHeader: taskHeaderAr,
    taskStats: taskStatsAr,
    taskList: taskListAr,
    taskModal: taskModalAr,
    taskItem: taskItemAr,
    todoPage: todoPageAr,
    languageSwitcher: languageSwitcherAr,
  },
};

i18n
  .use(LanguageDetector) // Auto-detect from localStorage or browser settings
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'taskHeader',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'], // Check localStorage first, then browser language
      caches: ['localStorage'], // Remember user's choice
    },
  });

// Set initial direction based on detected language
const currentLanguage = i18n.language;
document.documentElement.lang = currentLanguage;
document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';

export default i18n;
