import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Publicacion {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop()
  imagenUrl?: string;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Usuario' }], default: [] })
  meGusta: Types.ObjectId[];

  // @Prop({ type: [Comentario], default: []})
  // comentarios: Comentario[];

  @Prop({ default: true })
  activo: boolean;

  @Prop({ default: Date.now })
  creadoEn: Date;
}

export const PublicacionesSchema = SchemaFactory.createForClass(Publicacion);
