import os
import time
import asyncio

async def cleanup_file(file_path: str, delay: int = 600):
    """
    Deletes a file after a specified delay in seconds.
    Default delay: 10 minutes (600 seconds).
    """
    if delay > 0:
        await asyncio.sleep(delay)
    
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Cleanup: Successfully removed {file_path}")
    except Exception as e:
        print(f"Cleanup Error: {e}")

def get_temp_path(filename: str) -> str:
    return os.path.join("temp", filename)
