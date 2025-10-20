import '../../../../../../style/Pages/Processing Page Style/layer.css';

import NeuronVisualizer from './NeuronVisualizer'; // For the input layer visualization
import LayerForm from './LayerForm'; // For the input layer visualization

import { useState }from 'react';

function Layer({ la, onSave, onDelete, index, setIsCompiled, setSaved }) {

  const [showForm, setShowForm] = useState(false);

  //tempLayer = {"activatiion": "sigmoid", "numOfNeuroms": 3, "lr": 0.01, "wim": "XAVİER", "LT": "DL"}
  const [tempLayer, setTempLayer] = useState(la);



//onClick={handleBoxClick}
    return (
        <div className="layer-wrapper" onClick={() => setShowForm(true)}>
            <div className="layer-hover-box" >
                <NeuronVisualizer numOfNeurons={la.numOfNeurons} />
            </div>

        </div>
    )
}

export default Layer;
