import { 
  cloudMongoDbUrl,
  FIREBASE,
  FS,
  localMongoDbUrl,
  MEMORY,
  MONGODB,
  MONGODBAAS,
  MYSQL_MARIADB,
  SQLITE3,
  USED_PERSISTENCY_TYPE
} from "../../constants";
import Fs from "./Fs";
import MysqlMariadb from "./MysqlMariadb";
import Sqlite3 from "./Sqlite3";
import Mongodb from "./Mongodb";
import Firebase from "./Firebase";
import Memory from "./Memory";

export default (resource: string) => {
  switch (USED_PERSISTENCY_TYPE) {
    case MEMORY:
      return new Memory(resource);
    case FS:
      return new Fs(resource);
    case MYSQL_MARIADB:
      return new MysqlMariadb(resource);
    case SQLITE3:
      return new Sqlite3(resource);
    case MONGODB:
      return new Mongodb(resource, localMongoDbUrl);
    case MONGODBAAS:
      return new Mongodb(resource, cloudMongoDbUrl);
    case FIREBASE:
      return new Firebase(resource);
  }
}