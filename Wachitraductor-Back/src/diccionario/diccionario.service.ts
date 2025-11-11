import { Injectable } from '@nestjs/common';
import { EntradaDiccionario } from './entities/entrada-diccionario.entity';
import {
    FiltrarDiccionarioDto,
    RespuestaPaginadaDiccionario,
    CategoriaGramatical,
} from './dto/filtrar-diccionario.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DiccionarioService {
    private entradasDiccionario: EntradaDiccionario[] = [];

    constructor() {
        this.cargarDatosDiccionario();
    }

    private cargarDatosDiccionario(): void {
        try {
            const rutaArchivo = path.join(process.cwd(), 'src', 'diccionario', 'data', 'diccionario-triqui.json');
            const datos = fs.readFileSync(rutaArchivo, 'utf-8');
            const datosJson = JSON.parse(datos);

            // Convertir las fechas string a objetos Date
            this.entradasDiccionario = datosJson.map((entrada: any) => ({
                ...entrada,
                fechaCreacion: new Date(entrada.fechaCreacion)
            }));

            console.log(`Diccionario cargado con ${this.entradasDiccionario.length} entradas`);
        } catch (error) {
            console.error('Error al cargar datos del diccionario:', error);
            this.entradasDiccionario = this.obtenerDatosEjemplo();
        }
    }

    private obtenerDatosEjemplo(): EntradaDiccionario[] {
        return [
            {
                id: 1,
                palabraEspanol: 'agua',
                palabraTriqui: 'yaa',
                pronunciacion: 'yaa',
                categoria: CategoriaGramatical.SUSTANTIVO,
                areaTematica: 'numeros',
                definicion: 'Líquido transparente, incoloro, inodoro e insípido que es esencial para la vida',
                ejemploEspanol: 'El agua del río está muy fría',
                ejemploTriqui: 'Yaa nij si ga\'a',
                traduccionEjemplo: 'El agua del río está muy fría',
                palabrasRelacionadas: ['río', 'lluvia', 'mar'],
                notas: 'Palabra fundamental en el vocabulario básico',
                nivelDificultad: 1,
                fechaCreacion: new Date('2024-01-01'),
                variantesDialectales: ['yaa', 'ya\'a']
            }
        ];
    }

    async obtenerTodo(): Promise<EntradaDiccionario[]> {
        return this.entradasDiccionario;
    }

    async buscarPorFiltros(filtros: FiltrarDiccionarioDto): Promise<RespuestaPaginadaDiccionario> {
        let resultados = [...this.entradasDiccionario];

        // Aplicar filtro de búsqueda
        if (filtros.busqueda) {
            const terminoBusqueda = filtros.busqueda.toLowerCase();
            resultados = resultados.filter(entrada => {
                const coincidenceiaEspanol = entrada.palabraEspanol.toLowerCase().includes(terminoBusqueda);
                const coincidenciaTriqui = entrada.palabraTriqui.toLowerCase().includes(terminoBusqueda);
                const coincidenciaDefinicion = entrada.definicion.toLowerCase().includes(terminoBusqueda);

                switch (filtros.idioma) {
                    case 'español':
                        return coincidenceiaEspanol || coincidenciaDefinicion;
                    case 'triqui':
                        return coincidenciaTriqui;
                    case 'ambos':
                    default:
                        return coincidenceiaEspanol || coincidenciaTriqui || coincidenciaDefinicion;
                }
            });
        }

        // Aplicar filtro por categoría gramatical
        if (filtros.categoria) {
            resultados = resultados.filter(entrada => entrada.categoria === filtros.categoria);
        }

        // Aplicar filtro por área temática
        if (filtros.areaTematica) {
            resultados = resultados.filter(entrada => entrada.areaTematica === filtros.areaTematica);
        }

        // Aplicar filtro por nivel de dificultad
        if (filtros.nivelDificultad) {
            resultados = resultados.filter(entrada => entrada.nivelDificultad === filtros.nivelDificultad);
        }

        // Aplicar ordenamiento
        resultados.sort((a, b) => {
            let valorA: any;
            let valorB: any;

            switch (filtros.ordenarPor) {
                case 'palabra-espanol':
                    valorA = a.palabraEspanol.toLowerCase();
                    valorB = b.palabraEspanol.toLowerCase();
                    break;
                case 'palabra-triqui':
                    valorA = a.palabraTriqui.toLowerCase();
                    valorB = b.palabraTriqui.toLowerCase();
                    break;
                case 'categoria':
                    valorA = a.categoria;
                    valorB = b.categoria;
                    break;
                case 'nivel':
                    valorA = a.nivelDificultad;
                    valorB = b.nivelDificultad;
                    break;
                case 'fecha':
                    valorA = a.fechaCreacion.getTime();
                    valorB = b.fechaCreacion.getTime();
                    break;
                default:
                    valorA = a.palabraEspanol.toLowerCase();
                    valorB = b.palabraEspanol.toLowerCase();
            }

            const comparacion = valorA < valorB ? -1 : valorA > valorB ? 1 : 0;
            return filtros.direccion === 'desc' ? -comparacion : comparacion;
        });

        // Aplicar paginación
        const totalElementos = resultados.length;
        const elementosPorPagina = filtros.limite || 20;
        const paginaActual = filtros.pagina || 1;
        const totalPaginas = Math.ceil(totalElementos / elementosPorPagina);

        const inicio = (paginaActual - 1) * elementosPorPagina;
        const fin = inicio + elementosPorPagina;
        const entradasPaginadas = resultados.slice(inicio, fin);

        return {
            entradas: entradasPaginadas,
            paginacion: {
                paginaActual,
                totalPaginas,
                totalElementos,
                elementosPorPagina,
                hayPaginaSiguiente: paginaActual < totalPaginas,
                hayPaginaAnterior: paginaActual > 1
            },
            filtrosAplicados: filtros
        };
    }

    async obtenerPorId(id: number): Promise<EntradaDiccionario | null> {
        const entrada = this.entradasDiccionario.find(e => e.id === id);
        return entrada || null;
    }

    async buscarPorPalabra(palabra: string, idioma?: 'español' | 'triqui'): Promise<EntradaDiccionario[]> {
        const palabraBuscar = palabra.toLowerCase().trim();

        return this.entradasDiccionario.filter(entrada => {
            switch (idioma) {
                case 'español':
                    return entrada.palabraEspanol.toLowerCase() === palabraBuscar;
                case 'triqui':
                    return entrada.palabraTriqui.toLowerCase() === palabraBuscar;
                default:
                    return entrada.palabraEspanol.toLowerCase() === palabraBuscar ||
                        entrada.palabraTriqui.toLowerCase() === palabraBuscar;
            }
        });
    }

    async obtenerCategorias(): Promise<string[]> {
        return Object.values(CategoriaGramatical);
    }

    async obtenerAreasTematicas(): Promise<string[]> {
        // Derivar las áreas temáticas únicas a partir de las entradas cargadas
        const areas = this.entradasDiccionario
            .map(e => e.areaTematica)
            .filter(Boolean) as string[];

        return Array.from(new Set(areas));
    }

    async obtenerEstadisticas() {
        const totalEntradas = this.entradasDiccionario.length;

        const estadisticasPorCategoria = Object.values(CategoriaGramatical).reduce((acc, categoria) => {
            acc[categoria] = this.entradasDiccionario.filter(e => e.categoria === categoria).length;
            return acc;
        }, {} as Record<string, number>);

        // Contar dinámicamente por área temática
        const estadisticasPorArea = this.entradasDiccionario.reduce((acc, entrada) => {
            const area = entrada.areaTematica || 'sin-especificar';
            acc[area] = (acc[area] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const estadisticasPorNivel = {
            basico: this.entradasDiccionario.filter(e => e.nivelDificultad === 1).length,
            intermedio: this.entradasDiccionario.filter(e => e.nivelDificultad === 2).length,
            avanzado: this.entradasDiccionario.filter(e => e.nivelDificultad === 3).length
        };

        return {
            totalEntradas,
            categorias: estadisticasPorCategoria,
            areasTematicas: estadisticasPorArea,
            nivelesDificultad: estadisticasPorNivel
        };
    }

    async buscarSugerencias(termino: string, limite: number = 5): Promise<string[]> {
        const terminoBuscar = termino.toLowerCase();
        const sugerencias = new Set<string>();

        // Buscar coincidencias en palabras españolas
        this.entradasDiccionario.forEach(entrada => {
            if (entrada.palabraEspanol.toLowerCase().startsWith(terminoBuscar)) {
                sugerencias.add(entrada.palabraEspanol);
            }
            if (entrada.palabraTriqui.toLowerCase().startsWith(terminoBuscar)) {
                sugerencias.add(entrada.palabraTriqui);
            }
        });

        return Array.from(sugerencias).slice(0, limite);
    }
}