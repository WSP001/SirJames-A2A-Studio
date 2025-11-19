# 🏰 Sir James Adventures Book 003

An interactive story application built with TypeScript and Vite, featuring Sir James (a brave knight with blue eyes) and his companion Sparky the squirrel.

## Features

- **Interactive Storytelling**: Make virtue-based choices that shape the adventure
- **JSON Schema v3.0**: Validated story format with const version and metadata
- **Character System**: Sir James (blue eyes), Sparky (squirrel), and other characters  
- **Scene Management**: Structured scenes with ID pattern `^ch\d{2}_s\d{3}$`
- **Virtue Choices**: Choose between courage, wisdom, and trust
- **TypeScript**: Full type safety and excellent developer experience
- **Vite Build**: Fast development and optimized production builds
- **Ajv Validation**: Story file validation with comprehensive error reporting
- **CI/CD Pipeline**: Automated linting, type checking, testing, and validation
- **Netlify Deploy**: Ready for production deployment

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run full CI pipeline
npm run ci
```

## Story Structure

Chapter01 template includes:
- **Scene 1 (narrative)**: Introduction to the Enchanted Forest
- **Scene 2 (decision)**: Three paths with virtue-based choices
- **Scene 3 (climax)**: Forest Spirit encounter and gifts

## Validation

```bash
# Validate all story files
npm run validate

# Validate specific files
npm run validate stories/book003-chapter01.json
```

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Story Format](./docs/story-format.md) 
- [Development Guide](./docs/development.md)

## License

Apache License 2.0