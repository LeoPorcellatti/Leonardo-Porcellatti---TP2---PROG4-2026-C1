import { Module } from '@nestjs/common';
import { FutbolistasService } from './futbolistas.service';
import { FutbolistasController } from './futbolistas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Futbolistas, FutbolistaSchema } from './entities/futbolista.entity';
import { PaisSchema } from './entities/pais.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Futbolistas.name, schema: FutbolistaSchema },
      { name: 'Pais', schema: PaisSchema },
    ]),
  ],
  controllers: [FutbolistasController],
  providers: [FutbolistasService],
})
export class FutbolistasModule {}
