import { handler$Authenticate } from '@/modules/commands/Authenticate/handler';

const handler = handler$Authenticate();

export { handler as GET, handler as POST };