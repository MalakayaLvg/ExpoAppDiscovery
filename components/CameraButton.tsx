import React from "react";
import { View, Button, StyleSheet } from "react-native";


type Props = {
    onPress: () => void;
};

export default function CameraButton({ onPress }: Props){
    return(
        <View style={styles.buttonContainer}>
            <Button title={"Take Picture"} onPress={onPress}/>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: "#000",
        alignSelf: "center",
        marginBottom: 20,
        padding: 10,
        borderRadius: 5,
    },
});