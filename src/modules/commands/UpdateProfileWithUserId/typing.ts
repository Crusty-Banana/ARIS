import { z } from "zod";
import { UserProfile } from "../GetProfileWithUserId/typing";
import { FetcherResult } from "@/modules/business-types";

export const UpdateProfileWithUserId$Params = UserProfile.partial().required({
  userId: true,
});
export type UpdateProfileWithUserId$Params = z.infer<
  typeof UpdateProfileWithUserId$Params
>;

export const UpdateProfileWithUserIdFetcher$Params =
  UpdateProfileWithUserId$Params.omit({ userId: true });
export type UpdateProfileWithUserIdFetcher$Params = z.infer<
  typeof UpdateProfileWithUserIdFetcher$Params
>;

export const UpdateProfileWithUserId$Result = FetcherResult;
export type UpdateProfileWithUserId$Result = z.infer<
  typeof UpdateProfileWithUserId$Result
>;
