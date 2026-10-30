import { useEffect, useRef, useState } from 'react'
import '../styles.css'
import HomePage from './components/HomePage'
import LollipopPhone from './components/LollipopPhone'
import MusicPlayer from './components/MusicPlayer'
import PhoneBook from './components/PhoneBook'
import AddonLab from './components/AddonLab'


const getPageFromHash = () => {
  const hash = window.location.hash.slice(1)
  return hash === 'addons' ? 'addons' : 'home'
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [page, setPage] = useState(getPageFromHash)
  const [phoneBookOpen, setPhoneBookOpen] = useState(false)
  const audioRef = useRef(null)
  const nav = [['addons', '애드온', 'ADDONS']]

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
    {page === 'addons' ? <AddonLab navigate={navigate} /> : <HomePage />}
    <span id="schedule" hidden />
    <footer className="site-footer" data-section="site-footer"><div className="footer-brand">WOW DIARY <span>© 2026</span></div><p>여긴 공략글도 드랍정보도 없지만 낭만이 있지.낭만 와공쥬가 되어보자.</p><div className="footer-links"><a href="#home">HOME</a><a href="#schedule">ROADMAP</a><a href="#home">↑ TOP</a></div></footer>
  </div>
}

export default App
