import { useState } from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTestimonials } from '../../context/TestimonialsContext';

const fieldClass =
  'w-full rounded-lg border border-line bg-surface px-4 py-2.5 text-ink placeholder:text-ink-2/60 outline-none transition-colors focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30';

export function TestimonialForm({ onClose }: { onClose: () => void }) {
  const { addTestimonial } = useTestimonials();

  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [trip, setTrip] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    addTestimonial({
      quote: message.trim(),
      name: name.trim(),
      trip: trip.trim() || 'Pengunjung',
      rating,
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 aria-hidden="true" className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-ink">Terima kasih!</h3>
        <p className="mt-2 text-sm text-ink-2">
          Testimoni Anda sudah ditambahkan dan langsung tampil di halaman utama.
        </p>
        <Button onClick={onClose} className="mt-5 w-full">
          Tutup
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tf-name" className="mb-1.5 block text-sm font-medium text-ink">
            Nama <span className="text-primary">*</span>
          </label>
          <input
            id="tf-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="tf-trip" className="mb-1.5 block text-sm font-medium text-ink">
            Paket / Trip
          </label>
          <input
            id="tf-trip"
            type="text"
            value={trip}
            onChange={(e) => setTrip(e.target.value)}
            placeholder="Contoh: Privat Trip Ciremai"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink">Rating</span>
        <div role="group" aria-label="Beri rating" className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`${star} bintang`}
              aria-pressed={rating === star}
              className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Star
                aria-hidden="true"
                className={
                  star <= rating
                    ? 'h-6 w-6 fill-[#F4B942] text-[#F4B942]'
                    : 'h-6 w-6 text-line'
                }
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="tf-message" className="mb-1.5 block text-sm font-medium text-ink">
          Pesan <span className="text-primary">*</span>
        </label>
        <textarea
          id="tf-message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ceritakan pengalaman Anda bersama VisitCiremai..."
          className={`${fieldClass} resize-y`}
        />
      </div>

      <Button type="submit" className="w-full">
        Kirim Testimoni
      </Button>
    </form>
  );
}
