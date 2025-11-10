import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Configuración global de validación
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Configuración de CORS para el frontend
    app.enableCors({
        origin: true, // En producción, especificar el dominio del frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
    });

    // Configuración de Swagger
    const config = new DocumentBuilder()
        .setTitle('Wachitraductor API')
        .setDescription('API para la aplicación Wachitraductor - Cultura Triqui')
        .setVersion('1.0')
        .addTag('cultura')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';
    await app.listen(port, host);

}

bootstrap();