import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'; // 1. ייבוא הטיפוס של Express
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // 2. הוספת הטיפוס הגנרי <NestExpressApplication> כדי ש-TypeScript יכיר את פקודות Express
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. הפעלת CORS בצורה מתירנית (מאפשרת לכל דומיין לגשת)
  app.enableCors({
    origin: true, // מאפשר לכל מקור (Vercel) לגשת
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. אבטחה בסיסית וולידציה
  app.disable('x-powered-by'); // עכשיו זה תקין כי הגדרנו שזו אפליקציית Express
  app.useGlobalPipes(new ValidationPipe());

  // 3. האזנה לפורט של Render או ל-3001
  await app.listen(process.env.PORT || 3001);
}
bootstrap();