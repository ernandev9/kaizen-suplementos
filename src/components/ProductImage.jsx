import { useId } from 'react';
import { sizeOf } from '../utils/format';

/**
 * Mostra a foto do produto (product.image) ou, se não houver foto,
 * uma embalagem ilustrada gerada a partir de product.visual.
 */
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, v + amt));
  return `rgb(${c(n >> 16)}, ${c((n >> 8) & 255)}, ${c(n & 255)})`;
}
const isLight = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) > 165;
};

const FONT = 'Archivo, sans-serif';

function Packaging({ product, uid }) {
  const { visual, brand } = product;
  const { shape = 'pote', color = '#1E2A36', label = '' } = visual || {};
  const size = sizeOf(product);
  const light = isLight(color);
  const ink = light ? '#141a16' : '#FFFFFF';
  const c0 = shade(color, -55);
  const c1 = shade(color, 12);
  const c2 = shade(color, 45);
  const big = label.length > 8 ? 16 : label.length > 5 ? 19 : label.length > 3 ? 22 : 28;

  const body = `url(#b${uid})`;
  const gloss = `url(#g${uid})`;

  const defs = (
    <defs>
      <linearGradient id={`b${uid}`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor={c0} />
        <stop offset=".28" stopColor={c2} />
        <stop offset=".5" stopColor={c1} />
        <stop offset="1" stopColor={c0} />
      </linearGradient>
      <linearGradient id={`g${uid}`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset=".22" stopColor="#fff" stopOpacity=".38" />
        <stop offset=".34" stopColor="#fff" stopOpacity="0" />
        <stop offset=".8" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity=".28" />
      </linearGradient>
      <linearGradient id={`l${uid}`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#0d120f" />
        <stop offset="1" stopColor="#1b231e" />
      </linearGradient>
    </defs>
  );

  const Label = ({ x, y, w, h }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={`url(#l${uid})`} />
      <rect x={x} y={y} width={w} height="3" fill="#C9EE3F" />
      <path d={`M${x} ${y + h}h${w}v-6l-${w * 0.28} 6z`} fill="#C9EE3F" opacity="0" />
      <text x={x + w / 2} y={y + 17} textAnchor="middle" fontFamily={FONT} fontSize="6.5" fontWeight="700" letterSpacing="1.6" fill="#C9EE3F">
        {(brand || '').toUpperCase()}
      </text>
      <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" fontFamily={FONT} fontStyle="italic" fontWeight="900" fontSize={big} fill="#fff" textLength={Math.min(w - 16, label.length * big * 0.8)} lengthAdjust="spacingAndGlyphs">
        {label}
      </text>
      {size && (
        <text x={x + w / 2} y={y + h - 8} textAnchor="middle" fontFamily={FONT} fontSize="6.5" fontWeight="600" letterSpacing="1" fill="#fff" opacity=".7">
          {size.toUpperCase()}
        </text>
      )}
      <rect x={x} y={y + h - 3} width={w} height="3" fill={color} />
    </g>
  );

  if (shape === 'refil') {
    return (
      <g>
        {defs}
        <path d="M58 44h84l5 10-3 108a8 8 0 0 1-8 8H64a8 8 0 0 1-8-8l-3-108z" fill={body} />
        <path d="M58 44h84l5 10H53z" fill={c0} />
        <path d="M60 30h80l2 14H58z" fill={shade(color, -20)} />
        <path d="M62 34h76" stroke="#fff" strokeOpacity=".3" strokeWidth="1.5" />
        <rect x="53" y="46" width="94" height="124" fill={gloss} />
        <Label x={62} y={84} w={76} h={64} />
      </g>
    );
  }
  if (shape === 'barra') {
    return (
      <g transform="rotate(-14 100 100)">
        {defs}
        <rect x="34" y="72" width="132" height="52" rx="6" fill={body} />
        <rect x="34" y="72" width="132" height="52" rx="6" fill={gloss} />
        <path d="M34 78l-6 4v36l6 4M166 78l6 4v36l-6 4" stroke={c0} strokeWidth="3" fill="none" />
        <rect x="34" y="88" width="132" height="20" fill="#0d120f" />
        <rect x="34" y="88" width="132" height="2.5" fill="#C9EE3F" />
        <text x="100" y="103" textAnchor="middle" fontFamily={FONT} fontStyle="italic" fontWeight="900" fontSize="13" fill="#fff">{(brand || label).toUpperCase().slice(0, 14)}</text>
      </g>
    );
  }
  if (shape === 'frasco') {
    return (
      <g>
        {defs}
        <rect x="80" y="32" width="40" height="26" rx="4" fill={light ? '#2a332d' : '#eef1ea'} />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={84 + i * 6} y="34" width="2" height="22" fill="#000" opacity=".12" />)}
        <rect x="76" y="56" width="48" height="8" rx="3" fill={c0} />
        <rect x="64" y="62" width="72" height="108" rx="14" fill={body} />
        <rect x="64" y="62" width="72" height="108" rx="14" fill={gloss} />
        <Label x={66} y={88} w={68} h={58} />
      </g>
    );
  }
  if (shape === 'coqueteleira') {
    return (
      <g>
        {defs}
        <path d="M86 26h28l3 14H83z" fill="#C9EE3F" />
        <rect x="76" y="38" width="48" height="16" rx="3" fill={c0} />
        <path d="M78 54h44l-7 116H85z" fill={body} />
        <path d="M78 54h44l-7 116H85z" fill={gloss} />
        {[78, 92, 106, 120, 134].map((y) => <rect key={y} x={y > 100 ? 86 : 84} y={y} width={y > 100 ? 28 : 32} height="2" fill="#fff" opacity=".18" />)}
        <text x="100" y="116" textAnchor="middle" fontFamily={FONT} fontStyle="italic" fontWeight="900" fontSize="12" fill="#C9EE3F" style={{ fontStretch: '125%' }}>{label}</text>
        <text x="100" y="128" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="5.5" letterSpacing="1.4" fill="#fff" opacity=".6">700 ML</text>
      </g>
    );
  }
  // pote
  return (
    <g>
      {defs}
      <rect x="56" y="36" width="88" height="26" rx="6" fill={light ? '#2a332d' : shade(color, -25)} />
      {Array.from({ length: 14 }, (_, i) => <rect key={i} x={60 + i * 6} y="38" width="2" height="22" fill="#000" opacity=".16" />)}
      <rect x="56" y="36" width="88" height="26" rx="6" fill={gloss} />
      <rect x="52" y="60" width="96" height="112" rx="10" fill={body} />
      <rect x="52" y="60" width="96" height="112" rx="10" fill={gloss} />
      <Label x={54} y={84} w={92} h={70} />
    </g>
  );
}

export default function ProductImage({ product, className = '' }) {
  const uid = useId().replace(/:/g, '');
  if (product.image) {
    return <img src={product.image} alt={product.name} loading="lazy" decoding="async" className={`product-img ${className}`} />;
  }
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={product.name} className={`product-img ${className}`}>
      <ellipse cx="100" cy="175" rx="58" ry="6.5" fill="#000" opacity=".28" />
      <Packaging product={product} uid={uid} />
    </svg>
  );
}
