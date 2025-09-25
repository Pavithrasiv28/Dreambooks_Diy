"use client";
import { useState,useRef } from "react";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import TitleIcon from '@mui/icons-material/Title';
import InterestsIcon from '@mui/icons-material/Interests';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import AddIcon from '@mui/icons-material/Add';
// import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ManuscriptLayout() {
    const [activeIndex, setActiveIndex] = useState(0);
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
    <div className="flex h-full w-full">
    {diysidebar && (
     <div className={`z-10 h-[100%] w-[7dvw] ${diysidebar.button2 ? '' : 'pointer-events-none opacity-30'} bg-[#E9E9E9] flex flex-col items-center justify-center rounded-tr-3xl rounded-br-3xl relative" style={{ boxShadow: "4px 0 6px -2px rgba(0,0,0,0.3)" }`}>
       <div className="h-[90%] bg-rose-l00 w-full flex flex-col items-center justify-start py-[min(2rem,8%)]">
        {details.map((item, idx) =>{
          return(
          <div className="my-3">
          <button key={idx} 
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
    )}
    {/* {!diysidebar.button2 && (
    <div className="w-[7dvw]">

    </div>
    )} */}
    
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

      <div className="choose w-[13dvw] h-full bg-yellow-2r00 flex justify-center items-center flex-col">
         <div onClick={() => handleUploadClick('button1')} className={`h-35 w-35 text-md ${diysidebar.button1 ? 'bg-blue-300 scale-120 text-sm border-3 border-dashed border-black' : 'bg-blue-300/30'} my-3 rounded-md text-black flex justify-center items-center text-center flex-col`}>
            <h4 className="text-black font-bold">UPLOAD MANUSCRIPT</h4>
            <img src="/inbox.png" alt="Upload-image" height={40} width={40} />
         </div>
         <div onClick={() => handleUploadClick('button2')} className={`h-35 w-35 text-md ${diysidebar.button2 ? 'bg-blue-300 scale-120 text-sm border-3 border-dashed border-black' : 'bg-blue-300/20'} my-3 rounded-md text-black flex justify-center items-center text-center flex-col`}>
            <h4 className="text-black font-bold">CREATE</h4>
            <img src="/diy.png" alt="Upload-image" height={40} width={40} />
         </div>
      </div>
    </div>
    </>
  )
}

export default ManuscriptLayout