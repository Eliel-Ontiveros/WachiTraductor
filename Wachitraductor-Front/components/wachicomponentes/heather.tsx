import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
const Wachiheather = () => {
    return (
        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} locations={[0,0.6]} colors={['#047492', '#012f3c']} style={styles.header}>
            <ThemedText style={styles.appName}>WachiTraductor</ThemedText>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10,},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 10,
    position: 'relative',
    overflow: 'visible',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 15 : 15,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default Wachiheather;