import { Pool, PoolClient } from 'pg';
import config from '../config';

class DatabaseConnection {
  private pool: Pool;
  private static instance: DatabaseConnection;

  private constructor() {
    this.pool = new Pool({
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
      password: config.database.password,
      max: config.database.maxConnections,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async query(text: string, params?: any[]) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('query error', { text, error });
      throw error;
    }
  }

  public async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

export default DatabaseConnection.getInstance();

