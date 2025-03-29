import React from 'react';
import { useDrag } from 'react-dnd';
import './ElementsPanel.css';

const elementTypes = [
  { 
    type: 'heading', 
    label: 'Heading',
    icon: '🔤',
    defaultContent: 'New Heading',
    defaultProperties: {
      text: 'New Heading',
      level: 'h2'
    }
  },
  { 
    type: 'paragraph', 
    label: 'Paragraph',
    icon: '📝',
    defaultContent: 'New paragraph text goes here.',
    defaultProperties: {
      text: 'New paragraph text goes here.'
    }
  },
  { 
    type: 'image', 
    label: 'Image',
    icon: '🖼️',
    defaultContent: 'Image',
    defaultProperties: {
      src: 'https://via.placeholder.com/300x200',
      alt: 'Image description'
    }
  },
  { 
    type: 'button', 
    label: 'Button',
    icon: '🔘',
    defaultContent: 'Click Me',
    defaultProperties: {
      text: 'Click Me',
      url: '#',
      variant: 'primary'
    }
  },
  { 
    type: 'divider', 
    label: 'Divider',
    icon: '➖',
    defaultContent: '',
    defaultProperties: {
      style: 'solid'
    }
  },
  { 
    type: 'spacer', 
    label: 'Spacer',
    icon: '↕️',
    defaultContent: '',
    defaultProperties: {
      height: '50px'
    }
  }
];

const DraggableElement = ({ element }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ELEMENT',
    item: element,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag} 
      className={`draggable-element ${isDragging ? 'dragging' : ''}`}
    >
      <span className="element-icon">{element.icon}</span>
      <span className="element-label">{element.label}</span>
    </div>
  );
};

function ElementsPanel() {
  return (
    <div className="elements-panel">
      <h3>Elements</h3>
      <div className="elements-list">
        {elementTypes.map((element) => (
          <DraggableElement key={element.type} element={element} />
        ))}
      </div>
    </div>
  );
}

export default ElementsPanel;
