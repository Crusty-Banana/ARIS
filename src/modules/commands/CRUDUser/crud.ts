import { User } from "@/modules/business-types";
import { createCRUD } from "@/modules/constructors/BaseCRUD/crud";
import { z } from "zod";

export const {
  addParams: AddUser$Params,
  getParams: GetUsers$Params,
  updateParams: UpdateUser$Params,
  deleteParams: DeleteUser$Params,
  addResult: AddUser$Result,
  getResult: GetUsers$Result,
  updateResult: UpdateUser$Result,
  deleteResult: DeleteUser$Result,
  addHandler: handler$AddUser,
  getHandler: handler$GetUsers,
  updateHandler: handler$UpdateUser,
  deleteHandler: handler$DeleteUser,
  addFetcher: httpPost$AddUser,
  getFetcher: httpGet$GetUser,
  updateFetcher: httpPut$UpdateUser,
  deleteFetcher: httpDelete$DeleteUser,
} = createCRUD<typeof User>(User, "users");

export type AddUser$Params = z.infer<typeof AddUser$Params>;
export type GetUsers$Params = z.infer<typeof GetUsers$Params>;
export type UpdateUser$Params = z.infer<typeof UpdateUser$Params>;
export type DeleteUser$Params = z.infer<typeof DeleteUser$Params>;
export type AddUser$Result = z.infer<typeof AddUser$Result>;
export type GetUsers$Result = z.infer<typeof GetUsers$Result>;
export type UpdateUser$Result = z.infer<typeof UpdateUser$Result>;
export type DeleteUser$Result = z.infer<typeof DeleteUser$Result>;