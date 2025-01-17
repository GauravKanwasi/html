import React from 'react';

function TemplatePreview({ data, onSubmit }) {
  return (
    <div className="preview">
      <h2>Live Preview</h2>
      <div className="resume">
        <h1>{data.name || 'Your Name'}</h1>
        <p>Email: {data.email || 'Your Email'}</p>
        <p>Phone: {data.phone || 'Your Phone'}</p>
        <h3>Skills</h3>
        <p>{data.skills || 'Your skills here...'}</p>
        <h3>Experience</h3>
        <p>{data.experience || 'Your experience here...'}</p>
        <h3>Education</h3>
        <p>{data.education || 'Your education here...'}</p>
      </div>
      <button onClick={onSubmit}>Save Resume</button>
    </div>
  );
}

export default TemplatePreview;
