import os
import win32com.client
import pythoncom

def convert_excel_to_pdf(input_path: str, output_path: str):
    """
    Converts an Excel (.xlsx, .xls) file to a PDF file using Excel COM automation.
    Requires Microsoft Excel to be installed on the system (Windows only).
    """
    excel = None
    try:
        # Initialize COM for the current thread
        pythoncom.CoInitialize()
        
        # Ensure paths are absolute for COM
        abs_input = os.path.abspath(input_path)
        abs_output = os.path.abspath(output_path)
        
        # Create Excel instance
        excel = win32com.client.Dispatch("Excel.Application")
        excel.Visible = False
        excel.DisplayAlerts = False
        
        # Open the workbook
        wb = excel.Workbooks.Open(abs_input)
        
        # 0 = xlTypePDF
        # Export the entire workbook to PDF
        wb.ExportAsFixedFormat(0, abs_output)
        
        wb.Close(False)
        return os.path.exists(output_path)
        
    except Exception as e:
        print(f"Excel to PDF Conversion Error: {e}")
        return False
    finally:
        if excel:
            try:
                excel.Quit()
            except:
                pass
        # Uninitialize COM
        pythoncom.CoUninitialize()
