export const getTypeFromFieldName = (fieldName: string) => {
  let update_type: 0 | 1 | 2;

  switch (fieldName) {
    case 'source':
      update_type = 0;
      break;
    case 'subject':
      update_type = 1;
      break;
    case 'content':
      update_type = 2;
      break;

    default:
      update_type = 0;
      break;
  }

  return update_type;
};
