# Feature Modules System

This directory contains plug & play feature modules for FastMVP-Core. Each module is self-contained and can be easily integrated into your MVP.

## Structure

Each feature module follows this structure:

```
feature-name/
├── README.md              # Feature documentation
├── components/            # React components
│   └── FeatureName.tsx   # Main component
├── hooks/                 # Custom React hooks (optional)
├── utils/                 # Utility functions (optional)
├── types/                 # TypeScript types (optional)
└── index.ts              # Module exports
```

## How to Create a Feature Module

1. **Create a new directory** with a descriptive kebab-case name (e.g., `csv-upload/`, `auth-flow/`)

2. **Add a README.md** explaining:
   - What the feature does
   - Dependencies required
   - Integration instructions
   - Usage examples

3. **Implement components** in the `components/` directory
   - Keep components focused and reusable
   - Use TypeScript for type safety
   - Follow React best practices

4. **Export your module** via `index.ts`:
   ```typescript
   export { default as FeatureName } from './components/FeatureName';
   export * from './types';
   ```

5. **Test your module** independently before integration

## Integration

To use a feature module in your MVP:

```typescript
import { CSVUpload } from '@/templates/features/csv-upload';

function MyApp() {
  return <CSVUpload onUpload={(data) => console.log(data)} />;
}
```

## Available Modules

- **csv-upload/** - CSV file upload and parsing component (example)

## Contributing

When adding a new feature module:
- Keep it self-contained and documented
- Minimize external dependencies
- Provide clear integration examples
- Update this README with your module
