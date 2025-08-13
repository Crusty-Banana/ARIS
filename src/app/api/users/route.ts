import { ObjectIdAsHexString } from "@/modules/business-types";
import { AddUser$Params, DisplayUser, GetUsers$Params, handler$AddUser, handler$GetUsers } from "@/modules/commands/CRUDUser/crud";
import { createRoute } from "@/modules/constructors/BaseRoute/route";
import { z } from "zod";

export const POST = createRoute<AddUser$Params, ObjectIdAsHexString>({
  params: AddUser$Params,
  handler: handler$AddUser,
  success_message: "User added successfully",
  needAuth: true,
  needAdmin: true,
});

export const GET = createRoute<GetUsers$Params, (z.infer<typeof DisplayUser>)[]>({
  params: GetUsers$Params,
  handler: handler$GetUsers,
  success_message: "Users retrieved successfully",
  needAuth: true,
  needSearchParams: true,
  useId: true,
});