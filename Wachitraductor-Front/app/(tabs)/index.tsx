import { Image } from 'expo-image';
import { Platform, StatusBar, StyleSheet, View, TouchableOpacity, Animated, Text, Alert } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import Wachiheather from '@/components/wachicomponentes/heather';
import LanguageToggle from '@/components/wachicomponentes/lenguaje';
import TranslationCards from '@/components/wachicomponentes/translation-cards';
import BottomNavBar from '@/components/wachicomponentes/bottom-nav';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation, useVoiceRecording, useClipboard } from '@/hooks';

export default function HomeScreen() {
  const { inputText, outputText, isTranslating, setInputText, translate } = useTranslation();
  const { isRecording, toggleRecording } = useVoiceRecording();
  const { copyToClipboard } = useClipboard();
  const [selectedLanguage, setSelectedLanguage] = useState<'left' | 'right'>('left'); 
  
  const handleCopy = () => copyToClipboard(outputText);
  
  const handleTabPress = (tab: 'diccionario' | 'home' | 'cultura') => {
    if (tab === 'diccionario') {
      router.push('/(tabs)/Diccionario');
    } else if (tab === 'cultura') {
      router.push('/(tabs)/Cultura');
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <Wachiheather />
        {/* Selector de idiomas personalizado (componente) */}
        <LanguageToggle 
          activeLanguage={selectedLanguage}
          onChange={setSelectedLanguage}
        />
        {/* Traductor */}
        <TranslationCards 
          leftTitle={selectedLanguage === 'left' ? 'Español' : 'Triqui'}
          rightTitle={selectedLanguage === 'left' ? 'Triqui' : 'Español'}
          leftText={inputText}
          rightText={outputText || 'Esperando.....'}
          onLeftTextChange={setInputText}
          onMicPress={toggleRecording}
          onTranslatePress={translate}
          onCopyPress={handleCopy}
          isRecording={isRecording}
          isTranslating={isTranslating}
          isMicDisabled={selectedLanguage === 'right'} 
        />
        <BottomNavBar activeTab="home" onTabPress={handleTabPress} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 110, // Reserve space for absolute bottom nav (nav height ~80-90px)
  },
});
