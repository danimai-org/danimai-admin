import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { documentationBuilder } from './helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  documentationBuilder(app);
  await app.listen(8000);
}
bootstrap();
