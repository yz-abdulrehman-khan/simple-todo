# Task Description: Frontend Engineer - Todo Application

## Objective
Develop a web-based Todo application using **ReactJS** with the given stack. The goal is to evaluate your coding skills, architectural decisions, state management expertise, and ability to write documentation and tests.

---

## Technical Stack Requirements
- ReactJS, NextJS, VueJS, or using any UI Framework.
- Zustand (State Management) (if needed)
- Tailwind CSS
- ShadCN (UI Components)
- TypeScript
- Axios or Fetch (for API requests if necessary)
- Jest (for Unit Testing)
- Zod or Yup (for Form Validation)
- Vite or Create-React-App (Project Setup)
- Storybook (for Documentation)

---

## Business Requirements
The Todo application should support the following functionalities:

### 1. Task Management
- Users should be able to **add** new tasks.
- Users should be able to **edit** tasks by double-clicking on them.
- Users should be able to **delete** tasks (Soft Delete).
- Users should be able to **mark tasks as completed** by checking a checkbox.
- Users should be able to **view tasks in a paginated list**.

### 2. UI & UX
- A header should display the following:
  - Count of **uncompleted tasks**.
  - Count of **completed tasks**.
  - Count of **deleted tasks**.
- An **"Add Task"** button should be available in the header.
- Clicking on "Add Task" should open a **modal** with:
  - A **textarea** for entering the task.
  - A **save** button.
  - A **cancel** button.
- The same modal should be used for editing a task.
- You can use [UntitledUI](https://www.untitledui.com/free-figma-ui-kit) as a reference for the UI.
- Check the mockup designed under `/mockup` folder.

### 3. Pagination Support
- The tasks list should support **pagination** to handle a large number of tasks efficiently.

---

## API Endpoints

Please check the `postman_collection.json` for all available endpoints. Also, check and read the `README.md` file under `/api` folder for more details.

## Deliverables
### 1. Fully Functional Todo Application
- Please make sure to implement all features as described.
- Use the specified tech stack.

### 2. Code Quality & Best Practices
- Follow best practices for **code organization, modularity, and reusability**.
- Use **Zod or Yup** for form validation.
- Use **TypeScript** effectively.
- Maintain a **clean folder structure**.
- Use Prettier for code formatting (Airbnb Style).
- Configure ESLint for code linting.

### 3. Unit Tests
- Write **unit tests using Jest** for critical functionalities.
- Ensure at least **80% test coverage**.

### 4. Documentation
- Provide **clear setup instructions** on how to install and run the application.
- Document all components using **Storybook**:
  - Include component variations and states
  - Document props and their types
  - Provide usage examples
- Explain architectural choices and state management decisions.
- Describe any **trade-offs** made during development.
- Include API documentation if any API interactions are used.

### 5. Git Repository
- Host the project on a **public GitHub repository**.
- Follow a **structured commit history**.
- Include a well-written **README.md** file.

### 6. Nice to Have (Optional)
- Support the Internationalization (i18n) feature.
- Support the Dark Mode feature.

---

## Evaluation Criteria
- **Code Quality & Best Practices**: Clean, maintainable, and modular code.
- **Functionality**: Implementation of all required features.
- **State Management**: Proper use of Zustand.
- **UI/UX**: Use of Tailwind and ShadCN for a polished UI.
- **TypeScript Usage**: Effective use of types and interfaces.
- **Form Validation**: Proper implementation using Zod or Yup.
- **Testing**: Well-written unit tests with good coverage.
- **Documentation**: Clear, structured, and comprehensive documentation including Storybook implementation.
- **Performance & Scalability**: Efficient rendering and API handling.
- **Architecture & File Structure**: Well-organized project and follows good architecture.

---

## Submission Instructions
1. Upload the project to a public **GitHub repository**.
2. Include a **detailed README** with setup instructions.
3. Provide a **brief documentation file** explaining the architecture, state management, and decisions.
4. Submit the GitHub repository link within the given timeframe.

---

Good luck, and happy coding! 🚀

