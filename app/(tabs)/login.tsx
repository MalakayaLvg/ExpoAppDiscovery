import {Button, StyleSheet, Text, View, TextInput, Image} from "react-native";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { useRouter,router } from "expo-router";
import {useAuth} from "@/app/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PlaceholderImage = require('@/assets/images/react-logo.png');


export default function LoginView({navigation}:any){

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { setToken } = useAuth();


    const API_URL = "https://felix.esdlyon.dev";

    const handleLogin = async ()=> {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
            if (response.status === 200) {
                const {token} = response.data;
                setToken(token);
                // alert(`connection reussi, token ${token}`)

                const storeToken = async (token: string) => {
                    try {
                        await AsyncStorage.setItem('userToken', token);
                    } catch (error) {
                        console.error("Erreur de stockage du token", error);
                    }
                };

                router.replace("/(tabs)");
            } else {
                alert("Erreur: verifier vous indentifiant");
            }
        } catch (error) {
            console.log("Erreur lors de la connection :", error);
            alert("Impossible de se connecter :(");
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text>CONNEXION </Text>
                <Text style={styles.text}>Username</Text>
                <TextInput style={styles.input} placeholder={"Username"} onChangeText={setUsername} value={username}></TextInput>
                <Text style={styles.text}>Password</Text>
                <TextInput style={styles.input} placeholder={"Password"} secureTextEntry={true} onChangeText={setPassword} value={password}></TextInput>
                <Button title={loading ? "Connexion..." : "Se connecter"} onPress={handleLogin} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    form: {
        gap: 10,
        width: "60%",
    },
    text: {
        color: '#fff',
        padding: 5,
    },
    input: {
        height: 44,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
});


