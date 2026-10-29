import { useEffect, useRef, useState } from 'react'
import '../styles.css'
import GuidePage from './components/GuidePage'
import HomePage from './components/HomePage'
import LollipopPhone from './components/LollipopPhone'
import MusicPlayer from './components/MusicPlayer'
import PhoneBook from './components/PhoneBook'
import AddonLab from './components/AddonLab'

const pages = {
  dungeons: { ko: '던전', en: 'DUNGEONS', symbol: '♢', intro: '처음 만나는 던전의 기록', copy: '길을 잃어도 괜찮습니다. 발견한 입구와 마주친 이야기를 천천히 기록해보세요.', items: ['던전의 첫인상', '보스와의 첫 만남', '함께 걷는 파티'] },
  skills: { ko: '스킬', en: 'SKILLS', symbol: '⌁', intro: '내 손으로 익히는 기술', copy: '정답보다 나에게 맞는 리듬을 찾습니다. 직접 사용하고, 실패하고, 나만의 기술로 만들어보세요.', items: ['기본 기술 익히기', '나만의 연계 찾기', '성장하며 달라지는 손맛'] },
  classes: { ko: '직업', en: 'CLASSES', symbol: '✦', intro: '나와 잘 맞는 전투 스타일 찾기', copy: '마음이 끌리는 역할과 플레이 감각을 따라가며, 오래 함께할 직업을 천천히 골라보세요.', items: ['가장 먼저 끌린 역할', '혼자와 파티에서의 느낌', '계속 해보고 싶은 직업'] },
  maps: { ko: '맵', en: 'MAPS', symbol: '⌖', intro: '발자국이 쌓이는 아제로스', copy: '아직 이름 모를 장소와 우연히 발견한 길. 나만의 속도로 세계를 넓혀가는 지도입니다.', items: ['지역별 첫 풍경', '숨겨진 길 기록하기', '나만의 탐험 지도'] },
}

const getPageFromHash = () => {
  const hash = window.location.hash.slice(1)
  return hash && (pages[hash] || hash === 'addons') ? hash : 'home'
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [page, setPage] = useState(getPageFromHash)
  const [phoneBookOpen, setPhoneBookOpen] = useState(false)
  const audioRef = useRef(null)
  const nav = [['dungeons', '던전', 'DUNGEONS'], ['skills', '스킬', 'SKILLS'], ['classes', '직업', 'CLASSES'], ['maps', '지도', 'MAPS'], ['addons', '애드온', 'ADDONS']]

  useEffect(() => {
    const onHash = () => setPage(getPageFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (hash) => { setMenuOpen(false); window.location.hash = hash }

  return <div className="page-shell" id="home" data-page={page}>
    <header className="site-header" data-section="site-header">
      <a className="brand" href="#home"><span className="brand-mark"><span /><span /></span><span className="brand-copy"><strong>WOW DIARY</strong><small>와우 다이어리 &gt;.&lt;</small></span></a>
      <nav className={`main-nav ${menuOpen ? 'open' : ''}`} data-section="main-navigation">{nav.map(([id, ko, en]) => <a className={`nav-link ${page === id ? 'active' : ''}`} href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}><span className="ko-label">{ko}</span><small>{en}</small></a>)}</nav>
      <button className="menu-toggle" type="button" aria-label="메뉴" onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
    </header>
    <div className="candy-decoration" data-section="decorations" aria-hidden="true"><div className="cotton-candy-sticker"></div><div className="cat-star-sticker"><span className="cat-ear left" /><span className="cat-ear right" /></div></div>
    <LollipopPhone onOpenPhoneBook={() => setPhoneBookOpen(true)} />
    {phoneBookOpen && <PhoneBook onClose={() => setPhoneBookOpen(false)} />}
    <MusicPlayer audioRef={audioRef} playing={playing} setPlaying={setPlaying} />
    {page === 'home' ? <HomePage /> : page === 'addons' ? <AddonLab navigate={navigate} /> : <GuidePage data={pages[page]} navigate={navigate} />}
    <span id="schedule" hidden />
    <footer className="site-footer" data-section="site-footer"><div className="footer-brand">WOW DIARY <span>© 2026</span></div><p>여긴 공략글도 드랍정보도 없지만 낭만이 있지.낭만 와공쥬가 되어보자.</p><div className="footer-links"><a href="#home">HOME</a><a href="#schedule">ROADMAP</a><a href="#home">↑ TOP</a></div></footer>
  </div>
}

export default App
