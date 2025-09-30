"use client";
import { Stage, Layer, Rect, Circle, Line, Ellipse, Star, Arrow, Transformer, Image as KonvaImage, Text } from "react-konva";
import { useState, useRef, useEffect, forwardRef } from "react";
import useImage from "use-image";

// Sticker component
function Sticker({ shape, ...commonProps }) {
  const [image] = useImage(shape.src);
  return <KonvaImage {...commonProps} image={image} width={shape.width || 80} height={shape.height || 80} />;
}

const BackCanvas = forwardRef(function BackCanvas({
  canvasSize,
  shapes,
  setShapes,
  canvasBg,
  texts,
  setTexts,
  selectedId,
  setSelectedTextId,
  textColor,
}, ref) {
  const [selectedShape, setSelectedShape] = useState(null);
  const [editingTextId, setEditingTextId] = useState(null);
  const [textValue, setTextValue] = useState("");
  const transformerRef = useRef();
  const layerRef = useRef();
  const stageRef = useRef();

  // Safe background image load
  const [bgImage] = useImage(canvasBg?.type === "image" ? canvasBg.src : null);

  useEffect(() => {
    if (ref) {
      ref.current = stageRef.current;
    }
  }, [ref, stageRef]);

  // Deselect on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!stageRef.current) return;

      if (!stageRef.current.container().contains(e.target)) {
        setSelectedShape(null);
        if (typeof setSelectedTextId === "function") setSelectedTextId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSelectedTextId]);

  // Drag handler
  const handleDragEnd = (idx, e) => {
    const newShapes = [...shapes];
    newShapes[idx] = { ...newShapes[idx], x: e.target.x(), y: e.target.y() };
    setShapes(newShapes);
  };

  // Delete
  const handleDelete = () => {
    if (!selectedShape) return;

    if (selectedShape.startsWith("shape-")) {
      const idx = Number(selectedShape.split("-")[1]);
      setShapes(shapes.filter((_, i) => i !== idx));
    } else if (selectedShape.startsWith("text-")) {
      const textId = Number(selectedShape.split("-")[1]);
      setTexts(texts.filter(t => t.id !== textId));
    }

    setSelectedShape(null);
  };

  // Change color safely
  useEffect(() => {
    if (textColor && selectedId !== null) {
      setTexts(prevTexts =>
        prevTexts.map(t =>
          t.id === selectedId
            ? { ...t, color: textColor }
            : t
        )
      );
    }
  }, [textColor, selectedId, setTexts]);

  // Duplicate
  const handleDuplicate = () => {
    if (!selectedShape) return;

    if (selectedShape.startsWith("shape-")) {
      const idx = Number(selectedShape.split("-")[1]);
      const shapeToDuplicate = {
        ...shapes[idx],
        x: (shapes[idx].x || 50) + 20,
        y: (shapes[idx].y || 50) + 20,
      };
      setShapes([...shapes, shapeToDuplicate]);
    } else if (selectedShape.startsWith("text-")) {
      const textId = Number(selectedShape.split("-")[1]);
      const textToDuplicate = texts.find(t => t.id === textId);
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

  // Transformer update
  useEffect(() => {
    const layer = layerRef.current;
    const tr = transformerRef.current;

    if (selectedShape !== null && tr && layer) {
      const selectedNode = layer.findOne(`#${selectedShape}`);
      if (selectedNode) {
        tr.nodes([selectedNode]);
        tr.getLayer()?.batchDraw();
      }
    } else if (tr) {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
    }
  }, [selectedShape, shapes, texts]);

  return (
    <div className="relative w-full h-[82%] py-5 flex justify-center items-center">
      {selectedShape !== null && (
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <button onClick={handleDuplicate} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
            Duplicate
          </button>
          <button onClick={handleDelete} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
            Delete
          </button>
        </div>
      )}

      <Stage
        width={canvasSize.width}
        height={canvasSize.height}
        ref={stageRef}
        className="bg-white border"
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            setSelectedShape(null);
            if (typeof setSelectedTextId === "function") setSelectedTextId(null);
          }
        }}
      >
        <Layer ref={layerRef}>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={canvasSize.width}
            height={canvasSize.height}
            {...(canvasBg?.type === "solid"
              ? { fill: canvasBg.color }
              : canvasBg?.type === "gradient"
              ? {
                  fillLinearGradientStartPoint: { x: 0, y: 0 },
                  fillLinearGradientEndPoint: { x: canvasSize.width, y: 0 },
                  fillLinearGradientColorStops: canvasBg.colors,
                }
              : canvasBg?.type === "image" && bgImage
              ? {
                  fillPatternImage: bgImage,
                  fillPatternScale: {
                    x: canvasSize.width / bgImage.width,
                    y: canvasSize.height / bgImage.height,
                  },
                  fillPatternRepeat: "no-repeat",
                }
              : {}
            )}
          />

          {/* Shapes */}
          {shapes.map((shape, idx) => {
            const commonProps = {
              key: idx,
              id: `shape-${idx}`,
              x: shape.x || 50,
              y: shape.y || 50,
              draggable: true,
              onDragEnd: (e) => handleDragEnd(idx, e),
              onClick: () => setSelectedShape(`shape-${idx}`),
              onTap: () => setSelectedShape(`shape-${idx}`),
            };

            switch (shape.type) {
              case "Rect": return <Rect {...commonProps} width={shape.width || 100} height={shape.height || 60} fill={shape.color || "black"} />;
              case "Circle": return <Circle {...commonProps} radius={shape.radius || 50} fill={shape.color || "black"} />;
              case "Triangle": return <Line {...commonProps} points={[0, 50, 50, 50, 25, 0]} closed fill={shape.color || "black"} />;
              case "Ellipse": return <Ellipse {...commonProps} radiusX={shape.radiusX || 50} radiusY={shape.radiusY || 30} fill={shape.color || "black"} />;
              case "Line": return <Line {...commonProps} points={shape.points || [0, 0, 100, 0]} stroke={shape.color || "black"} strokeWidth={3} />;
              case "Polygon": return <Line {...commonProps} points={shape.points || [0, 50, 25, 0, 50, 50, 25, 25]} closed fill={shape.color || "black"} />;
              case "Star": return <Star {...commonProps} numPoints={5} innerRadius={shape.innerRadius || 10} outerRadius={shape.outerRadius || 25} fill={shape.color || "black"} />;
              case "Arrow": return <Arrow {...commonProps} points={shape.points || [0, 0, 100, 0]} pointerLength={10} pointerWidth={10} fill={shape.color || "black"} stroke={shape.color || "black"} />;
              case "Sticker": return <Sticker {...commonProps} shape={shape} />;
              default: return null;
            }
          })}

          {/* Texts */}
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
                if (typeof setSelectedTextId === "function") setSelectedTextId(t.id);
              }}
              onTap={() => {
                setSelectedShape(`text-${t.id}`);
                if (typeof setSelectedTextId === "function") setSelectedTextId(t.id);
              }}
            />
          ))}

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
});

export default BackCanvas;