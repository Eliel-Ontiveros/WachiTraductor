import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

interface FiltrosDiccionarioProps {
    areaTematicaSeleccionada?: string;
    onAreaTematicaSeleccionada: (area?: string) => void;
}

// Áreas temáticas que están actualmente en uso en el diccionario JSON
const areasTematicas = [
    { valor: 'numeros', nombre: 'Números' },
    { valor: 'parentesco', nombre: 'Parentesco' },
    { valor: 'tiempo', nombre: 'Tiempo' }
];

const FiltrosDiccionario: React.FC<FiltrosDiccionarioProps> = ({
    areaTematicaSeleccionada,
    onAreaTematicaSeleccionada,
}) => {
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

                {areasTematicas.map((area) => (
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