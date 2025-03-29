import React, { useState, useEffect } from 'react';
import './PropertiesPanel.css';
import FileUploadArea from './FileUploadArea';

function PropertiesPanel({ element, updateProperties }) {
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    // Initialize form values from element properties
    setFormValues(element.properties || {});
  }, [element]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProperties({ properties: formValues });
  };

  const renderFormFields = () => {
    switch (element.type) {
      case 'heading':
        return (
          <>
            <div className="form-group">
              <label>Text</label>
              <input
                type="text"
                name="text"
                value={formValues.text || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Heading Level</label>
              <select 
                name="level" 
                value={formValues.level || 'h2'} 
                onChange={handleChange}
              >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
                <option value="h5">H5</option>
                <option value="h6">H6</option>
              </select>
            </div>
          </>
        );
      
      case 'paragraph':
        return (
          <div className="form-group">
            <label>Text</label>
            <textarea
              name="text"
              value={formValues.text || ''}
              onChange={handleChange}
              rows={4}
            />
          </div>
        );
      
        case 'image':
  return (
    <>
      <div className="form-group">
        <label>Image</label>
        <FileUploadArea 
          onImageUploaded={(imageUrl) => {
            setFormValues({
              ...formValues,
              src: imageUrl
            });
          }}
          currentImageUrl={formValues.src || ''} 
        />
      </div>
      <div className="form-group">
        <label>Alt Text</label>
        <input
          type="text"
          name="alt"
          value={formValues.alt || ''}
          onChange={handleChange}
          placeholder="Describe the image for accessibility"
        />
      </div>
    </>
  );
      
      case 'button':
        return (
          <>
            <div className="form-group">
              <label>Button Text</label>
              <input
                type="text"
                name="text"
                value={formValues.text || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>URL</label>
              <input
                type="text"
                name="url"
                value={formValues.url || '#'}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Style</label>
              <select
                name="variant"
                value={formValues.variant || 'primary'}
                onChange={handleChange}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
                <option value="text">Text Only</option>
              </select>
            </div>
          </>
        );
      
      case 'divider':
        return (
          <div className="form-group">
            <label>Style</label>
            <select
              name="style"
              value={formValues.style || 'solid'}
              onChange={handleChange}
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>
        );
      
      case 'spacer':
        return (
          <div className="form-group">
            <label>Height</label>
            <input
              type="text"
              name="height"
              value={formValues.height || '20px'}
              onChange={handleChange}
            />
          </div>
        );
      
      default:
        return <p>No properties available for this element.</p>;
    }
  };

  return (
    <div className="properties-panel">
      <h3>Properties: {element.type}</h3>
      <form onSubmit={handleSubmit}>
        {renderFormFields()}
        
        <div className="form-group">
          <button type="submit" className="apply-button">
            Apply Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default PropertiesPanel;
