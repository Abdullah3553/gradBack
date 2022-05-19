import face_recognition
import cv2
import numpy as np
import sys
import os

# args[1]
def main(args):
    # Load a sample picture and learn how to recognize it.
    known_image = face_recognition.load_image_file(args[1])
    known_face_encoding = face_recognition.face_encodings(known_image)[0]

    # Create arrays of known face encodings and their names
    known_face_encodings = [
        known_face_encoding,
    ]
    # known_face_names = [
    #     "Abdullah Mahmoud",
    # ]

    unknown_images = []
    for path in os.listdir(args[2]):
        # check if current path is a file
        if os.path.isfile(os.path.join(args[2], path)):
            unknown_images.append(face_recognition.load_image_file(os.path.join(args[2], path)))

    # Initialize some variables
    face_locations = []
    face_encodings = []
    # face_names = []

    for image in unknown_images:
        small_image = cv2.resize(image, (0, 0), fx=0.25, fy=0.25)
        rgb_small_image = small_image[:, :, ::-1]
        face_locations = face_recognition.face_locations(rgb_small_image)
        face_encodings = face_recognition.face_encodings(rgb_small_image, face_locations)

        for face_encoding in face_encodings:
            # See if the face is a match for the known face(s)
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)

            # # If a match was found in known_face_encodings, just use the first one.
            # if True in matches:
            #     first_match_index = matches.index(True)
            #     name = known_face_names[first_match_index]

            # Or instead, use the known face with the smallest distance to the new face
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                return True
    return False


if __name__ == '__main__':
    main(sys.argv)
