import { InputLabel } from '@/components/ui/input/inputlabel';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { format } from 'date-fns';
import { AnswerReportData } from '@/services/admin-answer/admin-answer.type';

interface DetailProps {
  reportData?: AnswerReportData;
}

export default function UserReport({ reportData }: DetailProps) {
  const form = useForm({});
  const formattedDate = (date: any) => {
    if (!date) return '';
    const val = new Date(date * 1000);
    return format(val, 'yyyy-MM-dd HH:mm:ss');
  };

  return (
    <article className='md:overflow-y-hidden overflow-y-auto border-b border-customColor-bg1_1'>
      <section>
        <Form {...form}>
          <form>
            <article className='md:px-[40px] px-7'>
              <fieldset className='relative md:grid flex md:grid-cols-2 flex-col items-center my-[16px] gap-[17px]'>
                <FormField
                  name='user_id' // user id
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputLabel
                          labelContent='사용자ID'
                          {...field}
                          value={reportData?.user_id}
                          disabled={true}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name='creation_dt' // 작성일
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputLabel
                          labelContent='작성일'
                          {...field}
                          value={formattedDate(reportData?.creation_dt)}
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
                          value={reportData?.question_content}
                          className='min-h-[70px] w-full pt-[13px] pl-4 text-[1.6rem] bg-customColor-bg3 resize-none'
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
                            <p>답변</p>
                          </div>
                          <textarea
                            {...field}
                            value={reportData?.answer_content}
                            className='min-h-[70px] w-full pt-[13px] pl-4 text-[1.6rem] bg-customColor-bg3 resize-none'
                            disabled={true}
                          />
                        </>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </fieldset>
              <fieldset className='relative mb-[16px]'>
                <FormField
                  name='report' // 답변
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <>
                          <div className='h-[20px] text-[1.4rem]'>
                            <p>불만족 내용</p>
                          </div>
                          <textarea
                            {...field}
                            value={reportData?.report_content}
                            className='min-h-[70px] w-full pt-[13px] pl-4 text-[1.6rem] bg-customColor-bg3 resize-none'
                            disabled={true}
                          />
                        </>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </fieldset>
              <fieldset className='relative md:grid flex md:grid-cols-[40%_57%] flex-col items-center my-[16px] gap-[17px]'>
                <FormField
                  name='screen_id' // 화면 id
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputLabel
                          labelContent='화면 ID'
                          {...field}
                          value={reportData?.screen_id}
                          disabled={true}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name='manual_name' // 메뉴얼 이름
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputLabel
                          labelContent='메뉴얼 이름'
                          {...field}
                          value={reportData?.manual_name}
                          disabled={true}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </fieldset>
              <fieldset className='relative items-center my-[16px]'>
                <FormField
                  name='manual_path' // 메뉴얼 URL
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputLabel
                          labelContent='메뉴얼 URL'
                          {...field}
                          value={reportData?.manual_path}
                          disabled={true}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </fieldset>
            </article>
          </form>
        </Form>
      </section>
    </article>
  );
}
