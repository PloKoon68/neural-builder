  // Enhanced MainBox Component (based on your code)
  const MainBox = () => {
    const inputNeuronRefs = useRef([]);
    const layerNeuronRefs = useRef([]);
    const mainBoxRef = useRef(null);
    const canvasRef = useRef(null);

    // Clean input neuron refs if input size shrinks
    useEffect(() => {
      inputNeuronRefs.current = inputNeuronRefs.current.slice(0, inputSize);
    }, [inputSize]);

    // Drawing logic for connections using canvas
    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      if (!isCompiled) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      const drawLines = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Get scroll offset
        const container = mainBoxRef.current;
        const scrollLeft = container.scrollLeft;
        const scrollTop = container.scrollTop;
        
        const getOffset = (el) => {
          if (!el || !container) return { x: 0, y: 0 };
          const rect = el.getBoundingClientRect();
          const parentRect = container.getBoundingClientRect();
          return {
            x: rect.left - parentRect.left + rect.width / 2 + scrollLeft,
            y: rect.top - parentRect.top + rect.height / 2 + scrollTop,
          };
        };

        const allLayers = [inputNeuronRefs.current, ...layerNeuronRefs.current];
        for (let i = 0; i < allLayers.length - 1; i++) {
          const fromLayer = allLayers[i];
          const toLayer = allLayers[i + 1];
          if (!fromLayer || !toLayer) continue;

          for (let fi = 0; fi < fromLayer.length; fi++) {
            for (let ti = 0; ti < toLayer.length; ti++) {
              const fromEl = fromLayer[fi];
              const toEl = toLayer[ti];

              const fromPos = getOffset(fromEl);
              const toPos = getOffset(toEl);

              let weight = parameters?.[i]?.weights?.[fi]?.[ti] ?? (Math.random() * 2 - 1);
              let width = Math.abs(weight) * 4 + 1;
              let color = weight < 0 ? '#ef4444' : '#8b5cf6';

              ctx.beginPath();
              ctx.moveTo(fromPos.x, fromPos.y);
              ctx.lineTo(toPos.x, toPos.y);
              ctx.strokeStyle = color;
              ctx.lineWidth = width;
              ctx.globalAlpha = 0.7;
              ctx.stroke();
              ctx.globalAlpha = 1.0;
            }
          }
        }
      };

      const frame = requestAnimationFrame(drawLines);
      return () => cancelAnimationFrame(frame);
    }, [layers, inputSize, isCompiled, parameters]);

    const handleLayerChange = (index, updatedLayer) => {
      const updatedLayers = layers.map((layer, i) =>
        i === index ? updatedLayer : layer
      );
      setLayers(updatedLayers);
    };

    const handleLayerDelete = (index) => {
      const updatedLayers = layers.filter((_, i) => i !== index);
      setLayers(updatedLayers);
    };

    const addLayer = () => {
      setLayers([...layers, { activation: "relu", numOfNeurons: 1, lr: 0.01, wim: "XAVIER", layerType: "DL" }]);
      setSaved(false);
    };

    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {/* Model Architecture Header with Controls */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Model Architecture
          </h3>
          <div className="flex gap-2">
            <button
              onClick={addLayer}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Layer
            </button>
            <button
              onClick={() => setSaved(true)}
              disabled={saved}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
              style={saved ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
              <Save className="h-4 w-4" />
              Save Model
            </button>
          </div>
        </div>

        {/* Enhanced MainBox with Scrollbars */}
        <div 
          className="relative bg-slate-900 border border-slate-700 rounded-lg"
          style={{ height: '600px' }}
        >
          <div 
            className="relative overflow-auto w-full h-full"
            ref={mainBoxRef}
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: '#475569 #1e293b'
            }}
          >
            <canvas
              ref={canvasRef}
              width={1200}
              height={800}
              className="absolute top-0 left-0 pointer-events-none z-10"
            />
            
            <div className="relative z-20 flex items-center justify-center gap-16 p-8 min-w-max min-h-full">
              {/* Input Layer */}
              <div className="flex flex-col items-center space-y-4">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Input Layer</h4>
                <div className="flex flex-col gap-3">
                  {Array.from({ length: inputSize }).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-12 bg-green-500 rounded-full border-3 border-green-300 shadow-lg flex items-center justify-center"
                      ref={(el) => (inputNeuronRefs.current[idx] = el)}
                    >
                      <span className="text-white text-xs font-bold">{idx + 1}</span>
                    </div>
                  ))}
                </div>
                <span className="text-sm text-slate-400">Features: {inputSize}</span>
              </div>

              {/* Hidden Layers */}
              {layers.map((layer, index) => {
                layerNeuronRefs.current[index] = new Array(layer.numOfNeurons);
                return (
                  <NetworkLayer
                    key={index}
                    la={layer}
                    index={index}
                    onSave={handleLayerChange}
                    onDelete={handleLayerDelete}
                    layerNeuronRefs={layerNeuronRefs}
                    setIsCompiled={setIsCompiled}
                    setSaved={setSaved}
                  />
                );
              })}

              {/* Output Layer */}
              <div className="flex flex-col items-center space-y-4">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Output Layer</h4>
                <div className="flex flex-col gap-3">
                  {Array.from({ length: layers[layers.length - 1]?.numOfNeurons || 1 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-12 bg-red-500 rounded-full border-3 border-red-300 shadow-lg flex items-center justify-center"
                    >
                      <span className="text-white text-xs font-bold">{idx + 1}</span>
                    </div>
                  ))}
                </div>
                <span className="text-sm text-slate-400">Output: {layers[layers.length - 1]?.numOfNeurons || 1}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };