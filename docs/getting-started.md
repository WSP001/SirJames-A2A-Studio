# Getting Started

## Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/WSP001/SirJamesAdventures003.git
cd SirJamesAdventures003
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run validate` - Validate story files
- `npm run ci` - Run full CI pipeline

## Project Configuration

The project uses:
- **Vite** for build tooling
- **TypeScript** for type safety
- **ESLint** for code linting
- **Vitest** for testing
- **Ajv** for JSON schema validation

## Next Steps

- Read the [Story Format Documentation](./story-format.md)
- Check out the [Development Guide](./development.md)
- Explore the example story in `stories/book003-chapter01.json`