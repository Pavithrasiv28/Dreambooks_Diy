"use client";
import { Stage, Layer, Rect, Circle, Line, Ellipse, Star, Arrow, Transformer, Image as KonvaImage, Text } from "react-konva";
import { useState, useRef, useEffect, forwardRef } from "react";
import useImage from "use-image";

// Separate component for Sticker
function Sticker({ shape, ...commonProps }) {
  const [image] = useImage(shape.src); // hook is called consistently for each Sticker
  return <KonvaImage {...commonProps} image={image} width={shape.width || 80} height={shape.height || 80} />;
}

const CanvasArea = forwardRef(
  ({ canvasSize, shapes, setShapes, canvasBg, texts, setTexts, selectedId, setSelectedTextId, textColor }, ref) => {
    const [editingTextId, setEditingTextId] = useState(null);
    const [selectedShape, setSelectedShape] = useState(null);
    const [textValue, setTextValue] = useState("");
    const transformerRef = useRef();
    const layerRef = useRef();
    const internalRef = useRef(null);
    const stageRef = useRef(null);
    const wrapperRef = useRef();

    const [isBrowser, setIsBrowser] = useState(false);

    // ✅ Set isBrowser flag
    useEffect(() => {
      setIsBrowser(true);
    }, []);

    // ✅ Always call useImage hook before any return
    const imageSrc = canvasBg.type === "image" ? canvasBg.src : null;
    const [bgImage] = useImage(imageSrc);

    // ✅ Forward ref
    useEffect(() => {
      if (ref) {
        ref.current = stageRef.current;
      }
    }, [ref, stageRef]);

    // ✅ Mouse down transformer vanish
    // useEffect(() => {
    //   const handleClickOutside = (e) => {
    //     if (!stageRef.current) return;

    //     const isClickOnStage = stageRef.current.container().contains(e.target);
    //     const isClickOnButtons = wrapperRef.current?.contains(e.target);

    //     if (!isClickOnStage && !isClickOnButtons) {
    //       setSelectedShape(null);
    //       setSelectedTextId(null);
    //     }
    //   };

    //   document.addEventListener("mousedown", handleClickOutside);
    //   return () => {
    //     document.removeEventListener("mousedown", handleClickOutside);
    //   };
    // }, [setSelectedTextId]);

    // Update transformer
    useEffect(() => {
      const layer = layerRef.current;
      const tr = transformerRef.current;

      if (selectedShape !== null && tr) {
        const selectedNode = layer.findOne(`#${selectedShape}`);
        if (selectedNode) {
          tr.nodes([selectedNode]);
          tr.getLayer().batchDraw();
        }
      } else if (tr) {
        tr.nodes([]);
        tr.getLayer().batchDraw();
      }
    }, [selectedShape, shapes, texts]);

      // Update text color
    useEffect(() => {
      if (textColor && selectedId !== null) {
        setTexts((prevTexts) =>
          prevTexts.map((t) => (t.id === selectedId ? { ...t, color: textColor } : t))
        );
      }
    }, [textColor, selectedId, setTexts]);

//     useEffect(() => {
//   if (canvasBg.type === "image") {
//     import("use-image").then((mod) => {
//       const [image] = mod.default(canvasBg.src);
//       setBgImage(image);
//     });
//   }
// }, [canvasBg]);


    if (!isBrowser) return null;

    // Drag handler
    const handleDragEnd = (idx, e) => {
      const newShapes = [...shapes];
      newShapes[idx] = { ...newShapes[idx], x: e.target.x(), y: e.target.y() };
      setShapes(newShapes);
    };

    // Delete shape
    const handleDelete = () => {
      if (!selectedShape) return;

      if (selectedShape.startsWith("shape-")) {
        const idx = Number(selectedShape.split("-")[1]);
        setShapes(shapes.filter((_, i) => i !== idx));
      } else if (selectedShape.startsWith("text-")) {
        const textId = Number(selectedShape.split("-")[1]);
        setTexts(texts.filter((t) => t.id !== textId));
      }

      setSelectedShape(null);
    };


    // Duplicate shape
    const handleDuplicate = () => {
      if (!selectedShape) return;

      if (selectedShape.startsWith("shape-")) {
        const idx = Number(selectedShape.split("-")[1]);
        const newShapes = [...shapes];
        const shapeToDuplicate = {
          ...shapes[idx],
          x: (shapes[idx].x || 50) + 20,
          y: (shapes[idx].y || 50) + 20,
        };
        newShapes.push(shapeToDuplicate);
        setShapes(newShapes);
      } else if (selectedShape.startsWith("text-")) {
        const textId = Number(selectedShape.split("-")[1]);
        const textToDuplicate = texts.find((t) => t.id === textId);
        if (textToDuplicate) {
          const newText = {
            ...textToDuplicate,
            id: Date.now(),
            x: textToDuplicate.x + 20,
            y: textToDuplicate.y + 20,
          };
          setTexts([...texts, newText]);
        }
      }
    };

    return (
      <div ref={wrapperRef} className="relative w-full h-[82%] py-5 flex justify-center items-center">
        {selectedShape !== null && (
          <div ref={wrapperRef} className="absolute top-2 right-2 flex gap-2 z-10">
            <button
              onClick={handleDuplicate}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Duplicate
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}

        <Stage
          width={canvasSize.width}
          height={canvasSize.height}
          ref={stageRef}
          className="bg-white border"
          onMouseDown={() => {}}
        >
          <Layer ref={layerRef}>
            {/* Background */}
            <Rect
            id="background-rect" 
              x={0}
              y={0}
              width={canvasSize.width}
              height={canvasSize.height}
              {...(canvasBg.type === "solid"
                ? { fill: canvasBg.color }
                : canvasBg.type === "gradient"
                ? {
                    fillLinearGradientStartPoint: { x: 0, y: 0 },
                    fillLinearGradientEndPoint: { x: canvasSize.width, y: 0 },
                    fillLinearGradientColorStops: canvasBg.colors,
                  }
                : canvasBg.type === "image" && bgImage
                ? {
                    fillPatternImage: bgImage,
                    fillPatternScale: {
                      x: canvasSize.width / bgImage.width,
                      y: canvasSize.height / bgImage.height,
                    },
                    fillPatternRepeat: "no-repeat",
                  }
                : {})}
                   onMouseDown={() => {
    setSelectedShape(null);
    setSelectedTextId(null);
  }}
            />

            {/* Render shapes */}
            {shapes.map((shape, idx) => {
              const commonProps = {
                // key: idx,
                id: `shape-${idx}`,
                x: shape.x || 50,
                y: shape.y || 50,
                draggable: true,
                onDragEnd: (e) => handleDragEnd(idx, e),
                onClick: () => setSelectedShape(`shape-${idx}`),
                onTap: () => setSelectedShape(`shape-${idx}`),
              };

              switch (shape.type) {
                case "Rect":
                  return <Rect key={idx} {...commonProps} width={shape.width || 100} height={shape.height || 60} fill={shape.color || "black"} />;
                case "Circle":
                  return <Circle key={idx} {...commonProps} radius={shape.radius || 50} fill={shape.color || "black"} />;
                case "Triangle":
                  return <Line key={idx} {...commonProps} points={[0, 50, 50, 50, 25, 0]} closed fill={shape.color || "black"} />;
                case "Ellipse":
                  return <Ellipse key={idx} {...commonProps} radiusX={shape.radiusX || 50} radiusY={shape.radiusY || 30} fill={shape.color || "black"} />;
                case "Line":
                  return <Line key={idx} {...commonProps} points={shape.points || [0, 0, 100, 0]} stroke={shape.color || "black"} strokeWidth={3} />;
                case "Polygon":
                  return <Line key={idx} {...commonProps} points={shape.points || [0, 50, 25, 0, 50, 50, 25, 25]} closed fill={shape.color || "black"} />;
                case "Star":
                  return <Star key={idx} {...commonProps} numPoints={5} innerRadius={shape.innerRadius || 10} outerRadius={shape.outerRadius || 25} fill={shape.color || "black"} />;
                case "Arrow":
                  return <Arrow
                     key={idx}
                    {...commonProps}
                    points={shape.points || [0, 0, 100, 0]}
                    pointerLength={10}
                    pointerWidth={10}
                    fill={shape.color || "black"}
                    stroke={shape.color || "black"}
                  />;
                case "Sticker":
                  return <Sticker key={idx} {...commonProps} shape={shape} />;
                default:
                  return null;
              }
            })}

            {/* Render texts */}
            {texts.map((t, idx) => (
              <Text
                key={t.id}
                id={`text-${t.id}`}
                x={t.x}
                y={t.y}
                text={t.text}
                fontSize={t.fontSize}
                fontStyle={t.fontStyle || "normal"}
                fontFamily={t.fontFamily}
                fill={t.color || "black"}
                opacity={t.opacity ?? 1}
                draggable
                onDragEnd={(e) => {
                  const newTexts = [...texts];
                  newTexts[idx] = { ...newTexts[idx], x: e.target.x(), y: e.target.y() };
                  setTexts(newTexts);
                }}
                onClick={() => {
                  setSelectedShape(`text-${t.id}`);
                  setSelectedTextId(t.id);
                }}
                onTap={() => {
                  setSelectedShape(`text-${t.id}`);
                  setSelectedTextId(t.id);
                }}
                onDblClick={(e) => {
                  e.cancelBubble = true;
                  setEditingTextId(t.id);
                  setTextValue(t.text);

                  const stageBox = e.target.getStage().container().getBoundingClientRect();
                  const textarea = document.createElement("textarea");
                  document.body.appendChild(textarea);

                  textarea.value = t.text;
                  textarea.style.position = "absolute";
                  textarea.style.top = stageBox.top + t.y + "px";
                  textarea.style.left = stageBox.left + t.x + "px";
                  textarea.style.fontSize = t.fontSize + "px";
                  textarea.style.fontFamily = t.fontFamily;
                  textarea.style.border = "1px solid #ddd";
                  textarea.style.padding = "2px";
                  textarea.style.margin = "0";
                  textarea.style.background = "white";
                  textarea.style.color = t.color || "black";
                  textarea.style.overflow = "hidden";
                  textarea.style.width = t.text.length * (t.fontSize / 2) + "px";

                  textarea.focus();

                  const removeTextarea = () => {
                    const newTexts = [...texts];
                    newTexts[idx] = { ...newTexts[idx], text: textarea.value };
                    setTexts(newTexts);
                    setEditingTextId(null);
                    document.body.removeChild(textarea);
                  };

                  textarea.addEventListener("keydown", function (e) {
                    if (e.key === "Enter") {
                      removeTextarea();
                    }
                  });

                  textarea.addEventListener("blur", removeTextarea);
                }}
              />
            ))}

            {/* Transformer */}
            <Transformer
              ref={transformerRef}
              rotateEnabled
              enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
              anchorSize={8}
              borderStroke="blue"
              borderDash={[4, 4]}
            />
          </Layer>
        </Stage>
      </div>
    );
  }
);

CanvasArea.displayName = "CanvasArea";

export default CanvasArea;