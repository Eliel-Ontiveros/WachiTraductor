import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export enum TipoInformacion {
    HISTORIA = 'historia',
    TRADICIONES = 'tradiciones',
    FESTIVALES = 'festivales',
    ARTESANIAS = 'artesanias',
    GASTRONOMIA = 'gastronomia',
    VESTIMENTA = 'vestimenta',
    MUSICA = 'musica',
    UBICACION = 'ubicacion',
    POBLACION = 'poblacion',
    IDIOMA = 'idioma',
    RELIGION = 'religion',
}

export class FiltrarCulturaDto {
    @ApiPropertyOptional({
        description: 'Término de búsqueda para filtrar contenido',
        example: 'ceremonia',
    })
    @IsOptional()
    @IsString()
    busqueda?: string;

    @ApiPropertyOptional({
        enum: TipoInformacion,
        description: 'Tipo de información cultural a filtrar',
        example: TipoInformacion.TRADICIONES,
    })
    @IsOptional()
    @IsEnum(TipoInformacion)
    tipo?: TipoInformacion;

    @ApiPropertyOptional({
        description: 'Página para paginación',
        example: 1,
        minimum: 1,
    })
    @IsOptional()
    @IsString()
    pagina?: string;

    @ApiPropertyOptional({
        description: 'Límite de elementos por página',
        example: 10,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @IsString()
    limite?: string;
}