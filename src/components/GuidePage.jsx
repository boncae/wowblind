import { useEffect, useRef, useState } from 'react'

let errorPopupSeq = 0

export default function GuidePage({ data, navigate }) {
  const isDungeon = data.en === 'DUNGEONS'
  const [errorPopups, setErrorPopups] = useState([])
  const errorTimers = useRef([])

  useEffect(() => () => errorTimers.current.forEach(clearTimeout), [])

  const spawnErrorPopup = () => setErrorPopups((popups) => [...popups, errorPopupSeq++])
  const openErrorPopups = () => {
    spawnErrorPopup()
    errorTimers.current.push(setTimeout(spawnErrorPopup, 350))
    errorTimers.current.push(setTimeout(spawnErrorPopup, 700))
  }
  const closeErrorPopup = (id) => setErrorPopups((popups) => popups.filter((popupId) => popupId !== id))

  return <main className={`guide-page ${isDungeon ? 'dungeon-page' : ''}`} data-section={`${data.en.toLowerCase()}-page`}>
    {isDungeon && <aside className="dungeon-sidebar window" data-section="dungeon-guide-menu" data-title="know-how.exe"><span className="sidebar-label"></span><h2>던전 공략</h2><p>필요한 순간에만 열어보세요.</p><a className="dungeon-guide-button" href="#dungeon-guide" onClick={(event) => { event.preventDefault(); openErrorPopups() }}>공략 보기 <b>↗</b></a><small className="sidebar-warning">SPOILER LIGHT</small></aside>}
    {errorPopups.length > 0 && <div className="error-popup-backdrop" data-section="guide-error-popup">
      {errorPopups.map((id, i) => <div className="error-popup win97" key={id} role="alertdialog" aria-modal="true" aria-label="공략보기 실패" style={{ '--stack-i': i }}>
        <div className="error-popup-titlebar">
          <span className="error-popup-title">ERROR!!!!</span>
          <div className="error-popup-controls">
            <button type="button" aria-label="최소화">_</button>
            <button type="button" aria-label="닫기" onClick={() => closeErrorPopup(id)}>×</button>
          </div>
        </div>
        <div className="error-popup-body">
          <b className="error-popup-icon" aria-hidden="true">!</b>
          <div>
            <strong>공략 열기 실패</strong>
            <p>낭만을 찾을 수 없습니다. 진심이십니까 휴먼?</p>
          </div>
        </div>
        <div className="error-popup-actions"><button type="button" onClick={() => closeErrorPopup(id)}>확인</button></div>
      </div>)}
    </div>}
    <div className="guide-main"><section className="guide-hero" data-section="guide-hero"><div className="section-kicker">01 / {data.en}</div><div className="guide-title"><span className="guide-symbol">{data.symbol}</span><h1>{data.ko}<small>{data.en}</small></h1></div><p className="guide-intro">{data.intro}<small>{data.en}</small></p><p className="guide-copy">{data.copy}</p></section><section className="guide-content" data-section="guide-notes"><div className="section-kicker">YOUR FIRST NOTES</div><div className="guide-grid">{data.items.map((item, i) => <article className="guide-card" key={item}><span>0{i + 1}</span><div><h2>{item}</h2><small>{['당신이 처음 느낀 것', '처음 마주한 순간', '함께 걸어가는 길'][i]}</small></div><b>↗</b></article>)}</div>{isDungeon && <section className="dungeon-guide-detail window" id="dungeon-guide" data-section="dungeon-guide-detail" data-title="spoiler-light-guide.exe"><h2>던전 공략 메모</h2><p>처음에는 직접 발견해보세요. 막히는 순간 아래의 작은 힌트를 열어보면 됩니다.</p><ul><li>입장 전 파티의 역할을 확인해요.</li><li>새로운 바닥 효과가 보이면 잠시 멈춰 관찰해요.</li><li>모르는 패턴은 한 번 겪어보며 기록해요.</li></ul></section>}<a className="button back-button" href="#home" onClick={() => navigate('home')}>처음으로 돌아가기 <b>↗</b></a></section></div>
  </main>
}
