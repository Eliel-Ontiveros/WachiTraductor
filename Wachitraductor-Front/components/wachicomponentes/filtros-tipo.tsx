import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ConfiguracionTipo } from '@/services/cultura.types';

interface FiltrosTipoProps {
    tipos?: string[];
    configuracionTipos?: { [key: string]: ConfiguracionTipo };
    tipoSeleccionado?: string;
    onTipoSeleccionado: (tipo?: string) => void;
}

const formatearTipoBasico = (tipo: string): string => {
    // Formateo básico si no hay configuración del servidor
    return tipo
        .split('-')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
};

export default function FiltrosTipo({
    tipos = [],
    configuracionTipos,
    tipoSeleccionado,
    onTipoSeleccionado
}: FiltrosTipoProps) {

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <TouchableOpacity
                    style={[
                        styles.filtroButton,
                        !tipoSeleccionado && styles.filtroButtonActive
                    ]}
                    onPress={() => onTipoSeleccionado(undefined)}
                >
                    <Text style={[
                        styles.filtroText,
                        !tipoSeleccionado && styles.filtroTextActive
                    ]}>
                        Todos
                    </Text>
                </TouchableOpacity>

                {tipos.map((tipo) => {
                    const tipoInfo = configuracionTipos?.[tipo];
                    const nombreTipo = tipoInfo?.nombre || formatearTipoBasico(tipo);

                    return (
                        <TouchableOpacity
                            key={tipo}
                            style={[
                                styles.filtroButton,
                                tipoSeleccionado === tipo && styles.filtroButtonActive
                            ]}
                            onPress={() => onTipoSeleccionado(tipo)}
                        >
                            <Text style={[
                                styles.filtroText,
                                tipoSeleccionado === tipo && styles.filtroTextActive
                            ]}>
                                {nombreTipo}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filtroButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    filtroButtonActive: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    filtroText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    filtroTextActive: {
        color: '#FFFFFF',
    },
});