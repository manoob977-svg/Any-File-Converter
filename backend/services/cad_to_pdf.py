import os
import ezdxf
from ezdxf.addons.drawing import RenderContext, Frontend
from ezdxf.addons.drawing.matplotlib import MatplotlibBackend
import matplotlib.pyplot as plt
import pythoncom
import win32com.client
import requests
import json
import cloudmersive_convert_api_client
from cloudmersive_convert_api_client.rest import ApiException

# --- CONFIGURATION ---
# Get a free API key at https://account.cloudmersive.com/signup
CLOUDMERSIVE_API_KEY = "f5947ad6-0522-41b5-9e88-1092478de5bc" # Updated with user's key

def convert_cad_to_pdf(input_path: str, output_path: str):
    """
    Converts a CAD (.dwg, .dxf) file to a PDF file.
    Returns (True, "Success") or (False, "Error Message")
    """
    ext = os.path.splitext(input_path)[1].lower()
    last_error = "Unknown error"
    
    # --- STEP 1: AutoCAD COM (Requires AutoCAD) ---
    try:
        pythoncom.CoInitialize()
        abs_input = os.path.abspath(input_path)
        abs_output = os.path.abspath(output_path)
        
        try:
            print(f"DEBUG: Attempting AutoCAD COM Dispatch for {input_path}...")
            # Check if AutoCAD is registered before trying to dispatch
            try:
                # Try to get existing or create new AutoCAD instance
                try:
                    acad = win32com.client.GetActiveObject("AutoCAD.Application")
                except:
                    acad = win32com.client.Dispatch("AutoCAD.Application")
                    
                acad.Visible = False
                
                # Open the document
                doc = acad.Documents.Open(abs_input)
                
                # Setup Plot
                layout = doc.ActiveLayout
                layout.ConfigName = "DWG To PDF.pc3"
                
                # Plot
                doc.Plot.PlotToFile(abs_output)
                
                doc.Close(False)
                if os.path.exists(output_path):
                    return True, "Successfully converted using AutoCAD engine."
                else:
                    last_error = "Plot completed but PDF file was not created by AutoCAD."
            except Exception as dispatch_err:
                # This usually means AutoCAD is not installed or accessible
                last_error = f"AutoCAD software not detected on this server. {dispatch_err}"
                print(f"DEBUG: {last_error}")
        except Exception as com_err:
            last_error = f"AutoCAD COM Error: {com_err}"
            print(f"DEBUG: {last_error}")
    except Exception as e:
        last_error = f"COM Initialization Error: {e}"
    finally:
        try: pythoncom.CoUninitialize()
        except: pass

    # --- STEP 2: ezdxf Fallback (DXF only, no software needed) ---
    if ext == ".dxf":
        try:
            print("Using ezdxf fallback for DXF conversion...")
            doc = ezdxf.readfile(input_path)
            msp = doc.modelspace()
            
            fig = plt.figure()
            ax = fig.add_axes([0, 0, 1, 1])
            
            ctx = RenderContext(doc)
            out = MatplotlibBackend(ax)
            Frontend(ctx, out).draw_layout(msp, finalize=True)
            
            fig.savefig(output_path, format='pdf', bbox_inches='tight', pad_inches=0)
            plt.close(fig)
            
            if os.path.exists(output_path):
                return True, "Used ezdxf engine."
            else:
                return False, "ezdxf failed to save PDF."
        except Exception as e:
            msg = f"ezdxf Conversion Error: {e}"
            print(f"DEBUG: {msg}")
            try: plt.close(fig)
            except: pass
            return False, msg
            
    # --- STEP 3: Cloudmersive Fallback (Cloud API, no software needed) ---
    if ext == ".dwg" and last_error != "Success":
        try:
            print(f"Using Cloudmersive SDK for {ext} conversion...")
            # Configuration
            configuration = cloudmersive_convert_api_client.Configuration()
            configuration.api_key['Apikey'] = CLOUDMERSIVE_API_KEY
            
            # API Instance
            api_instance = cloudmersive_convert_api_client.ConvertDocumentApi(
                cloudmersive_convert_api_client.ApiClient(configuration)
            )
            
            # Convert
            with open(input_path, 'rb') as f:
                api_response = api_instance.convert_document_autodetect_to_pdf(f)
            
            # Save file
            if api_response:
                with open(output_path, 'wb') as out:
                    # The response is usually the binary data
                    out.write(api_response)
                if os.path.exists(output_path):
                    return True, "Successfully converted using Cloudmersive SDK."
            else:
                last_error = "Cloud API returned empty response."
        except ApiException as e:
            last_error = f"Cloud API Error: {e.reason if hasattr(e, 'reason') else e}"
            print(f"DEBUG: {last_error}")
        except Exception as e:
            last_error = f"Cloud API Integration Error: {e}"
            print(f"DEBUG: {last_error}")

    # --- FINAL FALLBACK (Clear Error for DWG) ---
    if ext == ".dwg":
        msg = f"DWG conversion failed. {last_error}"
        if "Apikey" in last_error or "401" in last_error:
            msg = "DWG conversion failed: Invalid or missing Cloud API key. Please update your CLOUDMERSIVE_API_KEY in cad_to_pdf.py."
        return False, msg

    return False, f"Could not convert {ext}. Error: {last_error}."
