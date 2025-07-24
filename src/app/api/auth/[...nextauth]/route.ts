import { handler$Authenticate } from '@/modules/commands/Authenticate/handler';
import { getDb } from '@/modules/mongodb';

const db = await getDb();

const handler = handler$Authenticate(db);

export { handler as GET, handler as POST };