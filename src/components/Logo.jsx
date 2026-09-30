import logo from '../assets/logo-kaizen.webp';
import logoFull from '../assets/logo-kaizen-completo.webp';

/** Logo oficial. `full` inclui o slogan "Performance · Força · Evolução". Use sobre fundo escuro. */
export default function Logo({ full = false, className = '' }) {
  return (
    <img
      src={full ? logoFull : logo}
      alt="Kaizen Suplementos"
      className={`logo ${className}`}
      width={full ? 560 : 480}
      height={full ? 207 : 140}
      decoding="async"
    />
  );
}
