import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface EstadisticasTraduccionProps {
    onPress: () => void;
}

export default function EstadisticasTraduccion({ onPress }: EstadisticasTraduccionProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.content}>
                <MaterialIcons name="info" size={20} color="#6366f1" />
                <Text style={styles.text}>Ver estadísticas de traducción</Text>
                <MaterialIcons name="keyboard-arrow-right" size={20} color="#6366f1" />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 12,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: '#475569',
        fontWeight: '500',
    },
});