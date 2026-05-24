import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Futbolista {
  @Prop()
  nombre: string;

  @Prop()
  edad: number;

  @Prop()
  va_al_mundial: boolean;

  @Prop()
  pais: string;
}

export const FutbolistaSchema = SchemaFactory.createForClass(Futbolista);
