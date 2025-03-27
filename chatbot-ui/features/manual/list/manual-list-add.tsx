'use client';

import { useState } from 'react';

import ManualDialogComponent from '@/components/dialog/manual/manual-dialog';
import DialogManualRegister1 from '@/components/dialog/manual/manual-register1';
import DialogManualUpdateEdit from '@/components/dialog/manual/manual-update-edit';

interface ManualListAddProps {
  refetchFn: () => void;
}

export default function ManualListAdd({ refetchFn }: ManualListAddProps) {
  const [isDialogOneOpen, setIsDialogOneOpen] = useState(false);
  const [isDialogTwoOpen, setIsDialogTwoOpen] = useState(false);
  const [preprocessId, setPreprocessId] = useState<number>();

  const handleDialog = () => {
    setIsDialogOneOpen(false);
    setIsDialogTwoOpen(true);
  };

  return (
    <>
      <ManualDialogComponent
        title='메뉴얼 등록'
        dialogContent={{
          className: 'md:max-w-[676px] md:max-h-[800px] max-h-[600px]',
        }}
        content={({ onClose }) => (
          <DialogManualRegister1
            onSuccess={handleDialog}
            setPreprocessId={setPreprocessId}
          />
        )}
        triggerButton={{
          variant: 'enter3',
          icon: 'plus',
          text: '등록',
          className:
            'text-2xl flex justify-center items-center p-3 space-x-3 w-44 h-16',
        }}
        isOpen={isDialogOneOpen}
        setIsOpen={setIsDialogOneOpen}
      />
      <ManualDialogComponent
        title='메뉴얼 등록2'
        content={({ onClose }) => (
          <DialogManualUpdateEdit
            typeId={preprocessId!}
            onClose={onClose}
            updateType={0}
            refetchFn={refetchFn}
          />
        )}
        dialogContent={{
          className: 'md:max-w-[1290px] md:max-h-[800px] max-h-[600px]',
        }}
        triggerButton={{
          variant: 'enter3',
          icon: 'plus',
          text: '등록2',
          className: 'hidden',
        }}
        isOpen={isDialogTwoOpen}
        setIsOpen={setIsDialogTwoOpen}
      />
    </>
  );
}
