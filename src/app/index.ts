export async function initApp() {
  // Import the modules asynchronously because table creation
  // needs to wait for the database to be connected
  const [{ userModule }, { postModule }] = await Promise.all([import('./user'), import('./post')]);
  return { userModule, postModule };
}
