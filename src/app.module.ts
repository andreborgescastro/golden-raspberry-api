import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';
import { ProducersModule } from './producers/producers.module';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      autoLoadEntities: true, // carrega entidades registradas nos módulos
      logging: true,
    }), MoviesModule, ProducersModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);
  async onModuleInit() {
    this.logger.log('(SQLite ready)');
  }
}