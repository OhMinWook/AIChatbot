// import { FileSymlink, ImageDown } from 'lucide-react';
// import {
//   BotChatArrayBox,
//   BotChatArrayContent,
//   BotChatArrayHeader,
//   BotChatArrayItem,
//   BotChatArrayManualLink,
// } from './bot-chat-array-layout';
// import { BotChatArrayImageDialog } from './bot-chat-array-image-dialog';

// interface BotChatImageArrayProps {
//   imgs: (string | null)[];
// }

// const BotChatImageArray = ({ imgs }: BotChatImageArrayProps) => {
//   return (
//     <BotChatArrayBox>
//       <BotChatArrayHeader className='rounded-tl-lg bg-gradient-to-r from-[#c92f5c] via-[#8b0029] to-[#5a0820]'>
//         <ImageDown className='w-10 h-10' />
//         이미지 뷰어
//       </BotChatArrayHeader>
//       <BotChatArrayContent>
//         {imgs.map((img, index) => (
//           <BotChatArrayItem key={'bot-chat-img-item' + index} index={index}>
//             <BotChatArrayImageDialog
//               imageUrl={img}
//               text={`이미지 ${index + 1}`}
//             />
//           </BotChatArrayItem>
//         ))}
//       </BotChatArrayContent>
//     </BotChatArrayBox>
//   );
// };

// interface BotChatManualArrayProps {
//   manuals: (string | null)[];
// }

// const BotChatManualArray = ({ manuals }: BotChatManualArrayProps) => {
//   return (
//     <BotChatArrayBox>
//       <BotChatArrayHeader className='rounded-tr-lg bg-gradient-to-l from-[#c92f5c] via-[#8b0029] to-[#5a0820]'>
//         <FileSymlink className='w-10 h-10' />
//         메뉴얼 링크
//       </BotChatArrayHeader>
//       <BotChatArrayContent>
//         {manuals.map((manual, index) => (
//           <BotChatArrayItem key={'bot-chat-manual-item' + index} index={index}>
//             <BotChatArrayManualLink
//               link={manual}
//               fallback='메뉴얼 링크가 없습니다.'
//             />
//           </BotChatArrayItem>
//         ))}
//       </BotChatArrayContent>
//     </BotChatArrayBox>
//   );
// };

// interface BotChatArrayProps {
//   imgs: (string | null)[];
//   manuals: (string | null)[];
// }

// const BotChatArray = ({ imgs, manuals }: BotChatArrayProps) => {
//   return (
//     <section className='w-full flex flex-col border bg-gray-50 h-auto rounded-xl shadow-md'>
//       <article className='w-full h-full flex divide-x'>
//         <BotChatImageArray imgs={imgs} />
//         <BotChatManualArray manuals={manuals} />
//       </article>
//     </section>
//   );
// };

// export default BotChatArray;
