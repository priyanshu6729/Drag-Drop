import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUploadArea.css';

function FileUploadArea({ onImageUploaded, currentImageUrl }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Initialize preview if there's a current image
  useEffect(() => {
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
    }
  }, [currentImageUrl]);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    // Only accept images
    if (!file.type.startsWith('image/')) {
      alert('Only image files are accepted');
      return;
    }

    // Simulate file upload with progress
    setIsUploading(true);
    setUploadProgress(0);
    
    // Create a FileReader to read the image
    const reader = new FileReader();
    
    reader.onload = () => {
      // Set preview immediately
      setPreviewUrl(reader.result);
      
      // Simulate network delay and progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Pass the image data URL to the parent component
          onImageUploaded(reader.result);
        }
      }, 100); // Faster simulation for better UX
    };
    
    reader.readAsDataURL(file);
  }, [onImageUploaded]);
  
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.svg']
    },
    noClick: previewUrl ? true : false // Disable click when preview is shown
  });

  // Handle clearing the preview/current image
  const handleClearImage = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onImageUploaded(''); // Clear the image in parent component
  };

  return (
    <div 
      {...getRootProps()} 
      className={`file-upload-area ${isDragActive ? 'active' : ''} ${previewUrl ? 'has-preview' : ''}`}
    >
      <input {...getInputProps()} />
      
      {isUploading ? (
        <div className="upload-progress">
          <div 
            className="progress-bar" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <span>Uploading... {uploadProgress}%</span>
        </div>
      ) : previewUrl ? (
        <div className="preview-container">
          <img src={previewUrl} alt="Preview" className="image-preview" />
          <div className="preview-controls">
            <button type="button" onClick={open} className="change-image-btn">
              Change
            </button>
            <button type="button" onClick={handleClearImage} className="remove-image-btn">
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="upload-message">
          {isDragActive ? (
            <p>Drop the image here</p>
          ) : (
            <div>
              <p>Drag & drop an image here, or click to select</p>
              <span className="file-types">Supports: JPG, PNG, GIF, SVG</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUploadArea;