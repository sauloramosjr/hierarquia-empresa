import React, { useEffect, useState } from 'react';
import { OrganizationChart } from './components/OrgChart';
import './App.css';
import { orgData } from './data';

const App = () => {
  const zoom = 0.5;
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const orgTable = document.querySelector('.org-table') as HTMLDivElement;

      if (orgTable) {
        const currentScale = parseFloat(orgTable.style.scale) || 1;
        const newScale = Math.max(0.2, currentScale + e.deltaY / 1000);
        orgTable.style.scale = newScale.toString();
      }
    };

    document.addEventListener('wheel', handleWheel);
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: any) => {
    if (isDragging) {
      const dx = e.clientX - startPosition.x;
      const dy = e.clientY - startPosition.y;
      setOffset((prevOffset) => ({
        x: prevOffset.x + dx,
        y: prevOffset.y + dy,
      }));
      setStartPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
      >
        <OrganizationChart data={orgData} onClickNode={() => {}} />
      </div>
    </div>
  );
};

export default App;
