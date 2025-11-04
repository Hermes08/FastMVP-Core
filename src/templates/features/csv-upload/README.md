# CSV Upload Feature Module

A plug & play CSV file upload component for FastMVP-Core.

## Description

This module provides a simple CSV file upload interface with basic validation and parsing capabilities. It's designed to be integrated into any MVP that requires CSV file handling.

## Features

- CSV file selection and validation
- Basic file type checking
- Drag & drop support (extensible)
- TypeScript support
- Minimal dependencies

## Dependencies

No external dependencies required for the basic component. For CSV parsing, you may want to add:

```bash
npm install papaparse
```

## Usage

```typescript
import { CSVUpload } from '@/templates/features/csv-upload';

function MyComponent() {
  const handleUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    // Process your CSV file here
  };

  return (
    <CSVUpload 
      onUpload={handleUpload}
      maxSizeMB={5}
    />
  );
}
```

## Integration Steps

1. Copy the `csv-upload/` directory to your project
2. Install dependencies if needed
3. Import and use the component
4. Customize styling and behavior as needed

## API

### Props

- `onUpload: (file: File) => void` - Callback when file is uploaded
- `maxSizeMB?: number` - Maximum file size in MB (optional)
- `accept?: string` - Accepted file types (default: '.csv')

## Customization

The component is intentionally minimal. Extend it by:

- Adding CSV parsing logic
- Implementing data preview
- Adding validation rules
- Customizing the UI
