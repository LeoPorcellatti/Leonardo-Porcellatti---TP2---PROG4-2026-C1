/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RegistroUsuarioDTO } from './dto/registro-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private UsuarioModel: Model<Usuario>,
  ) {}

  async obtenerUsuarioPorId(id: string) {
    try {
      const usuario = await this.UsuarioModel.findById(id);

      if (!usuario) {
        throw new NotFoundException();
      }
      const { password, ...usuarioSinPassword } = usuario.toObject();

      return usuarioSinPassword;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  create(registro: RegistroUsuarioDTO) {
    return 'This action adds a new usuario';
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
