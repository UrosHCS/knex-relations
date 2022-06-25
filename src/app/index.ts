import { postModule } from './post';
import { userModule } from './user';

export async function initApp() {
  // Import the modules asynchronously because table creation
  // needs to wait for the database to be connected
  return { userModule, postModule };
}
