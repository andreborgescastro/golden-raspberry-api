import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runSeed } from './seeds/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.init();
  await runSeed(app);        // carrega CSV

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
