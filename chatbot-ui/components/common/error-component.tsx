interface ErrorComponentProps {
  error: string;
}

const ErrorComponent = ({ error }: ErrorComponentProps) => {
  return (
    <div className='flex flex-col items-center justify-center space-y-10 text-2xl'>
      <p className='text-red-500'>데이터를 불러오는 중 오류가 발생했습니다.</p>
      <p key={'error message'} className='text-red-500'>
        {error}
      </p>
    </div>
  );
};

export default ErrorComponent;
