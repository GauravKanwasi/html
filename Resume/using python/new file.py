from dataclasses import dataclass, field
from datetime import date
from typing import List, Dict, Optional
from dateutil import parser
from tkinter import *
from tkinter import ttk, messagebox
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet
import webbrowser
from tkinter import colorchooser
from PIL import Image, ImageTk
import tempfile
from pdf2image import convert_from_path
import os

@dataclass
class Experience:
    title: str
    company: str
    start_date: date
    end_date: Optional[date] = None
    description: str = ""
    achievements: List[str] = field(default_factory=list)

@dataclass
class Education:
    institution: str
    degree: str
    field_of_study: str
    start_year: int
    end_year: int

class Resume:
    def __init__(self):
        self.sections: Dict[str, any] = {}
        self.custom_sections: Dict[str, any] = {}
        self.styling: Dict[str, any] = {
            'font': 'Arial',
            'theme': 'classic',
            'color_scheme': 'dark_blue'
        }
    
    def add_section(self, section_name: str, content: any, is_custom: bool = False):
        target = self.custom_sections if is_custom else self.sections
        target[section_name] = content
    
    def set_style(self, **style_options):
        self.styling.update(style_options)
    
    def to_markdown(self) -> str:
        output = []
        # Core sections
        if 'summary' in self.sections:
            output.append(f"# {self.sections['summary']['name']}\n{self.sections['summary']['text']}\n")
        
        # Experience formatting
        if 'experience' in self.sections:
            output.append("## Experience\n")
            for exp in self.sections['experience']:
                output.append(f"**{exp.title}** at {exp.company}\n")
                output.append(f"{exp.start_date.strftime('%b %Y')} - {exp.end_date.strftime('%b %Y') if exp.end_date else 'Present'}\n")
                output.append(f"{exp.description}\n")
                for achievement in exp.achievements:
                    output.append(f"- {achievement}\n")
        
        # Add other core sections similarly...
        return '\n'.join(output)

class Template:
    def __init__(self, resume: Resume):
        self.resume = resume
    
    def generate(self) -> str:
        return self.resume.to_markdown()

class InteractiveBuilder:
    @staticmethod
    def prompt_basic_info():
        return {
            'name': input("Enter your full name: "),
            'email': input("Enter your email: "),
            'phone': input("Enter your phone number: "),
            'linkedin': input("Enter LinkedIn profile (optional): ") or None,
            'github': input("Enter GitHub profile (optional): ") or None
        }

    @staticmethod
    def prompt_experience():
        experiences = []
        while True:
            print("\nAdd Work Experience (leave blank to finish)")
            title = input("Job title: ")
            if not title:
                break
            experiences.append(Experience(
                title=title,
                company=input("Company name: "),
                start_date=InteractiveBuilder._prompt_date("Start date (MM/YYYY): "),
                end_date=InteractiveBuilder._prompt_date("End date (MM/YYYY) or leave blank if current: ", optional=True),
                achievements=InteractiveBuilder._prompt_list("Achievements (one per line, blank to finish):")
            ))
        return experiences

    @staticmethod
    def _prompt_date(prompt_msg, optional=False):
        while True:
            date_str = input(prompt_msg).strip()
            if not date_str and optional:
                return None
            try:
                return parser.parse(date_str).date()
            except ValueError:
                print("Invalid date format. Try MM/YYYY or YYYY-MM-DD")

    @staticmethod
    def _prompt_list(prompt_msg):
        print(prompt_msg)
        items = []
        while True:
            item = input("> ").strip()
            if not item:
                return items
            items.append(item)

class ResumeApp(Tk):
    def __init__(self):
        super().__init__()
        self.title("Resume Builder 9000")
        self.resume = Resume()
        
        # Notebook for sections
        self.notebook = ttk.Notebook(self)
        self.notebook.pack(fill=BOTH, expand=True)
        
        # Personal Info Tab
        self.personal_frame = ttk.Frame(self.notebook)
        self._build_personal_info()
        self.notebook.add(self.personal_frame, text="Personal Info")
        
        # Experience Tab
        self.exp_frame = ttk.Frame(self.notebook)
        self._build_experience_section()
        self.notebook.add(self.exp_frame, text="Experience")
        
        # Add theme controls
        self._build_theme_controls()
        
        # Preview pane
        self.preview_frame = ttk.Frame(self)
        self.preview_frame.pack(side=RIGHT, fill=BOTH, expand=True)
        
        self.preview_canvas = Canvas(self.preview_frame, width=400, bg='white')
        self.preview_canvas.pack(fill=BOTH, expand=True)
        
        # Color picker button
        ttk.Button(
            self.preview_frame, 
            text="Choose Colors",
            command=self.pick_colors
        ).pack(pady=5)
        
        # Set up preview update events
        self.after(2000, self.update_preview)
        
        # Generate Button
        ttk.Button(self, text="Generate PDF", command=self.generate_pdf).pack(pady=10)
    
    def _build_personal_info(self):
        fields = [
            ('name', 'Full Name:'),
            ('email', 'Email:'), 
            ('phone', 'Phone:'),
            ('linkedin', 'LinkedIn:'),
            ('github', 'GitHub:')
        ]
        
        self.entries = {}
        for i, (field, label) in enumerate(fields):
            ttk.Label(self.personal_frame, text=label).grid(row=i, column=0, sticky=W, padx=5, pady=2)
            entry = ttk.Entry(self.personal_frame, width=40)
            entry.grid(row=i, column=1, padx=5, pady=2)
            self.entries[field] = entry
    
    def _build_experience_section(self):
        self.exp_entries = []
        ttk.Button(self.exp_frame, text="Add Experience", command=self.add_experience_field).pack(pady=5)
    
    def add_experience_field(self):
        frame = ttk.Frame(self.exp_frame)
        frame.pack(fill=X, pady=5)
        
        entries = {}
        fields = [
            ('title', 'Job Title:', 30),
            ('company', 'Company:', 30),
            ('start', 'Start Date (MM/YYYY):', 15),
            ('end', 'End Date (MM/YYYY):', 15)
        ]
        
        for i, (field, label, width) in enumerate(fields):
            ttk.Label(frame, text=label).grid(row=0, column=i*2, padx=2)
            entry = ttk.Entry(frame, width=width)
            entry.grid(row=0, column=i*2+1, padx=2)
            entries[field] = entry
        
        ttk.Label(frame, text="Achievements:").grid(row=1, column=0, columnspan=8, sticky=W)
        achievements = Text(frame, height=4, width=60)
        achievements.grid(row=2, column=0, columnspan=8)
        entries['achievements'] = achievements
        
        self.exp_entries.append(entries)
    
    def _build_theme_controls(self):
        control_frame = ttk.Frame(self)
        control_frame.pack(side=TOP, fill=X, padx=5, pady=5)
        
        ttk.Label(control_frame, text="Theme:").pack(side=LEFT)
        self.theme_var = StringVar(value='modern')
        themes = ['classic', 'modern', 'creative']
        for theme in themes:
            ttk.Radiobutton(
                control_frame, 
                text=theme.capitalize(),
                variable=self.theme_var,
                value=theme,
                command=self.update_theme
            ).pack(side=LEFT, padx=5)
    
    def update_theme(self):
        self.resume.set_theme_preset(self.theme_var.get())
    
    def pick_colors(self):
        color = colorchooser.askcolor(title="Choose Theme Color")[1]
        if color:
            self.resume.styling['primary_color'] = color
            self.update_preview()
    
    def update_preview(self):
        try:
            # Generate temporary PDF
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                temp_path = tmp.name
                
            self._generate_pdf(temp_path, preview=True)
            
            # Convert first page to image
            images = convert_from_path(
                temp_path,
                dpi=100,
                poppler_path=r"C:\path\to\poppler\bin"  # Windows example
                # Linux/Mac: poppler_path=None
            )
            
            if images:
                img = images[0].resize((400, 500))
                self.preview_image = ImageTk.PhotoImage(img)
                self.preview_canvas.delete("all")
                self.preview_canvas.create_image(0, 0, anchor=NW, image=self.preview_image)
            
            # Schedule next update
            self.after(1000, self.update_preview)
            
        except Exception as e:
            print(f"Preview error: {str(e)}")
            self.after(1000, self.update_preview)
    
    def _generate_pdf(self, filename, preview=False):
        # Modified PDF generation that uses styling
        doc = SimpleDocTemplate(
            filename,
            pagesize=letter,
            leftMargin=self.resume.styling['margin']*inch,
            rightMargin=self.resume.styling['margin']*inch
        )
        
        styles = getSampleStyleSheet()
        primary_color = self.resume.styling.get('primary_color', '#000000')
        
        # Create dynamic styles
        styles['Title'].textColor = primary_color
        styles['Heading2'].textColor = primary_color
        styles['Bullet'].textColor = primary_color
        
        # Collect personal info
        basics = {k: v.get() for k, v in self.entries.items()}
        self.resume.add_section('summary', {
            'name': basics['name'],
            'text': f"{basics['email']} | {basics['phone']}" + 
                    (f"\nGitHub: {basics['github']}" if basics['github'] else "") +
                    (f"\nLinkedIn: {basics['linkedin']}" if basics['linkedin'] else "")
        })
        
        # Collect experiences
        experiences = []
        for entry in self.exp_entries:
            experiences.append(Experience(
                title=entry['title'].get(),
                company=entry['company'].get(),
                start_date=parser.parse(entry['start'].get()).date(),
                end_date=parser.parse(entry['end'].get()).date() if entry['end'].get() else None,
                achievements=entry['achievements'].get("1.0", END).split("\n")
            ))
        if experiences:
            self.resume.add_section('experience', experiences)
        
        # Generate PDF
        story = []
        
        # Add content
        story.append(Paragraph(basics['name'], styles['Title']))
        story.append(Spacer(1, 12))
        
        if 'experience' in self.resume.sections:
            story.append(Paragraph("Experience", styles['Heading2']))
            for exp in self.resume.sections['experience']:
                date_range = f"{exp.start_date.strftime('%b %Y')} - {exp.end_date.strftime('%b %Y') if exp.end_date else 'Present'}"
                story.append(Paragraph(f"<b>{exp.title}</b> at {exp.company} ({date_range})", styles['BodyText']))
                for achiv in exp.achievements:
                    if achiv.strip():
                        story.append(Paragraph(f"• {achiv}", styles['Bullet']))
                story.append(Spacer(1, 8))
        
        doc.build(story)
        webbrowser.open(filename)
        messagebox.showinfo("Success", f"Resume saved as {filename}")
    
    def generate_pdf(self):
        try:
            self._generate_pdf(f"{basics['name'].replace(' ', '_')}_Resume.pdf")
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to generate PDF: {str(e)}")

if __name__ == "__main__":
    os.environ["PATH"] += os.pathsep + r'C:\path\to\poppler\bin'  # Windows only
    app = ResumeApp()
    app.mainloop()
