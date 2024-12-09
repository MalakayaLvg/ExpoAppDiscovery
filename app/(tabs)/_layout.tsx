import { Tabs, useRouter, useSegments } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "@/app/context/authContext";

export default function TabLayout() {
    return (
        <AuthProvider>
            <TabsWithAuth />
        </AuthProvider>
    );
}

function TabsWithAuth() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    const protectedRoutes = ["//(tabs)/profile", "//(tabs)/api_artist"];


    useEffect(() => {
        if (!loading && !isAuthenticated && protectedRoutes.includes(`/${segments.join("/")}`)) {
            router.replace("//(tabs)/login");
        }
    }, [isAuthenticated, loading, segments]);

    if (loading) {
        return null;
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#ffd33d",
                headerStyle: {
                    backgroundColor: "#25292e",
                },
                headerShadowVisible: false,
                headerTintColor: "#fff",
                tabBarStyle: {
                    backgroundColor: "#25292e",
                },
            }}
        >
            <Tabs.Screen
                name="login"
                options={{
                    title: "Login",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "log-in" : "log-in-outline"} color={color} size={24} />
                    ),
                }}
            />

            <Tabs.Screen
                name="audio"
                options={{
                    title: "Felix AI",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "mic-sharp" : "mic-outline"} color={color} size={24} />
                    ),
                }}
            />

            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "home-sharp" : "home-outline"} color={color} size={24} />
                    ),
                }}
            />


            <Tabs.Screen
                name="api_artist"
                options={{
                    title: "API",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "caret-forward-circle" : "caret-forward-circle-outline"}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "id-card" : "id-card-outline"} color={color} size={24} />
                    ),
                }}
            />
        </Tabs>
    );
}
