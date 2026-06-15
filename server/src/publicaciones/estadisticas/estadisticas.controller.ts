/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Headers, Query } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';

@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('publicaciones-por-usuario')
  publicacionesPorUsuario(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
    @Headers('authorization') auth: string,
  ) {
    return this.estadisticasService.publicacionesPorUsuario(desde, hasta, auth);
  }

  @Get('comentarios-por-fecha')
  comentariosPorFechas(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
    @Headers('authorization') auth: string,
  ) {
    return this.estadisticasService.comentariosPorFechas(desde, hasta, auth);
  }

  @Get('comentarios-por-publicacion')
  comentariosPorPublicacion(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
    @Headers('authorization') auth: string,
  ) {
    return this.estadisticasService.comentariosPorPublicacion(
      desde,
      hasta,
      auth,
    );
  }
}
