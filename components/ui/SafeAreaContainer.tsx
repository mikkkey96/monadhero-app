import React from 'react';

interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface SafeAreaContainerProps {
  children: React.ReactNode;
  insets?: SafeAreaInsets;
}

export function SafeAreaContainer({ children, insets }: SafeAreaContainerProps) {
  const padding = insets ? 
    `${insets.top}px ${insets.right}px ${insets.bottom}px ${insets.left}px` : 
    '0px';

  return (
    <div style={{ 
      padding,
      minHeight: '100vh',
      width: '100%'
    }}>
      {children}
    </div>
  );
}
