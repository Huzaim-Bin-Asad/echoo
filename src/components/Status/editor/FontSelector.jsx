import React from 'react';

const FontSelector = () => {
  const fontStyles = [
    { fontFamily: 'Arial', size: '1rem' },
    { fontFamily: 'Times New Roman', size: '1rem' },
    { fontFamily: 'Helvetica', size: '1rem' },
    { fontFamily: 'Courier New', size: '1rem' },
    { fontFamily: 'Georgia', size: '1rem' },
    { fontFamily: 'Verdana', size: '1rem' },
    { fontFamily: 'Impact', size: '1rem' },
    { fontFamily: 'Comic Sans MS', size: '1rem' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '10px',
        padding: '10px',
        whiteSpace: 'nowrap',
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        scrollbarWidth: 'none', // Firefox
        '-ms-overflow-style': 'none', // IE and Edge
      }}
    >
      <style>
        {`
          div::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
        `}
      </style>
      {fontStyles.map((style, index) => (
        <div
          key={index}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'rgb(51, 51, 51)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            fontFamily: style.fontFamily,
            fontSize: style.size,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          Aa
        </div>
      ))}
    </div>
  );
};

export default FontSelector;