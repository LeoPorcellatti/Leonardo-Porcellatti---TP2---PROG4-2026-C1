import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Usuario {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  nombreDeUsuario: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fechaDeNacimiento: string;

  @Prop()
  descripcion: string;

  @Prop()
  imagenDePerfil: string;

  @Prop({ enum: ['usuario', 'administrador'], default: 'usuario' })
  perfil?: string;

  @Prop({ default: true })
  activo: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
