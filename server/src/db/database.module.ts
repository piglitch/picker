import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Global() // Makes this module available globally
@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const pool = new Pool({
          user: configService.get<string>('POSTGRES_USER'),
          host: configService.get<string>('POSTGRES_HOST'),
          database: configService.get<string>('POSTGRES_DB'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          port: configService.get<number>('POSTGRES_PORT', 5432),
        });

        // Test the connection
        await pool.connect();
        return pool;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
