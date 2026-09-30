import { whatsappLink } from '../utils/whatsapp';
import { WhatsAppIcon } from './Icons';

export default function WhatsAppButton() {
  return (
    <a className="wa-float" href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">
      <WhatsAppIcon size={30} />
    </a>
  );
}
