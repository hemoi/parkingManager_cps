import os
import numpy as np
import pytesseract
import cv2

def plateProcessor(img):

    # read image
    img = cv2.imread(img, cv2.IMREAD_GRAYSCALE)

    # remove noise
    img = cv2.GaussianBlur(img,(3,3),0)

    return img


def plateRecongizer(img):
    plateInformation = pytesseract.image_to_string(img, lang='Hangul')

    return plateInformation



if __name__ == "__main__":
    # BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    # imgPath = BASE_DIR +"/img/"
    # imgName = imgPath + "plate.jpg"
    # print(imgName)
    imgName = '/home/hemoi/workspace/parkingManager_cps/src/parking/plate.jpg'
    img = plateProcessor(imgName)

    plateNum = plateRecongizer(img)
    print(plateNum)