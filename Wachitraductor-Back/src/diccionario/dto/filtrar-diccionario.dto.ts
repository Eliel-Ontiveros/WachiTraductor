import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoriaGramatical } from '../entities/entrada-diccionario.entity';

/**
 * DTO para filtrar y buscar entradas del diccionario
 */
export class FiltrarDiccionarioDto {
    @ApiPropertyOptional({
        description: 'Término de búsqueda que se aplicará a las palabras en español y Triqui',
        example: 'agua'
    })
    @IsOptional()
    @IsString()
    busqueda?: string;

    @ApiPropertyOptional({
        description: 'Filtrar por categoría gramatical',
        enum: CategoriaGramatical,
        example: CategoriaGramatical.SUSTANTIVO
    })
    @IsOptional()
    @IsEnum(CategoriaGramatical)
    categoria?: CategoriaGramatical;

    @ApiPropertyOptional({
        description: 'Filtrar por área temática (string). Las áreas son dinámicas y provienen de los datos',
        example: 'numeros'
    })
    @IsOptional()
    @IsString()
    areaTematica?: string;

    @ApiPropertyOptional({
        description: 'Filtrar por nivel de dificultad (1: básico, 2: intermedio, 3: avanzado)',
        example: 1,
        minimum: 1,
        maximum: 3
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @Max(3)
    nivelDificultad?: number;

    @ApiPropertyOptional({
        description: 'Número de página para paginación',
        example: 1,
        minimum: 1
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    pagina?: number = 1;

    @ApiPropertyOptional({
        description: 'Número de elementos por página',
        example: 20,
        minimum: 1,
        maximum: 100
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @Max(100)
    limite?: number = 20;

    @ApiPropertyOptional({
        description: 'Idioma de búsqueda (español, triqui, ambos)',
        example: 'ambos',
        enum: ['español', 'triqui', 'ambos']
    })
    @IsOptional()
    @IsEnum(['español', 'triqui', 'ambos'])
    idioma?: 'español' | 'triqui' | 'ambos' = 'ambos';

    @ApiPropertyOptional({
        description: 'Ordenar resultados por (palabra-espanol, palabra-triqui, categoria, nivel)',
        example: 'palabra-espanol',
        enum: ['palabra-espanol', 'palabra-triqui', 'categoria', 'nivel', 'fecha']
    })
    @IsOptional()
    @IsEnum(['palabra-espanol', 'palabra-triqui', 'categoria', 'nivel', 'fecha'])
    ordenarPor?: 'palabra-espanol' | 'palabra-triqui' | 'categoria' | 'nivel' | 'fecha' = 'palabra-espanol';

    @ApiPropertyOptional({
        description: 'Dirección del ordenamiento (asc, desc)',
        example: 'asc',
        enum: ['asc', 'desc']
    })
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    direccion?: 'asc' | 'desc' = 'asc';
}

/**
 * Respuesta paginada para el diccionario
 */
export class RespuestaPaginadaDiccionario {
    @ApiProperty({
        description: 'Lista de entradas del diccionario',
        type: 'array'
    })
    entradas: any[];

    @ApiProperty({
        description: 'Información de paginación'
    })
    paginacion: {
        paginaActual: number;
        totalPaginas: number;
        totalElementos: number;
        elementosPorPagina: number;
        hayPaginaSiguiente: boolean;
        hayPaginaAnterior: boolean;
    };

    @ApiProperty({
        description: 'Filtros aplicados en la búsqueda'
    })
    filtrosAplicados: FiltrarDiccionarioDto;
}

export { CategoriaGramatical };