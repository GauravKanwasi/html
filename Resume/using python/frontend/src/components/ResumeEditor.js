import React from 'react';

function ResumeEditor({ data, onChange }) {
  return (
    <div className="editor">
      <h2>Edit Resume</h2>
      <input type="text" placeholder="Full Name" value={data.name} onChange={(e) => onChange('name', e.target.value)} />
      <input type="email" placeholder="Email" value={data.email} onChange={(e) => onChange('email', e.target.value)} />
      <input type="text" placeholder="Phone Number" value={data.phone} onChange={(e) => onChange('phone', e.target.value)} />
      <textarea placeholder="Skills" value={data.skills} onChange={(e) => onChange('skills', e.target.value)} />
      <textarea placeholder="Experience" value={data.experience} onChange={(e) => onChange('experience', e.target.value)} />
      <textarea placeholder="Education" value={data.education} onChange={(e) => onChange('education', e.target.value)} />
    </div>
  );
}

export default ResumeEditor;
