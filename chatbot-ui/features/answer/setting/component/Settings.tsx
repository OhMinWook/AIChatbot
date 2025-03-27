import TextEditor from '@/features/answer/setting/component/TextEditor';
import { getAnswerId } from '@/services/admin-answer/admin-answer';

const getAnswerData = async () => {
  const { data } = await getAnswerId();
  if (data.error) return null;
  return data.data;
};

export default async function AnswerSettings() {
  const initAnswer = await getAnswerData();
  // console.log(initAnswer?.answer_content);

  return (
    <article>
      {initAnswer && <TextEditor answerData={initAnswer.answer_content} />}
    </article>
  );
}
