import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export enum DireccionTraduccion {
    ESPANOL_A_TRIQUI = 'español-triqui',
    TRIQUI_A_ESPANOL = 'triqui-español',
}

export class TraducirDto {
    @ApiProperty({
        description: 'Texto a traducir',
        example: 'agua',
    })
    @IsString()
    @IsNotEmpty()
    texto: string;

    @ApiProperty({
        description: 'Dirección de la traducción',
        enum: DireccionTraduccion,
        example: DireccionTraduccion.ESPANOL_A_TRIQUI,
    })
    @IsEnum(DireccionTraduccion)
    direccion: DireccionTraduccion;
}

export class ResultadoTraduccion {
    @ApiProperty({
        description: 'Texto original',
        example: 'agua',
    })
    textoOriginal: string;

    @ApiProperty({
        description: 'Texto traducido',
        example: 'yaa',
    })
    textoTraducido: string;

    @ApiProperty({
        description: 'Dirección de la traducción',
        enum: DireccionTraduccion,
    })
    direccion: DireccionTraduccion;

    @ApiProperty({
        description: 'Confianza de la traducción (0-100)',
        example: 95,
    })
    confianza: number;

    @ApiProperty({
        description: 'Traducciones alternativas encontradas',
        type: [String],
        example: ['ya\'a', 'yaa'],
    })
    alternativas: string[];

    @ApiProperty({
        description: 'Información adicional sobre la traducción',
        example: 'Traducción exacta encontrada en diccionario',
    })
    @IsOptional()
    notas?: string;
}