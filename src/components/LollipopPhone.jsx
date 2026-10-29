import useDraggable from '../hooks/useDraggable'

export default function LollipopPhone({onOpenPhoneBook}) {
    const {ref, isDragging, dragProps} = useDraggable()

    return <div
        className={`lollipop-phone draggable ${isDragging ? 'is-dragging' : ''}`}
        data-section="lollipop-phone" ref={ref} {...dragProps}>
        <span className="phone-speaker" aria-hidden="true"/>
        <div className="phone-screen">
            <div className="sms-top"><b>09:17</b></div>
            <div className="sms-sender"><small>새 문자 1건</small></div>


            <p> <div className="sms-top"><b>우왁굳</b></div>
                나랑,, 인던갈래..?</p>
            <button className="sms-reply" type="button"
                    onClick={onOpenPhoneBook}>답장하기
            </button>
        </div>
        <a className="phone-home" href="#home" aria-label="홈으로 이동">✦</a>
        <span className="phone-antenna" aria-hidden="true"/>
    </div>
}
