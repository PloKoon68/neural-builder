import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Search, Clock, Calendar, Brain, CheckCircle } from "lucide-react";


import {fetchModels, createModel,
        updateModel, deleteModel} from "../../../api/apiCalls/Express/modelApi.js"; // Import the axios call functions

import GlobalSpinner from "../../GlobalSpinner.js";




export default function MyModels() {
  const navigate = useNavigate();

  const [modelCards, setModelCards] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedCard, setEditedCard] = useState({ title: "", description: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [dbConnected, setDbConnected] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchWithDelay = async () => {
      let numCounts = 0, limit = 1;
      
      while (numCounts++ < limit) {
        console.log("Tried ", numCounts);
        try {
          const cases = await fetchModels();
          if (cases) {
            setModelCards(cases);
            numCounts = limit; // Exit the loop if cases are found
            //setDbConnected(true);
            setDbConnected(true);
            setLoading(false)
          }
        } catch (error) {
          console.error("Error fetching cases:", error);
        }
        // Delay before proceeding to the next iteration
        await new Promise(resolve => setTimeout(resolve, 2000)); 
      }
    };
  
    fetchWithDelay();
  }, []); // Empty dependency array means this runs once when the component mounts
  

  useEffect(() => {
    const filtered = modelCards.filter(model => 
      model.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredModels(filtered);
  }, [searchQuery, modelCards]);

  const notSavedWarning = (index) => {
    const updatedCases = [...modelCards];
    updatedCases[index] = { ...modelCards[index], highlight: true };
    setModelCards(updatedCases);
    setTimeout(() => {
      updatedCases[index] = { ...modelCards[index], highlight: false };
      setModelCards(updatedCases);
    }, 2000);
  };

  const handleAddCase = () => {
    if (editingIndex === null) {
      const newCase = { title: `Model ${modelCards.length + 1}`, description: "", status: "draft" };
      const updatedCases = [...modelCards, newCase];
      setModelCards(updatedCases);
      setFilteredModels(updatedCases);
      setEditingIndex(updatedCases.length - 1);
      setEditedCard({ ...newCase });
    } else {
      notSavedWarning(editingIndex);
    }
  };

  const handleDeleteModel = (index) => {
    let deletedModelId;
    const updatedCases = modelCards.filter((_, i) => { if(i === index) deletedModelId = _._id; return (i !== index)});
    setModelCards(updatedCases);
    setFilteredModels(updatedCases);
    setDeleteConfirm(null);
    
    // If the deleted case was being edited, exit edit mode
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditedCard({ title: "", description: "" });
    }
    else deleteModel(deletedModelId)    //axios call
  };

  const handleEditClick = (index) => {
    if (editingIndex === null) {
      setEditingIndex(index);
      setEditedCard({ ...modelCards[index] });
    } else {
      notSavedWarning(editingIndex);
    }
  };

  const handleCancelEdit = () => {
    if (!editedCard._id) {
      const updatedModels = modelCards.filter((_, i) => i !== editingIndex);
      setModelCards(updatedModels);
      setFilteredModels(updatedModels);
    }
    setEditingIndex(null);
    setEditedCard({ title: "", description: "" });
  };

  const handleInputChange = (e) => {
    setEditedCard({ ...editedCard, [e.target.name]: e.target.value });
  };

  const handleSaveClick = async (index) => {
    const updatedModels = [...modelCards];
    try {
      if (!editedCard._id) { // Creating a new case
        const updatedModel = await createModel(editedCard);
        updatedModels[index] = { ...updatedModel };
      } else { // Editing an existing case
        updatedModels[index] = { ...editedCard };
        await updateModel(editedCard._id, editedCard)
      }
    } catch (error) {
      console.error("Error saving case:", error);
      updatedModels[index] = { ...editedCard };
    }
    setFilteredModels(updatedModels);
    setModelCards(updatedModels); // Update state after all operations
    setEditingIndex(null); // Exit edit mode
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "trained": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "compiled": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "trained": return <CheckCircle className="h-3 w-3" />;
      case "compiled": return <Brain className="h-3 w-3" />;
      default: return <Edit2 className="h-3 w-3" />;
    }
  };

  if (loading) {
    return <GlobalSpinner />;
  }

  if (!dbConnected) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Connection Error</h1>
          <p className="text-slate-400">Server couldn't be reached. Please try again later.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Models</h1>
              <p className="text-slate-400">Manage and organize your neural network projects</p>
            </div>
            <button
              onClick={handleAddCase}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Model
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        {/* Models Grid */}
        {filteredModels.length === 0 ? (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
            <Brain className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? "No models found" : "No models yet"}
            </h3>
            <p className="text-slate-400 mb-6">
              {searchQuery 
                ? "Try adjusting your search query" 
                : "Create your first neural network model to get started"
              }
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddCase}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Create Model
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((modelCard, index) => (
              <div
                key={modelCard._id || index}
                onClick={(e) => {
                  if (!e.target.closest("button") && editingIndex !== index) {
                    navigate(`/process/${modelCard._id}`)
                  }
                }}
                className={`bg-slate-800 rounded-xl border transition-all ${
                  editingIndex === index
                    ? "border-green-500"
                    : modelCard.highlight
                    ? "border-red-500 animate-pulse"
                    : "border-slate-700 hover:border-slate-600"
                } ${editingIndex !== index ? "cursor-pointer hover:shadow-lg hover:shadow-slate-900/50" : ""}`}
              >
                {/* Card Header */}
                <div className="p-4 border-b border-slate-700">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="title"
                      value={editedCard.title}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-lg font-semibold focus:outline-none focus:border-green-500"
                      placeholder="Model Title"
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-white flex-1">{modelCard.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs border flex items-center gap-1 flex-shrink-0 ${getStatusColor(modelCard.status)}`}>
                        {getStatusIcon(modelCard.status)}
                        {modelCard.status || "draft"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4">
                  {editingIndex === index ? (
                    <textarea
                      name="description"
                      value={editedCard.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500 resize-none"
                      placeholder="Model description..."
                    />
                  ) : (
                    <>
                      <p className="text-slate-300 text-sm mb-4 min-h-[60px]">
                        {modelCard.description || "No description provided"}
                      </p>
                      
                      {/* Metadata */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="h-3 w-3" />
                          <span>Created: {formatDate(modelCard.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          <span>Updated: {formatDate(modelCard.updatedAt)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Card Footer */}
                <div className="p-4 border-t border-slate-700 flex gap-2">
                  {editingIndex === index ? (
                    <>
                      <button
                        onClick={() => handleSaveClick(index)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(index)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>
                      {deleteConfirm === index ? (
                        <button
                          onClick={() => handleDeleteModel(index)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm animate-pulse"
                        >
                          Confirm?
                        </button>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(index)}
                          className="flex-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm border border-red-600/30"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}