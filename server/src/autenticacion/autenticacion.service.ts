import { Injectable } from '@nestjs/common';
import { CreateAutenticacionDto } from './dto/create-autenticacion.dto';
import { UpdateAutenticacionDto } from './dto/update-autenticacion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class AutenticacionService {
  constructor(
    @InjectModel(Usuario.name) private UsuarioModel: Model<Usuario>,
  ) {}

  async registro(createAutenticacionDto: CreateAutenticacionDto) {
    const usuarioCreado = await this.UsuarioModel.create(
      createAutenticacionDto,
    );
    return usuarioCreado;
  }

  // async ingreso() {
  //   return 'respuestaEnProgreso';
  // }

  // async findOne(id: number) {
  //   return 'respuestaEnProgreso';
  // }

  // async update(id: number, updateAutenticacionDto: UpdateAutenticacionDto) {
  //   return 'respuestaEnProgreso';
  // }

  // async remove(id: number) {
  //   return 'respuestaEnProgreso';
  // }
}
