import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Animated, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  onSwap?: () => void;
  activeLanguage?: 'left' | 'right';
  onChange?: (language: 'left' | 'right') => void;
};

export default function LanguageToggle({ onSwap, activeLanguage = 'right', onChange }: Props) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(activeLanguage === 'right' ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: activeLanguage === 'left' ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [activeLanguage]);

  const swapLanguages = () => {
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    const newActive = activeLanguage === 'left' ? 'right' : 'left';
    if (onChange) onChange(newActive);
    if (onSwap) onSwap();
  };

  const handleLeftPress = () => {
    if (activeLanguage !== 'left' && onChange) {
      onChange('left');
    }
  };

  const handleRightPress = () => {
    if (activeLanguage !== 'right' && onChange) {
      onChange('right');
    }
  };

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  const backgroundLeft = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [5, 175] });

  const gradientColors: [string, string] = activeLanguage === 'left' ? ['#012f3c', '#047492'] : ['#047492', '#012f3c'];

  return (
    <View style={localStyles.languageSelector}>
      <View style={localStyles.contorno}>
        <Animated.View style={[localStyles.slidingBackground, { left: backgroundLeft }]}> 
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={gradientColors} style={localStyles.gradientFill} />
        </Animated.View>

        <TouchableOpacity style={localStyles.langButton} onPress={handleLeftPress}>
          <Text style={activeLanguage === 'left' ? localStyles.langTextActive : localStyles.langText}>Español</Text>
        </TouchableOpacity>

        <TouchableOpacity style={localStyles.swapButton} onPress={swapLanguages}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <MaterialIcons name="swap-horiz" size={24} color="black" />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity style={localStyles.langButton} onPress={handleRightPress}>
          <Text style={activeLanguage === 'right' ? localStyles.langTextActive : localStyles.langText}>Triqui</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  contorno: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F5F5F5',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 10,
    position: 'relative',
    overflow: 'visible',
    padding: 5,
  },
  slidingBackground: {
    position: 'absolute',
    width: 130,
    height: 44,
    borderRadius: 25,
    elevation: 15,
    top: 5,
    shadowColor: '#047492',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  gradientFill: { flex: 1, borderRadius: 25 },
  langButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    minWidth: 120,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    zIndex: 1,
  },
  langText: { fontSize: 16, color: '#333333', fontWeight: '500' },
  langTextActive: { fontSize: 16, color: '#FFFFFF', fontWeight: '600' },
  swapButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
});
