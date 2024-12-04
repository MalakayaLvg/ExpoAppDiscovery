// import React, { useEffect, useRef, useState } from "react";
// import { StyleSheet, View, Button, Text } from "react-native";
// import { Camera } from "expo-camera";
// import * as MediaLibrary from "expo-media-library";
// import type { CameraType } from "expo-camera";
//
// export default function CameraView() {
//     const cameraRef = useRef<CameraType>(null);
//     const [hasCameraPermission, setHasCameraPermission] = useState(false);
//     const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);
//     const [photoUri, setPhotoUri] = useState(null);
//
//     useEffect(() => {
//         (async () => {
//             const cameraPermission = await Camera.requestCameraPermissionsAsync();
//             const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
//             setHasCameraPermission(cameraPermission.status === "granted");
//             setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
//         })();
//     }, []);
//
//     const takePicture = async () => {
//         if (cameraRef.current) {
//             const photo = await cameraRef.current.takePictureAsync();
//             setPhotoUri(photo.uri);
//
//             if (hasMediaLibraryPermission) {
//                 await MediaLibrary.saveToLibraryAsync(photo.uri);
//                 alert("Photo saved to gallery!");
//             }
//         }
//     };
//
//     if (!hasCameraPermission) {
//         return <Text>Permission for camera not granted. Please enable it in settings.</Text>;
//     }
//
//     return (
//         <View style={styles.container}>
//             <Camera style={styles.camera} ref={cameraRef}>
//                 <View style={styles.buttonContainer}>
//                     <Button title="Take Picture" onPress={takePicture} />
//                 </View>
//             </Camera>
//             {photoUri && (
//                 <View style={styles.previewContainer}>
//                     <Text style={styles.text}>Photo Preview:</Text>
//                     <Text style={styles.text}>{photoUri}</Text>
//                 </View>
//             )}
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     camera: {
//         flex: 1,
//     },
//     buttonContainer: {
//         backgroundColor: "#000",
//         alignSelf: "center",
//         marginBottom: 20,
//         padding: 10,
//         borderRadius: 5,
//     },
//     text: {
//         color: "#fff",
//         textAlign: "center",
//     },
//     previewContainer: {
//         padding: 10,
//         alignItems: "center",
//     },
// });
