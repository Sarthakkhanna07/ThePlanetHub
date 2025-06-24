from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoTokenizer
import torch
from PyPDF2 import PdfReader
import io
import joblib

app = FastAPI()

# Allow frontend requests (adjust for prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with ["https://yourfrontend.com"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load tokenizer and model once at startup
tokenizer = AutoTokenizer.from_pretrained("allenai/specter2_base")
model = joblib.load("best_model.joblib")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        reader = PdfReader(io.BytesIO(contents))

        # Extract text from all pages
        text = "\n".join(
            [page.extract_text() or "" for page in reader.pages]
        ).strip()

        if not text:
            return {"error": "Failed to extract any text from the PDF."}

        # Tokenize input
        inputs = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding="max_length",
            max_length=512
        )

        # Run model prediction
        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=1)
            predicted = torch.argmax(probs).item()
            confidence = probs[0][predicted].item()

        # Scoring logic
        base_score = 500
        if predicted == 1:  # Accepted
            final_score = round(base_score + (confidence * base_score))
        else:  # Rejected
            final_score = round(base_score - (confidence * base_score))

        return {
            "prediction": "Accepted" if predicted == 1 else "Rejected",
            "confidence": f"{confidence * 100:.2f}%",
            "adjusted_score": final_score
        }

    except Exception as e:
        return {"error": f"Failed to process PDF: {str(e)}"}
