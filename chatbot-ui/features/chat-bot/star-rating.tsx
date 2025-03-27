import { useState, FC, useEffect } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  totalStars?: number;
  onRatingChange?: (rating: number) => void;
  initialRating?: number;
}

const StarRating: FC<StarRatingProps> = ({
  totalStars = 5,
  onRatingChange,
  initialRating = 0, // 기본값 0
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hover, setHover] = useState<number>(0);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleClick = (index: number) => {
    const newRating = index + 1;

    if (rating === newRating) {
      setRating(0);
      onRatingChange && onRatingChange(0);
    } else {
      setRating(newRating);
      onRatingChange && onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (index: number) => {
    setHover(index + 1);
  };

  const handleMouseLeave = () => {
    setHover(0);
  };

  return (
    <div className='flex flex-row space-x-2'>
      {Array.from({ length: totalStars }, (_, index) => {
        const isFilled = index < (hover || rating);
        return (
          <Star
            key={'Rate Star' + index}
            className={`cursor-pointer w-20 h-20 transition-colors duration-200 ${
              isFilled
                ? 'fill-customColor-primary1 stroke-customColor-primary1'
                : 'fill-customColor-gray1 stroke-customColor-gray1'
            }`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
