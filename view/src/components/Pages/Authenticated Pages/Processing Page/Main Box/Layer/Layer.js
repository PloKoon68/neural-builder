import '../../../../../../style/Pages/Processing Page Style/layer.css';
import '../../../../../../style/Pages/Processing Page Style/neuron.css';

import LayerForm from './LayerForm'; // For the input layer visualization

import { useState }from 'react';

function Layer({ la, layerNeuronRefs, onSave, onDelete, index, setIsCompiled, setSaved }) {

  const [showForm, setShowForm] = useState(false);

  //tempLayer = {"activatiion": "sigmoid", "numOfNeuroms": 3, "lr": 0.01, "wim": "XAVİER", "LT": "DL"}
  const [tempLayer, setTempLayer] = useState(la);

  const handleSave = () => {
    onSave(index, tempLayer);
    setShowForm(false); // optional: close form after save
  };

//onClick={handleBoxClick}
    return (
        <div className="layer-wrapper" onClick={() => setShowForm(true)}>
            <div className="layer-hover-box" >
                <div className="neuron-visualizer">
                    {Array.from({ length: la.numOfNeurons }).map((_, idx) => (
                        <div
                            key={idx}
                            className="neuron-circle"
                            ref={el => {
                            if (!layerNeuronRefs.current[index]) {
                                    layerNeuronRefs.current[index] = []; 
                                }
                                layerNeuronRefs.current[index][idx] = el;
                            }}
                        />
                    ))}
                </div>       
            </div>

            {showForm && (
                <div className="layer-popup">
                    <LayerForm
                        tempLayer={tempLayer}
                        setTempLayer={setTempLayer}
                    />
                    <div className="popup-buttons">
                        <button className="save-button" onClick={(e) => {
                                                                            e.stopPropagation(); // Prevent click bubbling to layer-wrapper
                                                                            setIsCompiled(false)
                                                                            setSaved(false)
                                                                            handleSave();
                                                                        }}>
                            Save
                        </button>
                        <button className="delete-button" onClick={() => {setIsCompiled(false) ;onDelete(index)} }>
                            Delete Layer
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Layer;
