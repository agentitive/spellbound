import { DiffToolInterface } from "./DiffToolInterface";
import * as vscode from "vscode";
import { applyPatch } from "diff";

export async function diffToolImpl(params: DiffToolInterface): Promise<string> {
  const {source, patchStr} = params;
  
  try {
    const patchedContent = applyPatch(source, patchStr);
    return patchedContent;
  } catch (err: any) {
    return `ERROR: Failed to apply diff patch: ${err?.message || 'Unknown error'}`;
  }
}
