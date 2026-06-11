/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacion } from './entities/publicacion.entity';
import { Model } from 'mongoose';
import { verify } from 'jsonwebtoken';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Comentario } from './entities/comentario.entity';
import { CreateComentarioDto } from './dto/create-comentarios.dto';
import { UpdateComentarioDto } from './dto/update-comentarios.dto';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectModel(Publicacion.name) private PublicacionModel: Model<Publicacion>,
    @InjectModel(Usuario.name) private UsuarioModel: Model<Usuario>,
    @InjectModel(Comentario.name) private ComentarioModel: Model<Comentario>,
  ) {}

  private extraerPayload(auth: string) {
    if (!auth) {
      throw new UnauthorizedException();
    }

    const token = auth.replace('Bearer ', '');
    return verify(token, process.env.CLAVE_SUPERSECRETA!) as any;
  }

  async comentar(crearComentario: CreateComentarioDto, auth: string) {
    const payload: any = this.extraerPayload(auth);

    const publicacion = await this.PublicacionModel.findOne({
      _id: crearComentario.publicacion,
      activo: true,
    });

    if (!publicacion) {
      throw new NotFoundException();
    }

    const comentario = await this.ComentarioModel.create({
      publicacion: crearComentario.publicacion,
      usuario: payload._id,
      mensaje: crearComentario.mensaje,
    });

    return comentario.populate(
      'usuario',
      'nombre apellido nombreDeUsuario imagenDePerfil',
    );
  }

  async modificar(
    id: string,
    modificarComentario: UpdateComentarioDto,
    auth: string,
  ) {
    const payload: any = this.extraerPayload(auth);

    const comentario = await this.ComentarioModel.findOne({
      _id: id,
      activo: true,
    });

    if (!comentario) {
      throw new NotFoundException();
    }

    if (comentario.usuario.toString() !== payload._id) {
      throw new UnauthorizedException();
    }

    const comentarioActualizado = await this.ComentarioModel.findOneAndUpdate(
      { _id: id },
      {
        mensaje: modificarComentario.mensaje,
        modificado: true,
      },
      { returnDocument: 'after' },
    );

    return comentarioActualizado;
  }

  async listar(
    orden: string,
    limite: number,
    offset: number,
    usuario?: string,
  ) {
    try {
      const filtro: any = { activo: true };

      if (usuario) {
        filtro.usuario = usuario;
      }

      const publicaciones = await this.PublicacionModel.aggregate([
        { $match: filtro },
        { $addFields: { cantidadMeGusta: { $size: '$meGusta' } } },
        {
          $sort:
            orden === 'megusta' ? { cantidadMeGusta: -1 } : { creadoEn: -1 },
        },
        { $skip: Number(offset) || 0 },
        { $limit: Number(limite) || 5 },
      ]);

      for (const publicacion of publicaciones) {
        const usuario = await this.UsuarioModel.findById(publicacion.usuario);

        publicacion.usuarioNombre = usuario?.nombreDeUsuario;

        publicacion.usuarioImagen = usuario?.imagenDePerfil;
      }

      return publicaciones;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async traerComentarios(publicacionId: string, limte: number, offset: number) {
    const publicacion = await this.PublicacionModel.findOne({
      _id: publicacionId,
      activo: true,
    });

    if (!publicacion) {
      throw new NotFoundException();
    }

    const comentarios = await this.ComentarioModel.find({
      publicacion: publicacionId,
      activo: true,
    })
      .sort({ creadoEn: -1 })
      .skip(Number(offset) || 0)
      .limit(Number(limte) || 3)
      .populate('usuario', 'nombre apellido nombreDeUsuario imagenDePerfil');

    const total = await this.ComentarioModel.countDocuments({
      publicacion: publicacionId,
      activo: true,
    });

    return { comentarios, total };
  }
}
