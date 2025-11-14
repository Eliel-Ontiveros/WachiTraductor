import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface FiltrosModalProps {
    visible: boolean;
    onClose: () => void;
    areaTematicaSeleccionada?: string;
    onAreaTematicaSeleccionada: (area?: string) => void;
    areasTematicas?: string[];
}

// Función utilitaria para convertir un identificador de área a un nombre legible
const humanizarArea = (area: string) => {
    if (!area) return '';
    return area
        .replace(/[_-]+/g, ' ')
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
};

const FiltrosModal: React.FC<FiltrosModalProps> = ({
    visible,
    onClose,
    areaTematicaSeleccionada,
    onAreaTematicaSeleccionada,
    areasTematicas,
}) => {
    const opciones = (areasTematicas && areasTematicas.length > 0)
        ? areasTematicas.map(a => ({ valor: a, nombre: humanizarArea(a) }))
        : [
            { valor: 'numeros', nombre: 'Números' },
            { valor: 'parentesco', nombre: 'Parentesco' },
            { valor: 'tiempo', nombre: 'Tiempo' }
        ];

    const handleSeleccionarFiltro = (area?: string) => {
        onAreaTematicaSeleccionada(area);
        onClose(); // Cerrar modal después de seleccionar
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <SafeAreaView style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Filtrar por categoría</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialIcons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Opción "Todas" */}
                        <TouchableOpacity
                            style={[
                                styles.optionButton,
                                !areaTematicaSeleccionada && styles.optionButtonSelected
                            ]}
                            onPress={() => handleSeleccionarFiltro(undefined)}
                        >
                            <View style={styles.optionContent}>
                                <View style={styles.optionTextContainer}>
                                    <Text style={[
                                        styles.optionText,
                                        !areaTematicaSeleccionada && styles.optionTextSelected
                                    ]}>
                                        Todas las categorías
                                    </Text>
                                    <Text style={styles.optionDescription}>
                                        Mostrar todas las entradas del diccionario
                                    </Text>
                                </View>
                                {!areaTematicaSeleccionada && (
                                    <MaterialIcons name="check-circle" size={24} color="#047492" />
                                )}
                            </View>
                        </TouchableOpacity>

                        {/* Opciones de área temática */}
                        {opciones.map((area) => (
                            <TouchableOpacity
                                key={area.valor}
                                style={[
                                    styles.optionButton,
                                    areaTematicaSeleccionada === area.valor && styles.optionButtonSelected
                                ]}
                                onPress={() => handleSeleccionarFiltro(area.valor)}
                            >
                                <View style={styles.optionContent}>
                                    <View style={styles.optionTextContainer}>
                                        <Text style={[
                                            styles.optionText,
                                            areaTematicaSeleccionada === area.valor && styles.optionTextSelected
                                        ]}>
                                            {area.nombre}
                                        </Text>
                                        <Text style={styles.optionDescription}>
                                            Filtrar por {area.nombre.toLowerCase()}
                                        </Text>
                                    </View>
                                    {areaTematicaSeleccionada === area.valor && (
                                        <MaterialIcons name="check-circle" size={24} color="#047492" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Footer con botón de aplicar */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.applyButton} onPress={onClose}>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                locations={[0, 0.9]}
                                colors={['#047492', '#012f3c']}
                                style={styles.applyButtonGradient}
                            >
                                <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        minHeight: '50%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0B3B5A',
    },
    closeButton: {
        padding: 4,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    optionButton: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        marginVertical: 6,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    optionButtonSelected: {
        backgroundColor: '#F0F9FF',
        borderColor: '#047492',
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    optionTextSelected: {
        color: '#047492',
    },
    optionDescription: {
        fontSize: 14,
        color: '#666',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    applyButton: {
        borderRadius: 25,
        overflow: 'hidden',
    },
    applyButtonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    applyButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default FiltrosModal;