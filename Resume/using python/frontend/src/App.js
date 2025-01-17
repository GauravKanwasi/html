import React, { useState } from 'react';
import ResumeEditor from './components/ResumeEditor';
import TemplatePreview from './components/TemplatePreview';
import './App.css';

function App() {
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    experience: '',
    education: ''
  });

  const handleChange = (field, value) => {
    setResumeData({ ...resumeData, [field]: value });
  };

  const handleSubmit = () => {
    fetch('/api/resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resumeData),
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
  };

  return (
    <div className="app-container">
      <ResumeEditor data={resumeData} onChange={handleChange} />
      <TemplatePreview data={resumeData} onSubmit={handleSubmit} />
    </div>
  );
}

export default App;
