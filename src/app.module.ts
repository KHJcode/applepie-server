import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseConfigModule } from './database-config.module';
import { ConfigModule } from '@nestjs/config';
import { RecipeModule } from './recipe/recipe.module';
import { PostModule } from './post/post.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { CommentModule } from './comment/comment.module';
import { ENV_PATH } from './constants';

@Module({
  imports: [
    MorganModule,
    UserModule,
    AuthModule,
    DatabaseConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [ENV_PATH],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    RecipeModule,
    PostModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('dev'),
    },
  ],
})
export class AppModule {}
