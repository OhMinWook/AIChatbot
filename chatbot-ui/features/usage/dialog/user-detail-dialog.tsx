import { InputLabel } from '@/components/ui/input/inputlabel';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { format } from 'date-fns';

interface DetailProps {
  detailData: any;
}

export default function UserDetail({ detailData }: DetailProps) {
  const form = useForm({});
  const formattedDate = (date: any) => {
    if (!date) return '';
    const val = new Date(date * 1000);
    return format(val, 'yyyy-MM-dd HH:mm:ss');
  };
  return (
    <section className='overflow-y-auto border-b border-customColor-bg1_1'>
      <div className=' mb-[32px]'>
        <Form {...form}>
          <form>
            <article className='md:px-[40px] px-7'>
              <fieldset className='relative md:grid flex md:grid-cols-2 flex-col items-center my-[16px] gap-[17px]'>
                <FormField
                  name='hospital' // hospital
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputLabel
                          labelContent='병원명'
                          {...field}
                          value={detailData?.hospital}
                          disabled={true}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name='username' // 사용자명
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputLabel
                          labelContent='사용자명'
                          {...field}
                          value={detailData?.username}
                          disabled={true}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </fieldset>
              <fieldset className='relative md:grid flex md:grid-cols-2 flex-col items-center my-[16px] gap-[17px]'>
                <FormField
                  name='call_path' // 호출 경로
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputLabel
                          labelContent='호출 경로'
                          {...field}
                          value={detailData?.call_path}
                          disabled={true}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name='creation_dt' // 사용 일자
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputLabel
                          labelContent='사용일자'
                          {...field}
                          value={formattedDate(detailData?.creation_dt)}
                          disabled={true}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </fieldset>
              <fieldset className='relative md:grid flex md:grid-cols-2 flex-col items-center my-[16px] gap-[17px]'>
                <FormField
                  name='use_token_cnt' // 사용 토큰수
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputLabel
                          labelContent='사용 토큰수'
                          {...field}
                          value={detailData?.use_token_cnt}
                          disabled={true}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name='use_amount' // 사용 금액
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputLabel
                          labelContent='사용 금액($)'
                          {...field}
                          value={detailData?.use_amount}
                          disabled={true}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </fieldset>
              <fieldset className='relative mb-[16px]'>
                <FormField
                  name='question' // 질문
                  render={({ field }) => (
                    <FormItem>
                      <div className='h-[20px] text-[1.4rem]'>
                        <p>질문</p>
                      </div>
                      <FormControl>
                        <textarea
                          {...field}
                          value={detailData?.question}
                          className='min-h-[150px] w-full pt-[13px] pl-4 text-[1.6rem] bg-customColor-bg3 resize-none'
                          disabled
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </fieldset>
              <fieldset className='relative mb-[16px]'>
                <FormField
                  name='answer' // 답변
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <>
                          <div className='h-[20px] text-[1.4rem]'>
                            <p>
                              {`답변 ${detailData?.satisfaction_rate ? `(만족도: ${detailData?.satisfaction_rate})` : ''}`}
                            </p>
                          </div>
                          <textarea
                            {...field}
                            value={detailData?.answer}
                            className='min-h-[150px] w-full pt-[13px] pl-4 text-[1.6rem] bg-customColor-bg3 resize-none'
                            disabled={true}
                          />
                        </>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </fieldset>
            </article>
          </form>
        </Form>
      </div>
    </section>
  );
}
