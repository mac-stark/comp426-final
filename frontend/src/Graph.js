import React from 'react';

const data = [

    { label: 'S', x: 0, y: 0 },
  
    { label: 'M', x: 1, y: 4 },
  
    { label: 'T', x: 2, y: 3 },
  
    { label: 'W', x: 3, y: 1 },
  
    { label: 'TH', x: 4, y: 4 },
  
    { label: 'F', x: 5, y: 5 },
  
    { label: 'S', x: 6, y: 4 }
  
];
   
const maximumXFromData = Math.max(...data.map(e => e.x));
  
const maximumYFromData = Math.max(...data.map(e => e.y));
  
  
  
const points = data.map(element => {
  
    const x = (element.x / maximumXFromData) * chartWidth + padding;
  
    const y = chartHeight - (element.y / maximumYFromData) * chartHeight + padding;
  
    return `${x},${y}`;
  
}).join(' ');

