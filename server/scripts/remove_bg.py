import sys
import os

# Check if rembg is installed
try:
    from rembg import remove, new_session
    from PIL import Image
except ImportError:
    print("Error: The 'rembg' or 'Pillow' library is not installed. Please run 'pip install rembg pillow'")
    sys.exit(1)

# Initialize a session with the lighter model
session = new_session("u2net_small")

def process_image(input_path, output_path):
    try:
        # Open the image
        with open(input_path, 'rb') as i:
            input_data = i.read()
            output_data = remove(input_data, session=session)
            
            with open(output_path, 'wb') as o:
                o.write(output_data)
        
        print(f"Successfully removed background: {output_path}")
        return True
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python remove_bg.py <input_path> <output_path>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    if not os.path.exists(input_file):
        print(f"Error: Input file {input_file} does not exist.")
        sys.exit(1)
        
    success = process_image(input_file, output_file)
    if not success:
        sys.exit(1)
