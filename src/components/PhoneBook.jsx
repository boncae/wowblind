import { useEffect, useState } from 'react'

const friends = [
  { id: 'wakgood', name: '왁굳이', emoji: '♧', jobs: ['도적', '드루이드'], message: '나랑 이따 인던갈래? 나는 인간 도적 플레이중 아 엘윈 숲 향기 너무 좋다 기모찌~' },
  { id: 'bugattang', name: '부가땅', emoji: '✧', jobs: ['법사', '주술사'], message: '음 스카이본 법사 재밌당~ 같이 사냥다닐 탱빵이 있어?' },
  { id: 'dongtan', name: '동탄단즈', emoji: '♡', jobs: ['전사', '성기사'], message: '탱 구한다고? 나 불러 나 불러! 방패 들고 바로 달려갈게 ㅎㅎ' },
  { id: 'haetbbi', name: '햇삐', emoji: '☀', jobs: ['사제', '드루이드'], message: '힐은 내가 볼게~ 다들 체력만 잘 보고 따라와요 오늘도 햇삐하게!' },
  { id: 'kirakira', name: '키라키라', emoji: '✦', jobs: ['사냥꾼', '악마사냥꾼'], message: '펫이랑 둘이 돌아다니는 중이야 반짝반짝 야수 사냥 같이 갈래?' },
]

export default function PhoneBook({ onClose }) {
  const [selectedId, setSelectedId] = useState(friends[0].id)
  const selected = friends.find((friend) => friend.id === selectedId)

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return <div className="phonebook-backdrop" data-section="phonebook" onClick={onClose}>
    <div className="phonebook window" data-title="friends.txt" role="dialog" aria-modal="true" aria-label="친구 목록" onClick={(event) => event.stopPropagation()}>
      <button className="phonebook-close" type="button" onClick={onClose} aria-label="닫기">×</button>
      <div className="phonebook-body">
        <ul className="friend-list">
          {friends.map((friend) => <li key={friend.id}>
            <button className={`friend-item ${friend.id === selectedId ? 'active' : ''}`} type="button" onClick={() => setSelectedId(friend.id)}>
              <span className="friend-emoji" aria-hidden="true">{friend.emoji}</span>
              <span className="friend-name">{friend.name}</span>
            </button>
          </li>)}
        </ul>
        <div className="friend-detail">
          <div className="friend-detail-head">
            <strong>{selected.name}</strong>
            <small>FRIEND INFO</small>
          </div>
          <div className="friend-jobs">
            <span className="friend-jobs-label">선호 직업</span>
            {selected.jobs.map((job) => <b className="friend-job" key={job}>{job}</b>)}
          </div>
          <p className="friend-message">{selected.message}</p>
        </div>
      </div>
    </div>
  </div>
}
