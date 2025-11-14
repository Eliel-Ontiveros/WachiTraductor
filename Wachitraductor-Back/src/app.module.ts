import { Module } from '@nestjs/common';
import { CulturaModule } from './cultura/cultura.module';
import { DiccionarioModule } from './diccionario/diccionario.module';
import { TraduccionModule } from './traduccion/traduccion.module';

@Module({
    imports: [CulturaModule, DiccionarioModule, TraduccionModule],
    controllers: [],
    providers: [],
})
export class AppModule { }