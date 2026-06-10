import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Query,
} from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentarios.dto';

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

  // @Post(':id')
  // likear(@Param('id') id: string, @Headers('authorization') auth: string) {
  //   return this.publicacionesService.likear(id, auth);
  // }

  // @Get()
  // listar(
  //   @Query('orden') orden: string,
  //   @Query('limite') limite: number,
  //   @Query('offset') offset: number,
  //   @Query('usuario') usuario: string,
  // ) {
  //   return this.publicacionesService.listar(orden, limite, offset, usuario);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.publicacionesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePublicacionesDto: UpdatePublicacionesDto,
  // ) {
  //   return this.publicacionesService.update(+id, updatePublicacionesDto);
  // }

  // @Delete(':id')
  // eliminar(@Param('id') id: string, @Headers('authorization') auth: string) {
  //   return this.publicacionesService.eliminar(id, auth);
  // }

  // @Delete(':id/dislike')
  // deslikear(@Param('id') id: string, @Headers('authorization') auth: string) {
  //   return this.publicacionesService.deslikear(id, auth);
  // }
}
