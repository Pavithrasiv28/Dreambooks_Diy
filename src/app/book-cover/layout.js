"use client";
import "../globals.css";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef} from "react";
// import { fabric } from "fabric";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import TitleIcon from '@mui/icons-material/Title';
import InterestsIcon from '@mui/icons-material/Interests';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import AppsIcon from '@mui/icons-material/Apps';
import AddIcon from '@mui/icons-material/Add';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Stage, Layer, Rect, Circle, Line, Ellipse, RegularPolygon, Star, Arrow } from "react-konva";
import { SketchPicker, ChromePicker } from "react-color";
import ghost from "../../../public/background/ghost.jpg"
import bgimages from '../../.././Image.json'
import stickers from '../../../stickers.json'
import fonts from '../../../fonts.json'
import WebFont from "webfontloader";
import CanvasArea from './page'
import BackCanvas from '../components/back_canvas'


export default function Booklayout() {

  const [canvas, setCanvas] = useState(false);
  const [frontCover, setFrontCover] = useState(null);
  const [backCover, setBackCover] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canvasShapes, setCanvasShapes] = useState([])

  // Front canvas
  const frontCanvasRef = useRef(null);
  const backCanvasRef = useRef(null);
  // Active canvas
  const [activeCanvas, setActiveCanvas] = useState("front"); // "front" or "back"\


  // collapsible
  const [collapsed, setCollapsed] = useState(true);

  // Background color
  const [canvasBg, setCanvasBg] = useState({
  type: "solid",
  color: "#ffffff",
  colors: [0, "#ff7e5f", 1, "#feb47b"],
  src: null
});

  const [showPicker, setShowPicker] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [showGradPicker, setShowGradPicker] = useState(false);
const [customGradStart, setCustomGradStart] = useState("#ff0000");
const [customGradEnd, setCustomGradEnd] = useState("#0000ff");

// Text
const [texts, setTexts] = useState([]); // array of text objects
const [selectedId, setSelectedId] = useState(null); // selected text
const [selectedTextId, setSelectedTextId] = useState(null);

const [showTextColorPicker, setShowTextColorPicker] = useState(false);
const [textColor, setTextColor] = useState("#000000");

// text style bold italic underline etc....
const selectedText = texts.find(t => t.id === selectedTextId);

// Dimensions
  const [canvasSize, setCanvasSize] = useState({ width: 290, height: 370 });

// Opacity
const [opacity, setOpacity] = useState(1);

// Palette vanish
const colorPickerRef = useRef(null);

// on mouse down palatte vanish
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      colorPickerRef.current &&
      !colorPickerRef.current.contains(event.target)
    ) {
      setShowTextColorPicker(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

// Fonts for text loader
WebFont.load({
  google: {
    families: fonts.map(f => f.name) 
  }
});

  const [sidebar, setSidebar] = useState({
    icon:0,
    state:false,
  });

  const details = [
    {description:'Upload Cover', icon: FileUploadIcon},
    {description:'Text', icon: TitleIcon},
    {description:'Background', icon: WallpaperIcon},
    {description:'Shapes', icon: InterestsIcon},
    {description:'Stickers', icon: AddReactionIcon},
  ]

   const shapes = [
  { name: "Rectangle", type: "Rect" },
  { name: "Circle", type: "Circle" },
  { name: "Triangle", type: "Triangle" },
  { name: "Ellipse", type: "Ellipse" },
  { name: "Line", type: "Line" },
  { name: "Polygon", type: "Polygon" },
  { name: "Star", type: "Star" },
  { name: "Arrow", type: "Arrow" },
];

//  Background colors
  const basicColors = ["#ffffff", "#000000", "#ff4c4c", "#ff66cc", "#9966ff", "#6699ff"];
  const gradientColors = [
  { css: "linear-gradient(to right, #ff7e5f, #feb47b)", stops: [0, "#ff7e5f", 1, "#feb47b"] },
  { css: "linear-gradient(to right, #6a11cb, #2575fc)", stops: [0, "#6a11cb", 1, "#2575fc"] },
  { css: "linear-gradient(to right, #43cea2, #185a9d)", stops: [0, "#43cea2", 1, "#185a9d"] },
  { css: "linear-gradient(to right, #ff512f, #dd2476)", stops: [0, "#ff512f", 1, "#dd2476"] },
];


  // Add shapes to canvas
  const addShapeToCanvas = (type) => {
  const newShape = { type, x: 100, y: 100 };

  if (activeCanvas === "front") {
    setCanvasShapes((prev) => [...prev, newShape]);
  } else {
    setBackCanvasShapes((prev) => [...prev, newShape]);
  }
};

// Download canvas
const handleDownloadFront = () => {
  if (!frontCanvasRef.current) return;
  const uri = frontCanvasRef.current.toDataURL({ pixelRatio: 2 });
  const link = document.createElement("a");
  link.download = "front-canvas.png";
  link.href = uri;
  link.click();
};

const handleDownloadBack = () => {
  if (!backCanvasRef.current) return;
  const uri = backCanvasRef.current.toDataURL({ pixelRatio: 2 });
  const link = document.createElement("a");
  link.download = "back-canvas.png";
  link.href = uri;
  link.click();
};


  // edit or upload
  const HandleCanvasSheet = (idx) =>{
    if (idx === 0){
      setCanvas(false)
    }
    else{
      setCanvas(true)
    }

    if (idx > 0){
       setSidebar(prev => ({
       ...prev,
       icon:idx,   
       state: true     
      }));
    }
    else{
      setSidebar(prev => ({
       ...prev,
       icon:idx,   
       state: false     
      }));
    }
  }
  
  const handleFileUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (!file) return;

    // validate type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Only JPG and PNG files are allowed!");
      return;
    }

    // validate size (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be below 5MB!");
      return;
    }

  const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
};

 const handleAddSticker = (src) => {
  const newSticker = {
    type: "Sticker",
    src,
    x: 50,
    y: 50,
    width: 80,
    height: 80,
  };

  if (activeCanvas === "front") {
    setCanvasShapes((prev) => [...prev, newSticker]);
  } else {
    setBackCanvasShapes((prev) => [...prev, newSticker]);
  }
};

// ADD Text to canvas
const addText = (type) => {
  const defaultColor = "#000000";
  const newText = {
    id: Date.now(),
    x: 50,
    y: 50,
    text: type === "heading" ? "Heading" : "Text",
    fontFamily: "Roboto",
    fontSize: type === "heading" ? 30 : 20,
    color: defaultColor,
    opacity: 1,
    fontStyle: "normal"
  };

  if (activeCanvas === "front") {
    setTexts((prev) => [...prev, newText]);
    setSelectedTextId(newText.id);
  } else {
    setBackTexts((prev) => [...prev, newText]);
    setBackSelectedTextId(newText.id);
  }

  setTextColor(defaultColor);

  // ✅ tell BackCanvas what is selected
  // You’ll need a setter prop for this
  setSelectedShape(`text-${newText.id}`);
};


const setActiveBg = (bg) => {
  if (activeCanvas === "front") {
    setCanvasBg(bg);
  } else {
    setBackCanvasBg(bg);
  }
};

// bg upload
const handleBgUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!validTypes.includes(file.type)) {
    alert("Only JPG and PNG files are allowed!");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("File size must be below 5MB!");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setActiveBg({ type: "image", src: reader.result });
  };
  reader.readAsDataURL(file);
};

// -------------------- BACK COVER STATES --------------------

// Back canvas shapes
const [backCanvasShapes, setBackCanvasShapes] = useState([]);

// Back canvas background
const [backCanvasBg, setBackCanvasBg] = useState({
  type: "solid",
  color: "#ffffff",
  colors: [0, "#ff7e5f", 1, "#feb47b"],
  src: null
});

// Texts on back canvas
const [backTexts, setBackTexts] = useState([]);

// Selected text ID for back canvas
const [backSelectedTextId, setBackSelectedTextId] = useState(null);

// Text color picker for back canvas
const [backTextColor, setBackTextColor] = useState("#000000");

// Text opacity for back canvas (optional separate control)
const [backOpacity, setBackOpacity] = useState(1);

// Text color picker visibility
const [showBackTextColorPicker, setShowBackTextColorPicker] = useState(false);

// Ref for color picker (back canvas)
const backColorPickerRef = useRef(null);


// -------------------- BACK COVER FUNCTIONS --------------------

// Handle click outside back text color picker
useEffect(() => {
  const handleClickOutsideBack = (event) => {
    if (
      backColorPickerRef.current &&
      !backColorPickerRef.current.contains(event.target)
    ) {
      setShowBackTextColorPicker(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutsideBack);

  return () => {
    document.removeEventListener("mousedown", handleClickOutsideBack);
  };
}, []);

// Add shape to back canvas
const addShapeToBackCanvas = (type) => {
  setBackCanvasShapes([...backCanvasShapes, { type, x: 100, y: 100 }]);
};

// Add text to back canvas
const addBackText = (type) => {
  const defaultColor = "#000000"; // always start new text as black

  const newText = {
    id: Date.now(),
    x: 50,
    y: 50,
    text: type === "heading" ? "Heading" : "Subtitle",
    fontFamily: "Roboto",
    fontSize: type === "heading" ? 30 : 20,
    color: defaultColor,
    opacity: 1,
    fontStyle: "normal"
  };

  setBackTexts([...backTexts, newText]);
  setBackSelectedTextId(newText.id); // select immediately
  setBackTextColor(defaultColor); // reset color picker
};

// Upload background for back canvas
const handleBackBgUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate type
  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!validTypes.includes(file.type)) {
    alert("Only JPG and PNG files are allowed!");
    return;
  }

  // Validate size 5MB
  if (file.size > 5 * 1024 * 1024) {
    alert("File size must be below 5MB!");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setBackCanvasBg({
      type: "image",
      src: reader.result
    });
  };
  reader.readAsDataURL(file);
};

// Add sticker to back canvas
const handleAddStickerBack = (src) => {
  const newSticker = {
    type: "Sticker",
    src,
    x: 50,
    y: 50,
    width: 80,
    height: 80,
  };
  setBackCanvasShapes([...backCanvasShapes, newSticker]);
};


  return (
    <>
    <div className="h-full flex bg-black">
      {/* Side Bar */}
     <div className="z-10 h-[100%] w-[7dvw] bg-[#E9E9E9] flex flex-col items-center justify-center rounded-tr-3xl rounded-br-3xl relative" style={{ boxShadow: "4px 0 6px -2px rgba(0,0,0,0.3)" }}>
       <div className="h-[90%] bg-rose-l00 w-full flex flex-col items-center justify-between py-[min(2rem,8%)]">
        {details.map((item, idx) =>{
          return(
          <>
          <button key={idx} 
          className={`h-15 w-15 rounded-2xl p-2 bg-gradient-to-b from-blue-400 to-purple-400 flex flex-col items-center justify-evenly
             ${activeIndex === idx ? "border-4 border-b-slate-900 border-t-slate-900 scale" : ""}`}
          onClick={() =>{ setActiveIndex(idx);HandleCanvasSheet(idx);}}
          >
           <item.icon/>
          </button>
           <p className="text-[#5B5B5B] text-center text-[12px] font-bold">{item.description}</p>
           </>
         );
        })}
         {/* <div className="absolute right-[-12px] top-1/2 transform -translate-y-1/2 bg-gradient-to-b from-blue-400 to-purple-400 rounded-4xl">
          <KeyboardArrowRightIcon />
        </div> */}
       </div>
      </div>

      {/* Collapsible */}
      {sidebar.state ?
      <div className={`z-0 collapsible h-full w-[25dvw] relative bg-white p-[min(1rem,3%)] overflow-y-scroll box-border rounded-tl-4xl rounded-bl-4xl overflow-x-hidden`}>
         <div className="text-center text-white font-bold flex justify-center items-center h-12 w-full rounded-2xl bg-gradient-to-r from-blue-300 to-gray-400">{sidebar.icon === 1 ? 'TEXT' : sidebar.icon === 2 ? 'BACKGROUND' : sidebar.icon === 3 ? 'SHAPES' : 'STICKERS' }</div>
          
          {sidebar.icon === 1 ? (
          // Text 
          <div className=" h-fit w-full box-border p-[min(2rem,5%)] mt-6 text-black flex-wrap">
            <div className="btn_group h-22 w-full flex flex-col justify-between">
               <button onClick={() => addText("heading")} className="w-full h-10 bg-gray-50 border-1 font-bold text-xl rounded-md">Add a Heading</button>
               <button onClick={() => addText("text")} className="w-full h-10 bg-gray-50 border-1 font-medium rounded-md">Add Text</button>
            </div>
            <div className="fonts w-full h-fit mt-4">
              <h3 className="font-bold text-center">FONTS</h3>
              <div className="font-display">
                {fonts.map((font, idx) => (
                <button key={idx} style={{ fontFamily: font.name }} className="h-10 w-full bg-gray-200 my-2" onClick={() => {
                 if (activeCanvas === "front" && selectedTextId) {
                  setTexts(prev =>
                  prev.map(t =>
                  t.id === selectedTextId ? { ...t, fontFamily: font.name } : t));
                } else if (activeCanvas === "back" && backSelectedTextId) {
                  setBackTexts(prev =>
                  prev.map(t =>
                  t.id === backSelectedTextId ? { ...t, fontFamily: font.name } : t));}}}>
                {font.name}</button>
                ))}
              </div>
            </div>
          </div>)

          : sidebar.icon===2 ? (

          // Background 
          <div className=" h-full w-full bg-yellow-2k00 box-border p-[min(2rem,5%)] mt-6 text-black">
            <div className="Solid colors h-fit w-full mb-5">
              <h5 className="font-bold">Solid Colours</h5>
              <div className="colors flex w-full h-fit justify-start mt-3 flex-wrap items-center">
                {basicColors.map((color, idx) => (
                <button
                 key={idx}
                className="h-11 w-11 rounded-full border-1 m-1"
                style={{ backgroundColor: color }}
                onClick={() => setActiveBg({ type: "solid", color })}/>
                ))}
                <button 
                onClick={() => setShowPicker(!showPicker)}
                className="h-11 w-11 border-2 rounded-full flex justify-center items-center m-1"><AddIcon/></button>
              </div>
              {showPicker && (
              <div className="">
              <SketchPicker color={color}
               onChange={(updatedColor) => {
               setColor(updatedColor.hex);
               setActiveBg({ type: "solid", color: updatedColor.hex });}}/>
               </div>)} 
              </div>

              <div className="gradient-colors h-fit w-full bg-amber-2k00">
               <h5 className="font-bold">Gradient Colours</h5>
               <div className="colors flex w-full h-fit justify-start mt-3 flex-wrap items-center">
                {gradientColors.map((gradient, idx) => (
                <button
                 key={idx}
                className="h-11 w-11 rounded-full border-1 m-1"
                style={{ background: gradient.css}}
                onClick={() => setActiveBg({ type: "gradient", colors: gradient.stops })}/>
                ))}

                <button
                onClick={() => setShowGradPicker(!showGradPicker)}
                className="h-11 w-11 border-2 rounded-full flex justify-center items-center m-1"><AddIcon/></button>
              </div>
                {showGradPicker && (
                <div className="flex gap-4 mt-2">
                  <div>
                  <p className="text-black font-semibold">Start Color</p>
                  <SketchPicker color={customGradStart} onChange={(color) => setCustomGradStart(color.hex)}/>
                  </div>
                  <div>
                   <p className="text-black font-semibold">End Color</p>
                   <SketchPicker color={customGradEnd} onChange={(color) => setCustomGradEnd(color.hex)}/>
                  </div>
                  <div className="flex flex-col justify-center">
                   <button
                   className="h-10 px-4 mt-4 bg-blue-500 text-white rounded"
                   onClick={() => {
                    setActiveBg({ type: "gradient", colors: [0, customGradStart, 1, customGradEnd] });
                   setShowGradPicker(false);}}>Apply Gradient
                  </button>
                  </div>
                  </div>
                  )}
              </div>

               <div className="h-fit w-full mt-4">
                <h5 className="font-bold">Upload Background</h5>
                <label className="h-11 w-11 border-2 rounded-full flex justify-center items-center m-1 cursor-pointer">
                  <FileUploadIcon />
                  <input type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
                </label>
              </div>

              <div className="h-fit w-full mt-4">
                <h5 className="font-bold">Background Images</h5>
                <div className=" w-full h-full p-[min(1rem,5%)] flex flex-wrap justify-between">
                {bgimages.map((img) => (
                  <img 
                  key={img.id}
                  src={img.src}
                  alt={img.name} className="h-30 w-20 my-2"
                  onClick={() => setActiveBg({ type: "image", src: img.src })}
                  />
                ))}
                </div>
              </div>

          </div>

          ) : sidebar.icon === 3? (
            //  Shapes 
         <div className=" h-full w-full bg-yellow-200k box-border p-[min(2rem,5%)] mt-6 text-black flex items-start justify-between flex-wrap">
            {shapes.map((shape, idx) => (
            <button key={idx} className="h-30 w-25 bg-gray-30k0 flex justify-center items-center" onClick={() => addShapeToCanvas(shape.type)}>
               <Stage width={50} height={50}>
                  <Layer>
                    {shape.type === "Rect" && <Rect x={5} y={5} width={40} height={30} fill="black" />}
                    {shape.type === "Circle" && <Circle x={25} y={25} radius={20} fill="black" />}
                    {shape.type === "Triangle" && <Line points={[25, 5, 45, 45, 5, 45]} closed fill="black" />}
                    {shape.type === "Ellipse" && <Ellipse x={25} y={25} radiusX={20} radiusY={15} fill="black" />}
                    {shape.type === "Line" && <Line points={[5,25,45,25]} stroke="black" strokeWidth={3} />}
                    {shape.type === "Polygon" && <Line points={[10,40,25,5,40,40,25,25]} closed fill="black" />}
                    {shape.type === "Star" && <Star x={25} y={25} numPoints={5} innerRadius={8} outerRadius={20} fill="black" />}
                    {shape.type === "Arrow" && <Arrow points={[5,25,45,25]} stroke="black" fill="black" pointerLength={10} pointerWidth={10} />}
                 </Layer>
               </Stage>
            </button>
            ))}
         </div>
         ):(

           
           <div className="Stickers h-full w-full bg-yellow-20l0 box-border p-[min(2rem,5%)] mt-6 text-black flex items-start justify-between flex-wrap">
             {/* Emojis And Reaction */}
             {stickers.map((category) => (
             <div key={category.category} className="h-fit w-full bg-gjreen-200">
               <h5 className="font-bold underline">{category.category}</h5>
               <div className="flex justify-between items-center flex-wrap">
                {category.stickers.map((sticker) => (
                 <img key={sticker.id} src={sticker.src} alt={`sticker-${sticker.id}`}
                 className="w-16 h-16 cursor-pointer hover:scale-110 transition-transform"
                 onClick={() => handleAddSticker(sticker.src)} />
                  ))}
               </div>
              </div>
              ))}
            </div>
         )}

         {/* <div onClick={() => setCollapsed(!collapsed)} className={`z-50 fixed top-1/2   
          ${collapsed ? 'fixed h-[30px] w-[20px]' : ''} left-89 transform -translate-x-1/2 w-5 h-10 bg-gradient-to-b from-blue-400 to-purple-400 flex justify-center items-center rounded-full cursor-pointer shadow-lg transition-transform duration-300`}>
          <KeyboardArrowRightIcon
          className={`transition-transform duration-300 ${
            collapsed ? "rotate-0" : "rotate-180"
          }`}
        />
        </div> */}
         {/* <div onClick={() => setCollapsed(!collapsed)} className={`
      fixed top-1/2 left-81 transform -translate-y-1/2
      w-5 h-10 bg-gradient-to-b from-blue-400 to-purple-400
      flex justify-center items-center rounded-full cursor-pointer shadow-lg
      z-[100] transition-transform duration-300
      ${collapsed ? 'translate-x-full' : 'translate-x-0'}
    `}>
          <KeyboardArrowRightIcon
          className={`transition-transform duration-300 ${
            collapsed ? "rotate-0" : "rotate-180"
          }`}
        />
        </div> */}
      </div>
       : null}

       
       {/* Page */}
      <div className="w-[80dvw] h-full">
        {canvas ?(
          <>
          {/* Text Edit */}
        {(activeCanvas === "front" ? selectedTextId && texts.length > 0 : backSelectedTextId && backTexts.length > 0) && (                                         
        <div className="text-edit w-[90%] h-12 bg-white m-auto mt-3 rounded-4xl flex items-center px-3 justify-between">
        <div className="h-fit w-70 border-black flex justify-between px-2">
          {/* Bold Text */}
          <button className={`text-xl font-bold text-black w-8 h-8 bg-gray-300 ${selectedText?.fontStyle === "bold" ? "scale-125 bg-yellow-400" : ""}`} 
          onClick={() => { 
             if (activeCanvas === "front" && selectedTextId) {
               setTexts(prev => prev.map(t => t.id === selectedTextId ? { ...t, fontStyle: t.fontStyle === "bold" ? "normal" : "bold" } : t));
              } else if (activeCanvas === "back" && backSelectedTextId) {
                setBackTexts(prev => prev.map(t => t.id === backSelectedTextId ? { ...t, fontStyle: t.fontStyle === "bold" ? "normal" : "bold" } : t));}}}>
          B</button>
          {/* Italic Text */}
          <button 
          className={`text-xl font-bold italic text-black w-8 h-8 bg-gray-300 transition-transform duration-200 ${selectedText?.fontStyle === "italic" ? "scale-125 bg-yellow-400" : ""}`}
           onClick={() => {
              if (activeCanvas === "front" && selectedTextId) {
                setTexts(prev => prev.map(t => t.id === selectedTextId ? { ...t, fontStyle: t.fontStyle === "italic" ? "normal" : "italic" } : t));
              } else if (activeCanvas === "back" && backSelectedTextId) {
               setBackTexts(prev => prev.map(t => t.id === backSelectedTextId ? { ...t, fontStyle: t.fontStyle === "italic" ? "normal" : "italic" } : t));}}}>
             I</button>
          {/* Underline */}
          <button className={`text-xl font-bold underline text-black w-8 h-8 bg-gray-300 transition-transform duration-200 ${selectedText?.fontStyle === "underline" ? "scale-125 bg-yellow-400" : ""}`}
           onClick={() =>{ if (activeCanvas === "front" && selectedTextId) {
            setTexts(prev => prev.map(t => t.id === selectedTextId ? { ...t, fontStyle: t.fontStyle === "underline" ? "underline" : "bold" } : t));
          } else if (activeCanvas === "back" && backSelectedTextId) {
            setBackTexts(prev => prev.map(t => t.id === backSelectedTextId ? { ...t, fontStyle: t.fontStyle === "underline" ? "normal" : "underline" } : t));}}}>
          U</button>
          {/* <button className="text-xl text-black w-8 h-8 line-through bg-gray-300">S</button> */}
          <button onClick={() => setShowTextColorPicker(!showTextColorPicker)} className="text-xl text-black w-9 h-8 line-through bg-gray-300"><FormatColorTextIcon sx={{fontSize:20}}/></button>
          {showTextColorPicker && selectedTextId && (
         <div ref={colorPickerRef} className="absolute z-50 mt-2">
         <SketchPicker color={activeCanvas === "front" ? textColor : backTextColor} onChange={(color) => {
             if (activeCanvas === "front") {
              setTextColor(color.hex);
              setTexts(prev =>
              prev.map(t =>t.id === selectedTextId ? { ...t, color: color.hex } : t));
              } else {
              setBackTextColor(color.hex);
              setBackTexts(prev =>
              prev.map(t =>
              t.id === backSelectedTextId ? { ...t, color: color.hex } : t));}}}/>

          </div>)}
        </div>
        {/* Transparency Slider */}
        <div className="slider w-80 mx-auto">
          <label className="mb-2 font-bold text-black"> Transparency: {Math.round((selectedText?.opacity ?? 1) * 100)}%</label>
          <input type="range" min={0} max={1} step={0.01} style={{ backgroundColor: "black" }}
           value={
             activeCanvas === "front" ? texts.find(t => t.id === selectedTextId)?.opacity ?? 1 : backTexts.find(t => t.id === backSelectedTextId)?.opacity ?? 1}
             onChange={(e) => {
             const value = parseFloat(e.target.value);
             if (activeCanvas === "front" && selectedTextId) {
               setTexts(prev => prev.map(t => t.id === selectedTextId ? { ...t, opacity: value } : t));
             } else if (activeCanvas === "back" && backSelectedTextId) {
               setBackTexts(prev => prev.map(t => t.id === backSelectedTextId ? { ...t, opacity: value } : t));}}}className="w-full"/>
        </div>
        </div>
        )}
        
        {activeCanvas === "front" && (
        <CanvasArea 
        ref={frontCanvasRef}
        canvasSize={canvasSize} 
        shapes={canvasShapes} 
        setShapes={setCanvasShapes}
        canvasBg={canvasBg} 
        handleAddSticker = {handleAddSticker}
        texts={texts}
        textColor={textColor}
        setTexts={setTexts}
        selectedId={selectedId}
        setSelectedTextId={setSelectedTextId}
        />
        )}

        {activeCanvas === "back" && (
        <BackCanvas
        ref={backCanvasRef}
        canvasSize={canvasSize}                  
        shapes={backCanvasShapes}               
        setShapes={setBackCanvasShapes}         
        canvasBg={backCanvasBg}                 
        texts={backTexts}                       
        setTexts={setBackTexts}                 
        selectedId={backSelectedTextId}         
        setSelectedTextId={setBackSelectedTextId} 
        textColor={backTextColor}               
       />
       )}

        <div className="w-60 m-auto flex justify-between">
          <button className={`text-white font-bold h-fit w-fit border-1 rounded-full py-1 px-3 ${activeCanvas === "front" ? "bg-blue-500" : "bg-gray-500" }`} onClick={() => setActiveCanvas("front")}>Frontcover</button>
          <button className={`text-white font-bold h-fit w-fit border-1 rounded-full py-1 px-3 ${activeCanvas === "back" ? "bg-blue-500" : "bg-gray-500"}`} onClick={() => setActiveCanvas("back")}>Backcover</button>
        </div>
        </>
        )

         :
         <div className="w-full h-full flex justify-center items-center flex-col">
           <div className="canvas sheet h-100 w-130 flex justify-between items-center">
            {/* front cover */}
             <div className="relative w-60 h-85 bg-white text-[#5e5e5e] text-[12px] text-center flex justify-center items-center">
               {frontCover ? (
                <img src={frontCover} alt="Front Cover" className="absolute top-0 left-0 w-full h-full object-cover" />) : (
                <>Front Cover <br /> Supported: JPG, PNG (Max 5MB)</>)}
              </div>
             {/* Back cover */}
             <div className="relative w-60 h-85 bg-white text-[#5e5e5e] text-[12px] text-center flex justify-center items-center">
               {backCover ? (<img src={backCover} alt="Back Cover" className="absolute top-0 left-0 w-full h-full object-cover" />) : (
                <>Back Cover <br /> Supported: JPG, PNG (Max 5MB)</>)}
             </div>
           </div>
            <div className="upload-btns flex w-100 justify-between">

              {/* Upload Front cover */}
              <label className="border border-dashed py-[min(1rem,3%)] px-[min(2rem,3%)] text-white flex items-center gap-2 cursor-pointer">
               <FileUploadIcon />Upload Front Cover
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setFrontCover)} />
              </label>

              {/* Upload Back cover */}
              <label className="border border-dashed py-[min(1rem,3%)] px-[min(2rem,3%)] text-white flex items-center gap-2 cursor-pointer">
               <FileUploadIcon />Upload Back Cover
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setBackCover)} />
              </label>
            </div>
         </div>
         }
      </div>

      {/* Dimensions */}
      <div className="w-[13dvw] flex justify-center items-center bg-black flex-col">
    <div className="h-fit w-full flex flex-col justify-between items-center">
      <h3 className="text-white mb-2">Dimensions</h3>
      {[
        { label: '5" x 8"', width: 200, height: 300 },
        { label: '5.5" x 8.5"', width: 220, height: 310 },
        { label: '7.25" x 9.25"', width: 290, height: 370 },
        { label: '8.25" x 11"', width: 300, height: 420 },
      ].map((book, idx) => {
        const isActive =
          canvasSize.width === book.width && canvasSize.height === book.height;
        return (
          <div
            key={idx}
            onClick={() =>
              setCanvasSize({ width: book.width, height: book.height })
            }
            className={`h-20 w-35 flex justify-center items-center my-2 cursor-pointer rounded
              ${isActive ? "border border-dotted bg-white/10 text-white" : "bg-white/10 text-[#a8a8a8]"}`}
          >
            {book.label}
          </div>
        );
      })}
    </div>
   <button onClick={() => {if (activeCanvas === "front"){handleDownloadFront();}else{handleDownloadBack();}}} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
  {activeCanvas === "front" ? "Download Front Cover" : "Download Back Cover"}
</button>


  </div>

     </div>
    </>
  )
}

{/* <div className="h-200 w-25 bg-gradient-to-b from-blue-400 to-purple-400 flex flex-col items-center justify-center"></div> */}
                