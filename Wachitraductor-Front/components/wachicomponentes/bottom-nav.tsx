import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Tab = 'diccionario' | 'home' | 'cultura';

type Props = {
  activeTab?: Tab;
  onTabPress?: (tab: Tab) => void;
};

export default function BottomNavBar({ activeTab = 'home', onTabPress }: Props) {
  const handlePress = (tab: Tab) => {
    if (onTabPress) {
      onTabPress(tab);
    }
  };

  return (
    <View style={styles.container}>
      {/* Diccionario Tab */}
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => handlePress('diccionario')}
      >
        <MaterialIcons 
          name="bookmark-outline" 
          size={28} 
          color={activeTab === 'diccionario' ? '#047492' : '#666666'} 
        />
        <Text style={[
          styles.tabLabel,
          activeTab === 'diccionario' && styles.tabLabelActive
        ]}>
          Diccionario
        </Text>
      </TouchableOpacity>

      {/* Home Tab - Centro con círculo degradado */}
      <TouchableOpacity
        style={styles.homeTab}
        onPress={() => handlePress('home')}
        activeOpacity={0.85}
      >
        <LinearGradient
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          locations={[0, 0.9]}
          colors={['#012f3c', '#047492']}
          style={styles.homeGradiente}
        >
          <MaterialIcons name="home" size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
      {/* Cultura Tab */}
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => handlePress('cultura')}
      >
        <MaterialIcons 
          name="local-library" 
          size={28} 
          color={activeTab === 'cultura' ? '#047492' : '#666666'} 
        />
        <Text style={[
          styles.tabLabel,
          activeTab === 'cultura' && styles.tabLabelActive
        ]}>
          Cultura
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 30, // Space for system navigation buttons
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  homeTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -12, // Eleva el botón del centro (menos porque el nav es absoluto)
  },
  homeCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    // kept for reference if needed
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  homeGradiente: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    // center visually above the nav
    transform: [{ translateY: -6 }],
  },
  tabLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#047492',
    fontWeight: '600',
  },
});
