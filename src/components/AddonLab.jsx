import { useMemo, useState } from 'react'
import { ADDON_FEATURES, API_CATEGORIES, WOW_API, buildAddon } from '../data/wowApi'

const copyText = async (text) => {
  try { await navigator.clipboard.writeText(text); return true } catch { return false }
}

const downloadText = (filename, text) => {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function CopyButton({ text, label = '복사' }) {
  const [done, setDone] = useState(false)
  return <button className="addon-copy" type="button" onClick={async () => { if (await copyText(text)) { setDone(true); setTimeout(() => setDone(false), 1200) } }}>
    {done ? '복사됨 ✓' : label}
  </button>
}

function ApiCard({ entry, highlighted }) {
  const [open, setOpen] = useState(false)
  return <article className={`api-card ${entry.kind} ${highlighted ? 'is-used' : ''} ${open ? 'open' : ''}`} id={`api-${entry.id}`}>
    <button className="api-card-head" type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
      <span className="api-kind">{entry.kind === 'event' ? 'EVENT' : 'FUNC'}</span>
      <strong>{entry.name}</strong>
      <b>{open ? '−' : '+'}</b>
    </button>
    <p className="api-ko">{entry.ko}</p>
    {open && <div className="api-detail">
      <dl>
        <dt>형태</dt><dd><code>{entry.sig}</code></dd>
        <dt>반환</dt><dd><code>{entry.returns}</code></dd>
      </dl>
      <div className="addon-code-wrap">
        <pre className="addon-code"><code>{entry.lua}</code></pre>
        <CopyButton text={entry.lua} />
      </div>
    </div>}
  </article>
}

function ApiDictionary({ usedIds }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return WOW_API.filter((e) => (category === 'all' || e.category === category) &&
      (!q || `${e.name} ${e.sig} ${e.ko} ${e.lua}`.toLowerCase().includes(q)))
  }, [query, category])

  return <section className="window addon-window" data-section="api-dictionary" data-title="API사전.exe">
    <p className="home-modal-lead">자주 쓰는 WoW 애드온 API를 한글로 풀어봤어요. 눌러서 Lua 예제를 열고, 복사해서 바로 써보세요 ✿</p>
    <div className="api-toolbar">
      <input className="api-search" type="search" placeholder="함수·이벤트·설명 검색 (예: 체력, target, 전투)" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="api-chips">
        {API_CATEGORIES.map((c) => <button className={`api-chip ${category === c.id ? 'active' : ''}`} type="button" key={c.id} onClick={() => setCategory(c.id)}>{c.label}</button>)}
      </div>
    </div>
    <div className="api-count">{list.length}개 · 분홍 테두리는 오른쪽 애드온에서 쓰는 API</div>
    <div className="api-list">
      {list.map((e) => <ApiCard entry={e} key={e.id} highlighted={usedIds.includes(e.id)} />)}
      {list.length === 0 && <p className="api-empty">검색 결과가 없어요. 다른 말로 찾아볼까요?</p>}
    </div>
    <small className="api-source">참고: <a href="https://warcraft.wiki.gg/wiki/World_of_Warcraft_API" target="_blank" rel="noopener noreferrer">warcraft.wiki.gg API 문서 ↗</a></small>
  </section>
}

function AddonBuilder({ name, setName, selected, setSelected, result }) {
  const [tab, setTab] = useState('lua')
  const toggle = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id])
  const code = tab === 'lua' ? result.lua : result.toc
  const filename = tab === 'lua' ? `${result.name}.lua` : `${result.name}.toc`

  return <section className="window addon-window addon-builder" data-section="addon-builder" data-title="애드온만들기.exe">
    <p className="home-modal-lead">기능을 고르면 애드온 파일이 완성돼요. 코딩 몰라도 괜찮아, 왼쪽 사전이 설명해줄게 ✿</p>
    <label className="addon-name-field">
      <span>애드온 이름 (영문·숫자)</span>
      <input type="text" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} placeholder="WowDiary" />
    </label>
    <ul className="addon-features">
      {ADDON_FEATURES.map((f) => <li key={f.id}>
        <label className={selected.includes(f.id) ? 'checked' : ''}>
          <input type="checkbox" checked={selected.includes(f.id)} onChange={() => toggle(f.id)} />
          <span className="addon-feature-check">{selected.includes(f.id) ? '✓' : ''}</span>
          <span className="addon-feature-text"><strong>{f.label}</strong><small>{f.hint}</small></span>
        </label>
      </li>)}
    </ul>
    <div className="addon-tabs">
      <button type="button" className={tab === 'lua' ? 'active' : ''} onClick={() => setTab('lua')}>{result.name}.lua</button>
      <button type="button" className={tab === 'toc' ? 'active' : ''} onClick={() => setTab('toc')}>{result.name}.toc</button>
    </div>
    <div className="addon-code-wrap">
      <pre className="addon-code addon-code-tall"><code>{code}</code></pre>
      <CopyButton text={code} />
    </div>
    <div className="addon-actions">
      <button className="button" type="button" onClick={() => { downloadText(`${result.name}.toc`, result.toc); downloadText(`${result.name}.lua`, result.lua) }}>두 파일 다운로드 <b>↓</b></button>
      <button className="button" type="button" onClick={() => downloadText(filename, code)}>{filename}만 <b>↓</b></button>
    </div>
    <div className="addon-howto">
      <strong>설치 방법</strong>
      <ol>
        <li><code>World of Warcraft/_retail_/Interface/AddOns/</code> 안에 <code>{result.name}</code> 폴더 만들기</li>
        <li>다운로드한 <code>{result.name}.toc</code>, <code>{result.name}.lua</code> 두 파일을 그 폴더에 넣기</li>
        <li>게임 재시작 (또는 <code>/reload</code>) 후 캐릭터 선택 화면 애드온 목록에서 확인</li>
      </ol>
    </div>
  </section>
}

export default function AddonLab({ navigate }) {
  const [name, setName] = useState('WowDiary')
  const [selected, setSelected] = useState(['login', 'nextitem'])
  const result = useMemo(() => buildAddon(name, selected), [name, selected])

  return <main className="guide-page addon-page" data-section="addons-page">
    <div className="guide-main">
      <section className="window addon-hero" data-section="addon-hero" data-title="애드온공방.exe">
        <div className="addon-hero-text">
          <span className="addon-hero-kicker">ADDON LAB · DOCS → CODE</span>
          <h1>애드온 공방<small>내 손으로 만드는 첫 애드온</small></h1>
          <p>와우 애드온은 Lua라는 작은 언어로 만들어요. 코딩 몰라도 괜찮아요. 사전에서 읽고, 체크만 하면 진짜 동작하는 애드온 파일이 나옵니다.</p>
        </div>
        <ol className="addon-hero-steps">
          <li><b>01</b><span>API 사전에서<br />함수 읽어보기</span></li>
          <li><b>02</b><span>원하는 기능<br />체크하기</span></li>
          <li><b>03</b><span>파일 받아서<br />AddOns 폴더에</span></li>
        </ol>
      </section>
      <div className="addon-grid addon-grid-tight">
        <ApiDictionary usedIds={result.uses} />
        <AddonBuilder name={name} setName={setName} selected={selected} setSelected={setSelected} result={result} />
      </div>
      <a className="button back-button" href="#home" onClick={() => navigate('home')}>처음으로 돌아가기 <b>↗</b></a>
    </div>
  </main>
}
