import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { RegistroUsuarioDTO } from '../usuarios/dto/registro-usuario.dto';
import { LoginUsuarioDTO } from '../usuarios/dto/login-usuario.dto';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post('/registro')
  create(@Body() usuario: RegistroUsuarioDTO) {
    return this.autenticacionService.registro(usuario);
  }

  @Post('/login')
  findOne(@Body() usuario: LoginUsuarioDTO) {
    return this.autenticacionService.login(usuario);
  }

  // @Post('/login'){
  //   findOne(@Param('email'))
  // }

  // @Get()
  // findAll() {
  //   return this.autenticacionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.autenticacionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateAutenticacionDto: UpdateAutenticacionDto,
  // ) {
  //   return this.autenticacionService.update(+id, updateAutenticacionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.autenticacionService.remove(+id);
  // }
}
