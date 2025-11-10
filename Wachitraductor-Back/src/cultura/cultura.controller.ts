import {
    Controller,
    Get,
    Param,
    Query,
    ParseIntPipe,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiParam,
} from '@nestjs/swagger';
import { CulturaService } from './cultura.service';
import { FiltrarCulturaDto, TipoInformacion } from './dto/filtrar-cultura.dto';
import { InformacionCultural } from './entities/informacion-cultural.entity';

@ApiTags('cultura')
@Controller('cultura')
export class CulturaController {
    constructor(private readonly culturaService: CulturaService) { }

    @Get()
    @ApiOperation({
        summary: 'Obtener información cultural filtrada',
        description: 'Obtiene información cultural de la cultura Triqui con opciones de filtrado y búsqueda',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de información cultural obtenida exitosamente',
    })
    @ApiQuery({
        name: 'busqueda',
        required: false,
        description: 'Término de búsqueda',
        example: 'ceremonia',
    })
    @ApiQuery({
        name: 'tipo',
        required: false,
        enum: TipoInformacion,
        description: 'Tipo de información cultural',
    })
    @ApiQuery({
        name: 'pagina',
        required: false,
        description: 'Número de página',
        example: 1,
    })
    @ApiQuery({
        name: 'limite',
        required: false,
        description: 'Elementos por página',
        example: 10,
    })
    async obtenerInformacionFiltrada(@Query() filtros: FiltrarCulturaDto) {
        try {
            const resultado = await this.culturaService.filtrarInformacion(filtros);
            return {
                exito: true,
                mensaje: 'Información cultural obtenida exitosamente',
                ...resultado,
            };
        } catch (error) {
            throw new HttpException(
                'Error al obtener información cultural',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('tipos')
    @ApiOperation({
        summary: 'Obtener tipos de información disponibles',
        description: 'Obtiene los tipos de información cultural disponibles',
    })
    @ApiResponse({
        status: 200,
        description: 'Tipos de información obtenidos exitosamente',
    })
    async obtenerTipos() {
        try {
            const tipos = await this.culturaService.obtenerTipos();
            return {
                exito: true,
                mensaje: 'Tipos de información obtenidos exitosamente',
                datos: tipos,
            };
        } catch (error) {
            throw new HttpException(
                'Error al obtener tipos de información',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('tipos/configuracion')
    @ApiOperation({
        summary: 'Obtener configuración completa de tipos',
        description: 'Obtiene la configuración de tipos con nombres formateados y colores',
    })
    @ApiResponse({
        status: 200,
        description: 'Configuración de tipos obtenida exitosamente',
    })
    async obtenerConfiguracionTipos() {
        try {
            const configuracion = await this.culturaService.obtenerConfiguracionTipos();
            return {
                exito: true,
                mensaje: 'Configuración de tipos obtenida exitosamente',
                datos: configuracion,
            };
        } catch (error) {
            throw new HttpException(
                'Error al obtener configuración de tipos',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('todo')
    @ApiOperation({
        summary: 'Obtener toda la información cultural',
        description: 'Obtiene toda la información cultural disponible sin filtros',
    })
    @ApiResponse({
        status: 200,
        description: 'Toda la información cultural obtenida exitosamente',
        type: [InformacionCultural],
    })
    async obtenerTodo() {
        try {
            const datos = await this.culturaService.obtenerTodo();
            return {
                exito: true,
                mensaje: 'Información cultural obtenida exitosamente',
                datos,
                total: datos.length,
            };
        } catch (error) {
            throw new HttpException(
                'Error al obtener información cultural',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener información cultural por ID',
        description: 'Obtiene información cultural específica por su identificador',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de la información cultural',
        example: 1,
    })
    @ApiResponse({
        status: 200,
        description: 'Información cultural obtenida exitosamente',
        type: InformacionCultural,
    })
    @ApiResponse({
        status: 404,
        description: 'Información cultural no encontrada',
    })
    async obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        try {
            const informacion = await this.culturaService.obtenerPorId(id);

            if (!informacion) {
                throw new HttpException(
                    'Información cultural no encontrada',
                    HttpStatus.NOT_FOUND,
                );
            }

            return {
                exito: true,
                mensaje: 'Información cultural obtenida exitosamente',
                datos: informacion,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Error al obtener información cultural',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}