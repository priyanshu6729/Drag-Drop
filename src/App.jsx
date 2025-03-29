import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import ElementsPanel from './components/ElementsPanel';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import './App.css';

// Detect touch device and use appropriate backend
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

function App() {
  const [selectedElement, setSelectedElement] = useState(null);
  const [canvasElements, setCanvasElements] = useState([]);
  
  const handleElementDrop = (item, position) => {
    const newElement = {
      id: `${item.type}-${Date.now()}`,
      type: item.type,
      position,
      content: item.defaultContent,
      style: item.defaultStyle || {},
      properties: item.defaultProperties || {}
    };
    
    setCanvasElements([...canvasElements, newElement]);
    setSelectedElement(newElement);
  };
  
  const updateElementProperties = (elementId, properties) => {
    setCanvasElements(canvasElements.map(element => 
      element.id === elementId 
        ? { ...element, ...properties } 
        : element
    ));
  };
  
  const removeElement = (elementId) => {
    setCanvasElements(canvasElements.filter(element => element.id !== elementId));
    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement(null);
    }
  };

  return (
    <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
      <div className="app">
        <header className="header">
          <h1>Drag&Drop</h1>
          <div className="header-actions">
            <button className="preview-button">Preview</button>
            <button className="save-button">Save</button>
            <button className="publish-button">Publish</button>
          </div>
        </header>
        
        <div className="main-content">
          <ElementsPanel />
          
          <Canvas 
            elements={canvasElements}
            onElementDrop={handleElementDrop}
            onElementSelect={setSelectedElement}
            selectedElementId={selectedElement?.id}
            onElementRemove={removeElement}
          />
          
          {selectedElement && (
            <PropertiesPanel 
              element={selectedElement}
              updateProperties={(properties) => 
                updateElementProperties(selectedElement.id, properties)
              }
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
