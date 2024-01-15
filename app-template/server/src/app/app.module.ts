import { Module } from '@nestjs/common'

import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'


import { StorageModule } from '@ss/storage'
import { AuthModule } from '@ss/auth'
import { ApiModule } from '@ss/api'
import { DataModule, DatabasesCollections, DbCollectionInfo, DbConnectionOptions } from '@ss/data'
import { CommonModule, SSConfig } from '@ss/common'
import { AuthenticatedRule, RulesModule } from '@ss/rules'

import { JobSchedulerConfig, JobSchedulerModule } from '@ss/job'

import { config } from './config'
const collections = {} as DbCollectionInfo
const conf = new SSConfig()
const appRules = []

const dbConnectionOptions = {
  'DB_DEFAULT': {
    collections: collections,
    dbConnectionOptions: {
      prefix: 'cp_',
      autoCreate: true,
      autoIndex: true,
    } as DbConnectionOptions,
    migrations: []
  }
} as DatabasesCollections

@Module({
  imports: [
    ConfigModule.forRoot({ load: [() => config] }),
    DataModule.register(dbConnectionOptions, { 'DB_DEFAULT': '' }),
    CommonModule.register(conf),
    RulesModule.register(AuthenticatedRule, appRules),
    AuthModule.register({ secret: '123321132' }),
    ApiModule.register(),
    ScheduleModule.forRoot(),
    StorageModule.register(),
    JobSchedulerModule.register(new JobSchedulerConfig()),
    // NotificationsModule.register(config.NOTIFICATIONS_CONFIG.channels, config.NOTIFICATIONS_CONFIG.topics)
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }