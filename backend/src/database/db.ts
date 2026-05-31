import { AppDataSource } from "../config/database";

export class Database {
    private static instance: Database;
    private initializingPromise: Promise<void> | null = null;

    public static getDataBaseInstance(): Database {
      if (!Database.instance) {
        Database.instance = new Database();
      }
      return Database.instance;
    }

    public getDataSource() {
        return AppDataSource;
    }

    public async init(): Promise<void> {
      if (AppDataSource.isInitialized) return;
      if (this.initializingPromise) return this.initializingPromise;

      this.initializingPromise = (async () => {
        try {
          await AppDataSource.initialize();
          console.log('Base de datos conectada exitosamente');
        } catch (error) {
          console.error('Error al conectar con la base de datos:', error);
          process.exit(1);
        } finally {
          this.initializingPromise = null;
        }
      })();

      return this.initializingPromise;
  }  
}