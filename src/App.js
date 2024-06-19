// App.js

import React, { useRef, useEffect, useState } from 'react';
import CanvasEditor from './CanvasEditor';
import { SketchPicker } from 'react-color';
import './App.css';

function App() {
  const canvasRef = useRef(null);
  const [stripColor, setStripColor] = useState('#0369A1'); // Initial strip color
  const [image, setImage] = useState(null);// State for the image maintanence
  const [captionText, setCaptionText] = useState('');//State for the caption text
  const [ctaText, setCtaText] = useState('Contact Us');
  const [recentColors, setRecentColors] = useState([]); // State for recent colors
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false); // State for color picker visibility
  const [captionSettings, setCaptionSettings] = useState({
    x: 20,
    y: 200,
    fontSize: 20,
    alignment: 'left',
    color: 'black',
    maxCharactersPerLine: 31,
  });

  const canvasEditorRef = useRef(null);

  const initialLines = [
    { startX: 40, startY: 125, endX: 100, endY: 175 },
    { startX: 20, startY: 120, endX: 120, endY: 200 },
    { startX: 0, startY: 115, endX: 130, endY: 220 },
    { startX: 1, startY: 128, endX: 125, endY: 228 },
    { startX: 2, startY: 140, endX: 110, endY: 225 },
    { startX: 2, startY: 150, endX: 90, endY: 220 },
    { startX: 2, startY: 160, endX: 70, endY: 215 },
    { startX: 2, startY: 170, endX: 60, endY: 218 },
    { startX: 2, startY: 180, endX: 50, endY: 219 },
    { startX: 2, startY: 190, endX: 40, endY: 220 },
    { startX: 2, startY: 200, endX: 30, endY: 222 },
    { startX: 2, startY: 210, endX: 20, endY: 224 },
    { startX: 2, startY: 220, endX: 10, endY: 226 },
    { startX: 2, startY: 230, endX: 1, endY: 228 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    canvasEditorRef.current = new CanvasEditor(canvas, stripColor, ctaText, initialLines);
  }, [stripColor, ctaText]);

  useEffect(() => {
    if (canvasEditorRef.current) {
      canvasEditorRef.current.setStripColor(stripColor);
      canvasEditorRef.current.setCtaText(ctaText);
    }
  }, [stripColor, ctaText]);
  useEffect(() => {
    if (canvasEditorRef.current) {
      canvasEditorRef.current.setCaption({
        text: captionText,
        x: captionSettings.x, // x,y coordinates of the caption
        y: captionSettings.y,
        fontSize: captionSettings.fontSize,
        alignment: captionSettings.alignment,
        color: captionSettings.color,
        maxCharactersPerLine: captionSettings.maxCharactersPerLine,
      });
    }
  }, [captionText, captionSettings]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        canvasEditorRef.current.setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptionChange = (e) => {
    setCaptionText(e.target.value);
  };
  const handleCtaTextChange = (e) => {
    setCtaText(e.target.value);
  };

  const handleColorChange = (color) => {
    setStripColor(color.hex);
    setRecentColors((prevColors) => {
      const newColors = [color.hex, ...prevColors.filter((col) => col !== color.hex)];
      return newColors.slice(0, 5); // top 5 recent colors
    });
    setIsColorPickerVisible(false);
  };

  const handleRecentColorClick = (color) => {
    setStripColor(color);
    setRecentColors((prevColors) => {
      const updatedColors = [color, ...prevColors.filter((col) => col !== color)];
      return updatedColors.slice(0, 5); // top 5 recent colors
    });
  };

  return (
    <div className="container mx-auto p-4 flex flex-wrap">
      <div className="w-full md:w-2/3 flex justify-center items-center mb-4">
        <div className="striped-box relative">
          <div className="canvas">
            <canvas ref={canvasRef} width={550} height={550}></canvas>
            {image && (
              <img
                src={image}
                alt="Uploaded"
                style={{
                  position: 'absolute',
                  top: '34%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '70%',
                  height: '55%',
                  zIndex: 3,
                  borderRadius: '5%',
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/3 md:ml-5 flex flex-col space-y-4">
        <h2 className="text-xl font-bold mb-2">Ad Customization</h2>

        <div>
          <label className="block mb-2">Select Image</label>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="mb-4" />
        </div>

        <div>
          <label className="block mb-3">Ad Content</label>
          <textarea
            value={captionText}
            onChange={handleCaptionChange}
            className="border p-2 w-full mb-4"
            rows="4"
          ></textarea>
        </div>

        <div>
          <label className="block mb-2"> CTA </label>
          <input
            type="text"
            value={ctaText}
            onChange={handleCtaTextChange}
            className="border p-2 w-full mb-4"
          />
        </div>

        <div className="mb-4 color-picker-section">
          <label className="block mb-2">Background Color</label>
          <div className="flex space-x-2 mb-2">
            {recentColors.map((color, index) => (
              <div
                key={index}
                className="w-10 h-10 rounded-full cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => handleRecentColorClick(color)}
              ></div>
            ))}
            <div
              className="w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer"
              onClick={() => setIsColorPickerVisible(true)}
            >
              +
            </div>
          </div>
          {isColorPickerVisible && (
            <div className="absolute z-10 mt-2">
              <SketchPicker color={stripColor} onChangeComplete={handleColorChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;