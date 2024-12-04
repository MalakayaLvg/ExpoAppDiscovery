import React, { useState } from "react";
import { Button, Image, View, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

export default function CameraView() {
    const [image, setImage] = useState<string | null>(null);
    const [hasMediaPermission, setHasMediaLibraryPermission] = useState(false);

    React.useEffect(()=>{
        (async ()=>{
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
            setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
        })();
    },[] );

    const takePicture = async () => {

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImage(uri);

            if (hasMediaPermission){
                await MediaLibrary.saveToLibraryAsync(uri);
                Alert.alert("Photo save into gallery !")
            } else {
                Alert.alert("Permission denied, Can't save the photo")
            }

        }
    };

    return (
        <View style={styles.container}>
            <Button title="Take Picture" onPress={takePicture} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 20,
    },
});
