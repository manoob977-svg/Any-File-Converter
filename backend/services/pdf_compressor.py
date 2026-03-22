import fitz  # PyMuPDF
import os
import time

def compress_pdf(input_path: str, output_path: str, power: str = "medium"):
    """
    Compresses a PDF file using PyMuPDF with image downsampling and resolution reduction.
    Power options: 'low', 'medium', 'high'
    """
    try:
        startTime = time.time()
        print(f"Starting aggressive compression: {input_path} ({power})")
        
        if not os.path.exists(input_path):
            return False

        doc = fitz.open(input_path)
        
        # Power parameters: (img_quality, shrink_factor, garbage_level)
        # Low: No image processing, fast garbage
        # Medium: 70% quality, no shrink, medium garbage
        # High: 50% quality, shrink factor 2 (50% size), max garbage
        settings = {
            "low": (0, 1, 3),
            "medium": (75, 1, 3),
            "high": (50, 2, 4)
        }
        
        img_quality, shrink, garbage_level = settings.get(power, (75, 1, 3))

        if img_quality > 0:
            processed_xrefs = set()
            
            for page in doc:
                for img in page.get_images():
                    xref = img[0]
                    if xref in processed_xrefs:
                        continue
                    
                    try:
                        # Extract original image to check its size and type
                        original_img = doc.extract_image(xref)
                        if not original_img: continue
                        
                        original_size = len(original_img["image"])
                        original_ext = original_img["ext"].lower()
                        
                        # Skip CCITT/JBIG2 as JPEG will likely bloat them
                        if original_ext in ["jb2", "fax"]:
                            processed_xrefs.add(xref)
                            continue

                        # Get Pixmap
                        pix = fitz.Pixmap(doc, xref)
                        
                        # Apply shrink if needed (only for High)
                        if shrink > 1:
                            pix.shrink(shrink)
                        
                        # Convert to JPEG bytes
                        if pix.n - pix.alpha > 3: # Handle CMYK
                            pix = fitz.Pixmap(fitz.csRGB, pix)
                            
                        img_bytes = pix.tobytes("jpeg", jquality=img_quality)
                        
                        # ONLY replace if it actually shrinks the file significantly
                        # (Target at least 15% reduction to account for overhead)
                        if len(img_bytes) < original_size * 0.85:
                            doc.replace_image(xref, stream=img_bytes)
                        
                        processed_xrefs.add(xref)
                        pix = None
                    except Exception:
                        continue
                        
                if time.time() - startTime > 45: 
                    print("Optimization: Timeout reached.")
                    break

        # Save with full optimization flags
        doc.save(
            output_path, 
            garbage=garbage_level, 
            deflate=True, 
            clean=True
        )
            
        doc.close()
        
        orig_s = os.path.getsize(input_path)
        new_s = os.path.getsize(output_path)
        
        # Final safety check
        if new_s >= orig_s and power != "low":
             import shutil
             shutil.copyfile(input_path, output_path)
        
        print(f"Aggressive Optimization: {orig_s} -> {new_s} ({(orig_s - new_s)/orig_s*100:.1f}%)")
        return True
    except Exception as e:
        print(f"PDF Compression Error: {e}")
        return False
