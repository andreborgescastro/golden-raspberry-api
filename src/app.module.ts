import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';
import { ProducersModule } from './producers/producers.module';
import { ConfigModule } from '@nestjs/config';
import { AwardsModule } from './awards/awards.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.SQLITE_DB || ':memory:',
      synchronize: true,
      autoLoadEntities: true, // carrega entidades registradas nos módulos
      logging: false,
    }), MoviesModule, ProducersModule, AwardsModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);
  async onModuleInit() {
    this.logger.log('(SQLite ready)');
  }
}