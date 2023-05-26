import React, { useState, useEffect, ReactElement, FC } from 'react';
import Measure from 'react-measure';

const FULL_HEIGHT_ID = 'full-height-wrapper';

type FullHeightProps = {
  children: ReactElement;
};

const FullHeight: FC<FullHeightProps> = ({ children }) => {
  const [viewportHeight, setViewportHeight] = useState(0);
  const [elementTop, setElementTop] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    const handleScroll = () => {
      const element = document.getElementById(FULL_HEIGHT_ID);
      if (element) {
        const rect = element.getBoundingClientRect();
        setElementTop(rect.top);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    handleResize(); // Initial measurement
    handleScroll(); // Initial scroll position

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const height = viewportHeight - elementTop;

  return (
    <Measure>
      {({ measureRef }) => (
        <div id={FULL_HEIGHT_ID} ref={measureRef} style={{ height }}>
          {children}
        </div>
      )}
    </Measure>
  );
};

export default FullHeight;
