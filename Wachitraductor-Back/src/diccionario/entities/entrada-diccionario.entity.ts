import { ApiProperty } from '@nestjs/swagger';

/**
 * Categorías disponibles para las entradas del diccionario
 */
export enum CategoriaGramatical {
    SUSTANTIVO = 'sustantivo',
    VERBO = 'verbo',
    ADJETIVO = 'adjetivo',
    NUMERAL = 'numeral'
}

/**
 * Áreas temáticas para clasificar las palabras del diccionario
 * Actualizado según las áreas realmente utilizadas en el diccionario JSON
 */
export enum AreaTematica {
    NUMEROS = 'numeros',
    PARENTESCO = 'parentesco',
    TIEMPO = 'tiempo'
}

/**
 * Entidad que representa una entrada del diccionario Triqui-Español
 */
export class EntradaDiccionario {
    @ApiProperty({
        description: 'Identificador único de la entrada',
        example: 1
    })
    id: number;

    @ApiProperty({
        description: 'Palabra en español',
        example: 'agua'
    })
    palabraEspanol: string;

    @ApiProperty({
        description: 'Palabra en lengua Triqui',
        example: 'yaa'
    })
    palabraTriqui: string;

    @ApiProperty({
        description: 'Pronunciación aproximada de la palabra Triqui',
        example: 'yaa',
        required: false
    })
    pronunciacion?: string;

    @ApiProperty({
        description: 'Categoría gramatical de la palabra',
        enum: CategoriaGramatical,
        example: CategoriaGramatical.SUSTANTIVO
    })
    categoria: CategoriaGramatical;

    @ApiProperty({
        description: 'Área temática a la que pertenece la palabra',
        example: 'numeros'
    })
    // Se permite cualquier string para áreas temáticas para soportar valores dinámicos
    areaTematica: string;

    @ApiProperty({
        description: 'Definición o significado de la palabra',
        example: 'Líquido transparente, incoloro, inodoro e insípido que es esencial para la vida'
    })
    definicion: string;

    @ApiProperty({
        description: 'Ejemplo de uso en español',
        example: 'El agua del río está muy fría',
        required: false
    })
    ejemploEspanol?: string;

    @ApiProperty({
        description: 'Ejemplo de uso en Triqui',
        example: 'Yaa nij si ga\'a',
        required: false
    })
    ejemploTriqui?: string;

    @ApiProperty({
        description: 'Traducción del ejemplo en Triqui',
        example: 'El agua del río está muy fría',
        required: false
    })
    traduccionEjemplo?: string;

    @ApiProperty({
        description: 'Palabras relacionadas o sinónimos',
        type: [String],
        example: ['líquido', 'H2O'],
        required: false
    })
    palabrasRelacionadas?: string[];

    @ApiProperty({
        description: 'Notas adicionales sobre la palabra',
        example: 'Palabra fundamental en el vocabulario básico',
        required: false
    })
    notas?: string;

    @ApiProperty({
        description: 'Nivel de dificultad (1: básico, 2: intermedio, 3: avanzado)',
        example: 1,
        minimum: 1,
        maximum: 3
    })
    nivelDificultad: number;

    @ApiProperty({
        description: 'Fecha de creación del registro',
        example: '2024-01-01T00:00:00.000Z'
    })
    fechaCreacion: Date;

    @ApiProperty({
        description: 'Variantes dialectales de la palabra Triqui',
        type: [String],
        example: ['yaa', 'ya\'a'],
        required: false
    })
    variantesDialectales?: string[];
}