import { Image } from 'expo-image';
import { Platform, StatusBar, StyleSheet, View, TouchableOpacity, Animated, Text, Alert } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
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
import { useTranslation } from '@/hooks/use-translation';
import { useClipboard } from '@/hooks';

export default function TraductorScreen() {
  const { traducir, loading, error, verificarServicio } = useTranslation();
  const { copyToClipboard } = useClipboard();
  const [textoEntrada, setTextoEntrada] = useState('');
  const [textoSalida, setTextoSalida] = useState('');
  const [direccion, setDireccion] = useState<'español-triqui' | 'triqui-español'>('español-triqui');
  const [servicioActivo, setServicioActivo] = useState(true);

  useEffect(() => {
    // Verificar que el servicio esté activo al cargar
    verificarServicio().then(setServicioActivo);
  }, [verificarServicio]);

  const handleTraducir = async () => {
    if (!textoEntrada.trim()) {
      return;
    }

    const resultado = await traducir(textoEntrada, direccion);
    
    if (resultado) {
      setTextoSalida(resultado.textoTraducido);
    }
  };

  const intercambiarIdiomas = () => {
    setDireccion(prev => 
      prev === 'español-triqui' ? 'triqui-español' : 'español-triqui'
    );
    // Intercambiar también los textos
    const temp = textoEntrada;
    setTextoEntrada(textoSalida);
    setTextoSalida(temp);
  };

  const handleCopy = () => copyToClipboard(textoSalida);

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
          activeLanguage={direccion === 'español-triqui' ? 'left' : 'right'}
          onChange={(language) => setDireccion(language === 'left' ? 'español-triqui' : 'triqui-español')}
        />
        {/* Traductor */}
        <TranslationCards
          leftTitle={direccion === 'español-triqui' ? 'Español' : 'Triqui'}
          rightTitle={direccion === 'español-triqui' ? 'Triqui' : 'Español'}
          leftText={textoEntrada}
          rightText={textoSalida || 'Esperando.....'}
          onLeftTextChange={setTextoEntrada}
          onTranslatePress={handleTraducir}
          onCopyPress={handleCopy}
          onClearPress={() => { setTextoEntrada(''); setTextoSalida(''); }}
          isTranslating={loading}
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
