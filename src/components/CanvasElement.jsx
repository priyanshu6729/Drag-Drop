import React from 'react';
import { useDrag } from 'react-dnd';
import './CanvasElement.css';

function CanvasElement({ element, isSelected, onSelect, onRemove }) {
  const renderElementContent = () => {
    switch (element.type) {
      case 'heading': {
        const HeadingTag = element.properties.level || 'h2';
        return <HeadingTag>{element.properties.text || element.content}</HeadingTag>;
      }
      
      case 'paragraph':
        return <p>{element.properties.text || element.content}</p>;
      
      case 'image':
        return (
          <img 
            src={element.properties.src} 
            alt={element.properties.alt || 'Image'} 
            style={{ maxWidth: '100%' }}
          />
        );
      
      case 'button':
        return (
          <button 
            className={`btn ${element.properties.variant || 'primary'}`}
          >
            {element.properties.text || element.content}
          </button>
        );
      
      case 'divider':
        return <hr className={`divider ${element.properties.style || 'solid'}`} />;
      
      case 'spacer':
        return (
          <div 
            className="spacer" 
            style={{ height: element.properties.height || '20px' }}
          ></div>
        );
      
      default:
        return <div>{element.content}</div>;
    }
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CANVAS_ELEMENT',
    item: { id: element.id, type: element.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const style = {
    position: 'absolute',
    left: `${element.position.x}px`,
    top: `${element.position.y}px`,
    opacity: isDragging ? 0.5 : 1,
    ...element.style,
  };

  return (
    <div
      ref={drag}
      className={`canvas-element ${isSelected ? 'selected' : ''}`}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="element-content">
        {renderElementContent()}
      </div>
      
      {isSelected && (
        <div className="element-controls">
          <button className="delete-button" onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default CanvasElement;
