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
import { ConfiguracionTipo } from '@/services/cultura.types';

interface CulturaFiltrosModalProps {
    visible: boolean;
    onClose: () => void;
    tipoSeleccionado?: string;
    onTipoSeleccionado: (tipo?: string) => void;
    tipos?: string[];
    configuracionTipos?: { [key: string]: ConfiguracionTipo };
}

// Función utilitaria para formatear el nombre del tipo
const formatearTipoBasico = (tipo: string): string => {
    return tipo
        .split('-')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
};

const CulturaFiltrosModal: React.FC<CulturaFiltrosModalProps> = ({
    visible,
    onClose,
    tipoSeleccionado,
    onTipoSeleccionado,
    tipos = [],
    configuracionTipos,
}) => {
    const opciones = tipos.map(tipo => {
        const tipoInfo = configuracionTipos?.[tipo];
        return {
            valor: tipo,
            nombre: tipoInfo?.nombre || formatearTipoBasico(tipo),
            descripcion: `Información sobre ${(tipoInfo?.nombre || formatearTipoBasico(tipo)).toLowerCase()}`
        };
    });

    const handleSeleccionarFiltro = (tipo?: string) => {
        onTipoSeleccionado(tipo);
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
                        <Text style={styles.headerTitle}>Filtrar por tipo</Text>
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
                                !tipoSeleccionado && styles.optionButtonSelected
                            ]}
                            onPress={() => handleSeleccionarFiltro(undefined)}
                        >
                            <View style={styles.optionContent}>
                                <View style={styles.optionTextContainer}>
                                    <Text style={[
                                        styles.optionText,
                                        !tipoSeleccionado && styles.optionTextSelected
                                    ]}>
                                        Todos los tipos
                                    </Text>
                                    <Text style={styles.optionDescription}>
                                        Mostrar toda la información cultural
                                    </Text>
                                </View>
                                {!tipoSeleccionado && (
                                    <MaterialIcons name="check-circle" size={24} color="#007AFF" />
                                )}
                            </View>
                        </TouchableOpacity>

                        {/* Opciones de tipos */}
                        {opciones.map((tipo) => (
                            <TouchableOpacity
                                key={tipo.valor}
                                style={[
                                    styles.optionButton,
                                    tipoSeleccionado === tipo.valor && styles.optionButtonSelected
                                ]}
                                onPress={() => handleSeleccionarFiltro(tipo.valor)}
                            >
                                <View style={styles.optionContent}>
                                    <View style={styles.optionTextContainer}>
                                        <Text style={[
                                            styles.optionText,
                                            tipoSeleccionado === tipo.valor && styles.optionTextSelected
                                        ]}>
                                            {tipo.nombre}
                                        </Text>
                                        <Text style={styles.optionDescription}>
                                            {tipo.descripcion}
                                        </Text>
                                    </View>
                                    {tipoSeleccionado === tipo.valor && (
                                        <MaterialIcons name="check-circle" size={24} color="#007AFF" />
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
                                colors={['#007AFF', '#0056CC']}
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
        backgroundColor: '#F0F8FF',
        borderColor: '#007AFF',
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
        color: '#007AFF',
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

export default CulturaFiltrosModal;