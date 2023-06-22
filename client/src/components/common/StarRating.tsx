export const StarRating = ({ rating, size = 'lg' }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  const starColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-400'];

  return (
    <div className="rating gap-1">
      {Array(5)
        .fill()
        .map((_, i) => (
          <input
            key={i}
            type="radio"
            name="rating"
            className={`mask mask-star ${starColors[i]}`}
          />
        ))}
    </div>
  );
};
