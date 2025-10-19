import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // <--- הוסף את השורה הזאת
  await app.listen(3001); // מומלץ לשנות את הפורט ל-3001 כדי למנוע התנגשות
}
bootstrap();
