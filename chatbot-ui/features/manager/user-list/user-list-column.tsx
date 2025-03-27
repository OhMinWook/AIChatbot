import DialogCellCommon from '@/components/dialog/common/dialog-cell-common';
import DialogNormalUserModifyContent from '@/components/dialog/normal-user/normal-user-form';
import { Checkbox } from '@/components/ui/checkbox';
import { normalUserUpdateformSchema } from '@/const/zod/normal-user-form.zod';
import { UserListData } from '@/services/admin-user/admin-normal-user.type';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const userListColumn: ColumnDef<UserListData>[] = [
  {
    id: 'select',
    size: 20,
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(checked) => {
            table.toggleAllRowsSelected(checked as boolean);
          }}
          aria-label='Select all rows'
          className='w-5 h-5 data-[state=checked]:bg-customColor-primary2'
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(checked) => row.toggleSelected(checked as boolean)}
          aria-label={`Select row ${row.id}`}
          className={`w-5 h-5 data-[state=checked]:bg-customColor-primary2`}
        />
      );
    },
  },
  {
    accessorKey: 'name',
    size: 50,
    header: () => <div className='whitespace-nowrap'>성함</div>,
    cell: ({ row }) => {
      const adminId = row.original.id;
      const name = row.original.name;

      return (
        <DialogCellCommon
          keyId={adminId!}
          textValue={name!}
          dialogContent={{
            className: 'md:max-w-[676px] md:max-h-[650px] max-h-[600px]',
          }}
          title='사용자 수정'
          content={({ keyId, closeParentDialog }) => (
            <DialogNormalUserModifyContent
              userId={Number(keyId)}
              closeParentDialog={closeParentDialog}
              formSchema={normalUserUpdateformSchema}
            />
          )}
        />
      );
    },
  },
  {
    accessorKey: 'dept_name',
    size: 100,
    header: () => <div className='whitespace-nowrap'>소속</div>,
    cell: ({ row }) => {
      const adminId = row.original.id;
      const dept_name = row.original.dept_name;

      return (
        <DialogCellCommon
          keyId={adminId!}
          textValue={dept_name!}
          dialogContent={{
            className: 'md:max-w-[676px] md:max-h-[650px] max-h-[600px]',
          }}
          title='사용자 수정'
          content={({ keyId, closeParentDialog }) => (
            <DialogNormalUserModifyContent
              userId={Number(keyId)}
              closeParentDialog={closeParentDialog}
              formSchema={normalUserUpdateformSchema}
            />
          )}
        />
      );
    },
  },
  {
    accessorKey: 'hospital_name',
    size: 120,
    header: () => <div className='whitespace-nowrap'>병원 이름</div>,
    cell: ({ getValue, row }) => {
      const hospitalName = getValue() as string;
      const adminId = row.original.id;

      return (
        <DialogCellCommon
          keyId={adminId!}
          textValue={hospitalName}
          dialogContent={{
            className: 'md:max-w-[676px] md:max-h-[650px] max-h-[600px]',
          }}
          title='사용자 수정'
          content={({ keyId, closeParentDialog }) => (
            <DialogNormalUserModifyContent
              userId={Number(keyId)}
              closeParentDialog={closeParentDialog}
              formSchema={normalUserUpdateformSchema}
            />
          )}
        />
      );
    },
  },
  {
    accessorKey: 'login_id',
    size: 250,
    header: () => <div className='whitespace-nowrap'>ID</div>,
    cell: ({ row }) => {
      const adminId = row.original.id;
      const login_id = row.original.login_id;
      return (
        <DialogCellCommon
          keyId={adminId!}
          textValue={login_id!}
          dialogContent={{
            className: 'md:max-w-[676px] md:max-h-[650px] max-h-[600px]',
          }}
          title='사용자 수정'
          content={({ keyId, closeParentDialog }) => (
            <DialogNormalUserModifyContent
              userId={Number(keyId)}
              closeParentDialog={closeParentDialog}
              formSchema={normalUserUpdateformSchema}
            />
          )}
        />
      );
    },
  },
  {
    accessorKey: 'hospital_code',
    size: 50,
    header: () => <div className='whitespace-nowrap'>병원 코드</div>,
    cell: ({ row }) => {
      const adminId = row.original.id;
      const hospitalCode = row.original.hospital_code;
      return (
        <DialogCellCommon
          keyId={adminId}
          textValue={hospitalCode!}
          dialogContent={{
            className: 'md:max-w-[676px] md:max-h-[650px] max-h-[600px]',
          }}
          title='사용자 수정'
          content={({ keyId, closeParentDialog }) => (
            <DialogNormalUserModifyContent
              userId={Number(keyId)}
              closeParentDialog={closeParentDialog}
              formSchema={normalUserUpdateformSchema}
            />
          )}
        />
      );
    },
  },
  {
    accessorKey: 'creation_dt',
    size: 100,
    header: () => <div className='whitespace-nowrap'>계정 생성일</div>,
    cell: ({ getValue, row }) => {
      const unixTime = getValue() as number;
      const adminId = row.original.id;
      const date =
        unixTime > 1e12 ? new Date(unixTime) : new Date(unixTime * 1000);

      return (
        <DialogCellCommon
          keyId={adminId}
          textValue={format(date, 'yyyy-MM-dd HH:mm:ss')}
          dialogContent={{
            className: 'md:max-w-[676px] md:max-h-[650px] max-h-[600px]',
          }}
          title='관리자 수정'
          content={({ keyId, closeParentDialog }) => (
            <DialogNormalUserModifyContent
              userId={Number(keyId)}
              closeParentDialog={closeParentDialog}
              formSchema={normalUserUpdateformSchema}
            />
          )}
        />
      );
    },
  },
];
