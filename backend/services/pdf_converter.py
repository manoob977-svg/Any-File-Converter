import pdfplumber
import tabula
import pandas as pd
import os
from services.ocr_service import perform_ocr_on_pdf

def convert_pdf_to_excel(pdf_path: str, excel_path: str):
    """
    Extracts data from PDF and saves it to an Excel file.
    Uses a hybrid approach: tabula-py -> pdfplumber -> OCR fallback.
    """
    extracted = False
    
    try:
        # 1. Attempt tabula-py (best for structured tables)
        tables = tabula.read_pdf(pdf_path, pages='all', multiple_tables=True)
        if tables:
            with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
                for i, df in enumerate(tables):
                    df.to_excel(writer, sheet_name=f'Table_{i+1}', index=False)
            extracted = True
    except Exception as e:
        print(f"Tabula fallback: {e}")

    if not extracted:
        try:
            # 2. Attempt pdfplumber (fallback for text-based PDFs)
            all_data = []
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    tables = page.extract_tables()
                    for table in tables:
                        if table and len(table) > 0:
                            df = pd.DataFrame(table[1:], columns=table[0])
                            all_data.append(df)
            
            if all_data:
                with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
                    for i, df in enumerate(all_data):
                        df.to_excel(writer, sheet_name=f'Sheet_{i+1}', index=False)
                extracted = True
        except Exception as e:
            print(f"pdfplumber fallback: {e}")

    if not extracted:
        try:
            # 3. OCR Fallback (for scanned PDFs)
            print("Attempting OCR fallback...")
            text = perform_ocr_on_pdf(pdf_path)
            if text:
                # Create a simple Excel sheet with the extracted text
                df = pd.DataFrame([line.split('\t') for line in text.split('\n')])
                df.to_excel(excel_path, index=False, header=False)
                extracted = True
        except Exception as e:
            print(f"OCR fallback failed: {e}")

    if not extracted:
        raise Exception("Could not extract any data from the PDF.")
    
    return True
