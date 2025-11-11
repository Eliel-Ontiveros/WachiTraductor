import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Wachiheather from '@/components/wachicomponentes/heather';
import BottomNavBar from '@/components/wachicomponentes/bottom-nav';
import FiltrosDiccionario from '@/components/wachicomponentes/filtros-diccionario';
import { diccionarioService } from '@/services/diccionario.service';
import { EntradaDiccionario, FiltrosDiccionario as FiltrosDiccionarioType } from '@/services/diccionario.types';

export default function DiccionarioScreen() {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<EntradaDiccionario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMoreResults, setHasMoreResults] = useState<boolean>(false);
  const [areaTematicaSeleccionada, setAreaTematicaSeleccionada] = useState<string | undefined>(undefined);
  const [areasTematicasOpciones, setAreasTematicasOpciones] = useState<string[]>([]);
  const [filtrosActivos, setFiltrosActivos] = useState<FiltrosDiccionarioType>({
    idioma: 'ambos',
    ordenarPor: 'palabra-espanol',
    direccion: 'asc',
    pagina: 1,
    limite: 20,
  });

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = useCallback(async () => {
    try {
      setLoading(true);
      // Obtener entradas
      const response = await diccionarioService.obtenerEntradas(filtrosActivos);

      // Intentar obtener áreas temáticas desde el endpoint dedicado; si falla, obtener todas las entradas y derivarlas
      let areas: string[] = [];
      try {
        areas = await diccionarioService.obtenerAreasTematicas();
      } catch (err) {
        console.warn('No se pudo obtener áreas temáticas desde el endpoint; se intentará derivarlas de todas las entradas', err);
        try {
          const todas = await diccionarioService.obtenerTodasLasEntradas();
          areas = Array.from(new Set(todas.map(e => e.areaTematica).filter(Boolean)));
        } catch (err2) {
          console.warn('No se pudieron derivar áreas temáticas desde todas las entradas', err2);
          areas = [];
        }
      }

      setResults(response.entradas);
      setHasMoreResults(response.paginacion.hayPaginaSiguiente);
      setCurrentPage(1);
      setAreasTematicasOpciones(areas || []);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      Alert.alert('Error', 'No se pudieron cargar las entradas del diccionario');
    } finally {
      setLoading(false);
    }
  }, [filtrosActivos]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      Alert.alert('Aviso', 'Por favor ingresa un término de búsqueda');
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      Keyboard.dismiss();

      const entradas = await diccionarioService.busquedaSimple(query.trim());
      setResults(entradas);
      setCurrentPage(1);
      setHasMoreResults(false); // Para búsqueda simple, no hay paginación
    } catch (error) {
      console.error('Error en búsqueda:', error);
      Alert.alert('Error', 'No se pudo realizar la búsqueda. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleClear = useCallback(() => {
    setQuery('');
    setHasSearched(false);
    cargarDatosIniciales();
  }, [cargarDatosIniciales]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    if (hasSearched) {
      handleSearch().finally(() => setRefreshing(false));
    } else {
      cargarDatosIniciales().finally(() => setRefreshing(false));
    }
  }, [hasSearched, handleSearch, cargarDatosIniciales]);

  const cargarMasResultados = useCallback(async () => {
    if (loading || !hasMoreResults || hasSearched) return;

    try {
      setLoading(true);
      const nextPage = currentPage + 1;

      const filtros = {
        ...filtrosActivos,
        pagina: nextPage,
      };

      const response = await diccionarioService.obtenerEntradas(filtros);
      setResults(prev => [...prev, ...response.entradas]);
      setHasMoreResults(response.paginacion.hayPaginaSiguiente);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error al cargar más resultados:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMoreResults, hasSearched, currentPage, filtrosActivos]);

  const aplicarFiltroAreaTematica = useCallback(async (areaTematica?: string) => {
    try {
      setLoading(true);
      setAreaTematicaSeleccionada(areaTematica);
      setHasSearched(false);
      setCurrentPage(1);

      const filtros: FiltrosDiccionarioType = {
        areaTematica,
        idioma: 'ambos',
        ordenarPor: 'palabra-espanol',
        direccion: 'asc',
        pagina: 1,
        limite: 20,
      };

      const response = await diccionarioService.obtenerEntradas(filtros);
      setResults(response.entradas);
      setHasMoreResults(response.paginacion.hayPaginaSiguiente);
      setFiltrosActivos(filtros);
    } catch (error) {
      console.error('Error al aplicar filtros:', error);
      Alert.alert('Error', 'No se pudieron aplicar los filtros');
    } finally {
      setLoading(false);
    }
  }, []);

  const aplicarFiltros = useCallback(async (nuevosFiltros: FiltrosDiccionarioType) => {
    try {
      setLoading(true);
      setFiltrosActivos(nuevosFiltros);
      setHasSearched(false);
      setCurrentPage(1);

      const response = await diccionarioService.obtenerEntradas({
        ...nuevosFiltros,
        pagina: 1,
      });

      setResults(response.entradas);
      setHasMoreResults(response.paginacion.hayPaginaSiguiente);
    } catch (error) {
      console.error('Error al aplicar filtros:', error);
      Alert.alert('Error', 'No se pudieron aplicar los filtros');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTabPress = (tab: 'diccionario' | 'home' | 'cultura') => {
    if (tab === 'home') {
      router.push('/(tabs)');
    } else if (tab === 'cultura') {
      router.push('/(tabs)/Cultura');
    }
    // Si es 'diccionario', ya estamos en esta pantalla
  };

  const renderItem = ({ item }: { item: EntradaDiccionario }) => (
    <TouchableOpacity style={styles.resultItem} activeOpacity={0.7}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultWordSpanish}>{item.palabraEspanol}</Text>
        <Text style={styles.resultWordTriqui}>{item.palabraTriqui}</Text>
      </View>

      {item.pronunciacion && (
        <Text style={styles.resultPronunciation}>/{item.pronunciacion}/</Text>
      )}

      <View style={styles.resultMeta}>
        <Text style={styles.resultArea}>{item.areaTematica}</Text>
      </View>

      <Text style={styles.resultDefinition} numberOfLines={2}>
        {item.definicion}
      </Text>

      {item.ejemploEspanol && (
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleLabel}>Ejemplo:</Text>
          <Text style={styles.exampleText}>{item.ejemploEspanol}</Text>
          {item.ejemploTriqui && (
            <Text style={styles.exampleTriqui}>{item.ejemploTriqui}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading || results.length === 0) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#047492" />
        <Text style={styles.footerText}>Cargando más resultados...</Text>
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (loading && results.length === 0) {
      return (
        <View style={styles.placeholderContainer}>
          <ActivityIndicator size="large" color="#047492" />
          <Text style={styles.placeholderText}>Cargando diccionario...</Text>
        </View>
      );
    }

    if (hasSearched && results.length === 0) {
      return (
        <View style={styles.placeholderContainer}>
          <MaterialIcons name="search-off" size={48} color="#ccc" />
          <Text style={styles.placeholderText}>
            No se encontraron resultados para "{query}"
          </Text>
          <Text style={styles.placeholderSubtext}>
            Intenta con otra palabra o verifica la ortografía
          </Text>
        </View>
      );
    }

    if (!hasSearched && results.length === 0) {
      return (
        <View style={styles.placeholderContainer}>
          <MaterialIcons name="menu-book" size={48} color="#ccc" />
          <Text style={styles.placeholderText}>Diccionario Triqui-Español</Text>
          <Text style={styles.placeholderSubtext}>
            Busca palabras en español o triqui para comenzar
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <Wachiheather />

        {/* Header pill */}
        <View style={styles.headerPill}>
          <Text style={styles.headerPillText}>WachiDiccionario</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar palabra español-lengua"
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />

          {query.length > 0 ? (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <MaterialIcons name="close" size={18} color="#444" />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <MaterialIcons name="search" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Filtros */}
        <FiltrosDiccionario
          areaTematicaSeleccionada={areaTematicaSeleccionada}
          onAreaTematicaSeleccionada={aplicarFiltroAreaTematica}
          areasTematicas={areasTematicasOpciones}
        />

        {/* Results area*/}
        <View style={styles.resultsWrapper}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={renderEmptyComponent}
            ListFooterComponent={renderFooter}
            onEndReached={cargarMasResultados}
            onEndReachedThreshold={0.3}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#047492']}
              />
            }
            contentContainerStyle={{
              paddingBottom: 16,
              flexGrow: 1
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <BottomNavBar activeTab="diccionario" onTabPress={handleTabPress} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 110, // Reserve space for absolute bottom nav
  },
  headerPill: {
    alignSelf: 'stretch',
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerPillText: {
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 18,
    backgroundColor: '#F6F6F6',
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    color: '#333',
  },
  clearButton: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#047492',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsWrapper: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 16,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  placeholderText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  placeholderSubtext: {
    color: '#999',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  resultItem: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resultWordSpanish: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    flex: 1,
    marginRight: 12,
  },
  resultWordTriqui: {
    fontSize: 16,
    fontWeight: '600',
    color: '#047492',
    fontStyle: 'italic',
  },
  resultPronunciation: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  resultArea: {
    fontSize: 12,
    color: '#047492',
    fontWeight: '600',
    backgroundColor: '#E8F4F8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  resultDefinition: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 8,
  },
  exampleContainer: {
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#047492',
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 13,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  exampleTriqui: {
    fontSize: 13,
    color: '#047492',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  footerLoader: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
});
