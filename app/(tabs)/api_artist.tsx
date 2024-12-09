import { Text, View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ApiScreen(){
    const API_URL = 'http://192.168.8.228:8000';
    const [artists, setArtists ] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getAllArtists = async () => {
        try {
            const response = await axios.get(`${API_URL}/artist/all`);
            setArtists(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllArtists();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}> Test </Text>
            <Text style={styles.title}> Liste des artistes </Text>
            {loading ? (
                <Text style={styles.text}>Chargement ...</Text>
            ) : (
                <View>
                    {artists.map((artist) => (
                        <View style={styles.artistContainer}>
                            <Text style={styles.text}>Name : {artist.name}</Text>
                            <Text style={styles.text}>Age : {artist.age} </Text>
                        </View>
                    ))}
                </View>
            )}
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
        padding: 5,
    },
    artistContainer: {
        marginBottom: 16,
        padding: 8,
        borderRadius: 4,
        backgroundColor: "#3b3b3b",
        width: "100%",
        alignItems: "center",
    },
    title: {
        color: "#fff",
        fontSize: 24,
        marginBottom: 16,
        textAlign: "center",
    },
});
