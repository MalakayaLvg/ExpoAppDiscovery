import { Tabs } from 'expo-router';
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {AuthProvider, useAuth} from "@/app/context/authContext";
import {Button} from "react-native";

export default function TabLayout() {
    const { authState, onLogout } = useAuth();
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: "#ffd33d",
            headerStyle: {
                backgroundColor: "#25292e",
            },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            tabBarStyle: {
                backgroundColor: '#25292e'
            },
        }}>

            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon : ({ color, focused }) => (
                        <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
                    )
                    }}
            />
            {/*{authState?.authenticated ?*/}
                <Tabs.Screen
                name="cameratest"
                options={{
                    title: 'Camera',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'camera' : 'camera-outline'} color={color} size={24}/>
                    )

                }}
            />
            {/*:*/}
            <Tabs.Screen
                name="login"
                options={{
                    title: 'Login',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'log-in' : 'log-in-outline'} color={color} size={24}/>
                    ),
                    headerRight: ()=> <Button onPress={onLogout} title={"Sign Out"}/>,
                }}
            />
            {/*}*/}
            {/*<Tabs.Screen*/}
            {/*    name="about"*/}
            {/*    options={{*/}
            {/*        title: 'About',*/}
            {/*        tabBarIcon: ({ color, focused }) => (*/}
            {/*            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>*/}
            {/*        )*/}

            {/*    }}*/}
            {/*/>*/}




        </Tabs>
    );
}
