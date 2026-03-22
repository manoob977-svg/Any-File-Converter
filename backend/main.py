from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import List
import os
import uuid
import shutil
import json
from services.pdf_converter import convert_pdf_to_excel
from services.pdf_merger import merge_pdf_pages
from utils.file_manager import cleanup_file, get_temp_path
from services.image_to_pdf import convert_images_to_pdf
from services.word_to_pdf import convert_word_to_pdf
from services.excel_to_pdf import convert_excel_to_pdf
from services.cad_to_pdf import convert_cad_to_pdf
from services.image_enhancer import enhance_image
from services.pdf_to_image import convert_pdf_to_images

app = FastAPI(title="Any File Converter API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "temp"
if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

@app.get("/")
def read_root():
    return {"message": "Welcome to Any File Converter API"}

@app.post("/convert/pdf-to-excel")
async def pdf_to_excel(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    file_id = str(uuid.uuid4())
    input_path = os.path.join(TEMP_DIR, f"{file_id}.pdf")
    output_path = os.path.join(TEMP_DIR, f"{file_id}.xlsx")
    
    # Save uploaded file
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Perform conversion
        convert_pdf_to_excel(input_path, output_path)
        
        # Schedule cleanup
        background_tasks.add_task(cleanup_file, input_path)
        background_tasks.add_task(cleanup_file, output_path, delay=3600)  # Cleanup output after 1 hour
        
        return {
            "fileId": file_id,
            "filename": file.filename.replace(".pdf", ".xlsx"),
            "downloadUrl": f"/download/{file_id}"
        }
    except Exception as e:
        if os.path.exists(input_path):
            os.remove(input_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/convert/merge-pdfs")
async def pdf_merger_endpoint(
    files: List[UploadFile] = File(...), 
    layout: str = File(...), # Stringified JSON: [[file_index, page_index], ...]
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    if not files:
        raise HTTPException(status_code=400, detail="No PDF files provided.")
    
    file_id = str(uuid.uuid4())
    input_paths = []
    
    try:
        # Save all uploaded files
        for i, file in enumerate(files):
            input_filename = f"{file_id}_{i}.pdf"
            input_path = get_temp_path(input_filename)
            with open(input_path, "wb") as f:
                content = await file.read()
                f.write(content)
            input_paths.append(input_path)
            # Cleanup source files after processing
            background_tasks.add_task(cleanup_file, input_path, 600)

        # Parse layout
        try:
            page_layout = json.loads(layout)
        except:
            # Fallback to simple merge if layout is invalid
            page_layout = [] 
            # (In a real app, you'd raise an error here)

        output_filename = f"{file_id}.pdf"
        output_path = get_temp_path(output_filename)

        # Build page config list
        page_configs = []
        for file_idx, page_idx in page_layout:
            if 0 <= file_idx < len(input_paths):
                page_configs.append({
                    'path': input_paths[file_idx],
                    'page_index': page_idx
                })

        # Merge PDFs at page level
        success = merge_pdf_pages(page_configs, output_path)
        
        if not success:
            raise HTTPException(status_code=500, detail="Page-level PDF merging failed.")

        # Schedule cleanup for output file
        background_tasks.add_task(cleanup_file, output_path, 3600)

    except Exception as e:
        print(f"Error merging PDF pages: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "fileId": file_id,
        "filename": "merged_document.pdf",
        "downloadUrl": f"http://localhost:8000/download/{file_id}"
    }

from services.pdf_to_word import convert_pdf_to_word

@app.post("/convert/pdf-to-word")
async def pdf_to_word(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    file_id = str(uuid.uuid4())
    input_path = get_temp_path(f"{file_id}.pdf")
    output_path = get_temp_path(f"{file_id}.docx")
    
    # Save uploaded file
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Perform conversion
        success = convert_pdf_to_word(input_path, output_path)
        
        if not success:
            raise HTTPException(status_code=500, detail="PDF to Word conversion failed.")
            
        # Schedule cleanup
        background_tasks.add_task(cleanup_file, input_path)
        background_tasks.add_task(cleanup_file, output_path, delay=3600)
        
        return {
            "fileId": file_id,
            "filename": file.filename.replace(".pdf", ".docx"),
            "downloadUrl": f"http://localhost:8000/download/{file_id}"
        }
    except Exception as e:
        if os.path.exists(input_path):
            os.remove(input_path)
        raise HTTPException(status_code=500, detail=str(e))

from services.pdf_compressor import compress_pdf

@app.post("/convert/compress-pdf")
async def pdf_compress(
    background_tasks: BackgroundTasks, 
    file: UploadFile = File(...),
    power: str = Form("medium")
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    file_id = str(uuid.uuid4())
    input_path = get_temp_path(f"{file_id}_input.pdf")
    output_path = get_temp_path(f"{file_id}.pdf")
    
    # Save uploaded file
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Perform compression
        success = compress_pdf(input_path, output_path, power=power)
        
        if not success:
            raise HTTPException(status_code=500, detail="PDF compression failed.")
            
        # Schedule cleanup
        background_tasks.add_task(cleanup_file, input_path)
        background_tasks.add_task(cleanup_file, output_path, delay=3600)
        
        return {
            "fileId": file_id,
            "filename": file.filename.replace(".pdf", "_compressed.pdf"),
            "downloadUrl": f"http://localhost:8000/download/{file_id}"
        }
    except Exception as e:
        if os.path.exists(input_path):
            os.remove(input_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/convert/image-to-pdf")
async def image_to_pdf_endpoint(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...)
):
    """
    Converts multiple uploaded images into a single PDF document.
    """
    file_id = str(uuid.uuid4())
    output_path = get_temp_path(f"{file_id}.pdf")
    input_paths = []
    
    try:
      if not files:
          raise HTTPException(status_code=400, detail="No files uploaded.")
          
      for i, file in enumerate(files):
          # Support common image formats
          ext = file.filename.split(".")[-1].lower()
          if ext not in ["jpg", "jpeg", "png", "bmp", "tiff", "webp"]:
              continue
              
          input_path = get_temp_path(f"{file_id}_{i}.{ext}")
          with open(input_path, "wb") as buffer:
              shutil.copyfileobj(file.file, buffer)
          input_paths.append(input_path)
          background_tasks.add_task(cleanup_file, input_path)

      if not input_paths:
          raise HTTPException(status_code=400, detail="No valid images uploaded.")

      # Convert
      success = convert_images_to_pdf(input_paths, output_path)
      
      if not success:
          raise HTTPException(status_code=500, detail="Conversion failed.")
          
      # Schedule cleanup
      background_tasks.add_task(cleanup_file, output_path, delay=3600)
      
      return {
          "fileId": file_id,
          "filename": "converted_images.pdf",
          "downloadUrl": f"http://localhost:8000/download/{file_id}"
      }
    except Exception as e:
      # Cleanup any partial files
      for p in input_paths:
          if os.path.exists(p): os.remove(p)
      raise HTTPException(status_code=500, detail=str(e))

@app.post("/convert/word-to-pdf")
async def word_to_pdf_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Converts a single uploaded Word document into a PDF.
    """
    if not file.filename.endswith((".docx", ".doc")):
        raise HTTPException(status_code=400, detail="Only Word files (.doc, .docx) are supported.")
        
    file_id = str(uuid.uuid4())
    input_path = get_temp_path(f"{file_id}_input{os.path.splitext(file.filename)[1]}")
    output_path = get_temp_path(f"{file_id}.pdf")
    
    try:
        # Save uploaded file
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Convert
        success = convert_word_to_pdf(input_path, output_path)
        
        if not success:
            raise HTTPException(status_code=500, detail="Word to PDF conversion failed.")
            
        # Schedule cleanup
        background_tasks.add_task(cleanup_file, input_path)
        background_tasks.add_task(cleanup_file, output_path, delay=3600)
        
        return {
            "fileId": file_id,
            "filename": file.filename.replace(".docx", ".pdf").replace(".doc", ".pdf"),
            "downloadUrl": f"http://localhost:8000/download/{file_id}"
        }
    except Exception as e:
        if os.path.exists(input_path): os.remove(input_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/convert/excel-to-pdf")
async def excel_to_pdf_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Converts a single uploaded Excel spreadsheet into a PDF.
    """
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Only Excel files (.xls, .xlsx) are supported.")
        
    file_id = str(uuid.uuid4())
    input_path = get_temp_path(f"{file_id}_input{os.path.splitext(file.filename)[1]}")
    output_path = get_temp_path(f"{file_id}.pdf")
    
    try:
        # Save uploaded file
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Convert
        success = convert_excel_to_pdf(input_path, output_path)
        
        if not success:
            raise HTTPException(status_code=500, detail="Excel to PDF conversion failed.")
            
        # Schedule cleanup
        background_tasks.add_task(cleanup_file, input_path)
        background_tasks.add_task(cleanup_file, output_path, delay=3600)
        
        return {
            "fileId": file_id,
            "filename": file.filename.replace(".xlsx", ".pdf").replace(".xls", ".pdf"),
            "downloadUrl": f"http://localhost:8000/download/{file_id}"
        }
    except Exception as e:
        if os.path.exists(input_path): os.remove(input_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/convert/cad-to-pdf")
async def cad_to_pdf_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Converts a single uploaded CAD (.dxf) document into a PDF.
    """
    if not file.filename.lower().endswith((".dxf", ".dwg")):
        raise HTTPException(status_code=400, detail="Only DXF and DWG files are supported.")
        
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    input_path = get_temp_path(f"{file_id}_input{ext}")
    output_path = get_temp_path(f"{file_id}.pdf")
    
    try:
        # Save uploaded file
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Convert
        success, message = convert_cad_to_pdf(input_path, output_path)
        
        if not success:
            raise HTTPException(status_code=500, detail=f"CAD to PDF conversion failed: {message}")
            
        # Schedule cleanup
        background_tasks.add_task(cleanup_file, input_path)
        background_tasks.add_task(cleanup_file, output_path, delay=3600)
        
        return {
            "fileId": file_id,
            "filename": file.filename.replace(".dxf", ".pdf"),
            "downloadUrl": f"http://localhost:8000/download/{file_id}"
        }
    except Exception as e:
        if os.path.exists(input_path): os.remove(input_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/convert/enhance-image")
async def enhance_image_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Enhances the quality of an uploaded image using AI-powered filters.
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp", ".bmp"]:
        raise HTTPException(status_code=400, detail="Only common image formats are supported.")
        
    file_id = str(uuid.uuid4())
    input_path = get_temp_path(f"{file_id}_input{ext}")
    output_path = get_temp_path(f"{file_id}_enhanced{ext}")
    
    try:
        # Save uploaded file
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Enhance
        success = enhance_image(input_path, output_path)
        
        if not success:
            raise HTTPException(status_code=500, detail="Image enhancement failed.")
            
        # Schedule cleanup
        background_tasks.add_task(cleanup_file, input_path)
        background_tasks.add_task(cleanup_file, output_path, delay=3600)
        
        return {
            "fileId": file_id,
            "filename": f"enhanced_{file.filename}",
            "downloadUrl": f"http://localhost:8000/download/enhanced/{file_id}/{ext.replace('.', '')}"
        }
    except Exception as e:
        if os.path.exists(input_path): os.remove(input_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/convert/pdf-to-image")
async def pdf_to_image_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Converts a single uploaded PDF into a ZIP of images (one per page).
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    file_id = str(uuid.uuid4())
    input_path = get_temp_path(f"{file_id}_input.pdf")
    output_path = get_temp_path(f"{file_id}.zip")
    
    try:
        # Save uploaded file
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Convert
        success = convert_pdf_to_images(input_path, output_path)
        
        if not success:
            raise HTTPException(status_code=500, detail="PDF to Image conversion failed.")
            
        # Schedule cleanup
        background_tasks.add_task(cleanup_file, input_path)
        background_tasks.add_task(cleanup_file, output_path, delay=3600)
        
        return {
            "fileId": file_id,
            "filename": file.filename.replace(".pdf", "_images.zip").replace(".PDF", "_images.zip"),
            "downloadUrl": f"http://localhost:8000/download/zip/{file_id}"
        }
    except Exception as e:
        if os.path.exists(input_path): os.remove(input_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/zip/{file_id}")
async def download_zip(file_id: str):
    path = os.path.join(TEMP_DIR, f"{file_id}.zip")
    if os.path.exists(path):
        return FileResponse(
            path=path,
            filename=f"converted_images.zip",
            media_type="application/zip"
        )
    else:
        raise HTTPException(status_code=404, detail="File not found or expired.")

@app.get("/download/enhanced/{file_id}/{ext}")
async def download_enhanced(file_id: str, ext: str):
    path = os.path.join(TEMP_DIR, f"{file_id}_enhanced.{ext}")
    if os.path.exists(path):
        return FileResponse(
            path=path,
            filename=f"enhanced_image.{ext}",
            media_type=f"image/{ext}"
        )
    else:
        raise HTTPException(status_code=404, detail="File not found or expired.")

@app.get("/download/{file_id}")
async def download_file(file_id: str):
    # Check for Excel first, then Word, then PDF
    excel_path = os.path.join(TEMP_DIR, f"{file_id}.xlsx")
    docx_path = os.path.join(TEMP_DIR, f"{file_id}.docx")
    pdf_path = os.path.join(TEMP_DIR, f"{file_id}.pdf")
    
    if os.path.exists(excel_path):
        return FileResponse(
            path=excel_path,
            filename=f"converted_file.xlsx",
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    elif os.path.exists(docx_path):
        return FileResponse(
            path=docx_path,
            filename=f"converted_file.docx",
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    elif os.path.exists(pdf_path):
        return FileResponse(
            path=pdf_path,
            filename=f"merged_document.pdf",
            media_type="application/pdf"
        )
    else:
        raise HTTPException(status_code=404, detail="File not found or expired.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
