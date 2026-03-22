import fitz  # PyMuPDF
import os

def convert_images_to_pdf(image_paths: list, output_path: str):
    """
    Converts a list of images into a single PDF file.
    """
    try:
        doc = fitz.open()
        
        for img_path in image_paths:
            if not os.path.exists(img_path):
                continue
                
            img = fitz.open(img_path)
            # Create a PDF page with the same dimensions as the image
            rect = img[0].rect
            pdfbytes = img.convert_to_pdf()
            img.close()
            
            imgpdf = fitz.open("pdf", pdfbytes)
            doc.insert_pdf(imgpdf)
            imgpdf.close()
            
        doc.save(output_path)
        doc.close()
        return True
    except Exception as e:
        print(f"Image to PDF Error: {e}")
        return False
