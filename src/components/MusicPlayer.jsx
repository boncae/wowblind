import {useState} from 'react'
import useDraggable from '../hooks/useDraggable'

export default function MusicPlayer({audioRef, playing, setPlaying}) {
    const {ref, isDragging, dragProps} = useDraggable()
    const tracks = [
        {id: 'zGOzGcEbd-s', label: '고양이가 세상을 구한다!'},
        {id: '7INnT75lzcs', label: 'your turn'},
        {id: 'kaLuwOYWA4c', label: 'pump jump pump'},
    ]
    const [trackIndex, setTrackIndex] = useState(0)
    const track = tracks[trackIndex]
    const command = (func) => audioRef.current?.contentWindow?.postMessage(JSON.stringify({
        event: 'command',
        func,
        args: []
    }), '*')
    const toggleMusic = () => {
        command(playing ? 'pauseVideo' : 'playVideo');
        setPlaying(!playing)
    }
    const changeTrack = (direction) => {
        setTrackIndex((current) => (current + direction + tracks.length) % tracks.length);
        setPlaying(false)
    }

    return <aside
        className={`cd-player window draggable ${playing ? 'is-playing' : ''} ${isDragging ? 'is-dragging' : ''}`}
        data-section="music-player" data-title="CD플레이어.exe"
        ref={ref} {...dragProps}>
        <iframe ref={audioRef} key={track.id} className="youtube-audio"
                title="WoW Diary background music"
                src={`https://www.youtube.com/embed/${track.id}?enablejsapi=1&autoplay=0&controls=0&playsinline=1&rel=0`}
                allow="autoplay"/>
        <div className="cd-disc" aria-hidden="true"><span>WOW<br/>MIX</span>
        </div>
        <div className="cd-info"><strong>나의 아제로스 BGM</strong>{playing ?
            <div className="cd-track marquee" aria-label={track.label}>
                <span>{track.label}</span><span
                aria-hidden="true">{track.label}</span></div> :
            <small>{track.label}</small>}<em>{playing ? 'NOW PLAYING ♫' : 'PRESS PLAY TO START'}</em>
        </div>
        <div className="cd-controls">
            <button className="cd-skip" type="button"
                    onClick={() => changeTrack(-1)}>⏪︎
            </button>
            <button className="cd-button" type="button"
                    onClick={toggleMusic}>{playing ? 'Ⅱ' : '▶'}</button>
            <button className="cd-skip" type="button"
                    onClick={() => changeTrack(1)}>⏩︎
            </button>
        </div>
    </aside>
}
