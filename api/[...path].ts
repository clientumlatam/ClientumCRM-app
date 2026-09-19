// Keep the extension explicit: Vercel runs this function as ESM and the
// extensionless path collides with the sibling `server/` directory.
import { app } from "../server.ts";

export default app;