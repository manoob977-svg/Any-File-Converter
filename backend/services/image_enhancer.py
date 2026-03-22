import cv2
import numpy as np
import os

def enhance_image(input_path: str, output_path: str):
    """
    Enhances image quality using a combination of:
    1. Noise Reduction (Bilateral Filter)
    2. Adaptive Contrast Enhancement (CLAHE)
    3. Sharpening (Unsharp Masking)
    """
    try:
        # Load image
        img = cv2.imread(input_path)
        if img is None:
            return False
            
        # 1. Noise Reduction - Preserves edges while smoothing flat areas
        denoised = cv2.bilateralFilter(img, 9, 75, 75)
        
        # 2. Convert to LAB color space to enhance lightness without affecting color
        lab = cv2.cvtColor(denoised, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        
        # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        cl = clahe.apply(l)
        
        # Merge back
        limg = cv2.merge((cl, a, b))
        final_lab = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
        
        # 3. Sharpening using Unsharp Masking
        # Gaussian blur + Weighted sum
        gaussian_3 = cv2.GaussianBlur(final_lab, (0, 0), 3)
        sharpened = cv2.addWeighted(final_lab, 1.5, gaussian_3, -0.5, 0)
        
        # Save output
        cv2.imwrite(output_path, sharpened, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
        
        return os.path.exists(output_path)
        
    except Exception as e:
        print(f"Image Enhancement Error: {e}")
        return False
