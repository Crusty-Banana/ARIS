import {
  FetcherResult,
  ObjectIdAsHexString,
  PAP,
  User,
} from "@/modules/business-types";
import { z } from "zod";

export const UserProfilePAP = PAP.pick({
  doB: true,
  gender: true,
  allowPublic: true,
  publicId: true,
  underlyingMedCon: true,
});
export type UserProfilePAP = z.infer<typeof UserProfilePAP>;

export const UserProfileUser = User.omit({
  id: true,
  password: true,
  role: true,
});
export type UserProfileUser = z.infer<typeof UserProfileUser>;

export const UserProfile = UserProfileUser.extend({
  ...UserProfilePAP.shape,
  userId: ObjectIdAsHexString,
});
export type UserProfile = z.infer<typeof UserProfile>;

export const GetProfileWithUserId$Params = z.object({
  userId: z.string(),
});
export type GetProfileWithUserId$Params = z.infer<
  typeof GetProfileWithUserId$Params
>;

export const GetProfileWithUserId$Result = FetcherResult.extend({
  result: UserProfile.optional(),
});
export type GetProfileWithUserId$Result = z.infer<
  typeof GetProfileWithUserId$Result
>;
