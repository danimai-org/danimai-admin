import { Module } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({})
export class TestModule {
  constructor(@InjectDataSource() dataSource: DataSource) {
    console.log('dataSource', dataSource.migrations);
  }
}
