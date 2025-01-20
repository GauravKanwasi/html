from flask import Flask, jsonify, request, send_from_directory, render_template
import os
import pdfkit

# Flask setup
app = Flask(__name__, static_folder="frontend/build")

# API to handle resume data and generate PDF
@app.route('/api/resume', methods=['POST'])
def generate_resume():
    data = request.json
    html_content = f'''
    <html>
    <head><title>Resume</title></head>
    <body>
        <h1>{data.get('name', 'Your Name')}</h1>
        <p>Email: {data.get('email', 'Your Email')}</p>
        <p>Phone: {data.get('phone', 'Your Phone')}</p>
        <h3>Skills</h3>
        <p>{data.get('skills', 'Your Skills')}</p>
        <h3>Experience</h3>
        <p>{data.get('experience', 'Your Experience')}</p>
        <h3>Education</h3>
        <p>{data.get('education', 'Your Education')}</p>
    </body>
    </html>
    '''
    pdfkit.from_string(html_content, 'resume.pdf')
    return jsonify({"message": "PDF generated successfully!", "data": data})

# Serve the React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
