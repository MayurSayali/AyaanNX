import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus } from 'lucide-react';
import { ProductReview } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../ui/Toast.js';

interface ReviewSectionProps {
  productId: string;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  onReviewAdded: () => void;
  onRequireAuth: () => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  rating,
  reviewCount,
  reviews = [],
  onReviewAdded,
  onRequireAuth,
}) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    if (!comment.trim() || comment.trim().length < 5) {
      showToast('Please provide a detailed review (at least 5 characters)', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('ayaan_token');
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: userRating, comment: comment.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Thank you! Your verified review has been published.', 'success');
        setComment('');
        setShowForm(false);
        onReviewAdded();
      } else {
        showToast(data.error || 'Failed to submit review', 'error');
      }
    } catch {
      showToast('Error connecting to review server', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h3 className="font-bebas text-2xl tracking-wider uppercase text-neutral-900 dark:text-neutral-100">
            Client Reviews & Ratings
          </h3>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(rating) ? 'fill-amber-400' : 'text-neutral-300 dark:text-neutral-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold tabular-nums text-neutral-900 dark:text-neutral-100 font-mono">
              {rating.toFixed(1)} / 5.0
            </span>
            <span className="text-xs text-neutral-500">
              ({reviewCount} verified client evaluations)
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            if (!isAuthenticated) {
              onRequireAuth();
            } else {
              setShowForm(!showForm);
            }
          }}
          className="px-5 py-2.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 dark:hover:bg-amber-400 transition-colors self-start md:self-auto flex items-center gap-2"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          {showForm ? 'Cancel Review' : 'Write a Review'}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4"
        >
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2 font-mono">
              Your Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setUserRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= userRating ? 'fill-amber-400' : 'text-neutral-300 dark:text-neutral-700'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono ml-2 text-neutral-400">{userRating} of 5 Stars</span>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2 font-mono">
              Detailed Assessment & Sizing Feedback
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How does the fabric drape? How is the shoulder seam and heavyweight cotton feel?"
              className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Post Verified Review'}
            </button>
          </div>
        </form>
      )}

      {/* Review list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800">
            Be the first client to review this Ayaan NX silhouette.
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    {rev.userName}
                  </span>
                  {rev.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-500 font-mono">
                      <CheckCircle className="w-3 h-3" />
                      Verified Order
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-neutral-400 font-mono">{rev.date}</span>
              </div>

              <div className="flex items-center text-amber-400 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= rev.rating ? 'fill-amber-400' : 'text-neutral-300 dark:text-neutral-700'
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-body">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
