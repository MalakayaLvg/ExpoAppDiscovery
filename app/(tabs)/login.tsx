import {Button, StyleSheet, Text, View, TextInput, Image} from "react-native";
import React, {useEffect, useState} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {API_URL, useAuth} from "@/app/context/authContext";
import ImageViewer from "@/components/ImageViewer";
import axios from "axios/index";

const PlaceholderImage = require('@/assets/images/react-logo.png');

const Stack = createNativeStackNavigator()

const Login = ()=> {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin, onRegister } = useAuth();

    useEffect(() => {
        const testCall = async ()=> {
            const result = await axios.get(`${API_URL}/users`);
        }
        testCall();
    }, []);

    const login = async ()=> {
        const result = await onLogin!(email,password);
        if (result && result.error){
            alert(result.msg);
        }
    }

    const register = async ()=> {
        const result = await onRegister!(email, password);
        if (result && result.error) {
            alert(result.msg);
        } else {
            login();
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput style={styles.input} placeholder={"Email"} onChangeText={(text: string) => setEmail(text)} value={email}></TextInput>
                <TextInput style={styles.input} placeholder={"Password"} secureTextEntry={true} onChangeText={(text: string) => setPassword(text)} value={password}></TextInput>
                <Button onPress={login} title={"Sing in"}/>
                <Button onPress={register} title={"Create Account"}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    form: {
        gap: 10,
        width: "60%",
    },
    input: {
        height: 44,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff",
    },
    container: {
        alignItems: "center",
        width: "100%",
        paddingTop: "30%",
    }
});

export default Login;

