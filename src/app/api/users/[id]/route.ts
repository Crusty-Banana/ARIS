import { DeleteUser$Params, DisplayUser, GetUsers$Params, handler$DeleteUser, handler$GetUsers, handler$UpdateUser, UpdateUser$Params } from "@/modules/commands/CRUDUser/crud";
import { createRoute } from "@/modules/constructors/BaseRoute/route";
import { z } from "zod";

export const GET = createRoute<GetUsers$Params, (z.infer<typeof DisplayUser>)[]>({
  params: GetUsers$Params,
  handler: handler$GetUsers,
  success_message: "User retrieved successfully",
  needAuth: true,
  useId: true,
});

export const PUT = createRoute<UpdateUser$Params, number>({
  params: UpdateUser$Params,
  handler: handler$UpdateUser,
  success_message: "User updated successfully",
  needAuth: true,
  needAdmin: true,
  useId: true,
  omitResult: true,
});

export const DELETE = createRoute<DeleteUser$Params, number>({
  params: DeleteUser$Params,
  handler: handler$DeleteUser,
  success_message: "User deleted successfully",
  needAuth: true,
  needAdmin: true,
  useId: true,
  omitResult: true,
});