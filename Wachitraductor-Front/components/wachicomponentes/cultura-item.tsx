import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { InformacionCultural, ConfiguracionTipo } from '@/services/cultura.types';

interface CulturaItemProps {
    item: InformacionCultural;
    configuracionTipos?: { [key: string]: ConfiguracionTipo };
    onPress?: (item: InformacionCultural) => void;
}

const getColorPorDefecto = (tipo: string): string => {
    // Función hash simple para generar color consistente basado en el tipo
    let hash = 0;
    for (let i = 0; i < tipo.length; i++) {
        const char = tipo.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convertir a entero de 32 bits
    }

    const colores = [
        '#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94',
        '#D4A4EB', '#95E1D3', '#F8E8A6', '#C7CEEA', '#FFAAA5',
        '#FFA726', '#66BB6A', '#42A5F5', '#AB47BC', '#FF7043'
    ];

    return colores[Math.abs(hash) % colores.length];
};

const formatearTipoBasico = (tipo: string): string => {
    // Formateo básico si no hay configuración del servidor
    return tipo
        .split('-')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
};

export default function CulturaItem({ item, configuracionTipos, onPress }: CulturaItemProps) {
    // Usar configuración del servidor si está disponible, sino usar valores por defecto
    const tipoInfo = configuracionTipos?.[item.tipo];
    const colorTipo = tipoInfo?.color || getColorPorDefecto(item.tipo);
    const nombreTipo = tipoInfo?.nombre || formatearTipoBasico(item.tipo);
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress?.(item)}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={[styles.tipoBadge, { backgroundColor: colorTipo }]}>
                    <Text style={styles.tipoText}>{nombreTipo}</Text>
                </View>
            </View>

            <Text style={styles.titulo}>{item.titulo}</Text>

            <Text style={styles.descripcion} numberOfLines={3}>
                {item.descripcion}
            </Text>

            <View style={styles.footer}>
                <Text style={styles.region}>{item.region}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    tipoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
    },
    tipoText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    titulo: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C2C2C',
        marginBottom: 8,
        lineHeight: 22,
    },
    descripcion: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    region: {
        fontSize: 12,
        color: '#999',
    },
    leerMas: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '600',
    },
});