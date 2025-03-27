import { Button } from '@/components/ui/button';

interface ReportExistProps {
  onClose: () => void;
}

export const ReportExist = ({ onClose }: ReportExistProps) => {
  return (
    <>
      <section
        className={` w-[400px] rounded-xl p-10 h-auto bg-customColor-white flex flex-col space-y-3`}
      >
        <div className='flex w-full space-x-3 justify-center items-center pt-10'>
          <h1 className='text-3xl font-bold'>이미 제출한 리포트 입니다.</h1>
        </div>
        <div className='pt-10 flex justify-end'>
          <Button
            type='button'
            variant={'cancel1'}
            className='h-20 w-40 px-5'
            onClick={() => onClose()}
          >
            닫기
          </Button>
        </div>
      </section>
    </>
  );
};
