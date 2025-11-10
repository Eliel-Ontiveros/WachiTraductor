import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Oculta la barra de tabs por defecto
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="Diccionario"
        options={{
          title: 'Diccionario',
        }}
      />
      <Tabs.Screen
        name="Cultura"
        options={{
          title: 'Cultura',
        }}
      />
    </Tabs>
  );
}
