import React, { useCallback, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Wachiheather from '@/components/wachicomponentes/heather';
import BottomNavBar from '@/components/wachicomponentes/bottom-nav';
import CulturaItem from '@/components/wachicomponentes/cultura-item';
import FiltrosTipo from '@/components/wachicomponentes/filtros-tipo';
import { culturaService } from '@/services/cultura.service';
import { InformacionCultural, ConfiguracionTipo } from '@/services/cultura.types';

export default function CulturaScreen() {
  const [items, setItems] = useState<InformacionCultural[]>([]);
  const [tipos, setTipos] = useState<string[]>([]);
  const [configuracionTipos, setConfiguracionTipos] = useState<{ [key: string]: ConfiguracionTipo }>({});
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales y configuración
  useEffect(() => {
    cargarConfiguracion();
    cargarDatos();
  }, []);

  const cargarConfiguracion = useCallback(async () => {
    try {
      // Cargar tipos disponibles
      const tiposResponse = await culturaService.obtenerTipos();
      if (tiposResponse.exito) {
        setTipos(tiposResponse.datos);
      }

      // Cargar configuración de tipos
      const configResponse = await culturaService.obtenerConfiguracionTipos();
      if (configResponse.exito) {
        setConfiguracionTipos(configResponse.datos);
      }
    } catch (error) {
      console.warn('No se pudo cargar la configuración de tipos:', error);
      // Continuar sin configuración dinámica
    }
  }, []);

  // Recargar datos cuando cambien los filtros
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      cargarDatos();
    }, 500); // Debounce para la búsqueda

    return () => clearTimeout(timeoutId);
  }, [busqueda, tipoFiltro]);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await culturaService.obtenerInformacionCultural({
        busqueda: busqueda.trim() || undefined,
        tipo: tipoFiltro,
        limite: 50, // Cargar más elementos
      });

      if (response.exito) {
        setItems(response.datos);
      } else {
        setError('Error al cargar la información cultural');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [busqueda, tipoFiltro]);

  const handleItemPress = useCallback((item: InformacionCultural) => {
    Alert.alert(
      item.titulo,
      item.descripcion,
      [
        { text: 'Cerrar', style: 'cancel' },

      ],
      { cancelable: true }
    );
  }, []);

  const handleTabPress = (tab: 'diccionario' | 'home' | 'cultura') => {
    if (tab === 'home') {
      router.push('/(tabs)');
    } else if (tab === 'diccionario') {
      router.push('/(tabs)/Diccionario');
    }
  };

  const renderItem = ({ item }: { item: InformacionCultural }) => (
    <CulturaItem
      item={item}
      configuracionTipos={configuracionTipos}
      onPress={handleItemPress}
    />
  );

  const renderHeader = () => (
    <View>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar información cultural..."
          value={busqueda}
          onChangeText={setBusqueda}
          placeholderTextColor="#999"
        />
        {busqueda.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setBusqueda('')}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros por tipo */}
      <FiltrosTipo
        tipos={tipos}
        configuracionTipos={configuracionTipos}
        tipoSeleccionado={tipoFiltro}
        onTipoSeleccionado={setTipoFiltro}
      />

      {/* Indicador de resultados */}
      <View style={styles.resultadosHeader}>
        <Text style={styles.resultadosText}>
          {loading ? 'Cargando...' : `${items.length} resultado${items.length !== 1 ? 's' : ''}`}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        <Wachiheather />

        {/* Header pill */}
        <View style={styles.headerPill}>
          <Text style={styles.headerPillText}>Cultura Triqui</Text>
        </View>

        {/* Content area */}
        <View style={styles.resultsWrapper}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>❌ {error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={cargarDatos}
              >
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              ListHeaderComponent={renderHeader}
              ListEmptyComponent={
                loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Cargando información cultural...</Text>
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      {busqueda || tipoFiltro
                        ? 'No se encontraron resultados para tu búsqueda'
                        : 'No hay información cultural disponible'
                      }
                    </Text>
                  </View>
                )
              }
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshing={loading}
              onRefresh={cargarDatos}
            />
          )}
        </View>

        <BottomNavBar activeTab="cultura" onTabPress={handleTabPress} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingBottom: 110,
  },
  headerPill: {
    alignSelf: 'stretch',
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    flexDirection: 'row',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerPillText: {
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
    fontSize: 16,
  },
  resultsWrapper: {
    flex: 1,
    marginTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  resultadosHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  resultadosText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
