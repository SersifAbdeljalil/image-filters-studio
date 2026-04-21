import cv2
import numpy as np

def apply_filter(img: np.ndarray, filter_name: str) -> np.ndarray:
    if filter_name == "original":
        return img

    if filter_name == "grayscale":
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        return cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

    if filter_name == "blur":
        return cv2.GaussianBlur(img, (25, 25), 0)

    if filter_name == "edges":
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 80, 160)
        return cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)

    if filter_name == "sepia":
        kernel = np.array([
            [0.272, 0.534, 0.131],
            [0.349, 0.686, 0.168],
            [0.393, 0.769, 0.189]
        ])
        sepia = cv2.transform(img, kernel)
        return np.clip(sepia, 0, 255).astype(np.uint8)

    if filter_name == "sharpen":
        kernel = np.array([
            [ 0, -1,  0],
            [-1,  5, -1],
            [ 0, -1,  0]
        ])
        return cv2.filter2D(img, -1, kernel)

    if filter_name == "emboss":
        kernel = np.array([
            [-2, -1,  0],
            [-1,  1,  1],
            [ 0,  1,  2]
        ])
        emboss = cv2.filter2D(img, -1, kernel) + 128
        return np.clip(emboss, 0, 255).astype(np.uint8)

    if filter_name == "cartoon":
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur = cv2.medianBlur(gray, 5)
        edges = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 9)
        color = cv2.bilateralFilter(img, 9, 300, 300)
        edges_bgr = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
        return cv2.bitwise_and(color, edges_bgr)

    if filter_name == "invert":
        return cv2.bitwise_not(img)

    if filter_name == "warm":
        b, g, r = cv2.split(img)
        r = np.clip(r.astype(np.int32) + 30, 0, 255).astype(np.uint8)
        b = np.clip(b.astype(np.int32) - 20, 0, 255).astype(np.uint8)
        return cv2.merge([b, g, r])

    if filter_name == "cool":
        b, g, r = cv2.split(img)
        b = np.clip(b.astype(np.int32) + 30, 0, 255).astype(np.uint8)
        r = np.clip(r.astype(np.int32) - 20, 0, 255).astype(np.uint8)
        return cv2.merge([b, g, r])

    if filter_name == "vignette":
        rows, cols = img.shape[:2]
        X = cv2.getGaussianKernel(cols, cols * 0.5)
        Y = cv2.getGaussianKernel(rows, rows * 0.5)
        mask = Y * X.T
        mask = mask / mask.max()
        result = img.copy().astype(np.float64)
        for i in range(3):
            result[:, :, i] *= mask
        return result.astype(np.uint8)

    return img


def upscale_4k(img: np.ndarray) -> np.ndarray:
    target_w, target_h = 3840, 2160
    h, w = img.shape[:2]
    ratio = min(target_w / w, target_h / h)
    if ratio <= 1.0:
        return img
    new_w = int(w * ratio)
    new_h = int(h * ratio)
    return cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)