import os
import sys

# We'll try to use docx2pdf which is reliable on Windows if Word is installed
try:
    from docx2pdf import convert
    HAS_DOCX2PDF = True
except ImportError:
    HAS_DOCX2PDF = False

def convert_word_to_pdf(input_path: str, output_path: str):
    """
    Converts a Word (.docx) file to a PDF file.
    Note: Requires Microsoft Word to be installed on the system (Windows only).
    """
    try:
        if not os.path.exists(input_path):
            return False

        if HAS_DOCX2PDF:
            # On Windows, docx2pdf uses COM to talk to Word for perfect conversion
            convert(input_path, output_path)
            return os.path.exists(output_path)
        else:
            print("Error: docx2pdf library not found.")
            return False
            
    except Exception as e:
        print(f"Word to PDF Conversion Error: {e}")
        return False
