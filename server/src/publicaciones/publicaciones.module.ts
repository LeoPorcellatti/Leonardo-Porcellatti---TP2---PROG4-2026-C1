import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from './entities/publicacion.entity';
import { Usuario, UsuarioSchema } from '../usuarios/entities/usuario.entity';
import { Comentario, ComentarioSchema } from './entities/comentario.entity';
import { ComentariosController } from './comentarios.controller';
import { ComentariosService } from './comentarios.service';
import { EstadisticasModule } from './estadisticas/estadisticas.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema },
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Comentario.name, schema: ComentarioSchema },
    ]),
    EstadisticasModule,
  ],
  controllers: [PublicacionesController, ComentariosController],
  providers: [PublicacionesService, ComentariosService],
  exports: [MongooseModule],
})
export class PublicacionesModule {}
