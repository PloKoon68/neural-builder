import React, { useState, useEffect, useRef } from 'react';
import { Upload, Play, Square, Settings, Brain, Activity, CheckCircle, Plus, Trash2, Eye, BarChart3, Download, Save } from 'lucide-react';

import Papa from 'papaparse';


import { useParams } from 'react-router-dom';
import { sendTestRequest, sendHyperparametersCrow, fetchParameters, sendPredictionRequest,   createCompiledModel, removeModel } from '../../../../api/apiCalls/Crow/crowHttp.js';
import { saveModelInfo, fetchModelData } from '../../../../api/apiCalls/Express/processApi.js';

import { generateSocket } from '../../../../api/apiCalls/Crow/crowSocket.js';


// for loss graph
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


import '../../../../style/Pages/Processing Page Style/mainBox.css'; // for styling

import { Virtuoso } from "react-virtuoso";

import { List } from 'react-window';




const TestEpoch = ({epochLogs}) => {

  return(
    epochLogs.length > 0 && (
        <div className="bg-slate-900 rounded-lg p-3 max-h-64 overflow-y-auto">
          <h4 className="text-xs font-medium text-slate-400 mb-2">Training Logs</h4>
          {epochLogs.map((log, idx) => (
            <div key={idx} className="text-xs text-slate-300 font-mono mb-1">
              {log}
            </div>
          ))}
        </div>
      )
  )
} 
const ProcessPage = ({ saved, setSaved }) => {
  // State management

  const modelId = useParams().modelId

  const [layers, setLayers] = useState([
    { activation: "relu", numOfNeurons: 5, lr: 0.01, wim: "XAVIER", layerType: "DL" },
    { activation: "relu", numOfNeurons: 2, lr: 0.01, wim: "XAVIER", layerType: "DL" }
  ]);
  
  const [trainingHyperparameters, setTrainingHyperparameters] = useState({
    lossFunction: "sigmoid cross entropy",
    optimizer: "SGD",
    epochNum: 900,
    minibatchSize: 128,
    learningRate: 0.01
  });

  const [testingHyperparameters, setTestingHyperparameters] = useState({
    batchSize: 32,
    metricsToShow: ['accuracy', 'precision', 'recall', 'f1'],
    showConfusionMatrix: true,
    confidenceThreshold: 0.5
  });

  const [trainDataset, setTrainDataset] = useState({
    fileNames: { features: "No file selected", labels: "No file selected" },
    features: null,
    labels: null
  });
  
  const [testDataset, setTestDataset] = useState({
    fileNames: { features: "No file selected", labels: "No file selected" },
    features: null,
    labels: null
  });
  

  const [inputSize, setInputSize] = useState(40);
  const [parameters, setParameters] = useState([]);
  const [normalizerParameters, setNormalizerParameters] = useState([]);
  const [isCompiled, setIsCompiled] = useState(false);
  const [modelInProcess, setModelInProcess] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [trainResult, setTrainResult] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [epochLogs, setEpochLogs] = useState([]);

  const [neuronSize, setNeuronSize] = useState(48);
  const [layerSpacing, setLayerSpacing] = useState(128);

  const [socket, setSocket] = useState(null);


  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('overview'); // 'detailed' or 'overview'

  const [isFullscreen, setIsFullscreen] = useState(false);



  //prediction section variables & functions
  const [inputMethod, setInputMethod] = useState('manual'); // 'manual' or 'csv'
  const [manualInput, setManualInput] = useState(Array(0).fill(''));
  const [predictionFile, setPredictionFile] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionData, setPredictionData] = useState(null);


  const [showTrainingChart, setShowTrainingChart] = useState(true);
  const [showEpochLogs, setShowEpochLogs] = useState(false);
  
useEffect(() => {
  const handlePopstate = (event) => {
    if (!saved) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) {
        // Push the current state back to prevent navigation
        window.history.pushState(null, '', window.location.pathname);
      } else {
        removeModel(modelId);
      }
    }
  };

  const unloadCallback = (event) => {
    if (!saved) {
      event.preventDefault();
      event.returnValue = "";
      return "";
    }
  };

  // Add popstate listener for back button
  window.addEventListener("popstate", handlePopstate);
  window.addEventListener("beforeunload", unloadCallback);
  
  // Push initial state to enable popstate detection
  window.history.pushState(null, '', window.location.pathname);

  return () => {
    window.removeEventListener("popstate", handlePopstate);
    window.removeEventListener("beforeunload", unloadCallback);
  };
}, [saved]);






  useEffect(() => {
    setManualInput(Array(inputSize).fill(''))
  }, [inputSize]); // Empty dependency array means this runs once when the component mounts


  const handlePredictionFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setPredictionFile(file.name);
    // Parse CSV similar to other uploads
    Papa.parse(file, {
      complete: (results) => {
        const parsedData = results.data.filter(row => row.length > 0);
        parsedData.shift(); // Remove header
        parsedData.pop(); // Remove empty last row
        const features = parsedData.map(row => row.map(Number));
        // Store for prediction
        setPredictionData(features);
      },
      header: false
    });
  };

  const canPredict = () => {
    if (inputMethod === 'manual') {
      return manualInput.some(val => val !== '');
    } else {
      return predictionFile !== '';
    }
  };

  const handlePredict = async () => {
    setModelInProcess(true);
    
    try {
      let inputData;
      if (inputMethod === 'manual') {
        // Convert manual input to numbers
        inputData = manualInput.map(val => parseFloat(val) || 0);
      } else {
        // Use CSV data
        inputData = predictionData;
      }
      
      // Call your prediction API
      const result = await sendPredictionRequest(modelId, inputData, setModelInProcess);
      setPredictionResult({predicted_class: result.predictionResult[0]});

    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setModelInProcess(false);
    }
  };

  const handleExportPredictions = () => {
    if (!predictionResult?.predictions) return;
    
    const csv = predictionResult.predictions.map((pred, idx) => 
      `${idx + 1},${pred.predicted_class},${pred.confidence.toFixed(4)}`
    ).join('\n');
    
    const blob = new Blob([`Sample,Predicted Class,Confidence\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'predictions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };





  const ModelDataLoading = ({process}) => {
    let loadingMessage;
    switch(process) {
      case "loading":
        loadingMessage = "Loading model architecture...";
        break;
      case "training":
        loadingMessage = "Training in progress...";
        break;
      case "testing":
        loadingMessage = "Testing in progress...";
        break;
      case "predicting":
        loadingMessage = "Predicting...";
        break;

    }

    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-400 text-sm"> {loadingMessage} </p>
        </div>
      </div>
    )
  }



  useEffect(() => {
    const fetchWithDelay = async () => {
      let numCounts = 0, limit = 1;
      
      while (numCounts++ < limit) {
        console.log("Tried ", numCounts);
        try {
          const modelInfo = await fetchModelData(modelId);
          setLayers(modelInfo["layers"])
          setIsCompiled(modelInfo.isCompiled)
          setInputSize(modelInfo.inputSize)
          setParameters(modelInfo.parameters)
          setNormalizerParameters(modelInfo.normalizerParameters)
          setTrainingHyperparameters(modelInfo.trainingHyperparameters)
          
          console.log("model: ", modelInfo)

          setLoading(false); 
          } catch (error) {
          console.error("Error fetching cases:", error);
          setLoading(false); 
        }
        await new Promise(resolve => setTimeout(resolve, 2000)); 
      }
    };

    fetchWithDelay();
  }, []); // Empty dependency array means this runs once when the component mounts


  
  useEffect(() => {
    // Create model when mounted  
    if(isCompiled) {

      let hyperParametersWithParameters = transform()

      hyperParametersWithParameters = {...hyperParametersWithParameters, lossFunction: trainingHyperparameters.lossFunction, parameters: parameters, normalizerParameters: normalizerParameters}
      createCompiledModel(modelId, hyperParametersWithParameters);
    }

    return () => {
      if(isCompiled) {
        removeModel(modelId);
      }
    };
  }, [isCompiled]);



  // LayerForm Component (integrated)
  const LayerForm = ({ tempLayer, setTempLayer }) => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setTempLayer({ ...tempLayer, [name]: name === 'numOfNeurons' ? Number(value) : value });
    };

    return (
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-slate-300 mb-1">Layer Type:</label>
          <select 
            name="layerType" 
            value={tempLayer.layerType} 
            onChange={handleChange}
            className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white text-sm"
          >
            <option value="DL">Dense</option>
            <option value="Conv">Convolutional</option>
            <option value="RNN">RNN</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-300 mb-1">Activation:</label>
          <select 
            name="activation" 
            value={tempLayer.activation} 
            onChange={handleChange}
            className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white text-sm"
          >
            <option value="relu">ReLU</option>
            <option value="sigmoid">Sigmoid</option>
            <option value="tanh">Tanh</option>
            <option value="softmax">Softmax</option>
          </select>
        </div>

        {tempLayer.layerType === 'DL' && (
          <div>
            <label className="block text-xs text-slate-300 mb-1">Neurons:</label>
            <input
              type="number"
              name="numOfNeurons"
              value={tempLayer.numOfNeurons}
              onChange={handleChange}
              min="1"
              className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white text-sm"
            />
          </div>
        )}

        <div>
          <label className="block text-xs text-slate-300 mb-1">Learning Rate:</label>
          <input
            type="number"
            name="lr"
            step="0.001"
            value={tempLayer.lr}
            onChange={handleChange}
            className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-300 mb-1">Weight Init:</label>
          <select 
            name="wim" 
            value={tempLayer.wim} 
            onChange={handleChange}
            className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white text-sm"
          >
            <option value="XAVIER">Xavier</option>
            <option value="HE">He</option>
            <option value="RANDOM">Random</option>
          </select>
        </div>
      </div>
    );
  };



const OverviewLayer = ({ layer, index }) => (
  <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-blue-500 transition-colors min-w-32">
    <div className="text-center">
      <h4 className="text-sm font-medium text-white mb-2">Layer {index + 1}</h4>
      <div className="text-xs text-slate-300 space-y-1">
        <div>Type: {layer.layerType}</div>
        <div>Neurons: {layer.numOfNeurons}</div>
        <div>Activation: {layer.activation}</div>
      </div>
    </div>
  </div>
);

const MainBox = () => {
  const inputNeuronRefs = useRef([]);
  const layerNeuronRefs = useRef([]);
  const mainBoxRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Performance optimization states
  const [viewportBounds, setViewportBounds] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef(null);


  // esc keyword to minimize
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
      else if (e.key === 'Enter' && !isFullscreen) {
        setIsFullscreen(true);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  // Clean input neuron refs if input size shrinks
  useEffect(() => {
    inputNeuronRefs.current = inputNeuronRefs.current.slice(0, inputSize);
  }, [inputSize]);

  // Viewport tracking for culling
  useEffect(() => {

    const updateViewport = () => {
      const container = mainBoxRef.current;
      if (!container) return;
      
      const bounds = {
        left: container.scrollLeft - 100,
        right: container.scrollLeft + container.clientWidth + 100,
        top: container.scrollTop - 100,
        bottom: container.scrollTop + container.clientHeight + 100
      };
      setViewportBounds(bounds);
    };

    updateViewport();
    const container = mainBoxRef.current;
    if (container) {
      container.addEventListener('scroll', updateViewport);
      container.addEventListener('resize', updateViewport);
      return () => {
        container.removeEventListener('scroll', updateViewport);
        container.removeEventListener('resize', updateViewport);
      };
    }

  }, []);

  // Get detail level based on network size
  const getDetailLevel = () => {
    const totalNeurons = inputSize + layers.reduce((sum, layer) => sum + layer.numOfNeurons, 0);
    if (totalNeurons > 1000) return 'low';
    if (totalNeurons > 500) return 'medium';
    return 'high';
  };

  // Optimized drawing with viewport clipping
  useEffect(() => {

    if (!isCompiled) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const container = mainBoxRef.current;
    
    if (!ctx || !canvas || !container) return;

    if (!isCompiled) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    
    const drawLines = () => {
      const startTime = performance.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Get current viewport bounds
      const viewportLeft = container.scrollLeft;
      const viewportRight = container.scrollLeft + container.clientWidth;
      const viewportTop = container.scrollTop;
      const viewportBottom = container.scrollTop + container.clientHeight;
      
      const getOffset = (el) => {
        if (!el || !container) return { x: 0, y: 0 };
        const rect = el.getBoundingClientRect();
        const parentRect = container.getBoundingClientRect();
        return {
          x: rect.left - parentRect.left + rect.width / 2 + container.scrollLeft,
          y: rect.top - parentRect.top + rect.height / 2 + container.scrollTop,
        };
      };

      // Line clipping function (Cohen-Sutherland algorithm)
      const clipLine = (x1, y1, x2, y2) => {
        const INSIDE = 0; // 0000
        const LEFT = 1;   // 0001
        const RIGHT = 2;  // 0010
        const BOTTOM = 4; // 0100
        const TOP = 8;    // 1000

        const computeOutCode = (x, y) => {
          let code = INSIDE;
          if (x < viewportLeft) code |= LEFT;
          else if (x > viewportRight) code |= RIGHT;
          if (y < viewportTop) code |= BOTTOM;
          else if (y > viewportBottom) code |= TOP;
          return code;
        };

        let outcode1 = computeOutCode(x1, y1);
        let outcode2 = computeOutCode(x2, y2);

        while (true) {
          if (!(outcode1 | outcode2)) {
            // Both points inside viewport
            return { x1, y1, x2, y2, visible: true };
          } else if (outcode1 & outcode2) {
            // Both points outside same region
            return { visible: false };
          } else {
            // Line needs clipping
            let x, y;
            const outcodeOut = outcode1 ? outcode1 : outcode2;

            if (outcodeOut & TOP) {
              x = x1 + (x2 - x1) * (viewportBottom - y1) / (y2 - y1);
              y = viewportBottom;
            } else if (outcodeOut & BOTTOM) {
              x = x1 + (x2 - x1) * (viewportTop - y1) / (y2 - y1);
              y = viewportTop;
            } else if (outcodeOut & RIGHT) {
              y = y1 + (y2 - y1) * (viewportRight - x1) / (x2 - x1);
              x = viewportRight;
            } else if (outcodeOut & LEFT) {
              y = y1 + (y2 - y1) * (viewportLeft - x1) / (x2 - x1);
              x = viewportLeft;
            }

            if (outcodeOut === outcode1) {
              x1 = x;
              y1 = y;
              outcode1 = computeOutCode(x1, y1);
            } else {
              x2 = x;
              y2 = y;
              outcode2 = computeOutCode(x2, y2);
            }
          }
        }
      };

      let connectionsDrawn = 0;
      const allLayers = [inputNeuronRefs.current, ...layerNeuronRefs.current];
      
      // Draw connections with viewport clipping
      for (let i = 0; i < allLayers.length - 1; i++) {
        const fromLayer = allLayers[i];
        const toLayer = allLayers[i + 1];
        if (!fromLayer || !toLayer) continue;

        for (let fi = 0; fi < fromLayer.length; fi++) {
          for (let ti = 0; ti < toLayer.length; ti++) {
            const fromEl = fromLayer[fi];
            const toEl = toLayer[ti];
            
            if (!fromEl || !toEl) continue;

            const fromPos = getOffset(fromEl);
            const toPos = getOffset(toEl);

            // Clip the line to viewport
            const clipped = clipLine(fromPos.x, fromPos.y, toPos.x, toPos.y);
            
            // Skip if line is completely outside viewport
            if (!clipped.visible) continue;

            let weight = parameters?.[i]?.weights?.[ti]?.[fi] ?? 0;
            
            // Skip very tiny weights
            if (Math.abs(weight) < 0.001) continue;

            let width = Math.abs(weight) * 4 + 0.5;
            let color = weight < 0 ? '#ef4444' : '#8b5cf6';

            ctx.globalAlpha = isScrolling ? 0.4 : 0.7;
            ctx.strokeStyle = color;
            ctx.lineWidth = width;

            // Draw only the clipped (visible) portion
            ctx.beginPath();
            ctx.moveTo(clipped.x1, clipped.y1);
            ctx.lineTo(clipped.x2, clipped.y2);
            ctx.stroke();

            connectionsDrawn++;
          }
        }
      }

      ctx.globalAlpha = 1.0;
      
      // Performance logging
      const endTime = performance.now();
      if (endTime - startTime > 16 && process.env.NODE_ENV === 'development') {
        console.log(`Viewport rendering: ${endTime - startTime}ms for ${connectionsDrawn} visible connections`);
      }
    };



    

    // Remove the debounced handleScroll and replace with immediate drawing
    const handleScroll = () => {
      // Draw immediately without debouncing
      drawLines();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    // Remove the initial requestAnimationFrame delay
    drawLines(); // Draw immediately on mount

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };


  }, [layers, inputSize, isCompiled, parameters, neuronSize, layerSpacing, viewportBounds, isScrolling]);

  // Centering logic
  useEffect(() => {

    if (!loading && mainBoxRef.current) {
      const container = mainBoxRef.current;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      container.scrollLeft = maxScrollLeft / 2;
      
      const maxScrollTop = container.scrollHeight - container.clientHeight;
      container.scrollTop = maxScrollTop / 2;
    }
  }, [loading]);

  // Event handlers
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
    setLayers([...layers, { 
      activation: "relu", 
      numOfNeurons: 1, 
      lr: 0.01, 
      wim: "XAVIER", 
      layerType: "DL" 
    }]);
    setSaved(false);
  };

  const handleSaveModel = async () => {
    const modelInfo = {
      modelId: modelId,
      layers: layers,
      trainingHyperparameters: trainingHyperparameters,
      parameters: parameters,
      normalizerParameters: normalizerParameters,
      inputSize: inputSize,
      isCompiled: isCompiled,
    };
    await saveModelInfo(modelInfo);
    setSaved(true);
  };


    



  return (
    
  <div className={`bg-slate-800 rounded-xl border border-slate-700 overflow-hidden ${
    isFullscreen 
      ? 'fixed inset-0 z-50 rounded-none' 
      : ''
  }`}>
      



{/* Model Architecture Header with Controls */}
<div className="p-4 border-b border-slate-700 flex items-center justify-between">
  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
    <Brain className="h-5 w-5" />
    Model Architecture
  </h3>
  
  {/* Visual Controls */}
  <div className="flex items-center gap-4">
    {/* View Toggle */}
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">View:</span>
      <button
        onClick={() => setViewMode(viewMode === 'detailed' ? 'overview' : 'detailed')}
        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
          viewMode === 'detailed' 
            ? 'bg-blue-600 text-white' 
            : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
        }`}
      >
        {viewMode === 'detailed' ? 'Detailed' : 'Overview'}
      </button>
    </div>

    {/* Only show sliders in detailed mode */}
    {viewMode === 'detailed' && isCompiled && (
      <>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Neuron Size:</span>
          <input
            type="range"
            min="24"
            max="72"
            value={neuronSize}
            onChange={(e) => setNeuronSize(Number(e.target.value))}
            className="w-16 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-slate-300">{Math.round(neuronSize/4)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Layer Spacing:</span>
          <input
            type="range"
            min="80"
            max="2000"
            value={layerSpacing}
            onChange={(e) => setLayerSpacing(Number(e.target.value))}
            className="w-16 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-slate-300">{Math.round(layerSpacing/4)}</span>
        </div>
      </>
    )}
    
    {/* Rest of controls - only show in non-fullscreen mode */}
    {!isFullscreen && (
      <>
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
            Detail: {getDetailLevel()} | {isScrolling ? 'Scrolling' : 'Idle'}
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={addLayer}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Layer
          </button>
          <button
            onClick={handleSaveModel}
            disabled={saved}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
            style={saved ? { opacity: 0.5, cursor: "not-allowed" } : {}}
          >
            <Save className="h-4 w-4" />
            Save Model
          </button>
        </div>
      </>
    )}

    {/* Fullscreen Toggle Button */}
    <button
      onClick={() => setIsFullscreen(!isFullscreen)}
      className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
    >
      {isFullscreen ? (
        <Square className="h-4 w-4" />
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      )}
    </button>
  </div>
</div>




      {/* Enhanced MainBox with Scrollbars */}
    <div 
      className="relative bg-slate-900 border border-slate-700 rounded-lg"
      style={{ 
        height: isFullscreen ? 'calc(100vh - 80px)' : '600px' 
      }}
    >




        <div 
          className="relative overflow-auto w-full h-full"
          ref={mainBoxRef}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#475569 #1e293b',
            // Optimize scrolling performance
            willChange: 'scroll-position',
            transform: 'translateZ(0)'
          }}
        >
          {loading ? (
            <ModelDataLoading process={"loading"}/>
          ) : (
            <>
                            
            {/* Only show canvas in detailed mode */}
            {viewMode === 'detailed' && (
              <canvas
                ref={canvasRef}
                width={Math.max(1400, (layers.length + 2) * layerSpacing + 400)}
                height={Math.max(800, inputSize * (neuronSize + 12) + 200)}
                className="absolute top-0 left-0 pointer-events-none"
                style={{ 
                  zIndex: 15,
                  imageRendering: 'optimizeSpeed'
                }}
              />
            )}
              




              
                <div 
                  className="relative z-20 flex items-center justify-center gap-16 p-8 min-w-max min-h-full" 
                  style={{ gap: viewMode === 'detailed' ? `${layerSpacing}px` : '32px' }}
                >
                  {viewMode === 'detailed' ? (
                    // Detailed view (your existing content)
                    <>
                      {/* Input Layer */}
                      <div className="flex flex-col items-center space-y-4">
                        <h4 className="text-sm font-medium text-slate-300 mb-3">Input Layer</h4>
                        <div className="flex flex-col gap-3">
                          {Array.from({ length: inputSize }).map((_, idx) => (
                            <div
                              key={idx}
                              className="bg-green-500 rounded-full border-3 border-green-300 shadow-lg flex items-center justify-center"
                              style={{
                                width: `${neuronSize}px`,
                                height: `${neuronSize}px`
                              }}
                              ref={(el) => (inputNeuronRefs.current[idx] = el)}
                            >
                              <span
                                className="text-white font-bold"
                                style={{ fontSize: `${Math.max(10, neuronSize/4)}px` }}
                              >
                                {idx + 1}
                              </span>
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
                            neuronSize={neuronSize}
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
                              className="bg-red-500 rounded-full border-3 border-red-300 shadow-lg flex items-center justify-center"
                              style={{
                                width: `${neuronSize}px`,
                                height: `${neuronSize}px`
                              }}
                            >
                              <span
                                className="text-white font-bold"
                                style={{ fontSize: `${Math.max(10, neuronSize/4)}px` }}
                              >
                                {idx + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                        <span className="text-sm text-slate-400">
                          Output: {layers[layers.length - 1]?.numOfNeurons || 1}
                        </span>
                      </div>
                    </>
                  ) : (
                    // Overview mode
                    <>

                      {/* Input Layer Overview */}
                      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 border-green-500 min-w-32">
                        <div className="text-center">
                          <h4 className="text-sm font-medium text-white mb-2">Input Layer</h4>
                          <div className="text-xs text-slate-300">
                            <div>Features: {inputSize}</div>
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="text-slate-500 text-2xl">→</div>

                      {/* Hidden Layers Overview */}
                      {layers.map((layer, index) => (
                        <React.Fragment key={index}>
                          <OverviewLayer layer={layer} index={index} />
                          {index < layers.length - 1 && <div className="text-slate-500 text-2xl">→</div>}
                        </React.Fragment>
                      ))}


                      {
  
                      }

                      {/*,,   other type of overview
                                          <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                          <span className="text-white font-bold text-sm">IN</span>
                        </div>
                        <span className="text-xs text-slate-400">Input</span>
                      </div>
                      
                      {layers.map((layer, index) => (
                        <React.Fragment key={index}>
                          <div className="w-px h-12 bg-slate-600"></div>
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2 relative">
                              <span className="text-white font-bold text-xs">{layer.numOfNeurons}</span>
                            </div>
                            <span className="text-xs text-slate-400">Layer {index + 1}</span>
                            <span className="text-xs text-slate-500">{layer.activation}</span>
                          </div>
                        </React.Fragment>
                      ))}
                      */}

                    </>
                  )
                  }
                </div>








            </>
          )}
        </div>
      </div>
    </div>
  );
};





  // NetworkLayer Component (based on your Layer.js)
  const NetworkLayer = ({ la, layerNeuronRefs, onSave, onDelete, index, setIsCompiled, setSaved, neuronSize }) => {
    const [showForm, setShowForm] = useState(false);
    const [tempLayer, setTempLayer] = useState(la);

    const handleSave = () => {
      onSave(index, tempLayer);
      setShowForm(false);
    };

    return (
      <div className="relative flex flex-col items-center">
        <div 
          className="cursor-pointer group"
          onClick={() => setShowForm(true)}
        >
          <h4 className="text-sm font-medium text-slate-300 mb-3 text-center">Layer {index + 1}</h4>
            <div 
              className="flex flex-col gap-3 p-4 rounded-lg border-2 border-dashed border-slate-600 group-hover:border-blue-500 transition-colors group-hover:bg-slate-800/20"
            >      
             {Array.from({ length: la.numOfNeurons }).map((_, idx) => (
              <div
                key={idx}
                className="bg-blue-500 rounded-full border-3 border-blue-300 group-hover:bg-blue-400 transition-colors shadow-lg flex items-center justify-center"
                style={{ 
                  width: `${neuronSize}px`, 
                  height: `${neuronSize}px` 
                }}
                ref={el => {
                  if (!layerNeuronRefs.current[index]) {
                    layerNeuronRefs.current[index] = [];
                  }
                  layerNeuronRefs.current[index][idx] = el;
                }}
              >
                <span 
                  className="text-white font-bold" 
                  style={{ fontSize: `${Math.max(10, neuronSize/4)}px` }}
                >
                  {idx + 1}
                </span>
              </div>
            ))}
          </div>
          <span className="text-sm text-slate-400 text-center block mt-2">{la.activation} - {la.numOfNeurons}n</span>
        </div>

        {showForm && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl z-50">
            <h4 className="text-sm font-semibold text-white mb-3">Configure Layer {index + 1}</h4>
            <LayerForm tempLayer={tempLayer} setTempLayer={setTempLayer} />
            
            <div className="flex gap-2 mt-4">
              <button 
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCompiled(false);
                  setSaved(false);
                  handleSave();
                }}
              >
                <CheckCircle className="h-3 w-3" />
                Save
              </button>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCompiled(false);
                  onDelete(index);
                  setShowForm(false);
                }}
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
              <button 
                className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowForm(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Handler functions
  const handleTrainFeaturesUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    

    Papa.parse(file, {
      complete: (results) => {
        const parsedData = results.data.filter(row => row.length > 0); // remove empty lines
        parsedData.shift();   //removes first element of the array
        parsedData.pop();   //removes last element of the array
        const features = parsedData.map(row => row.map(Number))
        setTrainDataset({features: features, labels: trainDataset.labels, fileNames: {features: file.name, labels: trainDataset.fileNames.labels}})

        setInputSize(features[0].length)
      },
      header: false
    });
    setIsCompiled(false)
    setSaved(false)
  };

  const handleTrainLabelsUpload = (e) => {


    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const parsedData = results.data.filter(row => row.length > 0); // remove empty lines
        parsedData.shift();   //removes first element of the array
        parsedData.pop();   //removes last element of the array
        setTrainDataset({features: trainDataset.features, labels: parsedData.map(row => row.map(Number)), fileNames: {features: trainDataset.fileNames.features, labels: file.name}})
      },
      header: false
    });
  };

  const handleTestFeaturesUpload = (e) => {

    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      complete: (results) => {
        const parsedData = results.data.filter(row => row.length > 0); // remove empty lines
        parsedData.shift();   //removes first element of the array
        parsedData.pop();   //removes last element of the array
        setTestDataset({labels: testDataset.labels, features: parsedData.map(row => row.map(Number)), fileNames: {features: file.name, labels: testDataset.fileNames.labels}})
      },
      header: false
    });
  };

  const handleTestLabelsUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      complete: (results) => {
        const parsedData = results.data.filter(row => row.length > 0); // remove empty lines
        parsedData.shift();   //removes first element of the array
        parsedData.pop();   //removes last element of the array
        setTestDataset({features: testDataset.features, labels: parsedData.map(row => row.map(Number)), fileNames: {features: testDataset.fileNames.features, labels: file.name}})

      },
      header: false
    });
  };


  function transform() {
    const hyperParameters = {
      "hiddenLayerSizes": [],
      "learningRates": [],
      "layerActivations": [],
      "inputSize": inputSize,
    };
      layers.map((layer) => {
      hyperParameters.layerActivations.push(layer.activation)
      hyperParameters.hiddenLayerSizes.push(layer.numOfNeurons)
      hyperParameters.learningRates.push(layer.lr)
    })
    return hyperParameters;
  }

  
  const handleCompile = async () => {
    if(!trainDataset.features){
      alert('First upload the features dataset for training please!')
      return;
    }


    const hyperParameters = transform()

    setModelInProcess(true);
    //hyperparameters sent to crow, model parameters recieved
    const parametersRecieved = await sendHyperparametersCrow(modelId, hyperParameters, setModelInProcess);

    setParameters(parametersRecieved);

    setIsCompiled(true)
    setSaved(false)
  };

  const handleTrain = async () => {
    if(!trainDataset.features){
      alert('First upload the features dataset for training please!')
      return;
    }

    if(!trainDataset.labels){
      alert('First upload the labels dataset for training please!')
      return;
    }

    // Prevent starting a new training session if one is already running
    if (socket) {
      console.log("Training is already in progress.");
      return;
    }
    setIsTraining(true)
    
    // Clear previous logs  
    setEpochLogs([]);
    setModelInProcess(true)
    const newSocket = await generateSocket(modelId, trainDataset, trainingHyperparameters, setEpochLogs, setTrainResult, setSocket, setModelInProcess, setIsTraining, setParameters, setNormalizerParameters);
    // Store the socket in state
    setSocket(newSocket);
  };

  const handleStopTraining = () => {
    setIsTraining(false);
    setModelInProcess(false);
  };


  const handleTest = async () => {
    if(!testDataset.features) {
      alert('Please upload input features csv file first!')
      return;
    }
    if(!testDataset.labels) {
      alert('Please upload output target csv file first!')
      return;
    }

    

    setModelInProcess(true)
    setIsTesting(true);
    const testResult = await sendTestRequest(modelId, testDataset, setIsTesting, setModelInProcess);

    //    setTestResult(testResult.accuracy);
    setTestResult(testResult);

  };
  
  
/*
  const handleTest = () => {
    setModelInProcess(true);
    setTimeout(() => {
      const accuracy = 0.85 + Math.random() * 0.1;
      const precision = 0.82 + Math.random() * 0.1;
      const recall = 0.87 + Math.random() * 0.1;
      const f1 = 2 * (precision * recall) / (precision + recall);
      
      setTestResult({
        accuracy: (accuracy * 100).toFixed(1),
        precision: (precision * 100).toFixed(1),
        recall: (recall * 100).toFixed(1),
        f1: (f1 * 100).toFixed(1)
      });
      setModelInProcess(false);
    }, 2000);
  };
*/

  const ConfusionMatrix = ({ confusionMatrix }) => {
  //if (!confusionMatrix || !Array.isArray(confusionMatrix)) return null;
  const numClasses = confusionMatrix.length;
  const isBinary = numClasses === 2;
  
  // Calculate totals for each class
  const classTotals = confusionMatrix.map(row => row.reduce((sum, val) => sum + val, 0));
  const totalPredictions = classTotals.reduce((sum, val) => sum + val, 0);
  
    // Binary classification - show traditional TP, FP, TN, FN format
    const tn = confusionMatrix[0][0];
    const fp = confusionMatrix[0][1];
    const fn = confusionMatrix[1][0];
    const tp = confusionMatrix[1][1];
 
    // Multi-class classification - show full matrix
  return (
    <div className="bg-slate-700 rounded-lg p-3">
      <h5 className="text-xs font-medium text-slate-400 mb-3">Confusion Matrix ({numClasses} Classes)</h5>
      <div className="overflow-x-auto">
        <div 
          className="grid gap-1 text-xs font-mono min-w-max"
          style={{ 
            gridTemplateColumns: `40px repeat(${numClasses}, 1fr)`,
            maxWidth: '100%'
          }}
        >
          {/* Header row */}
          <div></div>
          {Array.from({ length: numClasses }, (_, i) => (
            <div key={`header-${i}`} className="text-center text-slate-400 font-semibold p-1">
              P{i}
            </div>
          ))}
          
          {/* Matrix rows */}
          {confusionMatrix.map((row, trueClass) => (
            <React.Fragment key={`row-${trueClass}`}>
              <div className="text-slate-400 font-semibold flex items-center justify-center">
                T{trueClass}
              </div>
              {row.map((value, predClass) => (
                <div 
                  key={`cell-${trueClass}-${predClass}`}
                  className={`p-2 text-center border border-slate-600 ${
                    trueClass === predClass 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="font-bold">{value}</div>
                  {classTotals[trueClass] > 0 && (
                    <div className="text-xs text-slate-500">
                      {((value / classTotals[trueClass]) * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        
        {/* Summary stats */}
        <div className="mt-3 text-xs text-slate-400">
          <div>Total Samples: {totalPredictions}</div>
          <div>Classes: {numClasses}</div>
        </div>
      </div>
    </div>
  );
};








  const TrainingChart = ({ epochLogs }) => {
    // Parse epoch logs to extract loss and accuracy data
    const data = React.useMemo(() => {

      return epochLogs.map((log, index) => {
        const costMatch = log.match(/cost:\s*([\d.]+)/);
        const accuracyMatch = log.match(/accuracy:\s*([\d.]+)/);
        const epochMatch = log.match(/epoch\s*(\d+)/);
        
        return {
          epoch: epochMatch ? parseInt(epochMatch[1]) : index + 1,
          loss: costMatch ? parseFloat(costMatch[1]) : null,
          accuracy: accuracyMatch ? (parseFloat(accuracyMatch[1]) * 100) : null
        };
      }).filter(data => data.loss !== null || data.accuracy !== null);
    }, [epochLogs]); // The dependency array ensures this only runs when epochLogs changes


    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-slate-400">
          No chart data available
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="epoch" 
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis 
            yAxisId="loss"
            orientation="left"
            stroke="#ef4444"
            fontSize={12}
          />
          <YAxis 
            yAxisId="accuracy"
            orientation="right"
            stroke="#10b981"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f9fafb'
            }}
            formatter={(value, name) => [
              typeof value === 'number' ? value.toFixed(4) : value,
              name === 'loss' ? 'Loss' : 'Accuracy (%)'
            ]}
          />
          <Line
            yAxisId="loss"
            type="monotone"
            dataKey="loss"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
            name="loss"
          />
          <Line
            yAxisId="accuracy"
            type="monotone"
            dataKey="accuracy"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
            name="accuracy"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };



function TrainingLogs({ logs }) {
  return (
    <div className="bg-slate-900 rounded-lg p-3 max-h-64">
      <h4 className="text-xs font-medium text-slate-400 mb-2">Training Logs</h4>
      <Virtuoso
        style={{ height: 240 }}   // matches your old 240px height
        totalCount={logs.length}
        itemContent={(index) => (
          <div className="text-xs text-slate-300 font-mono mb-1">
            {logs[index].text ?? logs[index]} {/* supports both objects or strings */}
          </div>
        )}
      />
    </div>
  );
}




  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Deep Learning Model Builder</h1>
          <p className="text-slate-400">Design, train, and test your neural networks visually</p>
        </div>

        {/* Model Architecture Section - Full Width */}
        <MainBox />

        {/* Training and Testing Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Training Setup */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          {loading ? (
            // Loading state
            <ModelDataLoading process={"loading"} />
          ) : (<>

            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-400" />
              Training Setup
            </h3>
            
            {/* Training Data Upload */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Training Dataset</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-3 hover:border-green-500 transition-colors">
                  <label htmlFor="train-features" className="cursor-pointer block">
                    <div className="text-center">
                      <Upload className="mx-auto h-6 w-6 text-slate-400 mb-1" />
                      <p className="text-xs text-slate-300">Upload Features CSV</p>
                      <p className="text-xs text-green-400 mt-1">{trainDataset.fileNames.features}</p>
                    </div>
                  </label>
                  <input
                    id="train-features"
                    type="file"
                    accept=".csv"
                    onChange={handleTrainFeaturesUpload}
                    className="hidden"
                  />
                </div>
                
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-3 hover:border-green-500 transition-colors">
                  <label htmlFor="train-labels" className="cursor-pointer block">
                    <div className="text-center">
                      <Upload className="mx-auto h-6 w-6 text-slate-400 mb-1" />
                      <p className="text-xs text-slate-300">Upload Labels CSV</p>
                      <p className="text-xs text-green-400 mt-1">{trainDataset.fileNames.labels}</p>
                    </div>
                  </label>
                  <input
                    id="train-labels"
                    type="file"
                    accept=".csv"
                    onChange={handleTrainLabelsUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Training Hyperparameters */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Hyperparameters</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Loss Function</label>
                  <select
                    value={trainingHyperparameters.lossFunction}
                    onChange={(e) => setTrainingHyperparameters(prev => ({ ...prev, lossFunction: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="sigmoid cross entropy">Sigmoid Cross Entropy</option>
                    <option value="categorical cross entropy">Categorical Cross Entropy</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Optimizer</label>
                  <select
                    value={trainingHyperparameters.optimizer}
                    onChange={(e) => setTrainingHyperparameters(prev => ({ ...prev, optimizer: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="SGD">SGD</option>
                    <option value="Adam">Adam</option>
                    <option value="Momentum">Momentum</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Epochs</label>
                  <input
                    type="number"
                    value={trainingHyperparameters.epochNum}
                    onChange={(e) => setTrainingHyperparameters(prev => ({ ...prev, epochNum: Number(e.target.value) }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Batch Size</label>
                  <input
                    type="number"
                    value={trainingHyperparameters.minibatchSize}
                    onChange={(e) => setTrainingHyperparameters(prev => ({ ...prev, minibatchSize: Number(e.target.value) }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Training Actions */}
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={handleCompile}
                disabled={modelInProcess}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
              >
                <Settings className="h-4 w-4" />
                Compile
              </button>
              
              {!isTraining ? (
                <button
                  onClick={handleTrain}
                  disabled={!isCompiled || modelInProcess}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                >
                  <Play className="h-4 w-4" />
                  Train
                </button>
              ) : (
                <button
                  onClick={handleStopTraining}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                >
                  <Square className="h-4 w-4" />
                  Stop
                </button>
              )}
              
              {isCompiled && (
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Compiled
                </div>
              )}
            </div>


            {/* Training Results */}
            {trainResult && (
              <div className="bg-slate-700 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-slate-300 mb-1">Training Accuracy</h4>
                { isTraining? <ModelDataLoading process={"training"} /> : <p className="text-2xl font-bold text-green-400">{trainResult}</p> }
              </div>
            )}

{/* Training Chart - Collapsible */}
{epochLogs.length > 0 && (
  <div className="bg-slate-700 rounded-lg overflow-hidden mb-4">
    <button
      onClick={() => setShowTrainingChart(!showTrainingChart)}
      className="w-full p-4 flex items-center justify-between hover:bg-slate-600 transition-colors"
    >
      <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
        <Activity className="h-4 w-4" />
        Training Progress Chart
      </h4>
      <svg
        className={`h-4 w-4 text-slate-400 transition-transform ${showTrainingChart ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {showTrainingChart && (
      <div className="p-4 pt-0">
        <div className="h-48">
          <TrainingChart epochLogs={epochLogs} />
        </div>
      </div>
    )}
  </div>
)}

{/* Epoch Logs - Collapsible */}
{epochLogs.length > 0 && (
  <div className="bg-slate-700 rounded-lg overflow-hidden">
    <button
      onClick={() => setShowEpochLogs(!showEpochLogs)}
      className="w-full p-3 flex items-center justify-between hover:bg-slate-600 transition-colors"
    >
      <h4 className="text-xs font-medium text-slate-300 flex items-center gap-2">
        📋 Training Logs
        <span className="text-slate-500">({epochLogs.length - 2} epochs)</span>
      </h4>
      <svg
        className={`h-4 w-4 text-slate-400 transition-transform ${showEpochLogs ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {showEpochLogs && (
      <div className="bg-slate-900 p-3 max-h-64 overflow-y-auto">
        {epochLogs.map((log, idx) => (
          <div key={idx} className="text-xs text-slate-300 font-mono mb-1">
            {log}
          </div>
        ))}
      </div>
    )}
  </div>
)}
            


          </> )}

          </div>




          {/* Testing Setup */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">

            {loading ? (
            // Loading state
            <ModelDataLoading process={"loading"}/>
          ) : (<>

            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              Testing Setup
            </h3>
            
            {/* Test Data Upload */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Test Dataset</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-3 hover:border-purple-500 transition-colors">
                  <label htmlFor="test-features" className="cursor-pointer block">
                    <div className="text-center">
                      <Upload className="mx-auto h-6 w-6 text-slate-400 mb-1" />
                      <p className="text-xs text-slate-300">Upload Features CSV</p>
                      <p className="text-xs text-purple-400 mt-1">{testDataset.fileNames.features}</p>
                    </div>
                  </label>
                  <input
                    id="test-features"
                    type="file"
                    accept=".csv"
                    onChange={handleTestFeaturesUpload}
                    className="hidden"
                  />
                </div>
                
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-3 hover:border-purple-500 transition-colors">
                  <label htmlFor="test-labels" className="cursor-pointer block">
                    <div className="text-center">
                      <Upload className="mx-auto h-6 w-6 text-slate-400 mb-1" />
                      <p className="text-xs text-slate-300">Upload Labels CSV</p>
                      <p className="text-xs text-purple-400 mt-1">{testDataset.fileNames.labels}</p>
                    </div>
                  </label>
                  <input
                    id="test-labels"
                    type="file"
                    accept=".csv"
                    onChange={handleTestLabelsUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Testing Parameters */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Test Parameters</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Batch Size</label>
                  <input
                    type="number"
                    value={testingHyperparameters.batchSize}
                    onChange={(e) => setTestingHyperparameters(prev => ({ ...prev, batchSize: Number(e.target.value) }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Confidence Threshold</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={testingHyperparameters.confidenceThreshold}
                    onChange={(e) => setTestingHyperparameters(prev => ({ ...prev, confidenceThreshold: Number(e.target.value) }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-3">
                <label className="block text-xs text-slate-400 mb-2">Show Metrics</label>
                <div className="flex flex-wrap gap-2">
                  {['accuracy', 'precision', 'recall', 'f1'].map(metric => (
                    <label key={metric} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={testingHyperparameters.metricsToShow.includes(metric)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTestingHyperparameters(prev => ({
                              ...prev,
                              metricsToShow: [...prev.metricsToShow, metric]
                            }));
                          } else {
                            setTestingHyperparameters(prev => ({
                              ...prev,
                              metricsToShow: prev.metricsToShow.filter(m => m !== metric)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-xs text-slate-300 capitalize">{metric}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Testing Actions */}
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={handleTest}
                disabled={!isCompiled || modelInProcess}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
              >
                <Eye className="h-4 w-4" />
                Run Test
              </button>
              
              {testResult && (
                <button className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm">
                  <Download className="h-4 w-4" />
                  Export Results
                </button>
              )}
            </div>

              {testResult && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300">Test Results</h4>

                  {isTesting ? <ModelDataLoading process={"testing"}/> :

                  <>
                  <div className="grid grid-cols-2 gap-3">
                    {testingHyperparameters.metricsToShow.map(metric => (
                      testResult[metric] && (
                        <div key={metric} className="bg-slate-700 rounded-lg p-3">
                          <h5 className="text-xs font-medium text-slate-400 capitalize">{metric}</h5>
                          <p className="text-lg font-bold text-purple-400">{testResult[metric].toFixed(2)}%</p>
                        </div>
                      )
                    ))}
                  </div>
                  
                  {/* Updated flexible confusion matrix */}
                  {testingHyperparameters.showConfusionMatrix && (
                    <ConfusionMatrix confusionMatrix={testResult.confusion_matrix} />
                  )}
                  </>
                  }


                </div>
              )}


          </> )}

          </div>



          {/* Prediction/Inference Setup */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            {loading ? (
              <ModelDataLoading/>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-cyan-400" />
                  Model Prediction
                </h3>

                {!isCompiled && (
                  <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mb-4">
                    <p className="text-yellow-300 text-sm">Model must be compiled before making predictions</p>
                  </div>
                )}

                {/* Input Method Toggle */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm font-medium text-slate-300">Input Method:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setInputMethod('manual')}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          inputMethod === 'manual'
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                        }`}
                      >
                        Manual Input
                      </button>
                      <button
                        onClick={() => setInputMethod('csv')}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          inputMethod === 'csv'
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                        }`}
                      >
                        CSV Upload
                      </button>
                    </div>
                  </div>

                  {inputMethod === 'manual' ? (
                    // Manual Input Section
                    <div className="space-y-4">
                      <div className="bg-slate-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-slate-300 mb-3">
                          Enter Feature Values ({inputSize} features required)
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {Array.from({ length: inputSize }, (_, idx) => (
                            <div key={idx}>
                              <label className="block text-xs text-slate-400 mb-1">
                                Feature {idx + 1}
                              </label>
                              <input
                                type="number"
                                step="any"
                                value={manualInput[idx] || ''}
                                onChange={(e) => {
                                  const newInput = [...manualInput];
                                  newInput[idx] = e.target.value;
                                  setManualInput(newInput);
                                }}
                                className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                placeholder="0.0"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // CSV Upload Section
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 hover:border-cyan-500 transition-colors">
                      <label htmlFor="prediction-csv" className="cursor-pointer block">
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                          <p className="text-sm text-slate-300 mb-1">Upload CSV for Batch Prediction</p>
                          <p className="text-xs text-slate-500">Each row should have {inputSize} features</p>
                          <p className="text-xs text-cyan-400 mt-2">{predictionFile || 'No file selected'}</p>
                        </div>
                      </label>
                      <input
                        id="prediction-csv"
                        type="file"
                        accept=".csv"
                        onChange={handlePredictionFileUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Prediction Action */}
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={handlePredict}
                    disabled={!isCompiled || modelInProcess || !canPredict()}
                    className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                  >
                    <Activity className="h-4 w-4" />
                    {inputMethod === 'manual' ? 'Predict' : 'Batch Predict'}
                  </button>
                  
                  {inputMethod === 'manual' && (
                    <button
                      onClick={() => setManualInput(Array(inputSize).fill(''))}
                      className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Prediction Results */}
                {predictionResult && (
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-slate-300 mb-3">Prediction Results</h4>
                    
                    {inputMethod === 'manual' ? (
                      // Single prediction result
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Predicted Class:</span>
                          <span className="text-cyan-400 font-bold text-lg">
                            {predictionResult.predicted_class}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Confidence:</span>
                          <span className="text-cyan-400 font-bold">
                            {(predictionResult.confidence * 100).toFixed(2)}%
                          </span>
                        </div>
                        {predictionResult.probabilities && (
                          <div className="mt-4">
                            <span className="text-slate-400 text-sm block mb-2">Class Probabilities:</span>
                            <div className="space-y-1">
                              {predictionResult.probabilities.map((prob, idx) => (
                                <div key={idx} className="flex justify-between text-xs">
                                  <span className="text-slate-500">Class {idx}:</span>
                                  <span className="text-slate-300">{(prob * 100).toFixed(2)}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Batch prediction results
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Total Predictions:</span>
                          <span className="text-cyan-400 font-bold">
                            {predictionResult.predictions?.length || 0}
                          </span>
                        </div>
                        
                        {predictionResult.predictions && (
                          <div className="max-h-48 overflow-y-auto bg-slate-900 rounded p-3">
                            <div className="text-xs font-mono space-y-1">
                              {predictionResult.predictions.slice(0, 10).map((pred, idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span className="text-slate-500">Sample {idx + 1}:</span>
                                  <span className="text-slate-300">
                                    Class {pred.predicted_class} ({(pred.confidence * 100).toFixed(1)}%)
                                  </span>
                                </div>
                              ))}
                              {predictionResult.predictions.length > 10 && (
                                <div className="text-slate-500 text-center mt-2">
                                  ... and {predictionResult.predictions.length - 10} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <button
                          onClick={handleExportPredictions}
                          className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded text-sm flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Export Results
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>



        </div>
      </div>

    </div>
  );
};

export default ProcessPage;