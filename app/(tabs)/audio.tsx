import {useEffect, useState} from 'react';
import {View, StyleSheet, Button, Alert, Pressable, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import React from "react";
import * as MediaLibrary from 'expo-media-library';
import Ionicons from "@expo/vector-icons/Ionicons";
import {AndroidAudioEncoder, AndroidOutputFormat, IOSOutputFormat} from "expo-av/build/Audio/RecordingConstants";
import axios from "axios";
import {Recording} from "expo-av/build/Audio/Recording";
import * as ImagePicker from "expo-image-picker";
import {Sound} from "expo-av/build/Audio/Sound";


export default function AudioScreen() {
    const [recording, setRecording] = useState<any>();
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [mediaPermissionResponse, mediaRequestPermission] = MediaLibrary.usePermissions();
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState<any>();
    const [hasMediaPermission, setHasMediaLibraryPermission] = useState(false);
    const [audioUri, setAudioUri ] = useState<string | null >(null);
    const [recordings, setRecordings] = useState<any[]>([])
    const [userQuestion, setUserQuestion] = useState<string>("");
    const [ollamaResponse, setOllamaResponse] = useState<string>("");
    const [meloAudioUri, setMeloAudioUri ] = useState<string | null>(null);

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hbGFrYXlhIiwiaWF0IjoxNzMzNTAxMzA1LCJleHAiOjE3MzM1MDQ5MDV9.YILj6L1PBQxaZA9BsFGX820o8jVGZfvIb6iqw9AjtSI";

    React.useEffect(()=>{
        (async ()=>{
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
            setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
        })();
    },[] );


    async function startRecording() {
        try {
            // @ts-ignore
            if (permissionResponse.status !== 'granted') {
                console.log('Requesting permission..');
                await requestPermission();
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync({
                isMeteringEnabled: true,
                android: {
                    ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
                    extension: '.wav',
                    // @ts-ignore
                    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_WAVE,
                    audioEncoder: AndroidAudioEncoder.DEFAULT,
                },
                ios: {
                    ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
                    extension: '.wav',
                    outputFormat: IOSOutputFormat.LINEARPCM,
                },
                web: {
                    mimeType: 'audio/wav',
                    bitsPerSecond: 128000,
                },
            });
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(undefined);

        await recording.stopAndUnloadAsync();

        await Audio.setAudioModeAsync(
            {
                allowsRecordingIOS: false,
            }
        );
        const uri = recording.getURI();

        let allRecordings = [...recordings];

        const { sound, status } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: false }
        );

        const userText = await sendAudioToApi(uri);
        console.log("dans stop",userText);
        setUserQuestion(userText);
        const AiResponse =  await sendQuestionToOllama(userText)
        setOllamaResponse(AiResponse);
        const coquiUri = await sendTextToMelo(AiResponse);

        // console.log(uri)

        allRecordings.push({
            sound: sound,
            // @ts-ignore
            duration: getDurationFormatted(status.durationMillis),
            file: uri,
            userText: userText,
            aiResponse: AiResponse,
            coquiUri: coquiUri,
        })
        // console.log(allRecordings)
        setRecordings(allRecordings);

        setAudioUri(uri);

        // if (hasMediaPermission){
        //     await MediaLibrary.saveToLibraryAsync(uri);
        //     console.log("Audio save into document")
        // } else {
        //     Alert.alert("Permission denied, Can't save the photo")
        // }

        // console.log('Recording stopped and stored at', uri);
    }

    // @ts-ignore
    async function sendAudioToApi(uri){
        console.log("API whisper")
        try {
            const formData = new FormData();

            // @ts-ignore
            formData.append('file', {
                uri: uri,
                name: 'recording.wav',
                type: 'audio/wav',
            });
            formData.append('model', 'base');
            formData.append('language', 'fr');
            formData.append('initial_prompt', 'string');

            const response = await axios.post('https://felix.esdlyon.dev/whisper/v1/transcriptions',formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },

            });
            const data = response.data;
            // console.log(data);
            return data.text;

        } catch (error) {
            console.error('Erreur :', error);
        }
    }

    async function sendQuestionToOllama(userText:string){
        try {

            console.log("API ollama")
            const response = await axios.post('https://felix.esdlyon.dev/ollama',
                {
                    prompt: userText,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                },

            });
            console.log(response.data)
            return response.data.message;


        } catch (error) {
            console.error("Error posting data:",error)
        }

    }

    // @ts-ignore
    function getDurationFormatted(milliseconds){
        const minutes = milliseconds / 1000 / 60;
        const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
        return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`;
    }

    async function sendTextToMelo(ollamaText: string){
        try {
            console.log("API COQUI")
            const response = await axios.get(`https://felix.esdlyon.dev/coqui/api/tts?text=${ollamaText}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });




            return response.data;

        } catch (error) {
            console.error("Erreur avec COQUI:", error)
        }
    }

    function getRecordingLines(){
        return recordings.map((recordingLine, index)=> {
            return (
                <View key={index} style={styles.messagesContainer}>
                    {audioUri && (
                        <View style={styles.messageContainer}>
                            <View>
                                <Text style={styles.textInfo}>Vous</Text>
                            </View>
                            <View style={styles.messageBody}>
                                <Text style={styles.audioText}>{ recordingLine.userText }</Text>
                            </View>
                            <View style={styles.playPause}>
                                <TouchableOpacity onPress={togglePlayPause}>
                                    <Ionicons
                                        name={isPlaying ? "pause-circle" : "play-circle"}
                                        size={30}
                                    />
                                </TouchableOpacity>
                                <Text style={
                                    {color: "rgba(41,41,41,0.5)",
                                    fontSize: 12,
                                    marginLeft: 3,
                                    }

                                }>{recordingLine.duration}</Text>
                            </View>
                        </View>
                    )}
                    {ollamaResponse ? (
                        <View style={styles.ollamaMessageContainer}>
                            <View>
                                <Text style={styles.textInfo}>Ollama</Text>
                            </View>
                            <View style={styles.ollamaMessageBody}>
                                <View>
                                    <Text style={styles.ollamaText}> {recordingLine.aiResponse}</Text>
                                </View>
                            </View>
                            <View style={styles.playPause}>
                                <TouchableOpacity onPress={togglePlayPause}>
                                    <Ionicons
                                        name={isPlaying ? "pause-circle" : "play-circle"}
                                        size={30}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View> ) : (
                            <View style={styles.none}>

                            </View>
                    )

                    }

                </View>
            )
        })
    }

    function clearRecordings(){
        setRecordings([])
    }

    async function togglePlayPause() {
        if (isPlaying) {
            await sound.stopAsync(); // Stopper la lecture
            setIsPlaying(false);
        } else {
            if (audioUri) {
                const { sound } = await Audio.Sound.createAsync(
                    { uri: audioUri },
                    { shouldPlay: true }
                );
                setSound(sound);
                setIsPlaying(true);
                await sound.playAsync();
            }
        }
    }

    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);


    // ################ CAMERA ######################

    const [image, setImage] = useState<string | null>(null);

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


    // ##################################################

    return (
        <View style={styles.container}>

            <ScrollView style={styles.scrollView}>
                {getRecordingLines()}
            </ScrollView>


            <View style={styles.recordingContainer}>
                <View style={styles.recordingElement}>
                    <View style={styles.bin}>
                        <TouchableOpacity  onPress={clearRecordings}>
                            <Ionicons
                                name={ 'trash-bin'}
                                size={30}
                                color={"#fff"}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.mic}>
                        <TouchableOpacity  onPress={recording ? stopRecording : startRecording}>
                            <Ionicons
                                name={recording ? 'stop-circle' : 'mic'}
                                size={30}
                                color={"#ff3333"}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bin}>
                        <TouchableOpacity  onPress={takePicture}>
                            <Ionicons
                                name={'camera'}
                                size={30}
                                color={"#fff"}
                            />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    none: {
        width: 0,
        height: 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        // justifyContent: 'flex-end',
    },
    scrollView: {
        height: "80%",
        backgroundColor: "#292f33",
    },
    messagesContainer: {
        flexDirection: "column",
        padding: 15,
        width: "100%",
    },
    textInfo: {
        color: "rgba(32,32,32,0.7)",
    },
    messageContainer: {
        backgroundColor: '#ffd33d',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        flexDirection: 'column',
        justifyContent: 'space-between',
        maxWidth: "80%",
        alignSelf: "flex-end",
    },
    messageBody: {
        flexDirection: "row",
        alignItems: "center",
    },
    ollamaMessageBody: {
        flexDirection: "row",
        alignItems: "center",
    },
    ollamaMessageContainer: {
        backgroundColor: '#c57cff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 0,
        flexDirection: 'column',
        maxWidth: "80%",
    },
    audioText: {
        fontSize: 16,
        marginRight: 10,
    },
    ollamaText: {
        fontSize: 16,
        marginLeft: 5,
        marginRight: 5,
    },
    playPause: {
        paddingTop: 4,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    recordingContainer: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "center",
        width: "100%",
        padding: 8,
        backgroundColor: "#25292e",
    },
    recordingElement:{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#292f33",
        borderRadius: 20,
    },
    mic: {
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,

    },
    bin: {
        alignSelf: "flex-end",
        padding: 10,
    }
});
