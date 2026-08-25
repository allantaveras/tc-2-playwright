import { z } from "zod";

export const TestCaseSchema = z.object({
  id: z.string().min(1),
  scenario: z.string(),
  test_case: z.string(),
  preconditions: z.string(),
  steps: z.string(),
  expected: z.string(),
  sheet: z.string().optional(),
});

export const TestCaseArraySchema = z.array(TestCaseSchema);

export const CredentialsSchema = z.record(
  z.string(),
  z.object({
    username: z.string().min(1),
    password: z.string().min(1),
  })
);

export const GenerationOptionsSchema = z.object({
  targetUrl: z.string().url().optional(),
  includePOMs: z.boolean().default(true),
  includeAllure: z.boolean().default(true),
  includeStagehand: z.boolean().default(false),
});
