import { Db, ObjectId } from "mongodb";
import { BusisnessTypeCollection, Symptom } from "@/modules/business-types";
import { GetDetailSymptom$Params } from "./typing";

export async function handler$GetDetailSymptom(
  db: Db,
  params: GetDetailSymptom$Params
) {
  const { id } = params;

  const resultSymptom = await db
    .collection(BusisnessTypeCollection.symptoms)
    .findOne({ _id: ObjectId.createFromHexString(id) });

  if (!resultSymptom) {
    return { result: resultSymptom };
  }

  const parsedDocs = Symptom.parse({
    id: resultSymptom._id.toHexString(),
    ...resultSymptom,
  });

  return { result: parsedDocs };
}
