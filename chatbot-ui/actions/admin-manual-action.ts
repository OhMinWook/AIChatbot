'use server';

import {
  uploadAdminManualFile,
  createAdminManualPreprocessing,
  getAdminManualPreprocessById,
  createAdminManualCollection,
  updateAdminManualById,
  getAdminManualById,
  deleteAdminManual,
  uploadAdminManualImage,
  addAdminManualCollection,
  uploadAdminManualFileEnd,
} from '@/services/admin-manual/admin-manual';
import {
  AddDataRequestBody,
  CreateCollectionRequest,
  EmbeddingParams,
  ManaulId,
  UpdateManualBody,
  UploadImageParams,
  UploadManualEndParams,
  UploadManualParams,
} from '@/services/admin-manual/admin-manual.type';
import axios from 'axios';

export const uploadAdminManualFileAction = async (
  params: UploadManualParams,
) => {
  let data;

  const response = await uploadAdminManualFile(params);

  data = response.data;

  return data;
};

export const createAdminManualPreprocessingAction = async (
  formData: FormData,
) => {
  let data;

  formData.forEach((value, key) => {
    if (value instanceof File) {
      // 'binary' 인코딩 사용
      const fileNameBuffer = Buffer.from(value.name, 'binary');
      const fixedFileName = fileNameBuffer.toString('utf8');

      // 파일 이름 수정
      Object.defineProperty(value, 'name', {
        value: fixedFileName,
        writable: false,
      });
    }
  });

  try {
    const response = await createAdminManualPreprocessing(formData);

    data = response.data;

    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        data: err.response?.data.data,
        error: err.response?.data.error,
        message: err.response?.data.message,
      };
    }

    return {
      data: null,
      error: true,
      message: '업로드에 실패하였습니다.',
    };
  }
};

export const getAdminManualPreprocessByIdAction = async (
  set_id: string | number,
) => {
  let data;

  const response = await getAdminManualPreprocessById(set_id);
  data = response.data;

  return data;
};

export const getAdminManualByIdAction = async (manual_id: string | number) => {
  let data;

  // await new Promise((resolve) => setTimeout(resolve, 2000));

  const response = await getAdminManualById(manual_id);

  data = response.data;

  return data;
};
export const createAdminManualCollectionAction = async (
  params: EmbeddingParams,
  body: FormData,
) => {
  let data;

  const response = await createAdminManualCollection(params, body);
  data = response.data;

  return data;
};

export const updateAdminManualByIdAction = async (
  manual_id: number,
  body: UpdateManualBody,
) => {
  let data;

  const response = await updateAdminManualById(manual_id, body);
  data = response.data;

  return data;
};

export const deleteAdminManualAction = async (id_list: string) => {
  let data;

  const response = await deleteAdminManual(id_list);
  data = response.data;

  return data;
};

export const uploadAdminManualImageAction = async (
  params: UploadImageParams,
) => {
  let data;

  const response = await uploadAdminManualImage(params);
  data = response.data;

  return data;
};

export const addAdminManualCollectionAction = async (
  params: EmbeddingParams,
  body: FormData,
) => {
  let data;

  const response = await addAdminManualCollection(params, body);
  data = response.data;

  return data;
};

export const uploadAdminManualFileEndAction = async (
  params: UploadManualEndParams,
) => {
  let data;

  const response = await uploadAdminManualFileEnd(params);
  data = response.data;

  return data;
};
