import { formatDate } from "@/lib/format";

export default function ProductReviews({ reviews }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-gray-500">No reviews yet.</p>;
  }

  return (
    <ul className="divide-y divide-gray-100">
      {reviews.map((review, index) => (
        <li key={`${review.reviewerEmail}-${index}`} className="py-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">{review.reviewerName}</span>
            <span className="tabular-nums text-gray-600">{review.rating} ★</span>
          </div>
          <p className="mt-1 text-gray-700">{review.comment}</p>
          <p className="mt-1 text-xs text-gray-400">{formatDate(review.date)}</p>
        </li>
      ))}
    </ul>
  );
}
