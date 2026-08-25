import { Credentials } from "@/types";
import { CredentialsSchema } from "@/lib/schema";

export function parseCredentials(jsonString: string): { creds: Credentials; errors: string[] } {
  const errors: string[] = [];
  let raw: unknown;

  try {
    raw = JSON.parse(jsonString);
  } catch {
    return { creds: {}, errors: ["Invalid JSON format"] };
  }

  const result = CredentialsSchema.safeParse(raw);
  if (!result.success) {
    return {
      creds: {},
      errors: result.error.issues.map((i) => `[${i.path.join(".")}] ${i.message}`),
    };
  }

  return { creds: result.data, errors: [] };
}

export function getDefaultCredentials(): Credentials {
  return {
    admin: { username: "NT-5175", password: "2222" },
    user: { username: "NT-6041", password: "2222" },
    supervisor: { username: "preinoso", password: "2222" },
    hr: { username: "NT-7941", password: "2222" },
    finance: { username: "NTG-5180", password: "2222" },
  };
}
