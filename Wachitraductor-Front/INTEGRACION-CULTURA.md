# Conexión Frontend - Backend Wachitraductor

## 🔗 Resumen de la Integración

He conectado exitosamente el frontend React Native con el backend NestJS para la sección de **Cultura**. La aplicación ahora puede:

- ✅ Obtener información cultural desde el backend
- ✅ Filtrar por tipo de información (historia, tradiciones, festivales, etc.)
- ✅ Realizar búsquedas en tiempo real
- ✅ Mostrar la información en un diseño atractivo y funcional

## 📁 Archivos Creados/Modificados

### Backend (NestJS)
- ✅ **Funcionando** en `http://localhost:3000`
- Endpoints disponibles:
  - `GET /cultura` - Información filtrada
  - `GET /cultura/tipos` - Tipos disponibles  
  - `GET /cultura/todo` - Toda la información
  - `GET /cultura/:id` - Información específica

### Frontend (React Native)
**Nuevos archivos:**
1. **`services/cultura.service.ts`** - Servicio para comunicación con API
2. **`services/cultura.types.ts`** - Tipos TypeScript para la información cultural
3. **`components/wachicomponentes/cultura-item.tsx`** - Componente para mostrar elementos
4. **`components/wachicomponentes/filtros-tipo.tsx`** - Componente de filtros
5. **`constants/config.ts`** - Configuración de la aplicación

**Archivos modificados:**
1. **`app/(tabs)/Cultura.tsx`** - Pantalla principal actualizada con funcionalidad completa

## 🚀 Instrucciones de Uso

### 1. Ejecutar el Backend
```bash
cd Wachitraductor-Back
npm install
npm run start:dev
```

El backend estará disponible en: `http://localhost:3000`

### 2. Ejecutar el Frontend
```bash
cd Wachitraductor-Front
npm install
npm start
```

### 3. Configurar IP para Dispositivo Físico (Opcional)

Si usas un dispositivo físico, edita `services/cultura.service.ts`:

```typescript
private baseUrl = 'http://TU_IP_LOCAL:3000'; // Ejemplo: http://192.168.1.100:3000
```

Para encontrar tu IP:
- **Windows**: `ipconfig` en CMD
- **Mac/Linux**: `ifconfig` en Terminal

## 📱 Características Implementadas

### ✨ Funcionalidades
- **Búsqueda en tiempo real** con debounce
- **Filtros por tipo** de información cultural
- **Diseño responsive** y atractivo
- **Manejo de errores** y estados de carga
- **Pull to refresh** para recargar datos
- **Interfaz intuitiva** con emojis y colores

### 🎨 Componentes UI
- **CulturaItem**: Cards atractivas con información
- **FiltrosTipo**: Botones de filtro deslizables
- **Búsqueda**: Input con botón de limpiar
- **Estados**: Loading, error y vacío

### 📊 Datos Culturales
La aplicación muestra **20 registros** auténticos sobre la cultura Triqui:
- Historia y origen
- Tradiciones y costumbres
- Festivales y celebraciones  
- Artesanías y textiles
- Gastronomía tradicional
- Vestimenta típica
- Música y danzas
- Ubicación geográfica
- Datos poblacionales
- Información del idioma

## 🔧 Configuración Técnica

### Estructura de la API
```typescript
interface InformacionCultural {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  imagen?: string;
  palabrasClave: string[];
  region: string;
  fechaCreacion: string;
}
```

### Endpoints Utilizados
```bash
# Obtener información con filtros
GET /cultura?busqueda=X&tipo=Y&pagina=1&limite=10

# Obtener tipos disponibles
GET /cultura/tipos

# Obtener toda la información
GET /cultura/todo

# Obtener por ID específico
GET /cultura/:id
```

## 🐛 Troubleshooting

### Problema: "No se pudo conectar con el servidor"
**Solución**: Verifica que:
1. El backend esté ejecutándose en `http://localhost:3000`
2. No haya firewall bloqueando el puerto 3000
3. La URL en `cultura.service.ts` sea correcta

### Problema: Dispositivo físico no conecta
**Solución**: 
1. Cambia `localhost` por tu IP local
2. Asegúrate de estar en la misma red WiFi

### Problema: Datos no cargan
**Solución**: Verifica en la consola del navegador:
1. `http://localhost:3000/cultura/tipos` - debe responder JSON
2. Revisa logs del backend para errores

## 📈 Próximos Pasos Sugeridos

1. **Pantalla de detalle** para cada elemento cultural
2. **Imágenes reales** de la cultura Triqui
3. **Modo offline** con caché local
4. **Favorites** para guardar información importante
5. **Compartir** contenido cultural
6. **Audio** para pronunciación de palabras

## ✅ Estado Actual

- ✅ Backend funcionando correctamente
- ✅ Frontend conectado y operativo
- ✅ Datos culturales auténticos cargados
- ✅ UI/UX optimizada y funcional
- ✅ Filtros y búsqueda implementados

¡La sección de Cultura está lista y completamente funcional! 🎉