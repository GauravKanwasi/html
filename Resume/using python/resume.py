from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return '''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fun & Interactive Resume Builder</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.14.0/Sortable.min.js"></script>
        <style>
            body { background-color: #f4f4f4; transition: background-color 0.5s ease; }
            .container { margin-top: 30px; }
            #preview { background-color: white; padding: 20px; border-radius: 5px; min-height: 400px; }
            .template-preview { cursor: pointer; padding: 15px; margin: 10px 0; border-radius: 5px; transition: transform 0.3s, box-shadow 0.3s; }
            .template-preview:hover { transform: scale(1.05); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
            .drag-item { padding: 10px; background-color: #e9ecef; border-radius: 5px; margin-bottom: 5px; cursor: grab; }
            .theme-switcher { cursor: pointer; padding: 10px 15px; border-radius: 5px; background-color: #007bff; color: white; border: none; }
        </style>
    </head>
    <body>
        <div class="container-fluid">
            <div class="row">
                <!-- Left Panel: Form Input -->
                <div class="col-md-3">
                    <button class="btn btn-secondary mb-3" onclick="togglePanel('left-panel')">Toggle Form</button>
                    <button class="theme-switcher mb-3" onclick="switchTheme()">Switch Theme</button>
                    <div id="left-panel">
                        <h3>Resume Information</h3>
                        <div id="formFields">
                            <div class="drag-item" data-type="name">Name: <input type="text" id="name" class="form-control"></div>
                            <div class="drag-item" data-type="email">Email: <input type="email" id="email" class="form-control"></div>
                            <div class="drag-item" data-type="phone">Phone: <input type="text" id="phone" class="form-control"></div>
                            <div class="drag-item" data-type="skills">Skills: <input type="text" id="skills" class="form-control"></div>
                            <div class="drag-item" data-type="experience">Experience: <textarea id="experience" class="form-control"></textarea></div>
                            <div class="drag-item" data-type="education">Education: <textarea id="education" class="form-control"></textarea></div>
                        </div>
                    </div>
                </div>
                
                <!-- Center Panel: Live Preview -->
                <div class="col-md-6">
                    <button class="btn btn-secondary mb-3" onclick="togglePanel('preview')">Toggle Preview</button>
                    <h3>Live Preview (Drag & Edit)</h3>
                    <div id="preview" class="border">
                        <h2 id="previewName" contenteditable="true">Your Name</h2>
                        <p id="previewEmail" contenteditable="true">Your Email</p>
                        <p id="previewPhone" contenteditable="true">Your Phone</p>
                        <h4>Skills</h4>
                        <ul id="previewSkills" contenteditable="true"></ul>
                        <h4>Experience</h4>
                        <p id="previewExperience" contenteditable="true"></p>
                        <h4>Education</h4>
                        <p id="previewEducation" contenteditable="true"></p>
                    </div>
                </div>
                
                <!-- Right Panel: Template Selection -->
                <div class="col-md-3">
                    <button class="btn btn-secondary mb-3" onclick="togglePanel('template-panel')">Toggle Templates</button>
                    <div id="template-panel">
                        <h3>Select a Template</h3>
                        <div class="template-preview bg-light" onclick="selectTemplate('classic')">Classic Template</div>
                        <div class="template-preview bg-info text-white" onclick="selectTemplate('modern')">Modern Template</div>
                        <div class="template-preview bg-warning text-dark" onclick="selectTemplate('creative')">Creative Template</div>
                    </div>
                </div>
            </div>
        </div>

        <script>
            // Drag-and-drop setup
            new Sortable(document.getElementById('formFields'), { animation: 150, ghostClass: 'sortable-ghost' });
            new Sortable(document.getElementById('preview'), { animation: 150, ghostClass: 'sortable-ghost' });

            // Real-time preview update
            document.querySelectorAll('#formFields input, #formFields textarea').forEach(input => {
                input.addEventListener('input', updatePreview);
            });

            function updatePreview() {
                document.getElementById('previewName').innerText = document.getElementById('name').value || 'Your Name';
                document.getElementById('previewEmail').innerText = document.getElementById('email').value || 'Your Email';
                document.getElementById('previewPhone').innerText = document.getElementById('phone').value || 'Your Phone';

                let skills = document.getElementById('skills').value.split(',');
                document.getElementById('previewSkills').innerHTML = skills.map(skill => `<li>${skill.trim()}</li>`).join('');

                document.getElementById('previewExperience').innerText = document.getElementById('experience').value || 'Work experience';
                document.getElementById('previewEducation').innerText = document.getElementById('education').value || 'Educational background';
            }

            // Theme Switcher
            function switchTheme() {
                document.body.style.backgroundColor = document.body.style.backgroundColor === 'white' ? '#f4f4f4' : 'white';
            }

            // Template selection
            function selectTemplate(template) {
                alert('Template selected: ' + template);
            }

            // Toggle panel visibility
            function togglePanel(panelId) {
                let panel = document.getElementById(panelId);
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
        </script>
    </body>
    </html>
    '''

if __name__ == '__main__':
    app.run(debug=True)
