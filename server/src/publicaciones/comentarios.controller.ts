/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Post, Put, Body, Headers, Param } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentarios.dto';
import { UpdateComentarioDto } from './dto/update-comentarios.dto';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  comentar(
    @Body() crearComentario: CreateComentarioDto,
    @Headers('authorization') auth: string,
  ) {
    return this.comentariosService.comentar(crearComentario, auth);
  }

  @Put(':id')
  modificar(
    @Param('id') id: string,
    @Body() modificarComentarioDto: UpdateComentarioDto,
    @Headers('authorization') auth: string,
  ) {
    return this.comentariosService.modificar(id, modificarComentarioDto, auth);
  }
}
