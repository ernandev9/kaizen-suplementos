import { useEffect, useMemo, useState } from 'react';
import { REPO } from '../config/store';
import { categories, categoriesById } from '../data/categories';
import { brl, normalize } from '../utils/format';
import { navigate } from '../hooks/useRoute';
import { Icon } from '../components/Icons';

/**
 * PAINEL DO ADMINISTRADOR  (#/admin)
 * O site não tem servidor. O painel entra com um token do GitHub (só quem é dono do
 * repositório consegue) e grava as alterações em src/data/products.json. A loja lê esse
 * arquivo, então o cliente passa a ver o novo preço/estoque em poucos minutos.
 */
const API = `https://api.github.com/repos/${REPO.owner}/${REPO.name}`;
const TOKEN_KEY = 'kaizen:admin-token';
const TOKEN_URL = `https://github.com/settings/personal-access-tokens/new`;

const getStored = () => {
  try { return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
};
const storeToken = (t, remember) => {
  try {
    sessionStorage.setItem(TOKEN_KEY, t);
    if (remember) localStorage.setItem(TOKEN_KEY, t);
  } catch { /* sem armazenamento: pede o token de novo */ }
};
const clearToken = () => {
  try { sessionStorage.removeItem(TOKEN_KEY); localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
};

const fromB64 = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, '')), (c) => c.charCodeAt(0)));
const toB64 = (str) => {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin);
};

async function gh(token, path = '', init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Erro ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

const slugify = (s) =>
  normalize(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const SHAPE_BY_CAT = { whey: 'refil', creatina: 'pote', 'pre-treino': 'pote', 'pre-sem-cafeina': 'pote', 'bem-estar': 'frasco', barras: 'barra' };
const COLORS = ['#15171a', '#1b4fa0', '#c8481a', '#3f8f2c', '#d9a800', '#b8246f', '#5a2a8c', '#4a2c1d', '#c23a4d', '#7a1f1f'];

/** campo numérico que aceita digitação livre (vírgula ou ponto) */
function NumField({ value, onChange, label, int = false, min = 0, ...rest }) {
  const [text, setText] = useState(value === '' || value == null ? '' : String(value).replace('.', ','));
  useEffect(() => {
    setText(value === '' || value == null ? '' : String(value).replace('.', ','));
  }, [value]);
  const commit = (raw) => {
    setText(raw);
    const clean = raw.replace(',', '.').trim();
    if (clean === '') return onChange(null);
    const n = Number(clean);
    if (Number.isFinite(n) && n >= min) onChange(int ? Math.floor(n) : Math.round(n * 100) / 100);
  };
  return (
    <input
      className="adm__num" inputMode={int ? 'numeric' : 'decimal'} aria-label={label}
      value={text} onChange={(e) => commit(e.target.value)} {...rest}
    />
  );
}

function Login({ onLogin }) {
  const [token, setToken] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const repo = await gh(token.trim());
      if (!repo.permissions?.push) throw new Error('Este token não tem permissão de escrita no repositório da loja.');
      storeToken(token.trim(), remember);
      onLogin(token.trim());
    } catch (err) {
      setError(err.status === 401 ? 'Token inválido ou expirado.' : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page adm">
      <form className="panel adm__login" onSubmit={submit}>
        <p className="eyebrow eyebrow--dark"><i /> Área restrita</p>
        <h1 className="page__title">Painel do administrador</h1>
        <p className="muted">Entre com o seu token de acesso do GitHub para alterar preços, estoque e ativar ou desativar produtos.</p>
        <label className="field">
          Token de acesso
          <input type="password" autoComplete="off" value={token} onChange={(e) => setToken(e.target.value)} placeholder="github_pat_…" required />
        </label>
        <label className="switch"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Manter conectado neste aparelho</label>
        {error && <p className="alert" role="alert">{error}</p>}
        <button className="btn btn--primary btn--lg btn--block" disabled={busy || !token.trim()}>{busy ? 'Verificando…' : 'Entrar'}</button>
        <details className="adm__help">
          <summary>Como gerar o token</summary>
          <ol>
            <li>Abra <a className="link" href={TOKEN_URL} target="_blank" rel="noopener noreferrer">github.com → Fine-grained tokens</a> e crie um novo.</li>
            <li>Em <b>Repository access</b>, escolha “Only select repositories” e marque <b>{REPO.name}</b>.</li>
            <li>Em <b>Permissions → Repository permissions</b>, coloque <b>Contents: Read and write</b>.</li>
            <li>Gere, copie o token e cole acima. Não compartilhe com ninguém.</li>
          </ol>
        </details>
      </form>
    </div>
  );
}

function NewProduct({ onAdd, onClose }) {
  const [f, setF] = useState({ name: '', brand: '', category: categories[0].id, price: null, stock: 1 });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const ok = f.name.trim() && f.price > 0;
  const submit = (e) => {
    e.preventDefault();
    if (!ok) return;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    onAdd({
      name: f.name.trim(), brand: f.brand.trim(), category: f.category, price: f.price, stock: f.stock ?? 0, active: true,
      visual: { shape: SHAPE_BY_CAT[f.category] || 'pote', color, label: (categoriesById[f.category]?.short || 'KAIZEN').toUpperCase().slice(0, 8) },
      description: f.name.trim(),
    });
  };
  return (
    <form className="panel adm__new" onSubmit={submit}>
      <h2>Novo produto</h2>
      <div className="form-grid">
        <label className="field span-2">Nome<input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Ex.: Whey Black Skull · Baunilha" required /></label>
        <label className="field">Marca<input value={f.brand} onChange={(e) => set('brand', e.target.value)} /></label>
        <label className="field">Categoria
          <select value={f.category} onChange={(e) => set('category', e.target.value)}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="field">Preço (R$)<NumField value={f.price} onChange={(v) => set('price', v)} label="Preço" min={0.01} /></label>
        <label className="field">Estoque<NumField int value={f.stock} onChange={(v) => set('stock', v)} label="Estoque" /></label>
      </div>
      <div className="adm__actions">
        <button type="button" className="btn btn--ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn--primary" disabled={!ok}>Adicionar à lista</button>
      </div>
      <p className="muted small">A embalagem é desenhada automaticamente. Para foto real, adicione o campo <code>image</code> do produto no arquivo.</p>
    </form>
  );
}

export default function Admin() {
  const [token, setToken] = useState(getStored);
  const [original, setOriginal] = useState(null);
  const [draft, setDraft] = useState([]);
  const [sha, setSha] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | saving
  const [msg, setMsg] = useState(null); // { type, text }
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'robots'; document.head.appendChild(meta); }
    meta.content = 'noindex, nofollow';
    return () => meta.remove();
  }, []);

  const logout = () => { clearToken(); setToken(''); setOriginal(null); setDraft([]); };

  const load = async (t = token) => {
    setStatus('loading');
    setMsg(null);
    try {
      const file = await gh(t, `/contents/${REPO.file}?ref=${REPO.branch}`);
      const list = JSON.parse(fromB64(file.content));
      setOriginal(list);
      setDraft(list.map((p) => ({ ...p })));
      setSha(file.sha);
    } catch (err) {
      if (err.status === 401) { logout(); return; }
      setMsg({ type: 'error', text: `Não foi possível carregar os produtos: ${err.message}` });
    } finally {
      setStatus('idle');
    }
  };

  useEffect(() => { if (token) load(token); /* eslint-disable-next-line */ }, [token]);

  const origById = useMemo(() => Object.fromEntries((original || []).map((p) => [p.id, p])), [original]);
  const changed = (p) => JSON.stringify(origById[p.id]) !== JSON.stringify(p);
  const dirtyCount = draft.filter(changed).length;

  const update = (id, patch) => setDraft((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const addProduct = (data) => {
    const id = draft.reduce((m, p) => Math.max(m, p.id), 0) + 1;
    let slug = slugify(data.name);
    while (draft.some((p) => p.slug === slug)) slug += '-2';
    setDraft((list) => [...list, { id, slug, ...data }]);
    setAdding(false);
    setMsg({ type: 'ok', text: 'Produto adicionado à lista. Clique em “Salvar e publicar” para colocar no site.' });
  };

  const save = async () => {
    setStatus('saving');
    setMsg(null);
    try {
      const body = {
        message: `Painel: atualiza produtos (${dirtyCount} ${dirtyCount === 1 ? 'alteração' : 'alterações'})`,
        content: toB64(`${JSON.stringify(draft, null, 2)}\n`),
        sha,
        branch: REPO.branch,
      };
      const res = await gh(token, `/contents/${REPO.file}`, { method: 'PUT', body: JSON.stringify(body) });
      setSha(res.content.sha);
      setOriginal(draft.map((p) => ({ ...p })));
      setMsg({ type: 'ok', text: 'Publicado! A loja mostra as mudanças em poucos minutos (pode levar até 5).' });
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.status === 409 || err.status === 422
          ? 'O arquivo mudou no GitHub desde que você abriu o painel. Clique em “Recarregar” e refaça as alterações.'
          : `Não foi possível salvar: ${err.message}`,
      });
    } finally {
      setStatus('idle');
    }
  };

  if (!token) return <Login onLogin={setToken} />;

  const shown = draft.filter((p) => (!cat || p.category === cat) && (!q || normalize(`${p.name} ${p.brand}`).includes(normalize(q))));
  const activeCount = draft.filter((p) => p.active !== false).length;
  const busy = status !== 'idle';

  return (
    <div className="container page adm">
      <div className="adm__head">
        <div>
          <p className="eyebrow eyebrow--dark"><i /> Administrador</p>
          <h1 className="page__title">Produtos</h1>
          <p className="muted">{draft.length} cadastrados · {activeCount} ativos na loja</p>
        </div>
        <div className="adm__top-actions">
          <button className="btn btn--ghost" onClick={() => navigate('/')}>Ver loja</button>
          <button className="btn btn--outline" onClick={() => load()} disabled={busy}>Recarregar</button>
          <button className="btn btn--ghost" onClick={logout}>Sair</button>
        </div>
      </div>

      {msg && <p className={msg.type === 'ok' ? 'adm__ok' : 'alert'} role="status">{msg.text}</p>}

      <div className="adm__tools">
        <input className="adm__search" type="search" placeholder="Buscar produto ou marca" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar" />
        <select className="adm__cat" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Categoria">
          <option value="">Todas as categorias</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn btn--outline" onClick={() => setAdding((v) => !v)}><Icon name="plus" size={18} /> Novo produto</button>
      </div>

      {adding && <NewProduct onAdd={addProduct} onClose={() => setAdding(false)} />}

      {status === 'loading' && !draft.length ? <p className="muted">Carregando produtos…</p> : (
        <div className="adm__list" role="table" aria-label="Produtos">
          <div className="adm__row adm__row--head" role="row">
            <span>Produto</span><span>Preço (R$)</span><span>“De” (R$)</span><span>Estoque</span><span>Destaque</span><span>Na loja</span>
          </div>
          {shown.map((p) => (
            <div key={p.id} className={`adm__row ${changed(p) ? 'is-dirty' : ''} ${p.active === false ? 'is-off' : ''}`} role="row">
              <div className="adm__name" data-label="Produto">
                <strong>{p.name}</strong>
                <small>{[categoriesById[p.category]?.short, p.brand].filter(Boolean).join(' · ')}</small>
              </div>
              <label data-label="Preço (R$)"><NumField value={p.price} label={`Preço de ${p.name}`} min={0.01} onChange={(v) => v != null && update(p.id, { price: v })} /></label>
              <label data-label="“De” (R$)"><NumField value={p.oldPrice ?? ''} label={`Preço antigo de ${p.name}`} placeholder="—" onChange={(v) => update(p.id, { oldPrice: v || undefined })} /></label>
              <div className="adm__stock" data-label="Estoque">
                <button type="button" aria-label="Diminuir estoque" onClick={() => update(p.id, { stock: Math.max(0, (p.stock || 0) - 1) })}><Icon name="minus" size={16} /></button>
                <NumField int value={p.stock} label={`Estoque de ${p.name}`} onChange={(v) => update(p.id, { stock: v ?? 0 })} />
                <button type="button" aria-label="Aumentar estoque" onClick={() => update(p.id, { stock: (p.stock || 0) + 1 })}><Icon name="plus" size={16} /></button>
              </div>
              <label className="adm__check" data-label="Destaque"><input type="checkbox" checked={!!p.featured} onChange={(e) => update(p.id, { featured: e.target.checked || undefined })} /><span className="sr-only">Destaque</span></label>
              <label className="adm__toggle" data-label="Na loja">
                <input type="checkbox" role="switch" checked={p.active !== false} onChange={(e) => update(p.id, { active: e.target.checked })} />
                <span>{p.active === false ? 'Desativado' : 'Ativo'}</span>
              </label>
            </div>
          ))}
          {!shown.length && <p className="muted adm__none">Nenhum produto encontrado.</p>}
        </div>
      )}

      <div className={`adm__bar ${dirtyCount || draft.length !== original?.length ? 'is-on' : ''}`}>
        <span>{dirtyCount ? `${dirtyCount} produto${dirtyCount === 1 ? '' : 's'} alterado${dirtyCount === 1 ? '' : 's'}` : 'Novo produto na lista'}</span>
        <button className="btn btn--ghost" onClick={() => setDraft(original.map((p) => ({ ...p })))} disabled={busy}>Descartar</button>
        <button className="btn btn--lime" onClick={save} disabled={busy}>{status === 'saving' ? 'Publicando…' : 'Salvar e publicar'}</button>
      </div>
      <p className="muted small adm__note">Preço “De” preenchido (maior que o preço) mostra o produto em Ofertas com o desconto. Produto desativado some da loja, mas continua aqui para reativar. Total em estoque: {draft.reduce((s, p) => s + (p.stock || 0), 0)} unidades · valor {brl(draft.reduce((s, p) => s + p.price * (p.stock || 0), 0))}.</p>
    </div>
  );
}
