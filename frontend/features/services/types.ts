import { z } from 'zod';

export const serviceNameSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export const serviceNamesSchema = z.array(serviceNameSchema);

export type ServiceName = z.infer<typeof serviceNameSchema>;
export type ServiceNames = z.infer<typeof serviceNamesSchema>;