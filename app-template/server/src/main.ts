import { bootstrap } from '@ss/common';
import { AppModule } from './app/app.module';

bootstrap(AppModule, +(process.env.PORT || '3333'), {
  applicationName: 'app'
});

