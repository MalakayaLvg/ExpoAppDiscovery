import * as MediaLibrary from 'expo-media-library';
import { Text, View , StyleSheet, Platform } from "react-native";
import { Link } from 'expo-router';
import React from "react";


import ImageViewer from "@/components/ImageViewer";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import CircleButton from "@/components/circleButton";
import EmojiPicker from "@/components/EmojiPicker";
import EmojiList from "@/components/EmojiList";
import EmojiSticker from "@/components/EmojiSticker";

import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from 'react';
import { captureRef } from 'react-native-view-shot';
import { type ImageSource } from "expo-image";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {platform} from "node:os";

const PlaceholderImage = require('@/assets/images/background.jpg');

export default function Index() {

  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible ] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<ImageSource | undefined>(undefined);
  const [ status, requestPermission ] = MediaLibrary.usePermissions();
  const imageRef = useRef<View>(null);

  if (status === null ){
      requestPermission();
  }

  const pickImageAsync = async ()=>{
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ['images'],
         allowsEditing: true,
         quality: 1,
      });
      if (!result.canceled){
          setSelectedImage(result.assets[0].uri);
          setShowAppOptions(true);
      } else {
          alert('You did not select image.');
      }
  };

  const onReset = ()=>{
      setShowAppOptions(false);
  };
  const onAddSticker = ()=>{
    setIsModalVisible(true);
  };
  const onModalClose = ()=>{
      setIsModalVisible(false);
  }
  const onSaveImageAsync = async ()=>{
        try {
            const localUri = await captureRef(imageRef, {
                height: 400,
                quality: 1,
            });
            await MediaLibrary.saveToLibraryAsync(localUri);
            if (localUri) {
                alert('Saved!');
            }
        } catch (e) {
            console.log(e);
        }
  };

  return (
  <GestureHandlerRootView style={styles.container}>
    <View style={styles.container}>
        <Text style={styles.text}>Home Screen</Text>
        <Link href="/about" style={styles.button}>
            Go to About Screen
        </Link>
        <View style={styles.imageContainer}>
            <View ref={imageRef} collapsable={false}>
                <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
                {pickedEmoji &&  <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
            </View>
        </View>
        {showAppOptions ? (
            <View style={styles.optionsContainer}>
                <View style={styles.optionsRow}>
                    <IconButton icon="refresh" label="Reset" onPress={onReset} />
                    <CircleButton onPress={onAddSticker} />
                    <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
                </View>
            </View>
        ) : (
        <View style={styles.footerContainer}>
            <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
            <Button label="Use this photo" />
        </View>
        )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
            <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        </EmojiPicker>
    </View>
  </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
    },
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: '#fff',
    },
    imageContainer: {
        flex: 1,
    },
    image: {
        width: 320,
        height: 440,
        borderRadius: 18,
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: 'center',
    },
    optionsContainer: {
        position: 'absolute',
        bottom: 80,
    },
    optionsRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
})
