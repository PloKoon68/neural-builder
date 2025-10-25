import { Brain, Zap, BarChart3, Upload, Play, CheckCircle, ArrowRight, Layers, Activity, Target } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Layers className="h-8 w-8 text-green-400" />,
      title: "Visual Model Builder",
      description: "Design neural networks with an intuitive drag-and-drop interface. No coding required."
    },
    {
      icon: <Upload className="h-8 w-8 text-blue-400" />,
      title: "Easy Dataset Upload",
      description: "Simply upload your CSV files for training and testing. We handle the preprocessing."
    },
    {
      icon: <Activity className="h-8 w-8 text-purple-400" />,
      title: "Real-time Training",
      description: "Watch your model train in real-time with live metrics and interactive visualizations."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-yellow-400" />,
      title: "Performance Analytics",
      description: "Track accuracy, loss, and other metrics with beautiful charts and detailed reports."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Design Your Architecture",
      description: "Add layers, configure neurons, and choose activation functions using our visual builder.",
      icon: <Brain className="h-12 w-12 text-green-400" />
    },
    {
      number: "02",
      title: "Upload Your Data",
      description: "Import training and testing datasets in CSV format. Set hyperparameters and compile your model.",
      icon: <Upload className="h-12 w-12 text-blue-400" />
    },
    {
      number: "03",
      title: "Train & Evaluate",
      description: "Hit train and watch your model learn. Monitor progress with real-time charts and test accuracy.",
      icon: <Play className="h-12 w-12 text-purple-400" />
    }
  ];

  const benefits = [
    "No complex setup or installation required",
    "Experiment with different architectures quickly",
    "Perfect for learning and prototyping",
    "Save and manage multiple projects",
    "Export trained models for deployment",
    "Free to get started"
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(148, 163, 184) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/20 rounded-full px-4 py-2 mb-8">
              <Zap className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Visual Deep Learning Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Build Neural Networks
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                Without Writing Code
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Design, train, and test deep learning models with our intuitive visual interface. 
              Perfect for students, researchers, and ML enthusiasts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/getting-started')}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-green-600/50"
              >
                Getting Started Guide
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-white mb-1">100+</div>
                <div className="text-sm text-slate-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-slate-400">Models Trained</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">95%</div>
                <div className="text-sm text-slate-400">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Build AI
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Powerful features designed to make deep learning accessible to everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all hover:shadow-lg hover:shadow-slate-900/50"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              From idea to trained model in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-slate-700 to-transparent -ml-4"></div>
                )}

                <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 relative z-10 h-full">
                  {/* Step Number */}
                  <div className="text-6xl font-bold text-slate-700 mb-4">{step.number}</div>
                  
                  {/* Icon */}
                  <div className="mb-6">{step.icon}</div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                We've built the most intuitive way to experiment with neural networks. 
                Whether you're a student learning the basics or a researcher testing new ideas, 
                our platform adapts to your needs.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

          
            <div className="relative">

              {/* Placeholder for Screenshot/Demo */}
              <div className="relative">
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 shadow-2xl">
                  <video 
                    className="w-full h-full object-cover"
                    controls
                    poster="/tutorial-thumbnail.jpg"
                  >
                    <source src="/videos/720p compressed.mp4" type="video/mp4" />
                  </video>
                  
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-green-600 rounded-lg p-4 shadow-lg">
                <div className="text-white text-sm font-semibold">95% Accuracy</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-600 rounded-lg p-4 shadow-lg">
                <div className="text-white text-sm font-semibold">Real-time Training</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Build Your First Model?
            </h2>
            <p className="text-xl text-green-50 mb-8">
              Join thousands of developers and researchers using our platform
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2 transition-all hover:shadow-lg"
            >
              Start Building Now
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
                <Brain className="h-6 w-6 text-green-400" />
                Develop Model
              </div>
              <p className="text-slate-400 text-sm">
                Making deep learning accessible to everyone through visual design.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><button onClick={() => navigate('/how-it-works')} className="hover:text-white transition-colors">How It Works</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About</button></li>
                <li><button onClick={() => navigate('/my-models')} className="hover:text-white transition-colors">My Models</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            © 2025 Develop Model. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}