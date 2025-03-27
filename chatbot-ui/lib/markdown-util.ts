import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

export const convertMarkdownToHtml = async (markdown: string) => {
  try {
    const parsedHtml = await remark()
      .use(gfm)
      .use(html, { sanitize: true })
      .process(markdown);
    return parsedHtml.toString();
  } catch (error) {
    console.error('마크다운 변환 중 오류:', error);
    return '';
  }
};

export const isHtmlContent = (text: string) => {
  // 코드 블록 패턴 (``` 로 시작하는)
  const codeBlockRegex = /```[\s\S]*?```/g;
  // 인라인 코드 패턴 (` 로 감싸진)
  const inlineCodeRegex = /`[^`]*`/g;

  // 코드 블록과 인라인 코드를 임시 문자열로 대체
  const textWithoutCode = text
    .replace(codeBlockRegex, 'CODE_BLOCK_PLACEHOLDER')
    .replace(inlineCodeRegex, 'CODE_PLACEHOLDER');

  // 실제 HTML 컨텐츠 체크
  const commonHtmlTags =
    /<(p|div|span|h[1-6]|ul|ol|li|table|tr|td|th|br|hr|a|img)[^>]*>.*?<\/\1>/i;
  return commonHtmlTags.test(textWithoutCode);
};
