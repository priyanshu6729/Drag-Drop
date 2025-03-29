import React, { useCallback, useRef } from 'react';
import { useDrop } from 'react-dnd';
import CanvasElement from './CanvasElement';
import './Canvas.css';
import { useDropzone } from 'react-dropzone';

function Canvas({
  elements,
  onElementDrop,
  onElementSelect,
  selectedElementId,
  onElementRemove
}) {
  // Create a ref to hold the DOM node
  const canvasRef = useRef(null);
  
  const [{ isOver }, connectDrop] = useDrop(() => ({
    accept: 'ELEMENT',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = document.querySelector('.canvas-container').getBoundingClientRect();
      
      // Calculate position relative to canvas
      const position = {
        x: offset.x - canvasRect.left,
        y: offset.y - canvasRect.top
      };
      
      onElementDrop(item, position);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  
  // Add file drop handling
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          // Create an image element with the uploaded file
          const imageItem = {
            type: 'image',
            defaultContent: 'Image',
            defaultProperties: {
              src: reader.result,
              alt: file.name
            }
          };
          
          // Calculate position for center of viewport
          const canvasRect = document.querySelector('.canvas-container').getBoundingClientRect();
          const position = {
            x: (canvasRect.width / 2) - 150, // Center horizontally with 300px width
            y: window.scrollY + (window.innerHeight / 2) - 100 // Center in viewport
          };
          
          onElementDrop(imageItem, position);
        };
        reader.readAsDataURL(file);
      }
    });
  }, [onElementDrop]);
  
  const { getInputProps, isDragActive: isFileDragActive } = useDropzone({
    onDrop,
    noClick: true, // Don't open file dialog on click
    noKeyboard: true, // Don't open file dialog on keypress
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.svg']
    }
  });
  
  // Connect the drop ref to our canvas ref after render
  React.useEffect(() => {
    if (canvasRef.current) {
      connectDrop(canvasRef.current);
    }
  }, [connectDrop]);

  return (
    <div className="canvas-wrapper">
      <div className="canvas-header">
        <div className="templates">
          <button className="template-button">Home Page Template</button>
          <button className="template-button">Landing Page Template</button>
          <button className="template-button">Contact Page Template</button>
        </div>
        <div className="device-preview">
          <button className="device-button active">Desktop</button>
          <button className="device-button">Tablet</button>
          <button className="device-button">Mobile</button>
        </div>
      </div>
      
      <div 
        ref={canvasRef}
        className={`canvas-container ${isOver ? 'drag-over' : ''} ${isFileDragActive ? 'file-drag-active' : ''}`} 
      >
        <input {...getInputProps()} />
        
        {elements.length === 0 && (
          <div className="empty-canvas-message">
            <p>Drag and drop elements here to build your page</p>
            <p className="secondary-message">You can also drop image files directly onto the canvas</p>
          </div>
        )}
        
        {elements.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={element.id === selectedElementId}
            onClick={() => onElementSelect(element)}
            onRemove={() => onElementRemove(element.id)}
          />
        ))}
        
        {isFileDragActive && (
          <div className="file-drop-overlay">
            <div className="file-drop-message">
              Drop images here to add them to your page
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Canvas;