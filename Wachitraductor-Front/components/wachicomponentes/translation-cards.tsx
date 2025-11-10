import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  leftTitle?: string;
  rightTitle?: string;
  leftText?: string;
  rightText?: string;
  onLeftTextChange?: (text: string) => void;
  onMicPress?: () => void;
  onTranslatePress?: () => void;
  onCopyPress?: () => void;
  onFavPress?: () => void;
  isRecording?: boolean;
  isTranslating?: boolean;
  isMicDisabled?: boolean;
};

export default function TranslationCards({
  leftTitle = 'Español',
  rightTitle = 'Triqui',
  leftText = '',
  rightText = 'Esperando.....',
  onLeftTextChange,
  onMicPress,
  onTranslatePress,
  onCopyPress,
  isRecording = false,
  isTranslating = false,
  isMicDisabled = false,
}: Props) {
  return (
    <View style={localStyles.cardsContainer}>
      <View style={localStyles.card}>
        <View style={localStyles.cardHeader}>
          <Text style={localStyles.cardTitle}>{leftTitle}</Text>
          <MaterialIcons name="close" size={20} color="#333" />
        </View>
        <View style={localStyles.cardBody}>
          <TextInput
            style={localStyles.textInput}
            placeholder="Escribe aquí para traducir..."
            placeholderTextColor="#999"
            value={leftText}
            onChangeText={onLeftTextChange}
            multiline
            textAlignVertical="top"
          />
        </View>
        <View style={localStyles.cardFooter}>
          {/* Gradient only for mic button: gradient wrapper sized to button */}
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} locations={[0, 0.9]} colors={['#047492', '#012f3c']} style={isMicDisabled ? localStyles.micGradienteDisabled : localStyles.micGradiente}>
            <TouchableOpacity
              style={[localStyles.micButton, isRecording && localStyles.micButtonActive]}
              onPress={isMicDisabled ? undefined : onMicPress}
              disabled={isMicDisabled}
              activeOpacity={0.8}
            >
              <MaterialIcons name={isRecording ? 'stop' : 'mic'} size={20} color={isMicDisabled ? '#666' : '#fff'} />
            </TouchableOpacity>
          </LinearGradient>
            <TouchableOpacity 
                style={[localStyles.translateButton, isTranslating && localStyles.translateButtonDisabled]} 
                onPress={onTranslatePress}
                disabled={isTranslating}
            >
                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} locations={[0, 0.9]} colors={['#ff6600', '#bc4c01']} style={localStyles.gradiente}>
                    <Text style={localStyles.translateButtonText}>
                        {isTranslating ? 'Esperando...' : 'Traducir'}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
      </View>

      <View style={localStyles.card}>
        <View style={localStyles.cardHeader}>
          <Text style={localStyles.cardTitle}>{rightTitle}</Text>
        </View>
        <View style={localStyles.cardBody}>
          <Text style={localStyles.outputText}>{rightText}</Text>
        </View>
        <View style={[localStyles.cardFooter, { justifyContent: 'flex-end' }]}>
          <TouchableOpacity style={localStyles.footerIcon} onPress={onCopyPress}>
            <MaterialIcons name="content-copy" size={20} color="#047492" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  cardsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flex: 1,
  },
  gradiente: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flex: 1,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 10,
    position: 'relative',
    overflow: 'visible',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: '700',
    color: '#0B3B5A',
  },
  cardBody: {
    minHeight: 48,
    marginBottom: 12,
    flex: 1, //nota para quien vea esto si lo borras ocupa menos espacio xd
  },
  textInput: {
    fontSize: 14,
    color: '#333',
    minHeight: 48,
    flex: 1,//nota para quien vea esto si lo borras ocupa menos espacio xd
    textAlignVertical: 'top',
  },
  outputText: {
    fontSize: 14,
    color: '#333',
    minHeight: 48,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  micButton: {
    // size handled by gradient wrapper; keep centering and optional overrides
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonActive: {
    backgroundColor: '#FF5252',
  },
  micButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.5,
  },
  translateButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  micGradiente: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micGradienteDisabled: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  translateButtonDisabled: {
    opacity: 0.6,
  },
  translateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  footerIcon: {
    marginLeft: 12,
  },
});
