import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FutbolistasModule } from './futbolistas/futbolistas.module';

@Module({
  imports: [FutbolistasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
