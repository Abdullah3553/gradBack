
import re
import serial
import serial.tools.list_ports
import random
import sys
import os
import cv2
import numpy
from enhance import image_enhance
from skimage.morphology import skeletonize, thin

baudRate =  57600
serialPort= 0
fileName= 0
WIDTH = 256
HEIGHT = 288
READ_LEN = int(WIDTH * HEIGHT / 2)

DEPTH = 8
HEADER_SZ = 54

portSettings = ['', 0]

# assemble bmp header for a grayscale image
def assembleHeader(width, height, depth, cTable=False):
    header = bytearray(HEADER_SZ)
    header[0:2] = b'BM'   # bmp signature
    byte_width = int((depth*width + 31) / 32) * 4
    if cTable:
        header[2:6] = ((byte_width * height) + (2**depth)*4 + HEADER_SZ).to_bytes(4, byteorder='little')  #file size
    else:
        header[2:6] = ((byte_width * height) + HEADER_SZ).to_bytes(4, byteorder='little')  #file size
    #header[6:10] = (0).to_bytes(4, byteorder='little')
    if cTable:
        header[10:14] = ((2**depth) * 4 + HEADER_SZ).to_bytes(4, byteorder='little') #offset
    else:
        header[10:14] = (HEADER_SZ).to_bytes(4, byteorder='little') #offset

    header[14:18] = (40).to_bytes(4, byteorder='little')    #file header size
    header[18:22] = width.to_bytes(4, byteorder='little') #width
    header[22:26] = (-height).to_bytes(4, byteorder='little', signed=True) #height
    header[26:28] = (1).to_bytes(2, byteorder='little') #no of planes
    header[28:30] = depth.to_bytes(2, byteorder='little') #depth
    header[34:38] = (byte_width * height).to_bytes(4, byteorder='little') #image size
    header[38:42] = (1).to_bytes(4, byteorder='little') #resolution
    header[42:46] = (1).to_bytes(4, byteorder='little')
    return header

def initSerialPort():
    ports = serial.tools.list_ports.comports()
    global serialPort
    for i in ports:
     if "arduino" in i.manufacturer:
       serialPort= i.device
    portSettings[0] = serialPort
    portSettings[1] = baudRate


def initFileName(id):
   rand1= random.randint(100, 999)
   rand2= random.randint(100, 999)
   global fileName
   fileName = str(rand1) + str(id) + str(rand2)
   


def getPrint(fileName):
    out = open("fingerprint/" +fileName+'.bmp', 'wb')
    # assemble and write the BMP header to the file
    out.write(assembleHeader(WIDTH, HEIGHT, DEPTH, True))
    for i in range(256):
        # write the colour palette
        out.write(i.to_bytes(1,byteorder='little') * 4)
    try:
        # open the port; timeout is 1 sec; also resets the arduino
        ser = serial.Serial(portSettings[0], portSettings[1], timeout=1)
    except Exception as e:
        out.close()
        return
    while ser.isOpen():
        try:
            # assumes everything recved at first is printable ascii
            curr = ser.read().decode()
            # based on the image_to_pc sketch, \t indicates start of the stream
            if curr != '\t':
                continue
            for i in range(READ_LEN): # start recving image
                byte = ser.read()
                # if we get nothing after the 1 sec timeout period
                if not byte:
                    out.close()  # close port and file
                    ser.close()
                    return False
                # make each nibble a high nibble
                out.write((byte[0] & 0xf0).to_bytes(1, byteorder='little'))
                out.write(((byte[0] & 0x0f) << 4).to_bytes(1, byteorder='little'))

            out.close()  # close file
            ser.read(100)
            ser.close()
        except Exception as e:
            out.close()
            ser.close()
            return False
        except KeyboardInterrupt:
            out.close()
            ser.close()
            return False

def removedot(invertThin):
    temp0 = numpy.array(invertThin[:])
    temp0 = numpy.array(temp0)
    temp1 = temp0/255
    temp2 = numpy.array(temp1)
    temp3 = numpy.array(temp2)

    enhanced_img = numpy.array(temp0)
    filter0 = numpy.zeros((10,10))
    W,H = temp0.shape[:2]
    filtersize = 6

    for i in range(W - filtersize):
        for j in range(H - filtersize):
            filter0 = temp1[i:i + filtersize,j:j + filtersize]

            flag = 0
            if sum(filter0[:,0]) == 0:
                flag +=1
            if sum(filter0[:,filtersize - 1]) == 0:
                flag +=1
            if sum(filter0[0,:]) == 0:
                flag +=1
            if sum(filter0[filtersize - 1,:]) == 0:
                flag +=1
            if flag > 3:
                temp2[i:i + filtersize, j:j + filtersize] = numpy.zeros((filtersize, filtersize))

    return temp2

def get_descriptors(img):
	clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
	img = clahe.apply(img)
	img = image_enhance.image_enhance(img)
	img = numpy.array(img, dtype=numpy.uint8)
	# Threshold
	ret, img = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)
	# Normalize to 0 and 1 range
	img[img == 255] = 1

	#Thinning
	skeleton = skeletonize(img)
	skeleton = numpy.array(skeleton, dtype=numpy.uint8)
	skeleton = removedot(skeleton)
	# Harris corners
	harris_corners = cv2.cornerHarris(img, 3, 3, 0.04)
	harris_normalized = cv2.normalize(harris_corners, 0, 255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_32FC1)
	threshold_harris = 125
	# Extract keypoints
	keypoints = []
	for x in range(0, harris_normalized.shape[0]):
		for y in range(0, harris_normalized.shape[1]):
			if harris_normalized[x][y] > threshold_harris:
				keypoints.append(cv2.KeyPoint(y, x, 1))
	# Define descriptor
	orb = cv2.ORB_create()
	# Compute descriptors
	_, des = orb.compute(img, keypoints)
	return (keypoints, des)

def matcher(img1_path, img2_path):
	img1 = cv2.imread(img1_path, cv2.IMREAD_GRAYSCALE)
	kp1, des1 = get_descriptors(img1)
	img2 = cv2.imread(img2_path, cv2.IMREAD_GRAYSCALE)
	kp2, des2 = get_descriptors(img2)

	# Matching between descriptors
	bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
	matches = sorted(bf.match(des1, des2), key= lambda match:match.distance)

	# Plot keypoints
	#img4 = cv2.drawKeypoints(img1, kp1, outImage=None)
	#img5 = cv2.drawKeypoints(img2, kp2, outImage=None)
	#f, axarr = plt.subplots(1,2)
	#axarr[0].imshow(img4)
	#axarr[1].imshow(img5)
	#plt.show()
	# Plot matches
	#img3 = cv2.drawMatches(img1, kp1, img2, kp2, matches, flags=2, outImg=None)
	#plt.imshow(img3)
	#plt.show()

	# Calculate score
	score = 0
	for match in matches:
		score += match.distance
	score_threshold = 33
	if score/len(matches) < score_threshold:
		return True
	else:
		return False
def main():
    initSerialPort()
    if sys.argv[1] == "register":
        initFileName(sys.argv[2])
        tempimg= "temp"+fileName
        getPrint(fileName)
        getPrint(tempimg)
        result= matcher("fingerprint/"+tempimg+".bmp", "fingerprint/"+fileName+".bmp")
        if result is True:
            os.remove("fingerprint/"+tempimg+".bmp")
            print("TRUE," + fileName)
        elif result is False:
            os.remove("fingerprint/"+tempimg+".bmp")
            os.remove("fingerprint/"+fileName+".bmp")
            print("FALSE,")
    else:
        str= sys.argv[2].removeprefix("fingerprint/").removesuffix(".bmp")
        tempimg= "temp"+ str
        getPrint(tempimg)
        result= matcher("fingerprint/"+tempimg+".bmp", "fingerprint/"+str+".bmp")
        if result is True:
            os.remove("fingerprint/"+tempimg+".bmp")
            print("TRUE,")
        elif result is False:
            os.remove("fingerprint/"+tempimg+".bmp")
            print("FALSE,")

if __name__ == "__main__":
	try:
		main()
	except:
		raise
