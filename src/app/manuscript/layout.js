"use client";
import { useState,useRef } from "react";
import Image from "next/image";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import TitleIcon from '@mui/icons-material/Title';
import InterestsIcon from '@mui/icons-material/Interests';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ManuscriptLayout() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [collapsed, setCollapsed] = useState(true);
    const [diysidebar, setDiysidebar] = useState({
    button1: true,  // initial state
    button2: false,
  });
     
    // PDF upload
    const [file, setFile] = useState(null);
     const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile && selectedFile.type === "application/pdf") {
    // Store the actual File object
    setFile(selectedFile);
  }
};
 


    const details = [
    // {description:'Upload Script', icon: FileUploadIcon},
    {description:'Template', icon: TitleIcon},
    {description:'Chapters', icon: WallpaperIcon},
    // {description:'Shapes', icon: InterestsIcon},
    // {description:'Stickers', icon: AddIcon},
  ]
  

   const handleUploadClick = (button) =>{

       if (!diysidebar[button]) {
           setDiysidebar({
               button1: button === "button1",
               button2: button === "button2",
            });
        }
    }

    const handlePreview = () => {
    if (file) {
      const fileURL = URL.createObjectURL(file); // create a temporary URL
      window.open(fileURL, "_blank"); // open in a new tab
    }
  };

  return (
    <>
    <div className="flex h-full w-full overflow-hidden">
    
     <div className={`z-2 h-[100%] w-[7dvw] ${diysidebar.button2 ? '' : 'pointer-events-none opacity-30'} bg-[#E9E9E9] flex flex-col items-center justify-center rounded-tr-3xl rounded-br-3xl relative" style={{ boxShadow: "4px 0 6px -2px rgba(0,0,0,0.3)" }`}>
       <div className="h-[90%] bg-rose-l00 w-full flex flex-col items-center justify-start py-[min(2rem,8%)]">
        {details.map((item, idx) =>{
          return(
          <div key={idx} className="my-3">
          <button 
          className={`h-15 w-15 rounded-2xl p-2 bg-gradient-to-b from-blue-400 to-purple-400 flex flex-col items-center justify-evenly
             ${activeIndex === idx ? "border-4 border-b-slate-900 border-t-slate-900 scale" : ""}`}
          onClick={() =>{ setActiveIndex(idx);}}
          >
           <item.icon/>
          </button>
           <p className="text-[#5B5B5B] text-center text-[12px] font-bold">{item.description}</p>
           </div>
         );
        })}
       </div>
      </div>

        {/*Collapsible  */}
      {diysidebar.button2 && (
      <div className={`h-full w-[25dvw] relative bg-white py-[min(1rem,3%)] box-border rounded-tl-4xl rounded-bl-4xl transform transition-transform duration-300 ${collapsed ? '-translate-x-[100%]' : 'translate-x-0'}`}>
        <div className="text-center text-white font-bold flex justify-center items-center m-auto h-12 w-[90%] rounded-2xl bg-gradient-to-r from-blue-300 to-gray-400">TEMPLATES</div>
        <div className="collapsible h-full w-full overflow-y-scroll mt-5">
        <div className="h-fit w-full flex justify-center flex-col items-center over">
          <div className="h-60 w-[85%] bg-blue-200 text-black flex justify-center items-center my-2">TEMPLATE 1</div>
          <div className="h-60 w-[85%] bg-blue-200 text-black flex justify-center items-center my-2">TEMPLATE 2</div>
          <div className="h-60 w-[85%] bg-blue-200 text-black flex justify-center items-center my-2">TEMPLATE 3</div>
          <div className="h-60 w-[85%] bg-blue-200 text-black flex justify-center items-center my-2">TEMPLATE 4</div>
          <div className="h-60 w-[85%] bg-blue-200 text-black flex justify-center items-center my-2">TEMPLATE 5</div>
          <div className="h-60 w-[85%] bg-blue-200 text-black flex justify-center items-center my-2">TEMPLATE 6</div>
          <div className="h-60 w-[85%] bg-blue-200 text-black flex justify-center items-center my-2">TEMPLATE 7</div>
          <div className="h-60 w-[85%] bg-blue-200 text-black flex justify-center items-center my-2">TEMPLATE 8</div>
          <div className="h-60 w-[85%] bg-blue-200 text-black flex justify-center items-center my-2">TEMPLATE 9</div>
          <div className="h-60 w-[85%] bg-blue-200 text-black flex justify-center items-center my-2">TEMPLATE 10</div>
        </div>
        </div>
        <div onClick={() => setCollapsed(!collapsed)} className={`z-[100] absolute top-1/2   ${collapsed ? '-right-4' : '-right-1'} -right-1 transform -translate-y-1/2 w-5 h-10 bg-gradient-to-b from-blue-400 to-purple-400 flex justify-center items-center rounded-full cursor-pointer shadow-lg transition-transform duration-300`}>
          <KeyboardArrowRightIcon
          className={`transition-transform duration-300 ${
            collapsed ? "rotate-0" : "rotate-180"
          }`}
        />
        </div>
      </div>
      )}
    
      <div className="panel w-[80dvw] h-full bg-whhite flex justify-center items-center flex-col">
          {diysidebar.button1 ? 
          <>
          <button className="underline mb-2" onClick={handlePreview} disabled={!file}>Preview</button>
          <div className="upload h-100 w-200 flex flex-col items-center">
             <div className="h-80 w-70 bg-yelldow-100 px-2 border-3 border-double border-white flex justify-center items-center text-center flex-wrap">
                {file ? (
                    <p className="text-white truncate">{file.name}</p>
                ) : (
                    <p className="text-white">No Files Uploaded</p>
                )}
             </div>
             <div className="btns bg-gray-600 h-fit w-70">
                <input type="file" id="pdfUpload" accept="application/pdf" className="hidden" onChange={handleFileChange}/>
                <label htmlFor="pdfUpload" className="h-13 w-full px-3 py-2 bg-green-500 font-bold flex justify-center items-center cursor-pointer text-center text-white rounded">
                 Upload PDF
                </label>
                {/* <input type="file" accept="application/pdf"  className="h-13 w-full px-3 py-2 bg-green-500 font-bold flex justify-center items-center cursor-pointer text-center"/> */}
             </div>
          </div>
                </>
          :''}
      </div>

      <div className="choose w-fit h-full p-[min(2rem,2%)] bg-yellow-2r00 flex justify-center items-center flex-col">
         <div onClick={() => handleUploadClick('button1')} className={`h-35 w-35 text-md ${diysidebar.button1 ? 'bg-blue-300 scale-120 text-sm border-3 border-dashed border-black' : 'bg-blue-300/30'} my-3 rounded-md text-black flex justify-center items-center text-center flex-col`}>
            <h4 className="text-black font-bold">UPLOAD MANUSCRIPT</h4>
            <Image src="/inbox.png" alt="Upload-image" height={40} width={40} />
         </div>
         <div onClick={() => handleUploadClick('button2')} className={`h-35 w-35 text-md ${diysidebar.button2 ? 'bg-blue-300 scale-120 text-sm border-3 border-dashed border-black' : 'bg-blue-300/20'} my-3 rounded-md text-black flex justify-center items-center text-center flex-col`}>
            <h4 className="text-black font-bold">CREATE</h4>
            <Image src="/diy.png" alt="Upload-image" height={40} width={40} />
         </div>
      </div>
    </div>
    </>
  )
}

export default ManuscriptLayout