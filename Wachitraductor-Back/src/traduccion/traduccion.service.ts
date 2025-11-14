import { Injectable } from '@nestjs/common';
import { DiccionarioService } from '../diccionario/diccionario.service';
import { TraducirDto, ResultadoTraduccion, DireccionTraduccion } from './dto/traducir.dto';

@Injectable()
export class TraduccionService {
    constructor(private readonly diccionarioService: DiccionarioService) { }

    async traducir(traducirDto: TraducirDto): Promise<ResultadoTraduccion> {
        const { texto, direccion } = traducirDto;
        const diccionario = await this.diccionarioService.obtenerTodo();

        // Normalizar texto de entrada (convertir a minúsculas y quitar espacios extra)
        const textoNormalizado = texto.toLowerCase().trim();

        let traducciones: string[] = [];
        let confianza = 0;
        let notas = '';

        if (direccion === DireccionTraduccion.ESPANOL_A_TRIQUI) {
            // Buscar traducciones de español a triqui
            const coincidenciasExactas = diccionario.filter(
                entrada => entrada.palabraEspanol.toLowerCase() === textoNormalizado
            );

            if (coincidenciasExactas.length > 0) {
                traducciones = coincidenciasExactas.map(entrada => entrada.palabraTriqui);
                confianza = 100;
                notas = 'Traducción exacta encontrada en diccionario';
            } else {
                // Buscar coincidencias parciales
                const coincidenciasParciales = diccionario.filter(
                    entrada =>
                        entrada.palabraEspanol.toLowerCase().includes(textoNormalizado) ||
                        entrada.definicion.toLowerCase().includes(textoNormalizado)
                );

                if (coincidenciasParciales.length > 0) {
                    traducciones = coincidenciasParciales.map(entrada => entrada.palabraTriqui);
                    confianza = 70;
                    notas = 'Traducción aproximada basada en coincidencias parciales';
                } else {
                    // Intentar traducción palabra por palabra para frases
                    traducciones = await this.traducirFrase(textoNormalizado, diccionario, true);
                    confianza = traducciones.length > 0 ? 50 : 0;
                    notas = traducciones.length > 0
                        ? 'Traducción compuesta palabra por palabra'
                        : 'No se encontró traducción en el diccionario';
                }
            }
        } else {
            // Buscar traducciones de triqui a español
            const coincidenciasExactas = diccionario.filter(
                entrada => entrada.palabraTriqui.toLowerCase() === textoNormalizado
            );

            if (coincidenciasExactas.length > 0) {
                traducciones = coincidenciasExactas.map(entrada => entrada.palabraEspanol);
                confianza = 100;
                notas = 'Traducción exacta encontrada en diccionario';
            } else {
                // Buscar coincidencias parciales
                const coincidenciasParciales = diccionario.filter(
                    entrada => entrada.palabraTriqui.toLowerCase().includes(textoNormalizado)
                );

                if (coincidenciasParciales.length > 0) {
                    traducciones = coincidenciasParciales.map(entrada => entrada.palabraEspanol);
                    confianza = 70;
                    notas = 'Traducción aproximada basada en coincidencias parciales';
                } else {
                    // Intentar traducción palabra por palabra para frases
                    traducciones = await this.traducirFrase(textoNormalizado, diccionario, false);
                    confianza = traducciones.length > 0 ? 50 : 0;
                    notas = traducciones.length > 0
                        ? 'Traducción compuesta palabra por palabra'
                        : 'No se encontró traducción en el diccionario';
                }
            }
        }

        // Si no se encontró ninguna traducción, proporcionar una respuesta por defecto
        if (traducciones.length === 0) {
            traducciones = ['Traducción no disponible'];
        }

        return {
            textoOriginal: texto,
            textoTraducido: traducciones[0],
            direccion,
            confianza,
            alternativas: traducciones.slice(1),
            notas
        };
    }

    private async traducirFrase(frase: string, diccionario: any[], esEspanolATriqui: boolean): Promise<string[]> {
        const palabras = frase.split(' ').filter(palabra => palabra.length > 0);
        const traducciones: string[] = [];

        for (const palabra of palabras) {
            const palabraNormalizada = palabra.toLowerCase();
            let traduccionEncontrada = false;

            for (const entrada of diccionario) {
                if (esEspanolATriqui) {
                    if (entrada.palabraEspanol.toLowerCase() === palabraNormalizada) {
                        traducciones.push(entrada.palabraTriqui);
                        traduccionEncontrada = true;
                        break;
                    }
                } else {
                    if (entrada.palabraTriqui.toLowerCase() === palabraNormalizada) {
                        traducciones.push(entrada.palabraEspanol);
                        traduccionEncontrada = true;
                        break;
                    }
                }
            }

            if (!traduccionEncontrada) {
                traducciones.push(`[${palabra}]`); // Marcar palabras no traducidas
            }
        }

        return traducciones.length > 0 ? [traducciones.join(' ')] : [];
    }

    async obtenerEstadisticasTraduccion(): Promise<any> {
        const diccionario = await this.diccionarioService.obtenerTodo();

        return {
            totalPalabras: diccionario.length,
            areasTemáticas: [...new Set(diccionario.map(entrada => entrada.areaTematica))],
            categorías: [...new Set(diccionario.map(entrada => entrada.categoria).filter(Boolean))],
            ultimaActualización: new Date().toISOString()
        };
    }
}