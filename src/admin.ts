import AdminBro from 'admin-bro';
import * as AdminBroExpress from '@admin-bro/express';
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Database, Resource } from '@admin-bro/typeorm';
import { ENV_PATH, entities } from './constants';

(async function runAdmin() {
  dotenv.config({ path: ENV_PATH });
  const PORT = process.env.ADMIN_PORT;

  const app = await NestFactory.create(AppModule);

  await AdminBro.registerAdapter({ Database, Resource });

  const adminBro = new AdminBro({
    resources: entities,
    rootPath: '/',
  });
  const router = (AdminBroExpress as any).buildRouter(adminBro);

  app.use(adminBro.options.rootPath, router);
  await app.listen(PORT).then(() => {
    console.log(`Server is running on port ${PORT}.`);
  });
})();
