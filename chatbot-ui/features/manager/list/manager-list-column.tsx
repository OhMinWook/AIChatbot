import DialogAdminModifyContent from '@/components/dialog/admin/admin-modify';
import DialogCellCommon from '@/components/dialog/common/dialog-cell-common';
import { Checkbox } from '@/components/ui/checkbox';
import { formatPhoneNumber } from '@/lib/format-number';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export interface ManagerListData {
  id: number;
  name: string | null;
  dept_name: string | null;
  tel_no: string | null;
  login_id: string;
  auth_menu_list: string;
  creation_dt: number;
}

export const managerListColumn: ColumnDef<ManagerListData>[] = [
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
      const authValue = row.original.id;
      const isDisabled = authValue === 1;

      return (
        <Checkbox
          checked={isDisabled ? false : row.getIsSelected()}
          disabled={!row.getCanSelect() || isDisabled}
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
            className: 'md:max-w-[676px] md:max-h-[780px] max-h-[600px]',
          }}
          title='관리자 수정'
          content={({ keyId, closeParentDialog }) => (
            <DialogAdminModifyContent
              adminId={Number(keyId)}
              closeParentDialog={closeParentDialog}
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
            className: 'md:max-w-[676px] md:max-h-[780px] max-h-[600px]',
          }}
          title='관리자 수정'
          content={({ keyId, closeParentDialog }) => (
            <DialogAdminModifyContent
              adminId={Number(keyId)}
              closeParentDialog={closeParentDialog}
            />
          )}
        />
      );
    },
  },
  {
    accessorKey: 'tel_no',
    size: 80,
    header: () => <div className='whitespace-nowrap'>전화번호</div>,
    cell: ({ getValue, row }) => {
      const phoneNumber = getValue() as string;
      const adminId = row.original.id;

      return (
        <DialogCellCommon
          keyId={adminId!}
          textValue={formatPhoneNumber(phoneNumber)}
          dialogContent={{
            className: 'md:max-w-[676px] md:max-h-[780px] max-h-[600px]',
          }}
          title='관리자 수정'
          content={({ keyId, closeParentDialog }) => (
            <DialogAdminModifyContent
              adminId={Number(keyId)}
              closeParentDialog={closeParentDialog}
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
          textValue={login_id}
          dialogContent={{
            className: 'md:max-w-[676px] md:max-h-[780px] max-h-[600px]',
          }}
          title='관리자 수정'
          content={({ keyId, closeParentDialog }) => (
            <DialogAdminModifyContent
              adminId={Number(keyId)}
              closeParentDialog={closeParentDialog}
            />
          )}
        />
      );
    },
  },
  {
    accessorKey: 'auth_menu_list',
    size: 80,
    header: () => <div className='whitespace-nowrap'>권한</div>,
    cell: ({ row }) => {
      const adminId = row.original.id;
      const superAdmin = adminId === 1 ? '최고 관리자' : '관리자';

      return (
        <DialogCellCommon
          keyId={adminId}
          textValue={superAdmin}
          dialogContent={{
            className: 'md:max-w-[676px] md:max-h-[780px] max-h-[600px]',
          }}
          title='관리자 수정'
          content={({ keyId, closeParentDialog }) => (
            <DialogAdminModifyContent
              adminId={Number(keyId)}
              closeParentDialog={closeParentDialog}
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
            className: 'md:max-w-[676px] md:max-h-[780px] max-h-[600px]',
          }}
          title='관리자 수정'
          content={({ keyId, closeParentDialog }) => (
            <DialogAdminModifyContent
              adminId={Number(keyId)}
              closeParentDialog={closeParentDialog}
            />
          )}
        />
      );
    },
  },
];
