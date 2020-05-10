import os
import numpy as np
import pytesseract
import cv2

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
img = BASE_DIR +"/img/plate.jpg"
img = np.array(img)
img = cv2.cvtColor(img, )