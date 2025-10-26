// Dedicated i18n config for Storybook - can't reuse the app config because it includes browser language detection which interferes with story controls
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import taskHeaderEn from '../src/components/business/task-header/task-header.en.json';
import taskHeaderAr from '../src/components/business/task-header/task-header.ar.json';

import taskStatsEn from '../src/components/business/task-stats/task-stats.en.json';
import taskStatsAr from '../src/components/business/task-stats/task-stats.ar.json';

import taskListEn from '../src/components/business/task-list/task-list.en.json';
import taskListAr from '../src/components/business/task-list/task-list.ar.json';

import taskModalEn from '../src/components/business/task-modal/task-modal.en.json';
import taskModalAr from '../src/components/business/task-modal/task-modal.ar.json';

import taskItemEn from '../src/components/business/task-item/task-item.en.json';
import taskItemAr from '../src/components/business/task-item/task-item.ar.json';

import todoPageEn from '../src/pages/todo-page/todo-page.en.json';
import todoPageAr from '../src/pages/todo-page/todo-page.ar.json';

import languageSwitcherEn from '../src/components/business/language-switcher/language-switcher.en.json';
import languageSwitcherAr from '../src/components/business/language-switcher/language-switcher.ar.json';

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

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Fixed language instead of auto-detect
  fallbackLng: 'en',
  defaultNS: 'taskHeader',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false, // Prevents React Suspense from blocking story rendering
  },
});

export default i18n;
