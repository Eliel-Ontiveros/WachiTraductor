import { Module } from '@nestjs/common';
import { CulturaController } from './cultura.controller';
import { CulturaService } from './cultura.service';

@Module({
    controllers: [CulturaController],
    providers: [CulturaService],
})
export class CulturaModule { }