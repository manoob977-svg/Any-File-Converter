import os
import ezdxf
import matplotlib.pyplot as plt
from services.cad_to_pdf import convert_cad_to_pdf

def create_sample_dxf(filename):
    """Creates a simple DXF file for testing."""
    doc = ezdxf.new('R2010')
    msp = doc.modelspace()
    msp.add_line((0, 0), (10, 0))
    msp.add_line((10, 0), (10, 10))
    msp.add_line((10, 10), (0, 10))
    msp.add_line((0, 10), (0, 0))
    msp.add_circle((5, 5), 3)
    doc.saveas(filename)
    print(f"Sample DXF created: {filename}")

if __name__ == "__main__":
    input_dxf = "test_sample.dxf"
    output_pdf = "test_sample.pdf"
    
    # Cleanup old files
    if os.path.exists(input_dxf): os.remove(input_dxf)
    if os.path.exists(output_pdf): os.remove(output_pdf)
    
    try:
        create_sample_dxf(input_dxf)
        print("Starting conversion...")
        success, message = convert_cad_to_pdf(input_dxf, output_pdf)
        
        if success:
            print(f"SUCCESS: {message}")
            if os.path.exists(output_pdf):
                print(f"PDF generated: {output_pdf} ({os.path.getsize(output_pdf)} bytes)")
            else:
                print("ERROR: Success reported but output file not found.")
        else:
            print(f"FAILED: {message}")
            
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
    finally:
        # Keep the files for inspection
        # if os.path.exists(input_dxf): os.remove(input_dxf)
        pass
