import pytesseract
from PIL import Image
import pdf2image
import os

# Try to find tesseract in common Windows installation paths
TESSERACT_PATH = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
if os.path.exists(TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

def perform_ocr_on_pdf(pdf_path: str):
    """
    Converts a scanned PDF to images and performs OCR to extract text.
    Returns extracted text or structured data.
    """
    try:
        # Convert PDF to list of images
        images = pdf2image.convert_from_path(pdf_path)
        
        extracted_text = ""
        for img in images:
            text = pytesseract.image_to_string(img)
            extracted_text += text + "\n\n"
            
        return extracted_text
    except Exception as e:
        print(f"OCR Error: {e}")
        return None
