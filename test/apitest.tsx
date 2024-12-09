import React, { useState } from "react";
import { View, Button, Alert, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
const audioUri = "@/assets/sound/recording-test.wav"

export default function App() {
    const [fileUri, setFileUri] = useState<string | null>(null);

    const pickAudio = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "audio/*", // Filtrer uniquement les fichiers audio
            });

            console.log(result)
        } catch (error) {
            console.error("Erreur lors de la sélection du fichier", error);
            Alert.alert("Erreur", "Une erreur est survenue lors de la sélection du fichier.");
        }
    };


    const uploadFile = async () => {
        if (!fileUri) {
            Alert.alert("Erreur", "Veuillez sélectionner un fichier audio.");
            return;
        }

        try {
            const fileName = fileUri.split("/").pop();
            const file = await FileSystem.readAsStringAsync(audioUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const formData = new FormData();
            // @ts-ignore
            formData.append("file", {
                uri: audioUri,
                name: fileName,
                type: "audio/wav",
            });
            formData.append("model", "base");
            formData.append("language", "fr");
            formData.append("initial_prompt", "string");


            const response = await fetch("http://10.9.65.3:8000/v1/transcriptions", {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body: formData,
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                Alert.alert("Succès", "Fichier envoyé avec succès !");
            } else {
                const error = await response.json();
                Alert.alert("Erreur", error.message || "Une erreur s'est produite");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du fichier", error);
            Alert.alert("Erreur", "Une erreur s'est produite.");
        }
    };

    return (
        <View>
            <Button title={"UploadFile"} onPress={uploadFile} />
            <Button title={"pickAudio"} onPress={pickAudio} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 16,
    },
});
