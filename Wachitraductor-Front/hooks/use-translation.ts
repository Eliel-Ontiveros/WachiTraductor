import { useState } from 'react';
import { Alert } from 'react-native';


export function useTranslation() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const translate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Sin texto', 'Escribe algo para traducir');
      return;
    }

    setIsTranslating(true);
    setOutputText('Esperando...');

    setTimeout(() => {
      const mockTranslation = inputText.split('').reverse().join('');
      setOutputText(mockTranslation);
      setIsTranslating(false);
    }, 1500);
  };

  const clearTexts = () => {
    setInputText('');
    setOutputText('');
  };

  return {
    inputText,
    outputText,
    isTranslating,
    setInputText,
    setOutputText,
    translate,
    clearTexts,
  };
}
