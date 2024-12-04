import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { BadRequestExceptionFilter } from './filters/BadRequestException.filter';
import { ThrottlerExceptionFilter } from './filters/ThrottlerException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  mongoose.set('debug', true);
  app.enableCors();

  app.useGlobalFilters(
    new BadRequestExceptionFilter(),
    new ThrottlerExceptionFilter(),
  );

  if (process.env.NODE_ENV !== 'production') {
    app.use(
      ['/docs', '/docs-json'], // 保护的路由
      basicAuth({
        challenge: true,
        users: { dev: '123456&*' }, // 用户名和密码
      }),
    );
    const config = new DocumentBuilder()
      .setTitle('Document')
      .setDescription('API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
  await app.listen(3000);
}
bootstrap();
