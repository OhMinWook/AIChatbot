// import { BotChatArrayImageDialog } from '../bot-chat-array/bot-chat-array-image-dialog';
import { memo } from 'react';

interface BotChatLinksProps {
  hash_id_list?: string[];
  imgs?: (string | null)[] | Record<string, string | null>;
}

const BotChatLinks = memo(({ imgs, hash_id_list }: BotChatLinksProps) => {
  if (!hash_id_list || hash_id_list.length === 0) return null;

  if (
    !imgs ||
    (Array.isArray(imgs) ? imgs.length === 0 : Object.keys(imgs).length === 0)
  )
    return null;

  return (
    <div className='prose flex flex-col items-start pt-10'>
      {/* <strong className='mb-2'>참고 문서</strong>
      {hash_id_list.map((hash_id, index) => {
        const imageUrl = Array.isArray(imgs) ? imgs[index] : imgs[hash_id];
        return imageUrl ? (
          <BotChatArrayImageDialog
            key={hash_id}
            imageUrl={imageUrl}
            text={hash_id}
          />
        ) : (
          <span key={hash_id}>DOC ID : {hash_id}</span>
        );
      })} */}
    </div>
  );
});

BotChatLinks.displayName = 'BotChatLinks';

export default BotChatLinks;
