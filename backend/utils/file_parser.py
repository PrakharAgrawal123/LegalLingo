import io
import pypdf
import docx

def extract_text_from_file(file_stream, filename):
    """
    Extracts plain text content from a file-like object based on the filename extension.
    Supports PDF, DOCX, TXT, and MD.
    """
    if not file_stream or not filename:
        return ""
        
    ext = filename.split(".")[-1].lower()
    
    try:
        # Read file contents into an in-memory byte buffer to prevent seek/read stream conflicts
        file_bytes = file_stream.read()
        if not file_bytes:
            return ""
            
        byte_stream = io.BytesIO(file_bytes)
        
        if ext == "pdf":
            reader = pypdf.PdfReader(byte_stream)
            text_parts = []
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
            return "\n".join(text_parts)
            
        elif ext == "docx":
            doc = docx.Document(byte_stream)
            text_parts = []
            for paragraph in doc.paragraphs:
                if paragraph.text:
                    text_parts.append(paragraph.text)
            return "\n".join(text_parts)
            
        elif ext in ["txt", "md"]:
            return file_bytes.decode("utf-8", errors="ignore")
            
        else:
            # Fallback or unsupported extension
            return ""
            
    except Exception as e:
        print(f"[File Parser Error] Failed to extract text from {filename}: {str(e)}")
        # Raise parsing specific errors to bubbled up to API response
        raise RuntimeError(f"Failed to read file content: {str(e)}")
