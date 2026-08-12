// Central WhatsApp contact used by the floating button and the booking form.
export const WHATSAPP_NUMBER = '6285520752899';

/** Build a wa.me link with a pre-filled, URL-encoded message. */
export function waLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
