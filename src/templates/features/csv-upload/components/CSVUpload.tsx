import React, { ChangeEvent, useState } from 'react';

interface CSVUploadProps {
  onUpload?: (file: File) => void;
  maxSizeMB?: number;
  accept?: string;
}

/**
 * CSVUpload - A simple CSV file upload component
 * 
 * This is a minimal example component demonstrating the structure
 * of a feature module. Extend it with your own logic.
 */
export const CSVUpload: React.FC<CSVUploadProps> = ({
  onUpload,
  maxSizeMB = 5,
  accept = '.csv',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setError('Please select a valid CSV file');
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setError('');
    setSelectedFile(file);
    
    if (onUpload) {
      onUpload(file);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.uploadBox}>
        <h3 style={styles.title}>CSV Upload</h3>
        
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          style={styles.input}
          id="csv-file-input"
        />
        
        <label htmlFor="csv-file-input" style={styles.label}>
          {selectedFile ? selectedFile.name : 'Choose CSV file'}
        </label>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {selectedFile && !error && (
          <div style={styles.success}>
            ✓ File ready: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
          </div>
        )}
      </div>
    </div>
  );
};

// Basic inline styles (replace with your own styling solution)
const styles = {
  container: {
    padding: '20px',
  },
  uploadBox: {
    border: '2px dashed #ccc',
    borderRadius: '8px',
    padding: '30px',
    textAlign: 'center' as const,
    maxWidth: '500px',
  },
  title: {
    marginTop: 0,
    marginBottom: '20px',
    color: '#333',
  },
  input: {
    display: 'none',
  },
  label: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  error: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
  },
  success: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
  },
};

export default CSVUpload;
