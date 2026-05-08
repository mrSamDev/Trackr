import { z } from "zod";
const s = z.object({ params: z.record(z.string(), z.unknown()).optional() });
console.log(s);
