import { Module } from '@nestjs/common';
import { CulturaModule } from './cultura/cultura.module';
import { DiccionarioModule } from './diccionario/diccionario.module';

@Module({
    imports: [CulturaModule, DiccionarioModule],
    controllers: [],
    providers: [],
})
export class AppModule { }