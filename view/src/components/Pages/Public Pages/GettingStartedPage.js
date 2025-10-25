import { Brain, Layers, Upload, Play, Settings, BarChart3, CheckCircle, ArrowRight, Book, Video, Code, Zap } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export default function GettingStartedPage() {
  const navigate = useNavigate();

  const concepts = [
    {
      icon: <Layers className="h-8 w-8 text-green-400" />,
      title: "Neural Network Architecture",
      description: "Learn how to design your network by adding layers, choosing activation functions, and configuring neurons. Each layer processes information differently to extract patterns from your data."
    },
    {
      icon: <Upload className="h-8 w-8 text-blue-400" />,
      title: "Dataset Management",
      description: "Upload your training and testing data in CSV format. Your features (input data) and labels (expected outputs) should be in separate files for best results."
    },
    {
      icon: <Settings className="h-8 w-8 text-purple-400" />,
      title: "Hyperparameters",
      description: "Fine-tune your model's learning process by adjusting epochs, batch size, learning rate, and optimizer. These settings control how your model learns from data."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-yellow-400" />,
      title: "Training & Evaluation",
      description: "Watch your model train in real-time with live charts showing loss and accuracy. Test your model's performance on unseen data to ensure it generalizes well."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Model",
      description: "Start by clicking 'Add Model' on the My Models page. Give it a descriptive name and description so you can easily find it later.",
      tips: ["Use clear, descriptive names", "Add notes about the problem you're solving", "You can create multiple models for different experiments"]
    },
    {
      number: "02",
      title: "Design Architecture",
      description: "Add layers to build your network. Start with an input layer, add hidden layers with activation functions, and finish with an output layer.",
      tips: ["Input layer size = number of features in your data", "Hidden layers extract patterns (start with 1-2 layers)", "Output layer size = number of classes to predict", "ReLU activation is a good default for hidden layers"]
    },
    {
      number: "03",
      title: "Prepare Your Data",
      description: "Upload your training features (X_train.csv) and labels (y_train.csv). Optionally upload test data to evaluate performance.",
      tips: ["CSV files should have no headers or use first row as headers", "Features should be numerical values", "Labels should match your output layer configuration", "Normalize your data for better results"]
    },
    {
      number: "04",
      title: "Configure Training",
      description: "Set your hyperparameters: choose a loss function, optimizer, number of epochs, and batch size based on your problem type.",
      tips: ["Binary classification: Use Sigmoid Cross Entropy", "Multi-class: Use Categorical Cross Entropy", "Start with 10-50 epochs", "Batch size: 32 is a good default", "Adam optimizer works well for most cases"]
    },
    {
      number: "05",
      title: "Compile & Train",
      description: "Click 'Compile' to prepare your model, then hit 'Train' to start the learning process. Watch the charts update in real-time.",
      tips: ["Compile first - this validates your architecture", "Training can be stopped anytime", "Monitor the loss curve - it should decrease", "If accuracy isn't improving, try adjusting hyperparameters"]
    },
    {
      number: "06",
      title: "Test & Iterate",
      description: "Upload test data to evaluate your model's performance. Use the results to refine your architecture and hyperparameters.",
      tips: ["Test accuracy shows real-world performance", "If training accuracy is high but test is low: overfitting", "Try adding/removing layers or adjusting learning rate", "Experiment with different architectures"]
    }
  ];

  const examples = [
    {
      title: "Image Classification",
      description: "Build a CNN to classify images into categories",
      architecture: "Input(784) → Dense(128, ReLU) → Dense(64, ReLU) → Dense(10, Softmax)",
      dataset: "MNIST handwritten digits"
    },
    {
      title: "Binary Classification",
      description: "Predict yes/no outcomes from tabular data",
      architecture: "Input(20) → Dense(16, ReLU) → Dense(8, ReLU) → Dense(1, Sigmoid)",
      dataset: "Customer churn, spam detection"
    },
    {
      title: "Multi-class Classification",
      description: "Categorize data into multiple classes",
      architecture: "Input(30) → Dense(64, ReLU) → Dense(32, ReLU) → Dense(5, Softmax)",
      dataset: "Iris flowers, sentiment analysis"
    }
  ];

  const faqs = [
    {
      question: "What format should my data be in?",
      answer: "Your data should be in CSV format with numerical values. Features (X) and labels (y) should be in separate files. The first row can contain headers or be data."
    },
    {
      question: "How many layers should I use?",
      answer: "Start simple with 2-3 layers. More layers can learn more complex patterns but may overfit. Add layers gradually if your model isn't learning well."
    },
    {
      question: "What's the difference between training and testing?",
      answer: "Training data teaches your model patterns. Testing data evaluates how well it learned on unseen data. Never train on your test data!"
    },
    {
      question: "Why is my accuracy not improving?",
      answer: "Common issues: learning rate too high/low, not enough training data, wrong architecture, need more epochs, or data not normalized properly."
    },
    {
      question: "Can I save and resume training?",
      answer: "Yes! Your models are automatically saved. You can return anytime to continue training or test with new data."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/20 rounded-full px-4 py-2 mb-6">
              <Book className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Complete Guide</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Getting Started with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"> Develop Model</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
              Everything you need to know to build, train, and deploy your first neural network. 
              From basics to best practices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Start Building Now
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  document.getElementById('video-tutorial')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Video className="h-5 w-5" />
                Watch Tutorial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Tutorial Section */}
      <section id="video-tutorial" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Video Tutorial</h2>
            <p className="text-lg text-slate-400">
              Watch this comprehensive guide to building your first neural network
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-2xl">
            {/* Video Placeholder */}
          <div className="aspect-video bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
            <div className="text-center w-full h-full">

              <video 
                className="w-full h-full object-cover"
                controls
                poster="/tutorial-thumbnail.jpg"
              >
                <source src="/videos/720p compressed.mp4" type="video/mp4" />
              </video>
              
            </div>
          </div>

            {/* Video Info */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Duration: 5:30
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Beginner Friendly
                </span>
              </div>
              <button className="text-green-400 hover:text-green-300 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Download Sample Dataset
              </button>
            </div>
          </div>


        </div>
      </section>

      {/* Key Concepts Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Key Concepts</h2>
            <p className="text-lg text-slate-400">
              Understand the fundamentals before you start building
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {concepts.map((concept, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all"
              >
                <div className="mb-4">{concept.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{concept.title}</h3>
                <p className="text-slate-400 leading-relaxed">{concept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Step-by-Step Guide</h2>
            <p className="text-lg text-slate-400">
              Follow these steps to build and train your first model
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Step Number */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{step.number}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-white mb-3">{step.title}</h3>
                      <p className="text-slate-400 mb-4 leading-relaxed">{step.description}</p>

                      {/* Tips */}
                      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                        <p className="text-green-400 font-medium mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Pro Tips:
                        </p>
                        <ul className="space-y-1">
                          {step.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="text-slate-300 text-sm flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Projects */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Example Projects</h2>
            <p className="text-lg text-slate-400">
              Common use cases and recommended architectures
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {examples.map((example, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{example.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{example.description}</p>
                
                <div className="bg-slate-700/50 rounded-lg p-3 mb-3">
                  <p className="text-xs text-slate-500 mb-1">Architecture:</p>
                  <p className="text-green-400 text-xs font-mono">{example.architecture}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Upload className="h-3 w-3" />
                  Example: {example.dataset}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-400">
              Common questions from new users
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="text-lg font-semibold text-white mb-3 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-slate-400 leading-relaxed ml-8">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Build Your First Model?
          </h2>
          <p className="text-xl text-green-50 mb-8">
            Put your knowledge into practice and start experimenting
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2 transition-all hover:shadow-lg"
          >
            <Brain className="h-5 w-5" />
            Create Your Account
          </button>
        </div>
      </section>
    </div>
  );
}