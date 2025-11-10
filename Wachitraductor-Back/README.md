# Wachitraductor Backend

Backend de la aplicación Wachitraductor desarrollado en NestJS para servir información cultural sobre el pueblo Triqui.

## Características

- 🏛️ **Información Cultural**: API completa para datos culturales del pueblo Triqui
- 🔍 **Búsqueda Avanzada**: Búsqueda por texto en títulos, descripciones y palabras clave
- 🏷️ **Filtrado por Tipo**: Filtros por categorías (historia, tradiciones, festivales, etc.)
- 📄 **Paginación**: Sistema de paginación para manejo eficiente de datos
- 📚 **Documentación**: API documentada con Swagger
- ✅ **Validación**: Validación de datos con class-validator

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd Wachitraductor-Back
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar en modo desarrollo:
```bash
npm run start:dev
```

4. Ejecutar en producción:
```bash
npm run build
npm run start:prod
```

## Endpoints Disponibles

### Cultura
- `GET /cultura` - Obtener información cultural con filtros
- `GET /cultura/todo` - Obtener toda la información cultural
- `GET /cultura/tipos` - Obtener tipos de información disponibles
- `GET /cultura/:id` - Obtener información específica por ID

### Parámetros de consulta para `/cultura`:
- `busqueda` - Término de búsqueda (opcional)
- `tipo` - Tipo de información (opcional)
- `pagina` - Número de página (opcional, default: 1)
- `limite` - Elementos por página (opcional, default: 10)

### Tipos de información disponibles:
- `historia` - Historia del pueblo Triqui
- `tradiciones` - Tradiciones y costumbres
- `festivales` - Festivales y celebraciones
- `artesanias` - Artesanías tradicionales
- `gastronomia` - Gastronomía típica
- `vestimenta` - Vestimenta tradicional
- `musica` - Música y danzas
- `ubicacion` - Ubicación geográfica
- `poblacion` - Datos demográficos
- `idioma` - Información sobre el idioma

## Estructura del Proyecto

```
src/
├── cultura/
│   ├── data/
│   │   └── cultura-triqui.json    # Datos de la cultura Triqui
│   ├── dto/
│   │   └── filtrar-cultura.dto.ts # DTOs para filtros
│   ├── entities/
│   │   └── informacion-cultural.entity.ts # Entidad de información cultural
│   ├── cultura.controller.ts      # Controlador REST
│   ├── cultura.service.ts         # Lógica de negocio
│   └── cultura.module.ts          # Módulo de cultura
├── app.module.ts                  # Módulo principal
└── main.ts                        # Punto de entrada
```

## Documentación API

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación Swagger en:

```
http://localhost:3000/api
```

## Scripts Disponibles

- `npm run start` - Ejecutar aplicación
- `npm run start:dev` - Ejecutar en modo desarrollo (watch)
- `npm run start:debug` - Ejecutar en modo debug
- `npm run start:prod` - Ejecutar en modo producción
- `npm run build` - Compilar aplicación
- `npm run test` - Ejecutar tests
- `npm run test:watch` - Ejecutar tests en modo watch
- `npm run lint` - Ejecutar linter

## Tecnologías Utilizadas

- **NestJS** - Framework de Node.js
- **TypeScript** - Lenguaje de programación
- **Swagger** - Documentación de API
- **Class Validator** - Validación de datos
- **Class Transformer** - Transformación de datos

## Configuración

La aplicación ejecuta en el puerto 3000 por defecto. Puedes cambiar esto configurando la variable de entorno `PORT`.

## Desarrollo

Para agregar nuevos tipos de información cultural:

1. Actualiza el enum `TipoInformacion` en `filtrar-cultura.dto.ts`
2. Agrega los nuevos datos en `cultura-triqui.json`
3. La API automáticamente detectará los nuevos tipos

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request