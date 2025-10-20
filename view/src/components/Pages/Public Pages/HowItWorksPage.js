import '../../../style/Pages/HowItWorks.css';

function HowItWorksPage() {
  return (
    <div className="how-container">
      <h1>How It Works</h1>
      <ol>
        <li><strong>Create Model:</strong> Add layers, specify activation functions, learning rates, and more.</li>
        <li><strong>Upload Data:</strong> Upload your features and target datasets as CSV files.</li>
        <li><strong>Compile:</strong> Send your model configuration to the backend to initialize parameters.</li>
        <li><strong>Train:</strong> Start the training process. Watch epoch-wise logs update live via WebSocket.</li>
        <li><strong>Test:</strong> Evaluate your model’s performance after training.</li>
        <li><strong>Save:</strong> Store your models and configurations for future use.</li>
      </ol>
    </div>
  );
}

export default HowItWorksPage;
