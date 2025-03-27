import { z } from 'zod';

export const pageSectionSchema = z.object({
  dataId: z.number().optional(),
  source: z.string().optional(),
  subject: z.string().optional(),
  content: z
    .string({
      required_error: '내용은 필수입니다.',
    })
    .min(1, {
      message: 'content는 필수입니다.',
    }),
  image_path: z.string().optional(),
  addIndex: z.number().optional(),
  isEdit: z.boolean().optional(),
});

export const adminManualFormSchema = z.object({
  manual_name: z.string(),
  page: z.array(pageSectionSchema),
});
