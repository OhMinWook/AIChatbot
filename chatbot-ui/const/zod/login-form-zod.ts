import { z } from 'zod';

// .email({ message: '이메일 형식으로 작성되어야 합니다' })

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: '이메일은 2글자 이상으로 작성되어야 합니다',
    })
    .max(20, {
      message: '이메일은 20글자 이하로 작성되어야 합니다',
    }),
  password: z
    .string()
    .min(2, {
      message: '비밀번호는 2글자 이상으로 작성되어야 합니다',
    })
    .max(20, {
      message: '비밀번호는 20글자 이하로 작성되어야 합니다',
    }),
});
