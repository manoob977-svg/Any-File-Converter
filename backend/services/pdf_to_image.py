import fitz  # PyMuPDF
import os
import zipfile
from typing import List

def convert_pdf_to_images(pdf_path: str, output_zip_path: str):
    """
    Converts each page of a PDF into an image and saves them in a zip file.
    """
    try:
        # Open the PDF
        doc = fitz.open(pdf_path)
        
        # Create a temporary directory for images if needed, 
        # but better to write directly to zip if possible.
        # However, to maintain quality and avoid memory issues, 
        # we'll save them temporarily.
        
        temp_dir = os.path.dirname(output_zip_path)
        image_paths = []
        
        for i in range(len(doc)):
            page = doc.load_page(i)
            # Higher zoom for better quality
            zoom = 2.0 
            mat = fitz.Matrix(zoom, zoom)
            pix = page.get_pixmap(matrix=mat)
            
            image_name = f"page_{i+1}.png"
            image_path = os.path.join(temp_dir, image_name)
            pix.save(image_path)
            image_paths.append(image_path)
            
        doc.close()
        
        # Create ZIP file
        with zipfile.ZipFile(output_zip_path, 'w') as zipf:
            for img_path in image_paths:
                zipf.write(img_path, os.path.basename(img_path))
                
        # Cleanup temporary images
        for img_path in image_paths:
            if os.path.exists(img_path):
                os.remove(img_path)
                
        return os.path.exists(output_zip_path)
        
    except Exception as e:
        print(f"PDF to Image Error: {e}")
        return False
