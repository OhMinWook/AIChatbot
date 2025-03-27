import { z } from 'zod';

export const normalUserCreateformSchema = z
  .object({
    username: z
      .string()
      .max(15, {
        message: '이름은 15글자 이하로 작성되어야 합니다.',
      })
      .optional(),
    group: z
      .string()
      .max(20, {
        message: '소속은 20글자 이하로 작성되어야 합니다.',
      })
      .optional(),
    id: z
      .string({
        required_error: 'ID는 필수로 작성되어야 합니다.',
      })
      .min(4, {
        message: 'ID는 4글자 이상으로 작성되어야 합니다.',
      })
      .max(15, {
        message: 'ID는 15글자 이하로 작성되어야 합니다.',
      }),
    password: z
      .string({
        required_error: '비밀번호는 필수로 작성되어야 합니다.',
      })
      .min(6, {
        message: '비밀번호는 6글자 이상으로 작성되어야 합니다.',
      })
      .max(15, {
        message: '비밀번호는 15글자 이하로 작성되어야 합니다.',
      }),
    confirmPassword: z
      .string({
        required_error: '비밀번호는 필수로 작성되어야 합니다.',
      })
      .min(6, {
        message: '비밀번호는 6글자 이상으로 작성되어야 합니다.',
      })
      .max(15, {
        message: '비밀번호는 15글자 이하로 작성되어야 합니다.',
      }),
    hospitalName: z.string().optional(),
    hospitalCode: z
      .string({
        required_error: '병원 코드는 필수로 작성되어야 합니다.',
      })
      .min(1, {
        message: '병원 코드는 1글자 이상으로 작성되어야 합니다.',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
  });

export const normalUserUpdateformSchema = z
  .object({
    username: z
      .string()
      .max(15, {
        message: '이름은 15글자 이하로 작성되어야 합니다.',
      })
      .optional(),
    group: z
      .string()
      .max(20, {
        message: '소속은 20글자 이하로 작성되어야 합니다.',
      })
      .optional(),
    id: z
      .string({
        required_error: 'ID는 필수로 작성되어야 합니다.',
      })
      .min(4, {
        message: 'ID는 4글자 이상으로 작성되어야 합니다.',
      })
      .max(15, {
        message: 'ID는 15글자 이하로 작성되어야 합니다.',
      }),
    password: z
      .string()
      .max(15, {
        message: '비밀번호는 15글자 이하로 작성되어야 합니다.',
      })
      .optional(),
    confirmPassword: z
      .string()
      .max(15, {
        message: '비밀번호는 15글자 이하로 작성되어야 합니다.',
      })
      .optional(),
    hospitalName: z.string().optional(),
    hospitalCode: z
      .string({
        required_error: '병원 코드는 필수로 작성되어야 합니다.',
      })
      .min(1, {
        message: '병원 코드는 1글자 이상으로 작성되어야 합니다.',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
  });
