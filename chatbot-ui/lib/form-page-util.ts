import { adminManualFormSchema } from '@/const/zod/admin-manual-form-zod';
import { z } from 'zod';

type AdminFormData = z.infer<typeof adminManualFormSchema>;

export const getUpdatePages = (formData: AdminFormData) => {
  return {
    updated_pages: formData.page
      .filter(({ dataId, isEdit }) => dataId !== 0 && isEdit)
      .map(({ dataId, image_path, ...rest }) => ({
        ...rest,
        id: dataId,
      })),
  };
};

export const getAddedPages = (formData: AdminFormData) => {
  return {
    added_pages: formData.page
      .filter(({ dataId }) => dataId === 0)
      .map(({ dataId, image_path, ...rest }, index) => ({
        ...rest,
        id: index,
      })),
  };
};
