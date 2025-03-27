export const uploadFileByPresignedUrl = async (
  presignedUrl: string,
  formData: FormData,
) => {
  let resultData = { data: null, error: false, message: 'success' };

  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: formData,
    });

    if (response.status !== 200) {
      resultData = {
        data: null,
        error: true,
        message: 'presignedUrl upload error',
      };
    }
  } catch (error) {
    resultData = {
      data: null,
      error: true,
      message:
        '파일 업로드 중 오류가 발생했습니다: ' + (error as Error).message,
    };
  }

  return resultData;
};
