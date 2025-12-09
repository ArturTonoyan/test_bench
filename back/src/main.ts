import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS for frontend communication
  const frontendUrl = process.env.FRONTEND_URL;
  
  let allowedOrigins: string[] = [];
  if (frontendUrl) {
    allowedOrigins = frontendUrl.includes(',') 
      ? frontendUrl.split(',').map(url => url.trim())
      : [frontendUrl];
  } else {
    console.warn('WARNING: FRONTEND_URL environment variable is not set. CORS may not work correctly.');
  }
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.length > 0 && allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Allow all Vercel deployments (preview and production)
      if (origin.includes('.vercel.app')) {
        return callback(null, true);
      }
      
      // Allow Docker internal network communication
      if (origin.includes('frontend') || origin.startsWith('http://frontend')) {
        return callback(null, true);
      }
      
      // If no FRONTEND_URL is set, allow all origins (development mode)
      if (allowedOrigins.length === 0) {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Test Bench API')
    .setDescription('API documentation for Test Bench application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:${port}`);
  console.log(`Swagger documentation available at: http://0.0.0.0:${port}/docs`);
}
bootstrap();
