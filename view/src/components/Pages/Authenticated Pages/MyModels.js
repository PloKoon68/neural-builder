import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../../style/Pages/MyModels.css";


import {fetchModels, createModel,
        updateModel, deleteModel} from "../../../api/apiCalls/Express/modelApi.js"; // Import the axios call functions

import GlobalSpinner from "../../GlobalSpinner.js";

export default function MyModels() {

  const navigate = useNavigate();
  const [modelCards, setModelCards] = useState([]);

  
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedCard, setEditedCard] = useState({ title: "", description: "" });

  const [dbConnected, setDbConnected] = useState(false);
  const [loading, setLoading] = useState(true); // ← NEW for general loading

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
  

  const notSavedWarning = () => {
    const updatedCases = [...modelCards];
    updatedCases[editingIndex] = { ...modelCards[editingIndex], highlight: true };
    setModelCards(updatedCases);
  }

  const handleAddCase = () => {
    if(!editingIndex) {
      const newCase = { title: `case ${modelCards.length + 1}`, description: "" };
      const updatedCases = [...modelCards, newCase];

      setModelCards(updatedCases);
      setEditingIndex(updatedCases.length - 1); // Edit the newly added case
      setEditedCard({ ...newCase }); // Make a copy to prevent direct state mutation
    } 
    else notSavedWarning();
  };

  const handleDeleteModel = (index) => {
    let deletedModelId;
    const updatedCases = modelCards.filter((_, i) => { if(i === index) deletedModelId = _._id; return (i !== index)});
    setModelCards(updatedCases);
    
    // If the deleted case was being edited, exit edit mode
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditedCard({ title: "", description: "" });
    }
    else deleteModel(deletedModelId)    //axios call
  };

  const handleEditClick = async (index) => {
    if(!editingIndex) {
      setEditingIndex(index);
      setEditedCard({ ...modelCards[index] }); // Copy object to prevent state mutation
    }
    else notSavedWarning();
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
    setModelCards(updatedModels); // Update state after all operations
    setEditingIndex(null); // Exit edit mode
  };
  

  const gotToProccessingPage = (modelCard, index, e) => {
    if(!e.target.closest("button") && editingIndex !== index)  {
      navigate(`/process/${modelCard._id}`)
    }
  }


  return (
    <>
    {loading?(
      <GlobalSpinner/>
      ) : dbConnected? (
      <div className="my-models" >
        <div className="header">
          <h1>My Models</h1>
          <button className="add-model-button" onClick={handleAddCase}>+ Add Model</button>
        </div>

        <div className="model-grid">
          {modelCards.map((modelCard, index) => (
            <div key={index} className="model-card" onClick={(e) => gotToProccessingPage(modelCard, index, e)}>
              <div className="card">
                <div className="card-body">
                  {editingIndex === index ? (
                    <>
                      <input
                        type="text"
                        name="title"
                        className="model-input"
                        value={editedCard.title}
                        onChange={handleInputChange}
                        style={{ border: modelCard["highlight"] ? "2px solid red" : "1px solid black", width: "90%"}}
                      />
                      <textarea
                        name="description"
                        className="model-description"
                        rows="3"
                        value={editedCard.description}
                        onChange={handleInputChange}
                        style={{ border: modelCard["highlight"] ? "2px solid red" : "1px solid black", width: "90%"}}
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="card-title">{modelCard.title}</h3>
                      <p className="card-description">{modelCard.description}</p>
                    </>
                  )}
                </div>
                <div className="card-footer">
                  {editingIndex === index ? (
                    <button className="btn save" onClick={() => handleSaveClick(index)}>Save</button>
                  ) : (
                    <button className="btn edit" onClick={() => handleEditClick(index)}>Edit</button>
                  )}
                  <button className="btn delete" onClick={() => handleDeleteModel(index)}>Delete</button>
                </div>
              </div>
            </div>
          ))}

          <div className="model-card"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="add-sign" onClick={handleAddCase}></div>
          </div>
        </div>
      </div>) :
    (<h1>Server couldn't connected</h1>)
    }
    </>
);
}
