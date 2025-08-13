import { ObjectIdAsHexString, User } from "@/modules/business-types";
import { AddUser$Params, GetUsers$Params, handler$AddUser, handler$GetUsers } from "@/modules/commands/CRUDUser/crud";
import { createRoute } from "@/modules/constructors/BaseRoute/route";

export const POST = createRoute<AddUser$Params, ObjectIdAsHexString>({
  params: AddUser$Params,
  handler: handler$AddUser,
  success_message: "User added successfully",
  needAuth: true,
  needAdmin: true,
});

export const GET = createRoute<GetUsers$Params, (typeof User)[]>({
  params: GetUsers$Params,
  handler: handler$GetUsers,
  success_message: "Users retrieved successfully",
  needAuth: true,
  needSearchParams: true,
  useId: true,
});