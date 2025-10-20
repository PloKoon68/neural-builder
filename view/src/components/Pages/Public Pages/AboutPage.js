import '../../../style/Pages/About.css';


function AboutPage() {
  return (
    <div className="about-container">
      <h1>About This Project</h1>
      <p>
        This application allows users to build and train deep learning models using an intuitive
        interface. It is designed to help students and developers visualize model structures, upload
        datasets, and observe training metrics in real-time.
      </p>
      <p>
        The frontend is built with React, while the backend uses Express and a C++-based deep learning
        framework connected via Crow (a C++ web server). MongoDB is used for data persistence.
      </p>
    </div>
  );
}

export default AboutPage;
