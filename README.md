# Todo App

A simple todo app built with React and TypeScript. Add tasks, mark them done, edit them, or delete them.

## What's Inside

**Stack:**
- React 18.3 with hooks
- TypeScript 5.5 (strict mode, no shortcuts)
- Tailwind CSS for styling
- ShadCN UI components
- Vite for fast builds
- Zod for validation
- Jest + React Testing Library (95%+ coverage)
- Storybook for component docs
- i18next for English/Arabic support with RTL


## How to Run

```bash
# Install stuff
npm install

# Start the backend (runs on port 3001)
cd api && npm start

# Start the frontend (runs on port 5173)
npm run dev

# Run tests
npm test

# See test coverage
npm test:coverage

# Open Storybook
npm run storybook
```

Open http://localhost:5173 and you're good to go.

## Project Structure

```
src/
├── components/
│   ├── ui/              # Basic components (Button, Modal, Checkbox, etc.)
│   └── business/        # App-specific components (TaskList, TaskItem, etc.)
├── hooks/               # Custom hooks for data fetching and mutations
├── services/            # API calls and HTTP client
├── utils/               # Helper functions (error handling, formatting, etc.)
├── types/               # TypeScript types
├── constants/           # App constants (API endpoints, modal modes, etc.)
├── validations/         # Zod schemas
├── configs/             # Config files (API, pagination, etc.)
└── i18n/                # Translation setup
```

## How It Works

### Data Flow

1. **Components** use custom hooks (`useTasks`, `useTaskMutations`) to fetch and update data
2. **Hooks** call the API through a service layer
3. **Service layer** uses a generic HTTP client with error handling
4. **HTTP client** makes fetch requests and handles errors
5. **Errors** get formatted into user-friendly messages

No global state. Components refetch data after mutations. Simple and predictable.

### Why No Zustand/Redux?

The app is small enough that custom hooks + server state work fine. Each operation refetches fresh data from the backend, so there's no complex client-side state to manage. If this grew bigger, I'd probably add React Query or SWR before reaching for Redux.

### Translations

Translations live next to their components instead of one giant folder:
```
task-header/
├── task-header.tsx
├── task-header.test.tsx
├── task-header.en.json
└── task-header.ar.json
```

Easier to maintain. When you delete a component, its translations go with it.

## Features

- ✅ Add, edit, delete (soft), and complete tasks
- ✅ Pagination (10 tasks per page)
- ✅ Task counts (uncompleted, completed, deleted)
- ✅ Double-click to edit
- ✅ Modal for add/edit with textarea
- ✅ English/Arabic with RTL support
- ✅ Error handling with retry
- ✅ Form validation with Zod
- ✅ Responsive design
- ✅ 95%+ test coverage
- ✅ Storybook for all components
- ✅ Pre-commit hooks (lint, format, type check)

## Design Decisions

### Custom Hooks Over Libraries

I built `useTasks` and `useTaskMutations` instead of using React Query. For a small app, it's less overhead. Just fetch, update, refetch. No cache invalidation.

### Collocated Translations

Translations sit next to components. When you work on `TaskHeader`, everything you need is in one folder. No jumping between `src/components` and `src/locales`.

### Error Boundaries

Error handling happens at multiple levels:
1. HTTP client catches network errors
2. Hooks handle API errors
3. Components show error UI with retry button
4. Even if the backend dies, the header still renders

### Testing Approach

Tests focus on behavior, not implementation:
- User clicks button → modal opens
- User submits form → API called with correct data
- API fails → error message shows

No testing internal state or private methods. If a user can't see it, we don't test it.

### Why Fetch Over Axios?

Fetch is built-in and does everything we need. Axios adds 13KB for features we're not using (interceptors, request cancellation, etc.). Kept it simple.

## Test Coverage

```bash
npm test:coverage
```

## Storybook

```bash
npm run storybook
```

Every component has stories showing:
- Default state
- Loading state
- Error state
- Different variants
- Arabic/RTL version

## Git History

Commits follow conventional commits:
- `feat:` new features
- `fix:` bug fixes
- `refactor:` code improvements
- `test:` test updates
- `docs:` documentation
- `chore:` tooling/config

## Trade-offs

**No optimistic updates** - After each action, we refetch from the server. Simple but causes small delays. For a production app, I'd add optimistic updates or use React Query's built-in support.

**No debouncing on API calls** - Each click triggers a request immediately. Fine for now.

## What I'd Add Next

If this were a real product:
1. **React Query** - Better caching and automatic refetching
2. **Optimistic updates** - Instant feedback on actions
3. **Loading skeletons** - Instead of spinner, show placeholder UI
4. **Drag and drop** - Reorder tasks
5. **Undo delete** - Restore deleted tasks
6. **Keyboard shortcuts** - Press `n` for new task, `Enter` to save
7. **Dark mode** - Because everyone wants dark mode
8. **Search/filter** - Find tasks quickly
9. **Due dates** - Add deadlines to tasks
10. **Categories/tags** - Organize tasks

## API

Backend runs on `http://localhost:3001`. Check `api/README.md` for API docs or import `postman_collection.json` into Postman.

## License

Do whatever you want with it.
