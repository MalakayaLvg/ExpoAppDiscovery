import {Text, View, StyleSheet, Pressable} from "react-native";
import React from "react";
import Button from "@/components/Button";
import { useAuth } from "@/app/context/authContext";

export default function ProfileScreen(){
    const { logout, isAuthenticated, userToken } = useAuth();
    return (
        <View style={styles.container}>
            <Text style={styles.text}> Profile </Text>
            <Button label={"Logout"} onPress={logout}>

            </Button>
            <Text style={styles.text}>
                {isAuthenticated
                    ? "Vous êtes connecté."
                    : "Vous n'êtes pas connecté."}
            </Text>
            <Text style={styles.text}>
                {userToken ? userToken:
                    "no token"
                }
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
});
