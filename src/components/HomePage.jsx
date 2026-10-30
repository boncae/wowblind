import { useEffect, useState } from 'react'
import catGif from '../assets/gif/reshirii.gif'
import sparkleGif from '../assets/gif/licky cat!!.gif'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const RELEASE_TIME = new Date('2026-11-05T08:00:00+09:00').getTime()

const ROADMAP_STOPS = [
    { date: '09.17', title: '블리즈컨', copy: '레쟌도', past: true },
  { date: '09.17', title: '베타 시작!', copy: '레쟌도', past: true },
  { date: '10.22', title: '베타 끝!' },
  { date: '10.27', title: '사전 준비', copy: '모험을 위한 체크' },
  { date: '11.05', title: '포에버 정식 출시', copy: '이야기가 시작됩니다' },
  { date: '12.07', title: '첫 레이드 오픈', copy: '이야기가 시작됩니다' },
  { date: '내년 봄', title: '대규모 업데이트', copy: '이야기가 시작됩니다' },
]

const RECENT_LOGS = [
  { href: '#addons', label: '✿ 전사 버프됐대 오슈이야 ~' },
  { href: '#home', label: '✿ 사전준비때 캐릭생성 잊지말기 ' },
  { href: '#home', label: '✿ 나에게 맞는 직업 찾기' },
  { href: '#home', label: '✿ 우연히 발견한 작은 마을' },
]

const SCHEDULE_EVENTS = [
  { icon: '✦', title: '뉴비 소소팁을 적어봤어', text: '취향에 맞는 직업을 골라보세요' },
  { icon: '◈', title: '', text: '먼저 발을 내딛는 모험가들.' },
  { icon: '✧', title: '정식 출시', text: '당신의 이야기가 시작됩니다.' },
]

const CLASS_STREAMERS = [
  { job: '사냥꾼', role: 'dps', streamers: [] },
  { job: '사제', role: 'healer', streamers: [] },
  { job: '전사', role: 'tank', streamers: ['여올', '흠냥', '오늘님'] },
  { job: '법사', role: 'dps', streamers: ['단즈', '최또'] },
  { job: '드루이드', role: 'healer', streamers: ['애사비'] },
  { job: '성기사', role: 'tank', streamers: ['햇비', '묭씨'] },
  { job: '도적', role: 'dps', streamers: ['소피아', '우왁굳'] },
  { job: '주술사', role: 'healer', streamers: ['매그피이'] },
  { job: '흑마법사', role: 'dps', streamers: [] },
]

const CLASS_POPULARITY = CLASS_STREAMERS.map((c) => ({ ...c, count: c.streamers.length }))

const ROLE_META = {
  tank: { label: '탱커', color: '#7ed9f5' },
  healer: { label: '힐러', color: '#b8e986' },
  dps: { label: '딜러', color: '#ff9dcc' },
}

const RAID_ROLE_RATIOS = [
  { size: '10인 레이드', tank: 20, healer: 30, dps: 50 },
  { size: '20인 레이드', tank: 15, healer: 25, dps: 60 },
]

const RAID_ROLE_RANGE = ['tank', 'healer', 'dps'].reduce((acc, role) => {
  const values = RAID_ROLE_RATIOS.map((r) => r[role])
  acc[role] = { min: Math.min(...values), max: Math.max(...values) }
  return acc
}, {})

const CLASS_CUTOFF_RANGE = { min: 6, max: 12 }

const JOB_TEST_URL = 'https://yangjirap-wow-job-test.ridgetrading-7412.chatgpt.site'

const PREP_CHECKLIST = [
  '캐릭터 생성 미리 해두기 (닉네임 선점!)',
  '종족별 외형 커스터마이징 둘러보기',
  '직업 선택 전에 역할(탱/힐/딜) 정해두기',
  '길드 or 함께할 친구들과 시간 맞추기',
  '애드온/UI 미리 세팅해두기',
  '서버 접속 혼잡 대비해서 여유있게 로그인',
]

const NICKNAME_IDEAS = [
  '햇비브라늄', '테헹글곰이', '거몽', '패별연',
  '대재혁 4/0/4', '주수리르', '대냐쵸', '료히키텐카이', '묭쉘통통', '쪼물단즈', '인루앙까라메시',
  '최크메이또', '손흠냥', '라리양꾼', '달타포스', '셧더파깡',
  '노인공격쵸로키', '어우연',
]

const pad = (value) => String(value).padStart(2, '0')

const getRemaining = (targetTime) => Math.max(0, targetTime - Date.now())

const splitDuration = (ms) => ({
  days: Math.floor(ms / DAY),
  hours: Math.floor((ms % DAY) / HOUR),
  minutes: Math.floor((ms % HOUR) / MINUTE),
  seconds: Math.floor((ms % MINUTE) / SECOND),
})

function useCountdown(targetTime) {
  const [remaining, setRemaining] = useState(() => getRemaining(targetTime))

  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = getRemaining(targetTime)
      setRemaining(next)
      if (next === 0) window.clearInterval(timer)
    }, SECOND)

    return () => window.clearInterval(timer)
  }, [targetTime])

  return remaining
}

function ReleaseCountdown({ targetTime }) {
  const remaining = useCountdown(targetTime)
  const launched = remaining === 0
  const { days, hours, minutes, seconds } = splitDuration(remaining)

  return <div className="release-countdown">
    <span>{launched ? 'LAUNCHED' : 'D-DAY'}</span>
    {launched ? <b>OPEN!</b> : <b>{days}일</b>}
    {!launched && <small>{pad(hours)} : {pad(minutes)} : {pad(seconds)}</small>}
  </div>
}

function ReleaseRoadmapSection() {
  return <section
    className="window release-window"
    data-section="release-roadmap"
    data-title="포에버 로드맵.exe"
  >
    <div className="release-heading">
      <span className="status-heart">♥ ♥ ♥ </span>
      <ReleaseCountdown targetTime={RELEASE_TIME} />
    </div>

    <div className="roadmap-line">
      {ROADMAP_STOPS.map(({ date, title, copy, past }) => <div
        className={`roadmap-stop ${past ? 'is-past' : ''}`}
        key={title}
      >
        <span className="roadmap-dot" />
        <strong>{date}</strong>
        <h3>{title}</h3>
        <small>{copy}</small>
      </div>)}
    </div>
  </section>
}

function useEscapeKey(onClose) {
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])
}

function ClassStatsModal({ onClose }) {
  useEscapeKey(onClose)
  const maxCount = Math.max(...CLASS_POPULARITY.map((c) => c.count))

  return <div className="home-modal-backdrop" data-section="class-stats-modal" onClick={onClose}>
    <div className="home-modal home-modal-large window" data-title="직업분포.exe" role="dialog" aria-modal="true" aria-label="버튜버 와우 포에버 얼라이언스 직업 통계" onClick={(event) => event.stopPropagation()}>
      <button className="home-modal-close" type="button" onClick={onClose} aria-label="닫기">×</button>
      <div className="home-modal-body">
        <p className="home-modal-lead">버튜버 100명이 고른 와우 포에버 얼라이언스 직업, 다들 뭐 하나 몰려있을까? <b>(가상 통계)</b></p>
        <p className="class-chart-hint">빨간선은 적정 인원 커트라인 (6~12명) ✦ 파란 글씨는 그 직업 고른 숲 스트리머</p>

        <a className="button job-test-button" href={JOB_TEST_URL} target="_blank" rel="noopener noreferrer">
          나에게 맞는 직업테스트 받기 <b>↗</b>
        </a>

        <div className="class-chart">
          {CLASS_POPULARITY.map(({ job, role, count, streamers }) => {
            const barPct = Math.min((count / maxCount) * 100, 100)
            const cutoffMinPct = Math.min((CLASS_CUTOFF_RANGE.min / maxCount) * 100, 100)
            const cutoffMaxPct = Math.min((CLASS_CUTOFF_RANGE.max / maxCount) * 100, 100)
            return <div className="class-chart-row" key={job}>
              <span className="class-chart-label">{job}</span>
              <div className="class-chart-track">
                <div
                  className="class-chart-bar"
                  style={{ width: `${barPct}%`, background: ROLE_META[role].color }}
                />
                <span className="class-chart-cutoff" style={{ left: `${cutoffMinPct}%` }} />
                <span className="class-chart-cutoff" style={{ left: `${cutoffMaxPct}%` }} />
              </div>
              <span />
              <span className="class-chart-count-row">
                <span className="class-chart-count">{count}명</span>
                {streamers.length > 0 && <span className="class-chart-streamers">
                  {streamers.join(' · ')}
                </span>}
              </span>
            </div>
          })}
        </div>

        <div className="class-chart-legend">
          {Object.entries(ROLE_META).map(([key, { label, color }]) => <span key={key}><i style={{ background: color }} />{label}</span>)}
          <span className="class-chart-cutoff-legend"><i />적정 인원 커트라인(6~12명)</span>
        </div>

        <p className="home-modal-lead">레이드에서 통계적으로 필요한 탱/힐/딜 비율 범위예요</p>
        <div className="raid-ratio-card">
          <div
            className="raid-ratio-bar"
            style={{ background: `linear-gradient(90deg, ${ROLE_META.tank.color} 0%, ${ROLE_META.tank.color} ${RAID_ROLE_RANGE.tank.min}%, ${ROLE_META.healer.color} ${RAID_ROLE_RANGE.tank.max}%, ${ROLE_META.healer.color} ${RAID_ROLE_RANGE.tank.max + RAID_ROLE_RANGE.healer.min}%, ${ROLE_META.dps.color} ${RAID_ROLE_RANGE.tank.max + RAID_ROLE_RANGE.healer.max}%, ${ROLE_META.dps.color} 100%)` }}
          >
            <span>탱 {RAID_ROLE_RANGE.tank.min}~{RAID_ROLE_RANGE.tank.max}%</span>
            <span>힐 {RAID_ROLE_RANGE.healer.min}~{RAID_ROLE_RANGE.healer.max}%</span>
            <span>딜 {RAID_ROLE_RANGE.dps.min}~{RAID_ROLE_RANGE.dps.max}%</span>
          </div>
          <small className="raid-ratio-note">10인 ~ 20인 레이드 기준 (각 역할 비율의 최소~최대 범위, 경계는 흐릿하게 겹쳐서 표현)</small>
        </div>
      </div>
    </div>
  </div>
}

function PrepChecklistModal({ onClose }) {
  useEscapeKey(onClose)
  return <div className="home-modal-backdrop" data-section="prep-checklist-modal" onClick={onClose}>
    <div className="home-modal window" data-title="사전준비.exe" role="dialog" aria-modal="true" aria-label="사전 준비 체크리스트" onClick={(event) => event.stopPropagation()}>
      <button className="home-modal-close" type="button" onClick={onClose} aria-label="닫기">×</button>
      <div className="home-modal-body">
        <p className="home-modal-lead">사전 준비 기간에 미리 해두면 좋은 것들!</p>
        <ul className="prep-checklist">
          {PREP_CHECKLIST.map((item) => <li key={item}><span className="prep-check-icon">✓</span>{item}</li>)}
        </ul>
      </div>
    </div>
  </div>
}

function NicknameModal({ onClose }) {
  useEscapeKey(onClose)
  const count = NICKNAME_IDEAS.length

  return <div className="home-modal-backdrop" data-section="nickname-modal" onClick={onClose}>
    <div className="home-modal home-modal-large window" data-title="닉네임고민.exe" role="dialog" aria-modal="true" aria-label="닉네임 아이디어" onClick={(event) => event.stopPropagation()}>
      <button className="home-modal-close" type="button" onClick={onClose} aria-label="닫기">×</button>
      <div className="home-modal-body">
        <div className="nickname-float-field">
          <p className="nickname-float-lead">닉네임 고민될 때<br />둥둥 떠다니는<br />아이디어들 ~</p>
          {NICKNAME_IDEAS.map((name, i) => {
            const angle = ((360 / count) * i * Math.PI) / 180
            const radiusX = 40 + (i % 3) * 6
            const radiusY = 40 + (i % 3) * 6
            const left = Math.min(Math.max(50 + Math.cos(angle) * radiusX, 8), 92)
            const top = Math.min(Math.max(50 + Math.sin(angle) * radiusY, 10), 90)
            return <span
              className="nickname-float-chip"
              key={name}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                '--dur': `${7 + (i % 5)}s`,
                '--delay': `${(i % 7) * -0.9}s`,
              }}
            >{name}</span>
          })}
        </div>
      </div>
    </div>
  </div>
}

function HeroSection() {
  const [openModal, setOpenModal] = useState(null)

  return <section className="window hero-window" data-section="hero-introduction" data-title="시작하기.exe">
    <div>
      <p className="eyebrow">✿ 처음이라서 더 아름다운 모험</p>
      <h1>미지의 세계로<em>첫 발을 내딛다</em></h1>

      <p>
        누구의 공략도, 정답도 없는 아제로스.<br />
        당신의 첫 발자국으로 이야기를 시작하세요.
        <small>NO GUIDES · JUST YOUR STORY</small>
      </p>
      <div className="hero-buttons">
        <a className="button" href="#about" onClick={(event) => { event.preventDefault(); setOpenModal('class') }}>다들 어떤 직업고르지? <b>↗</b></a>
        <a className="button" href="#about" onClick={(event) => { event.preventDefault(); setOpenModal('prep') }}>사전 준비땐 머해야대? <b>↗</b></a>
        <a className="button" href="#about" onClick={(event) => { event.preventDefault(); setOpenModal('nickname') }}>닉네임은 뭘로할까?ㅠ <b>↗</b></a>
        <img className="home-sparkle-gif" src={sparkleGif} alt="" />
      </div>
    </div>
    {/*<div className="pixel-orb" />*/}

    {openModal === 'class' && <ClassStatsModal onClose={() => setOpenModal(null)} />}
    {openModal === 'prep' && <PrepChecklistModal onClose={() => setOpenModal(null)} />}
    {openModal === 'nickname' && <NicknameModal onClose={() => setOpenModal(null)} />}
  </section>
}

function RecentLogsSection() {
  return <section className="window log-window" data-section="recent-logs" data-title="업데이트.exe">
    <img className="home-cat-gif" src={catGif} alt="춤추는 고양이 장식" />
    {/*<img className="home-sparkle-gif" src={sparkleGif} alt="" />*/}
    <div className="log-list">
      {RECENT_LOGS.map(({ href, label }) => <a href={href} key={label}>{label}</a>)}
    </div>
    <p className="window-note">리쟈드짱의 업데이트 계속 기록해나갈게 ♡</p>
  </section>
}

function StatusSection() {
}

function ScheduleGrid() {
  return <div className="schedule-grid" id="schedule" data-section="release-events">
    {SCHEDULE_EVENTS.map(({ icon, title, text }) => <article
      className="window event-window"
      key={title}
      data-title="event.exe"
    >
      <div className="event-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>)}
  </div>
}

export default function HomePage() {
  return <main id="home" data-section="home-page" className="home-grid">
    <ReleaseRoadmapSection />
    <HeroSection />
    <RecentLogsSection />
    <StatusSection />
    <ScheduleGrid />
  </main>
}
