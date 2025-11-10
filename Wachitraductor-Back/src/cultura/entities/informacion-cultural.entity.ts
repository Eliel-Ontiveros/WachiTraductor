import { ApiProperty } from '@nestjs/swagger';

export class InformacionCultural {
    @ApiProperty({
        description: 'Identificador único de la información',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Título de la información cultural',
        example: 'Ceremonia del Fuego Sagrado',
    })
    titulo: string;

    @ApiProperty({
        description: 'Descripción detallada de la información',
        example: 'La ceremonia del fuego sagrado es una tradición ancestral...',
    })
    descripcion: string;

    @ApiProperty({
        description: 'Tipo de información cultural',
        example: 'tradiciones',
    })
    tipo: string;

    @ApiProperty({
        description: 'URL de imagen relacionada (opcional)',
        example: 'https://ejemplo.com/imagen.jpg',
        required: false,
    })
    imagen?: string;

    @ApiProperty({
        description: 'Palabras clave para búsqueda',
        example: ['ceremonia', 'fuego', 'tradición', 'ancestral'],
        type: [String],
    })
    palabrasClave: string[];

    @ApiProperty({
        description: 'Región específica donde se practica',
        example: 'Oaxaca, México',
    })
    region: string;

    @ApiProperty({
        description: 'Fecha de creación del registro',
        example: '2024-01-01T00:00:00.000Z',
    })
    fechaCreacion: Date;
}