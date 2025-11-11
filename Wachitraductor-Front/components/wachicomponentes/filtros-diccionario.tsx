import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

interface FiltrosDiccionarioProps {
    areaTematicaSeleccionada?: string;
    onAreaTematicaSeleccionada: (area?: string) => void;
    // Lista dinámica de áreas temáticas provista por el padre (por ejemplo: ['numeros','parentesco'])
    areasTematicas?: string[];
}

// Función utilitaria para convertir un identificador de área a un nombre legible
const humanizarArea = (area: string) => {
    if (!area) return '';
    // Reemplazar guiones/guiones bajos por espacios y capitalizar cada palabra
    return area
        .replace(/[_-]+/g, ' ')
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
};

const FiltrosDiccionario: React.FC<FiltrosDiccionarioProps> = ({
    areaTematicaSeleccionada,
    onAreaTematicaSeleccionada,
    areasTematicas,
}) => {
    // Construir el array de áreas en forma { valor, nombre } usando el prop dinámico si existe
    const opciones = (areasTematicas && areasTematicas.length > 0)
        ? areasTematicas.map(a => ({ valor: a, nombre: humanizarArea(a) }))
        : [
            { valor: 'numeros', nombre: 'Números' },
            { valor: 'parentesco', nombre: 'Parentesco' },
            { valor: 'tiempo', nombre: 'Tiempo' }
        ];
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
                        !areaTematicaSeleccionada && styles.filtroButtonActive
                    ]}
                    onPress={() => onAreaTematicaSeleccionada(undefined)}
                >
                    <Text style={[
                        styles.filtroText,
                        !areaTematicaSeleccionada && styles.filtroTextActive
                    ]}>
                        Todas
                    </Text>
                </TouchableOpacity>

                {opciones.map((area) => (
                    <TouchableOpacity
                        key={area.valor}
                        style={[
                            styles.filtroButton,
                            areaTematicaSeleccionada === area.valor && styles.filtroButtonActive
                        ]}
                        onPress={() => onAreaTematicaSeleccionada(area.valor)}
                    >
                        <Text style={[
                            styles.filtroText,
                            areaTematicaSeleccionada === area.valor && styles.filtroTextActive
                        ]}>
                            {area.nombre}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

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
        backgroundColor: '#047492',
        borderColor: '#047492',
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

export default FiltrosDiccionario;