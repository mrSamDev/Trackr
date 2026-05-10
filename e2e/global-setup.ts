import { setupAuth } from './helpers/auth';

export default async function globalSetup() {
  await setupAuth();
}
