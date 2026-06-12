/* ─────────────────────────────────────────────────────────────
   고치다 — Tab screens (Requests · Chats · Profile) + detail mocks
   ───────────────────────────────────────────────────────────── */
const { useState: useStateT, useEffect: useEffT, useRef: useRefT } = React;

/* Tab top header (large title, no back) */
function TabHeader({ title, subtitle }) {
  return (
    <div style={{ paddingTop: 60, paddingBottom: 8, paddingLeft: 24, paddingRight: 24, background: 'var(--background)' }}>
      <div className="t-display text-primary" style={{ fontSize: 28 }}>{title}</div>
      {subtitle && <div className="t-caption text-secondary" style={{ marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

const STATUS_VARIANT = {
  draft: 'neutral', ai_done: 'primary', waiting: 'warning',
  responded: 'primary', chatting: 'warning', completed: 'success',
};

function RequestCard({ req, onPress, onCompare }) {
  const done = req.status === 'completed';
  return (
    <Card radius="var(--r-xxl)" pad="18px" onPress={onPress} style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: done ? 'var(--success-light)' : 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={done ? 'checkCircle' : 'image'} size={23} color={done ? 'var(--success)' : 'var(--primary)'} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="t-body-strong text-primary" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{req.title}</div>
          <div className="t-caption text-secondary" style={{ marginTop: 3 }}>{req.location} · {req.symptom} · {req.dateText}</div>
        </div>
        <Icon name="chevronR" size={18} color="var(--text-tertiary)" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 14 }}>
        <Badge label={STATUS_LABEL[req.status]} variant={STATUS_VARIANT[req.status]} dot />
        <Badge label={req.tradeCategory} variant="neutral" />
      </div>
      {!done && (
        <button className="pressable" onClick={(e) => { e.stopPropagation(); onCompare(); }}
          style={{ marginTop: 14, width: '100%', height: 46, borderRadius: 'var(--r-pill)', border: 'none', background: 'var(--black)', color: '#fff', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}>
          전문가 응답 비교하기<Icon name="chevronR" size={15} color="#fff" strokeWidth={2.4} />
        </button>
      )}
    </Card>
  );
}

/* ── REQUESTS TAB ── */
function RequestsScreen({ onOpenRequest, onCompare }) {
  const active = MOCK_REQUESTS.filter((r) => r.status !== 'completed');
  const done = MOCK_REQUESTS.filter((r) => r.status === 'completed');
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      <TabHeader title="요청" subtitle="내가 만든 요청서와 진행 상태를 확인하세요" />
      <div className="screen-scroll" style={{ flex: 1, padding: '14px 24px 110px' }}>
        <div className="stagger">
          <div className="t-caption text-tertiary" style={{ fontWeight: 700, marginBottom: 12, marginLeft: 2 }}>진행 중 {active.length}</div>
          {active.map((r) => <RequestCard key={r.id} req={r} onPress={() => onOpenRequest(r.id)} onCompare={onCompare} />)}
          <div className="t-caption text-tertiary" style={{ fontWeight: 700, margin: '18px 0 12px', marginLeft: 2 }}>완료 {done.length}</div>
          {done.map((r) => <RequestCard key={r.id} req={r} onPress={() => onOpenRequest(r.id)} onCompare={onCompare} />)}
        </div>
      </div>
    </div>
  );
}

/* ── CHATS TAB ── */
function ChatsScreen({ onOpenChat }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      <TabHeader title="채팅" subtitle="전문가와 나눈 상담 내역" />
      <div className="screen-scroll" style={{ flex: 1, padding: '14px 16px 110px' }}>
        <div className="stagger">
          {MOCK_CHATS.map((c) => (
            <div key={c.id} className="pressable" onClick={() => onOpenChat(c.id)}
              style={{ display: 'flex', gap: 13, padding: '14px 10px', borderRadius: 'var(--r-l)', cursor: 'pointer' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                <Icon name="user" size={26} color="var(--primary)" />
                {c.unread > 0 && <span style={{ position: 'absolute', top: 0, right: 0, width: 13, height: 13, borderRadius: '50%', background: 'var(--danger)', border: '2px solid var(--background)' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0, borderBottom: '1px solid var(--divider)', paddingBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span className="t-body-strong text-primary" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.expertName}</span>
                  <span className="t-small text-tertiary" style={{ flexShrink: 0, fontWeight: 500 }}>{c.timeText}</span>
                </div>
                <div className="t-caption text-tertiary" style={{ marginTop: 2 }}>{c.requestTitle}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 6 }}>
                  <span className={c.unread > 0 ? 't-caption text-primary' : 't-caption text-secondary'} style={{ fontWeight: c.unread > 0 ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lastMessage}</span>
                  <span style={{ flexShrink: 0 }}><Badge label={c.warrantyType} variant={c.warrantyType === '안심 보증서' ? 'success' : 'neutral'} /></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── PROFILE TAB ── */
function ProfileScreen({ onGoTab }) {
  const menu = [
    ['고치다 사용법', 'sparkle', '사진 한 장으로 요청서를 만드는 방법을 안내해요.'],
    ['작업 확인서 · 보증서 안내', 'shield', '작업 확인서와 안심 보증서가 무엇을 보장하는지 설명해요.'],
    ['안전 유의사항', 'warning', '직접 시도하면 위험한 작업과 주의사항을 알려드려요.'],
    ['자주 묻는 질문', 'info', '비용, 응답 시간, 사후관리에 대한 답변을 모았어요.'],
    ['앱 정보', 'receipt', '버전 1.0.0 · 고치다 MVP 데모'],
    ['데모 버전 안내', 'bell', '이 앱은 데모입니다. 실제 결제·로그인은 제공되지 않아요.'],
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      <TabHeader title="내 정보" />
      <div className="screen-scroll" style={{ flex: 1, padding: '8px 24px 110px' }}>
        <div className="stagger">
          {/* user card */}
          <Card radius="var(--r-xxl)" pad="20px" style={{ marginBottom: 22, display: 'flex', alignItems: 'center', gap: 15 }}>
            <div style={{ width: 58, height: 58, borderRadius: '50%', background: 'linear-gradient(145deg, #6E7BFF, var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="person" size={30} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="t-h3 text-primary">데모 사용자</div>
              <div className="t-caption text-secondary" style={{ marginTop: 3 }}>고치다 체험 계정</div>
            </div>
            <Badge label="DEMO" variant="primary" />
          </Card>

          <Card radius="var(--r-xxl)" pad="6px 8px">
            {menu.map(([label, icon, msg], i) => (
              <button key={label} className="pressable" onClick={() => alert(`${label}\n\n${msg}`)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '15px 14px', background: 'transparent', border: 'none', borderBottom: i < menu.length - 1 ? '1px solid var(--divider)' : 'none', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={icon} size={19} color="var(--text-secondary)" />
                </div>
                <span className="t-body text-primary" style={{ flex: 1, fontWeight: 500 }}>{label}</span>
                <Icon name="chevronR" size={17} color="var(--text-tertiary)" />
              </button>
            ))}
          </Card>

          <div className="t-small text-tertiary" style={{ textAlign: 'center', marginTop: 22, lineHeight: '18px', fontWeight: 500 }}>
            고치다 v1.0.0 · 데모 버전<br />최종 작업 범위와 비용은 전문가 상담 후 결정됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── REQUEST DETAIL (stack) ── */
function RequestDetailScreen({ requestId, onBack, onCompare }) {
  const req = MOCK_REQUESTS.find((r) => r.id === requestId) || MOCK_REQUESTS[0];
  const done = req.status === 'completed';
  const rows = [['위치', req.location], ['증상', req.symptom], ['공종 후보', req.tradeCategory], ['요청 작업', req.requestedWork]];
  return (
    <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <AppHeader title="요청 상세" onBack={onBack} />
      <div className="screen-scroll" style={{ flex: 1, padding: '0 24px', paddingBottom: done ? 40 : 150 }}>
        <div className="stagger">
          <div className="t-h1 text-primary">{req.title}</div>
          <div style={{ display: 'flex', gap: 7, marginTop: 14 }}>
            <Badge label={STATUS_LABEL[req.status]} variant={STATUS_VARIANT[req.status]} dot />
            <Badge label={req.tradeCategory} variant="neutral" />
          </div>

          <div className="t-h3 text-primary" style={{ marginTop: 26, marginBottom: 12 }}>요청서 요약</div>
          <Card radius="var(--r-xxl)" pad="6px 22px">
            {rows.map(([k, v], i) => (
              <div key={k} style={{ display: 'flex', gap: 16, padding: '15px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                <span className="t-caption text-tertiary" style={{ width: 70, flexShrink: 0, paddingTop: 1 }}>{k}</span>
                <span className="t-body-strong text-primary" style={{ flex: 1 }}>{v}</span>
              </div>
            ))}
          </Card>

          <div className="t-h3 text-primary" style={{ marginTop: 26, marginBottom: 12 }}>전문가 응답</div>
          <Card radius="var(--r-xxl)" pad="20px" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="chat" size={22} color="var(--primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="t-body-strong text-primary">{done ? '작업 확인서 발급 가능' : `${req.responses}건 도착`}</div>
              <div className="t-caption text-secondary" style={{ marginTop: 2 }}>{done ? '완료된 요청이에요' : '작업 방식과 보증 조건을 비교해 보세요'}</div>
            </div>
          </Card>
        </div>
      </div>
      {!done && (
        <FloatingFooter>
          <Button title="전문가 응답 비교하기" onPress={onCompare} rightIcon={<Icon name="arrowR" size={19} color="#fff" strokeWidth={2.2} />} />
        </FloatingFooter>
      )}
    </div>
  );
}

/* ── CHAT DETAIL (stack) ── */
function ChatDetailScreen({ chatId, onBack }) {
  const chat = MOCK_CHATS.find((c) => c.id === chatId) || MOCK_CHATS[0];
  const scrollRef = useRefT(null);
  useEffT(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, []);
  const blockSend = () => alert('데모 버전에서는 채팅 전송 기능은 제공되지 않습니다.');

  return (
    <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      <AppHeader title={chat.expertName} onBack={onBack}
        right={<Badge label={chat.warrantyType} variant={chat.warrantyType === '안심 보증서' ? 'success' : 'neutral'} />} />
      <div style={{ padding: '0 24px 10px' }}>
        <div className="t-caption text-secondary" style={{ textAlign: 'center', background: 'var(--surface-soft)', borderRadius: 'var(--r-pill)', padding: '7px 14px', display: 'inline-block', width: '100%' }}>{chat.requestTitle}</div>
      </div>

      <div ref={scrollRef} className="screen-scroll" style={{ flex: 1, padding: '8px 20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MOCK_CHAT_THREAD.map((m, i) => {
          const me = m.from === 'me';
          return (
            <div key={i} style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '74%', padding: '11px 15px', borderRadius: 18,
                borderBottomRightRadius: me ? 5 : 18, borderBottomLeftRadius: me ? 18 : 5,
                background: me ? 'var(--primary)' : 'var(--surface)', color: me ? '#fff' : 'var(--text-primary)',
                boxShadow: me ? 'var(--shadow-primary)' : 'var(--shadow-soft)', fontSize: 14.5, lineHeight: '21px', fontWeight: 400 }}>
                {m.text}
              </div>
            </div>
          );
        })}
        <div className="t-small text-tertiary" style={{ textAlign: 'center', marginTop: 6, fontWeight: 500 }}>데모 대화 예시입니다</div>
      </div>

      {/* input mock */}
      <div style={{ padding: '10px 16px 28px', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="pressable" onClick={blockSend} style={{ flex: 1, height: 44, borderRadius: 'var(--r-pill)', background: 'var(--surface-soft)', display: 'flex', alignItems: 'center', padding: '0 18px', cursor: 'text' }}>
          <span className="t-body text-tertiary">메시지 입력</span>
        </div>
        <button className="pressable" onClick={blockSend} aria-label="전송" style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
          <Icon name="arrowR" size={20} color="#fff" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { RequestsScreen, ChatsScreen, ProfileScreen, RequestDetailScreen, ChatDetailScreen });
