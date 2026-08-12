import { WHATSAPP_NUMBER } from './config';

export { WHATSAPP_NUMBER };

/** Build a wa.me link with a pre-filled, URL-encoded message. */
export function waLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
