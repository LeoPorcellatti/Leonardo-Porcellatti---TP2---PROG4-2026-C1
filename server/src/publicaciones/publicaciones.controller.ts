/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
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
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  publicar(
    @Body() createPublicacionesDto: CreatePublicacionesDto,
    @Headers('authorization') auth: string,
  ) {
    return this.publicacionesService.publicar(createPublicacionesDto, auth);
  }

  @Post(':id')
  likear(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.publicacionesService.likear(id, auth);
  }

  @Get()
  listar(
    @Query('orden') orden: string,
    @Query('limite') limite: number,
    @Query('offset') offset: number,
    @Query('usuario') usuario: string,
  ) {
    return this.publicacionesService.listar(orden, limite, offset, usuario);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicacionesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePublicacionesDto: UpdatePublicacionesDto,
  ) {
    return this.publicacionesService.update(+id, updatePublicacionesDto);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.publicacionesService.eliminar(id, auth);
  }

  @Delete(':id/dislike')
  deslikear(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.publicacionesService.deslikear(id, auth);
  }
}
