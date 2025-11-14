import { Module } from '@nestjs/common';
import { TraduccionController } from './traduccion.controller';
import { TraduccionService } from './traduccion.service';
import { DiccionarioModule } from '../diccionario/diccionario.module';

@Module({
    imports: [DiccionarioModule],
    controllers: [TraduccionController],
    providers: [TraduccionService],
    exports: [TraduccionService],
})
export class TraduccionModule { }