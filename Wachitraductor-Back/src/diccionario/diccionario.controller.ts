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
import { DiccionarioService } from './diccionario.service';
import { FiltrarDiccionarioDto, RespuestaPaginadaDiccionario, CategoriaGramatical } from './dto/filtrar-diccionario.dto';
import { EntradaDiccionario } from './entities/entrada-diccionario.entity';

@ApiTags('diccionario')
@Controller('diccionario')
export class DiccionarioController {
    constructor(private readonly diccionarioService: DiccionarioService) { }

    @Get()
    @ApiOperation({
        summary: 'Obtener entradas del diccionario con filtros',
        description: 'Obtiene entradas del diccionario Triqui-Español con opciones de filtrado, búsqueda y paginación',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de entradas del diccionario obtenida exitosamente',
        type: RespuestaPaginadaDiccionario,
    })
    @ApiQuery({
        name: 'busqueda',
        required: false,
        description: 'Término de búsqueda en español o triqui',
        example: 'agua',
    })
    @ApiQuery({
        name: 'categoria',
        required: false,
        enum: CategoriaGramatical,
        description: 'Filtrar por categoría gramatical',
    })
    @ApiQuery({
        name: 'areaTematica',
        required: false,
        description: 'Filtrar por área temática (string). Las áreas disponibles son dinámicas según los datos',
        example: 'numeros'
    })
    @ApiQuery({
        name: 'nivelDificultad',
        required: false,
        description: 'Filtrar por nivel de dificultad (1-3)',
        example: 1,
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
        description: 'Elementos por página (máximo 100)',
        example: 20,
    })
    @ApiQuery({
        name: 'idioma',
        required: false,
        description: 'Idioma de búsqueda',
        example: 'ambos',
        enum: ['español', 'triqui', 'ambos'],
    })
    @ApiQuery({
        name: 'ordenarPor',
        required: false,
        description: 'Campo por el cual ordenar',
        example: 'palabra-espanol',
        enum: ['palabra-espanol', 'palabra-triqui', 'categoria', 'nivel', 'fecha'],
    })
    @ApiQuery({
        name: 'direccion',
        required: false,
        description: 'Dirección del ordenamiento',
        example: 'asc',
        enum: ['asc', 'desc'],
    })
    async obtenerEntradas(
        @Query() filtros: FiltrarDiccionarioDto,
    ): Promise<RespuestaPaginadaDiccionario> {
        try {
            return await this.diccionarioService.buscarPorFiltros(filtros);
        } catch (error) {
            throw new HttpException(
                'Error al obtener entradas del diccionario',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('todas')
    @ApiOperation({
        summary: 'Obtener todas las entradas del diccionario',
        description: 'Obtiene todas las entradas del diccionario sin paginación',
    })
    @ApiResponse({
        status: 200,
        description: 'Todas las entradas del diccionario',
        type: [EntradaDiccionario],
    })
    async obtenerTodasLasEntradas(): Promise<EntradaDiccionario[]> {
        try {
            return await this.diccionarioService.obtenerTodo();
        } catch (error) {
            throw new HttpException(
                'Error al obtener todas las entradas',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('estadisticas')
    @ApiOperation({
        summary: 'Obtener estadísticas del diccionario',
        description: 'Obtiene estadísticas sobre categorías, áreas temáticas y niveles de dificultad',
    })
    @ApiResponse({
        status: 200,
        description: 'Estadísticas del diccionario',
    })
    async obtenerEstadisticas() {
        try {
            return await this.diccionarioService.obtenerEstadisticas();
        } catch (error) {
            throw new HttpException(
                'Error al obtener estadísticas',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('categorias')
    @ApiOperation({
        summary: 'Obtener todas las categorías gramaticales',
        description: 'Lista todas las categorías gramaticales disponibles en el diccionario',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de categorías gramaticales',
        type: [String],
    })
    async obtenerCategorias(): Promise<string[]> {
        try {
            return await this.diccionarioService.obtenerCategorias();
        } catch (error) {
            throw new HttpException(
                'Error al obtener categorías',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('areas-tematicas')
    @ApiOperation({
        summary: 'Obtener todas las áreas temáticas',
        description: 'Lista todas las áreas temáticas disponibles en el diccionario',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de áreas temáticas',
        type: [String],
    })
    async obtenerAreasTematicas(): Promise<string[]> {
        try {
            return await this.diccionarioService.obtenerAreasTematicas();
        } catch (error) {
            throw new HttpException(
                'Error al obtener áreas temáticas',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('sugerencias')
    @ApiOperation({
        summary: 'Obtener sugerencias de búsqueda',
        description: 'Obtiene sugerencias de palabras basadas en un término de búsqueda',
    })
    @ApiQuery({
        name: 'q',
        description: 'Término de búsqueda para obtener sugerencias',
        example: 'ag',
    })
    @ApiQuery({
        name: 'limite',
        required: false,
        description: 'Número máximo de sugerencias',
        example: 5,
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de sugerencias',
        type: [String],
    })
    async obtenerSugerencias(
        @Query('q') termino: string,
        @Query('limite', new ParseIntPipe({ optional: true })) limite?: number,
    ): Promise<string[]> {
        if (!termino || termino.trim().length < 2) {
            return [];
        }

        try {
            return await this.diccionarioService.buscarSugerencias(termino, limite);
        } catch (error) {
            throw new HttpException(
                'Error al obtener sugerencias',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('buscar/:palabra')
    @ApiOperation({
        summary: 'Buscar entrada exacta por palabra',
        description: 'Busca una entrada específica del diccionario por palabra exacta',
    })
    @ApiParam({
        name: 'palabra',
        description: 'Palabra a buscar (en español o triqui)',
        example: 'agua',
    })
    @ApiQuery({
        name: 'idioma',
        required: false,
        description: 'Idioma de la palabra de búsqueda',
        enum: ['español', 'triqui'],
    })
    @ApiResponse({
        status: 200,
        description: 'Entradas encontradas',
        type: [EntradaDiccionario],
    })
    @ApiResponse({
        status: 404,
        description: 'Palabra no encontrada',
    })
    async buscarPorPalabra(
        @Param('palabra') palabra: string,
        @Query('idioma') idioma?: 'español' | 'triqui',
    ): Promise<EntradaDiccionario[]> {
        try {
            const entradas = await this.diccionarioService.buscarPorPalabra(palabra, idioma);

            if (entradas.length === 0) {
                throw new HttpException(
                    `Palabra "${palabra}" no encontrada en el diccionario`,
                    HttpStatus.NOT_FOUND,
                );
            }

            return entradas;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Error al buscar palabra',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener entrada del diccionario por ID',
        description: 'Obtiene una entrada específica del diccionario por su identificador único',
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la entrada del diccionario',
        example: 1,
    })
    @ApiResponse({
        status: 200,
        description: 'Entrada del diccionario encontrada',
        type: EntradaDiccionario,
    })
    @ApiResponse({
        status: 404,
        description: 'Entrada no encontrada',
    })
    async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<EntradaDiccionario> {
        try {
            const entrada = await this.diccionarioService.obtenerPorId(id);

            if (!entrada) {
                throw new HttpException(
                    `Entrada con ID ${id} no encontrada`,
                    HttpStatus.NOT_FOUND,
                );
            }

            return entrada;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Error al obtener entrada',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}