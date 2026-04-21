from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cv2
import numpy as np
import base64
import time
from filters import apply_filter

app = FastAPI(title="Image Filters Studio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Image Filters Studio API running"}

@app.get("/filters")
def list_filters():
    return {
        "filters": [
            {"id": "original",   "name": "Original",      "icon": "FiImage"},
            {"id": "grayscale",  "name": "Noir & Blanc",   "icon": "FiCircle"},
            {"id": "blur",       "name": "Flou Gaussien",  "icon": "FiDroplet"},
            {"id": "edges",      "name": "Contours",       "icon": "FiPenTool"},
            {"id": "sepia",      "name": "Sépia",          "icon": "FiSun"},
            {"id": "sharpen",    "name": "Netteté",        "icon": "FiZoomIn"},
            {"id": "emboss",     "name": "Emboss",         "icon": "FiLayers"},
            {"id": "cartoon",    "name": "Cartoon",        "icon": "FiFeather"},
            {"id": "invert",     "name": "Négatif",        "icon": "FiRefreshCw"},
            {"id": "warm",       "name": "Chaud",          "icon": "FiThermometer"},
            {"id": "cool",       "name": "Froid",          "icon": "FiWind"},
            {"id": "vignette",   "name": "Vignette",       "icon": "FiAperture"},
        ]
    }

@app.post("/apply-filter")
async def apply_filter_endpoint(
    file: UploadFile = File(...),
    filter_name: str = Form("grayscale")
):
    start = time.time()
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        return JSONResponse(status_code=400, content={"error": "Image invalide"})

    result = apply_filter(img, filter_name)
    _, buffer = cv2.imencode(".png", result)
    encoded = base64.b64encode(buffer).decode("utf-8")
    elapsed = round((time.time() - start) * 1000, 1)
    h, w = result.shape[:2]

    return {
        "image": encoded,
        "filter": filter_name,
        "processing_time_ms": elapsed,
        "width": w,
        "height": h,
    }