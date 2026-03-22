from pypdf import PdfWriter, PdfReader
import os

def merge_pdf_pages(page_configs: list[dict], output_path: str):
    """
    Assembles a PDF from specific pages of various files.
    page_configs: list of { 'path': str, 'page_index': int }
    """
    writer = PdfWriter()
    readers = {}

    try:
        for config in page_configs:
            path = config['path']
            idx = config['page_index']
            
            if path not in readers:
                if os.path.exists(path):
                    readers[path] = PdfReader(path)
                else:
                    print(f"Warning: File not found {path}")
                    continue
            
            reader = readers[path]
            if 0 <= idx < len(reader.pages):
                writer.add_page(reader.pages[idx])
            else:
                print(f"Warning: Page index {idx} out of range for {path}")

        with open(output_path, "wb") as f:
            writer.write(f)
        
        writer.close()
        return True
    except Exception as e:
        print(f"Page Merge Error: {e}")
        if writer:
            writer.close()
        return False
