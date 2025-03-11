import { z } from "zod";

const sampleSchema = z.object({
  //  name: z.string().min(1, { message: "1文字以上入れてください。" }),
  name: z.string().min(1, { message: "1文字以上入れてください。" }),
});

export { sampleSchema };
export type SampleSchemaType = z.infer<typeof sampleSchema>;
