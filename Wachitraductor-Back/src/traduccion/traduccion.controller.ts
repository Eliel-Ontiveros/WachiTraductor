import {
    Controller,
    Post,
    Body,
    Get,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
} from '@nestjs/swagger';
import { TraduccionService } from './traduccion.service';
import { TraducirDto, ResultadoTraduccion } from './dto/traducir.dto';

@ApiTags('traduccion')
@Controller('traduccion')
export class TraduccionController {
    constructor(private readonly traduccionService: TraduccionService) { }

    @Post()
    @ApiOperation({
        summary: 'Traducir texto',
        description: 'Traduce texto entre español y triqui utilizando el diccionario disponible',
    })
    @ApiBody({
        type: TraducirDto,
        description: 'Datos del texto a traducir',
    })
    @ApiResponse({
        status: 200,
        description: 'Texto traducido exitosamente',
        type: ResultadoTraduccion,
    })
    @ApiResponse({
        status: 400,
        description: 'Datos de entrada inválidos',
    })
    @ApiResponse({
        status: 500,
        description: 'Error interno del servidor',
    })
    async traducir(@Body() traducirDto: TraducirDto): Promise<ResultadoTraduccion> {
        try {
            return await this.traduccionService.traducir(traducirDto);
        } catch (error) {
            throw new HttpException(
                'Error al procesar la traducción',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('estadisticas')
    @ApiOperation({
        summary: 'Obtener estadísticas de traducción',
        description: 'Obtiene información sobre el diccionario y las capacidades de traducción',
    })
    @ApiResponse({
        status: 200,
        description: 'Estadísticas obtenidas exitosamente',
    })
    async obtenerEstadisticas(): Promise<any> {
        try {
            return await this.traduccionService.obtenerEstadisticasTraduccion();
        } catch (error) {
            throw new HttpException(
                'Error al obtener estadísticas',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}