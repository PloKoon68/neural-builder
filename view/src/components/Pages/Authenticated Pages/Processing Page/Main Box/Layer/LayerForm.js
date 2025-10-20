function LayerForm({ tempLayer, setTempLayer }) {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setTempLayer({ ...tempLayer, [name]: name === 'numOfNeurons' ? Number(value) : value });
    };
  
  //const [tempLayer, setTempLayer] = useState({"activatiion": 'relu', "numOfNeurons": 4, "lr": 0.01, "wim": 'XAVİER', layerType: 'Dense'});
   
  return (
      <>
        <label>Type: </label>
        <select name="type" value={tempLayer.type} onChange={handleChange}>
          <option value="Dense">Dense</option>
          <option value="Conv">Conv</option>
          <option value="RNN">RNN</option>
        </select>
  
        <br />
  
        <label>Activation: </label>
        <select name="activation" value={tempLayer.activation} onChange={handleChange}>
          <option value="relu">ReLU</option>
          <option value="sigmoid">Sigmoid</option>
          <option value="tanh">Tanh</option>
          <option value="softmax">Softmax</option>
        </select>
  
        <br />
  
        {tempLayer.layerType === 'DL' && (
          <>
            <label>Neurons: </label>
            <input
              type="number"
              name="numOfNeurons"
              value={tempLayer.numOfNeurons}
              onChange={handleChange}
              min="1"
            />
          </>
        )}
      </>
    );
  }
  
  export default LayerForm;
  