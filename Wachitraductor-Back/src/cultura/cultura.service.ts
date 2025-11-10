import { Injectable } from '@nestjs/common';
import { InformacionCultural } from './entities/informacion-cultural.entity';
import { FiltrarCulturaDto, TipoInformacion } from './dto/filtrar-cultura.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CulturaService {
    private informacionCultural: InformacionCultural[] = [];

    constructor() {
        this.cargarDatosCulturales();
    }

    private cargarDatosCulturales(): void {
        try {
            const rutaArchivo = path.join(process.cwd(), 'src', 'cultura', 'data', 'cultura-triqui-actualizado.json');
            const datos = fs.readFileSync(rutaArchivo, 'utf-8');
            this.informacionCultural = JSON.parse(datos);
        } catch (error) {
            console.error('Error al cargar datos culturales:', error);
            this.informacionCultural = this.obtenerDatosEjemplo();
        }
    } private obtenerDatosEjemplo(): InformacionCultural[] {
        return [
            {
                id: 1,
                titulo: 'Historia del Pueblo Triqui',
                descripcion: 'Los triquis son un pueblo indígena de México que habita principalmente en el estado de Oaxaca. Su historia se remonta a miles de años atrás, con una rica tradición cultural que ha perdurado a través de los siglos.',
                tipo: TipoInformacion.HISTORIA,
                imagen: 'https://ejemplo.com/historia-triqui.jpg',
                palabrasClave: ['historia', 'origen', 'ancestros', 'Oaxaca', 'pueblo indígena'],
                region: 'Oaxaca, México',
                fechaCreacion: new Date('2024-01-01'),
            },
            {
                id: 2,
                titulo: 'Tradiciones Ceremoniales',
                descripcion: 'Las ceremonias triquis incluyen rituales de siembra, cosecha y celebraciones espirituales que conectan a la comunidad con la naturaleza y sus ancestros.',
                tipo: TipoInformacion.TRADICIONES,
                imagen: 'https://ejemplo.com/ceremonias-triqui.jpg',
                palabrasClave: ['ceremonias', 'rituales', 'siembra', 'cosecha', 'espiritual'],
                region: 'Sierra de Oaxaca',
                fechaCreacion: new Date('2024-01-02'),
            },
            // Más datos...
        ];
    }

    async obtenerTodo(): Promise<InformacionCultural[]> {
        return this.informacionCultural;
    }

    async obtenerPorId(id: number): Promise<InformacionCultural | undefined> {
        return this.informacionCultural.find(item => item.id === id);
    }

    async filtrarInformacion(filtros: FiltrarCulturaDto): Promise<{
        datos: InformacionCultural[];
        total: number;
        pagina: number;
        limite: number;
        totalPaginas: number;
    }> {
        let datosFiltrados = [...this.informacionCultural];

        // Aplicar filtro de tipo
        if (filtros.tipo) {
            datosFiltrados = datosFiltrados.filter(item => item.tipo === filtros.tipo);
        }

        // Aplicar búsqueda por texto
        if (filtros.busqueda) {
            const termino = filtros.busqueda.toLowerCase();
            datosFiltrados = datosFiltrados.filter(item =>
                item.titulo.toLowerCase().includes(termino) ||
                item.descripcion.toLowerCase().includes(termino) ||
                item.palabrasClave.some(palabra => palabra.toLowerCase().includes(termino)) ||
                item.region.toLowerCase().includes(termino)
            );
        }

        // Paginación
        const pagina = Math.max(1, parseInt(filtros.pagina || '1', 10));
        const limite = Math.min(100, Math.max(1, parseInt(filtros.limite || '10', 10)));
        const inicio = (pagina - 1) * limite;
        const fin = inicio + limite;

        const datosPage = datosFiltrados.slice(inicio, fin);
        const total = datosFiltrados.length;
        const totalPaginas = Math.ceil(total / limite);

        return {
            datos: datosPage,
            total,
            pagina,
            limite,
            totalPaginas,
        };
    }

    async obtenerTipos(): Promise<string[]> {
        const tiposUnicos = [...new Set(this.informacionCultural.map(item => item.tipo))];
        return tiposUnicos.sort();
    }

    async obtenerConfiguracionTipos(): Promise<{ [key: string]: { nombre: string; color: string } }> {
        const tipos = await this.obtenerTipos();
        const configuracion: { [key: string]: { nombre: string; color: string } } = {};

        // Colores predeterminados que se asignan automáticamente
        const coloresPorDefecto = [
            '#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94',
            '#D4A4EB', '#95E1D3', '#F8E8A6', '#C7CEEA', '#FFAAA5',
            '#FFA726', '#66BB6A', '#42A5F5', '#AB47BC', '#FF7043'
        ];

        tipos.forEach((tipo, index) => {
            configuracion[tipo] = {
                nombre: this.formatearNombreTipo(tipo),
                color: coloresPorDefecto[index % coloresPorDefecto.length]
            };
        });

        return configuracion;
    }

    private formatearNombreTipo(tipo: string): string {
        // Capitalizar primera letra y reemplazar guiones por espacios
        return tipo
            .split('-')
            .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
            .join(' ');
    }

    async obtenerEstadisticasTipos(): Promise<{ tipo: string; cantidad: number }[]> {
        const conteoTipos = {};

        this.informacionCultural.forEach(item => {
            conteoTipos[item.tipo] = (conteoTipos[item.tipo] || 0) + 1;
        });

        return Object.entries(conteoTipos).map(([tipo, cantidad]) => ({
            tipo,
            cantidad: cantidad as number,
        }));
    }
}