/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { CreateAutenticacionDto } from './dto/create-autenticacion.dto';
import { UpdateAutenticacionDto } from './dto/update-autenticacion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { hash } from 'bcrypt';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';

@Injectable()
export class AutenticacionService {
  constructor(
    @InjectModel(Usuario.name) private UsuarioModel: Model<Usuario>,
  ) {}

  async registro(createUsuarioDto: CreateUsuarioDto) {
    const passwordHasheada = await hash(createUsuarioDto.password, 10);

    const usuarioCreado = await this.UsuarioModel.create({
      ...createUsuarioDto,
      password: passwordHasheada,
    });
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
