// /<INDEXNOW_KEY>.txt is rewritten here (next.config.ts). See lib/indexnow.ts.
import { keyFileResponse } from "@/lib/indexnow";

export async function GET(_req: Request, ctx: RouteContext<"/api/indexnow/[file]">) {
  const { file } = await ctx.params;
  return keyFileResponse(file);
}
