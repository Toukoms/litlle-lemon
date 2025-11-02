# Little Lemon Restaurant

A modern, responsive restaurant reservation system built with React 19, TypeScript, and Tailwind CSS. This application provides a seamless multi-step booking experience for the Little Lemon restaurant in Chicago.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)
![Tests](https://img.shields.io/badge/tests-86%2B-green.svg)

---

## 📚 Meta Frontend Developer Capstone Project

This project was developed as part of the **Meta Frontend Developer Professional Certificate** final capstone exam.

### ⚠️ Academic Integrity Notice

**For students currently enrolled in the Meta Frontend Developer course:**

This repository contains a complete solution to the capstone project. While it's available as a reference and learning resource, please be aware that:

- **Copying this code directly violates Meta's academic integrity policy**
- **You will learn more by building the project yourself**
- **Employers value genuine skills over copied certificates**
- **Use this as inspiration, not as a copy-paste solution**

If you're stuck on a specific feature or concept, try to:

1. Review the course materials again
2. Break down the problem into smaller steps
3. Search for documentation and tutorials on specific topics
4. Ask for help in course forums or communities
5. Only then, look at how others approached similar problems

**Your learning journey matters more than a quick certificate.** Take the time to truly understand the concepts, and you'll be much better prepared for real-world development.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Application Flow](#application-flow)
- [CI/CD](#cicd)
- [Important Notes](#important-notes)

## Overview

Little Lemon is a restaurant reservation system that guides users through a three-step booking process:

1. **Reservation Details** - Select date, time, party size, and seating preference
2. **Customer Information** - Provide contact details
3. **Payment Processing** - Enter payment information and confirm booking

The application features a clean, modern UI with comprehensive form validation, responsive design, and thorough E2E test coverage.

## Features

### Core Functionality

- **Multi-Step Reservation Flow** - Intuitive 3-step booking process
- **Smart Form Validation** - Real-time validation with helpful error messages
- **Responsive Design** - Mobile-first approach, works on all devices
- **Modern UI/UX** - Clean interface with Tailwind CSS
- **Comprehensive Testing** - 86+ E2E tests with Playwright

### Home Page

- Hero section with restaurant branding
- Static menu display with 3 featured dishes (Greek Salad, Bruschetta, Grilled Fish)
- Category buttons for display (Lunch, Mains, Desserts, A la carte, Starters, Drinks) - **non-functional, UI only**
- Quick "Reserve a Table" call-to-action

### Reservation System

- **Date Selection** - HTML5 date picker
- **Time Slots** - 11 available slots from 5:00 PM to 10:00 PM
- **Party Size** - Support for 1-10 diners
- **Seating Options** - Standard or Outside seating

### Customer Details

- Full name collection
- Email validation
- Phone number capture
- Required field validation with visual feedback

### Payment Processing

- **Smart Card Formatting** - Auto-spaces for card numbers (1234 5678 9012 3456)
- **Expiration Date** - Auto-formatted MM/YY input
- **CVV Handling** - Support for 3-4 digit CVV codes
- **Card Validation** - 13-19 digit card number validation
- **Help Information** - Interactive CVV help with visual card examples
- **Confirmation Modal** - Success confirmation with complete booking summary

## Tech Stack

### Frontend

- **React 19.1.1** - Latest React with modern features
- **TypeScript 5.9.3** - Type-safe development with strict mode
- **React Router 7.9.5** - Client-side routing
- **Tailwind CSS 4.1.16** - Utility-first CSS framework
- **Lucide React** - Modern SVG icon library

### Build Tools

- **Vite 7.1.7** - Lightning-fast build tool and dev server
- **Babel React Compiler** - Automatic React optimization
- **@vitejs/plugin-react** - React integration with Vite
- **pnpm** - Fast, disk space efficient package manager

### Testing

- **Playwright 1.56.1** - E2E testing framework
- Cross-browser testing (Chrome, Firefox, Safari)
- 86+ comprehensive test cases

### Code Quality

- **ESLint 9.36.0** - JavaScript/TypeScript linting
- **TypeScript ESLint** - TypeScript-specific rules
- **React Hooks ESLint Plugin** - React hooks linting
- **React Refresh ESLint Plugin** - Fast refresh validation

## Project Structure

```
litlle-lemon/
├── src/
│   ├── main.tsx                    # Application entry point
│   ├── App.tsx                     # Router configuration
│   ├── index.css                   # Global Tailwind styles
│   └── modules/
│       ├── index.tsx               # Root layout (Header, Footer, Outlet)
│       ├── home/
│       │   └── page.tsx            # Home page with menu
│       ├── reservations/
│       │   ├── page.tsx            # Step 1: Reservation form
│       │   ├── customer-details/
│       │   │   └── page.tsx        # Step 2: Customer info
│       │   └── payment/
│       │       └── page.tsx        # Step 3: Payment
│       └── shared/ui/
│           ├── Header.tsx          # Top navigation
│           ├── Footer.tsx          # Footer component
│           ├── Body.tsx            # Page wrapper with branding
│           ├── Loading.tsx         # Loading fallback
│           ├── Error.tsx           # Error boundary
│           └── NotFound.tsx        # 404 page
├── tests/                          # E2E test suites
│   ├── home.spec.ts                # Home page tests
│   ├── reservations.spec.ts        # Reservation tests
│   ├── customer-details.spec.ts    # Customer form tests
│   ├── payment.spec.ts             # Payment tests
│   ├── not-found.spec.ts           # 404 tests
│   └── e2e-reservation-flow.spec.ts # Full flow tests
├── public/                         # Static assets (images)
├── .github/workflows/
│   └── playwright.yml              # CI/CD configuration
├── vite.config.ts                  # Vite configuration
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
├── eslint.config.js                # ESLint rules
└── package.json                    # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Toukoms/litlle-lemon.git
cd litlle-lemon
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open your browser and visit `http://localhost:5173`

## Available Scripts

### Development

```bash
pnpm dev          # Start Vite dev server with HMR
pnpm build        # Build for production (TypeScript + Vite)
pnpm preview      # Preview production build locally
pnpm lint         # Run ESLint
```

### Testing

```bash
pnpm test             # Run all Playwright tests
pnpm test:watch       # Run tests in watch mode
pnpm test:report      # View HTML test report
```

## Testing

The application has comprehensive E2E test coverage using Playwright:

### Test Statistics

- **Total Test Suites**: 6
- **Total Test Cases**: 86+
- **Browsers Tested**: Chrome, Firefox, Safari

### Test Coverage

| Test Suite                     | Description                                | Tests |
| ------------------------------ | ------------------------------------------ | ----- |
| `home.spec.ts`                 | Home page rendering and navigation         | 10    |
| `reservations.spec.ts`         | Reservation form validation and submission | 11    |
| `customer-details.spec.ts`     | Customer info form validation              | 17    |
| `payment.spec.ts`              | Payment form and confirmation              | 18    |
| `not-found.spec.ts`            | 404 page functionality                     | 17    |
| `e2e-reservation-flow.spec.ts` | Complete booking flows                     | 13    |

### Test Categories

- **Component Rendering** - Verify all UI elements display correctly
- **Form Validation** - Test all validation rules and error messages
- **User Flows** - End-to-end booking scenarios
- **Navigation** - Route transitions and state passing
- **Responsive Design** - Mobile viewport testing
- **Edge Cases** - Boundary conditions (1 diner, 10 diners, 4-digit CVV)

### Running Tests

```bash
# Run all tests
pnpm test

# Run in watch mode (auto-reruns on file changes)
pnpm test:watch

# Run specific test file
pnpm exec playwright test tests/home.spec.ts

# View test report
pnpm test:report
```

## Application Flow

### User Journey

```
Home Page (/)
    ↓ Click "Reserve a Table"
Reservation Form (/reservations)
    ↓ Submit date, time, party size, seating
Customer Details (/reservations/customer-details)
    ↓ Submit contact information
Payment (/reservations/payment)
    ↓ Submit payment details
Confirmation Modal
    ↓ Return to Home
Home Page (/)
```

### State Management

- **React useState** - Local component state for forms
- **React Router State** - Pass data between steps via navigation state
- **No Global State** - Lightweight approach suitable for the flow

### Routing

```
/                              → Home Page
/reservations                  → Reservation Form
/reservations/customer-details → Customer Details
/reservations/payment          → Payment
/*                             → 404 Not Found
```

## CI/CD

The project uses GitHub Actions for continuous integration:

### Workflow Features

- **Trigger**: Push to `main` or PRs targeting `main`
- **Environment**: Ubuntu latest with Node.js LTS
- **Tests**: Full Playwright test suite
- **Artifacts**: HTML test reports (30-day retention)
- **Retries**: 2 automatic retries for flaky tests

### Configuration

See [.github/workflows/playwright.yml](.github/workflows/playwright.yml) for full workflow details.

## Important Notes

- **Frontend Only** - No backend integration, no database, no real payment processing
- **Static Data** - All menu items and content are hardcoded
- **No Persistence** - Reservations are not saved anywhere (client-side only)
- **Educational Project** - Built for learning purposes as part of Meta's course

## Architecture Highlights

### Strengths

- **Modern Stack** - Latest React 19, TypeScript, Vite
- **Type Safety** - Strict TypeScript configuration
- **Testing** - Comprehensive E2E coverage
- **Performance** - Vite for fast builds, React Compiler for optimization
- **Code Quality** - ESLint rules, type checking
- **CI/CD** - Automated testing pipeline
- **Responsive** - Mobile-first Tailwind approach
- **Accessibility** - Semantic HTML, proper labels

### Design Patterns

- **Component Composition** - Reusable UI components
- **Single Responsibility** - Each component has one job
- **Prop Drilling Avoidance** - Router state for data passing
- **Error Boundaries** - Graceful error handling
- **Loading States** - Better UX with loading indicators
- **Form Validation** - Both HTML5 and custom validation

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is free and open for anyone to use, modify, and learn from.

**Exception:** Students currently enrolled in the Meta Frontend Developer course should **not** copy this code for their capstone project submissions, as it violates academic integrity policies. Use it as a reference for learning, not for plagiarism.

## Acknowledgments

- React team for React 19 and the React Compiler
- Tailwind CSS for the utility-first CSS framework
- Playwright team for the excellent E2E testing framework
- Vite team for the blazing-fast build tool

---

**Built with** ❤️ **by the Tokiniaina**
