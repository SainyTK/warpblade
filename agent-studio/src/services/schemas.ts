import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Ajv } from "ajv";
import type { SchemaName } from "../types.ts";

const SCHEMA_DIR = join(import.meta.dirname, "..", "..", "schemas");

export function schemaText(name: SchemaName): Promise<string> {
  return readFile(join(SCHEMA_DIR, `${name}.schema.json`), "utf8");
}

/** the schema's error messages for a value, or none when it is valid */
export async function schemaErrors(name: SchemaName, value: unknown): Promise<string[]> {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(JSON.parse(await schemaText(name)));
  if (validate(value)) return [];
  return (validate.errors ?? []).map((e) => `${e.instancePath || "/"} ${e.message ?? "is invalid"}`);
}
