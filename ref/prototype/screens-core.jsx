/* ─────────────────────────────────────────────────────────────
   고치다 — Home (3 variants w/ hero icon) + Upload
   ───────────────────────────────────────────────────────────── */
const { useEffect: useEffectC, useRef: useRefC, useState: useStateC } = React;

const HERO = 'images/hero.png';

/* ── HOME DASHBOARD ── */
function HomeScreen({ onStart, onOpenRequest, onGoTab, onPreviewExperts }) {
  return (
    <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      {/* sticky brand header */}
      <div style={{ paddingTop: 58, paddingBottom: 12, paddingLeft: 24, paddingRight: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--background)', position: 'relative', zIndex: 5 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <img src={HERO} alt="" style={{ width: 26, height: 26 }} />
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.6, color: 'var(--text-primary)' }}>고치다</span>
          </div>
          <div className="t-caption text-secondary" style={{ marginTop: 3 }}>사진으로 시작하는 생활시공 요청</div>
        </div>
        <button className="pressable" onClick={() => onGoTab('profile')} aria-label="알림"
          style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', background: 'var(--surface)', boxShadow: 'var(--shadow-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="bell" size={21} color="var(--text-primary)" />
        </button>
      </div>

      <div className="screen-scroll" style={{ flex: 1, padding: '6px 24px 110px' }}>
        <div className="stagger">
          <HeroCTA onStart={onStart} />
          <RecentRequestCard request={MOCK_REQUESTS[0]} onPress={() => onOpenRequest(MOCK_REQUESTS[0].id)} />
          <AiPreviewCard />
          <PriceGuidePreview />
          <ExpertPreviewCard onPress={onPreviewExperts} />
          <TrustGuideCard onPress={() => onGoTab('profile')} />
          <div className="t-small text-tertiary" style={{ textAlign: 'center', marginTop: 20, fontWeight: 500 }}>고치다 데모 버전 · 실제 시공 계약은 전문가와 직접 진행됩니다</div>
        </div>
      </div>
    </div>
  );
}

/* Hero CTA — strong primary gradient card */
function HeroCTA({ onStart }) {
  return (
    <div style={{ position: 'relative', borderRadius: 'var(--r-3xl)', overflow: 'hidden',
      background: 'linear-gradient(145deg, #6E7BFF 0%, var(--primary) 52%, #4654D9 100%)',
      boxShadow: 'var(--shadow-primary)', padding: '24px 24px 22px', marginBottom: 16 }}>
      <div style={{ position: 'absolute', top: -46, right: -36, width: 168, height: 168, borderRadius: '50%', background: 'rgba(255,255,255,0.14)' }} />
      <div style={{ position: 'absolute', bottom: -54, right: 38, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }} />
      <img src={ASSET.heroFlow} alt="" style={{ position: 'absolute', top: 14, right: -8, width: 124, height: 124, objectFit: 'contain', zIndex: 0, filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.22))' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.18)', borderRadius: 'var(--r-pill)', padding: '5px 11px' }}>
          <Icon name="sparkle" size={13} color="#fff" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>AI 요청서 정리</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.6, color: '#fff', marginTop: 14, lineHeight: '31px' }}>사진 한 장이면<br />충분해요</div>
        <div style={{ fontSize: 13.5, lineHeight: '20px', color: 'rgba(255,255,255,0.82)', marginTop: 8, maxWidth: 200 }}>문제 부위를 올리면 AI가 전문가에게 전달할 요청서 초안을 정리해드려요.</div>
        <button className="pressable" onClick={onStart}
          style={{ marginTop: 18, height: 50, width: '100%', borderRadius: 'var(--r-pill)', border: 'none',
            background: '#fff', color: 'var(--primary)', fontFamily: 'inherit', fontSize: 15.5, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
          <Icon name="camera" size={19} color="var(--primary)" />사진으로 시작하기
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ title, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 4 }}>
      <span className="t-h3 text-primary">{title}</span>
      {action && (
        <button className="pressable" onClick={onAction} style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
          <span className="t-caption" style={{ color: 'var(--primary)', fontWeight: 600 }}>{action}</span>
          <Icon name="chevronR" size={14} color="var(--primary)" strokeWidth={2.2} />
        </button>
      )}
    </div>
  );
}

/* Recent request */
function RecentRequestCard({ request, onPress }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SectionTitle title="최근 요청" />
      <Card radius="var(--r-xxl)" pad="18px" onPress={onPress}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="image" size={23} color="var(--primary)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="t-body-strong text-primary" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{request.title}</div>
            <div className="t-caption text-secondary" style={{ marginTop: 3 }}>AI 요청서 정리 완료 · 전문가 응답 {request.responses}건</div>
          </div>
          <Icon name="chevronR" size={18} color="var(--text-tertiary)" />
        </div>
        <div style={{ display: 'flex', gap: 7, marginTop: 14 }}>
          <Badge label="응답 도착" variant="primary" dot />
          <Badge label={request.tradeCategory} variant="neutral" />
        </div>
      </Card>
    </div>
  );
}

/* AI request preview */
function AiPreviewCard() {
  const rows = [['위치', '베란다'], ['증상', '파손/고장'], ['공종 후보', '방충망/창호'], ['요청 작업', '망 교체 또는 프레임 확인']];
  return (
    <div style={{ marginBottom: 22 }}>
      <SectionTitle title="AI 요청서는 이렇게 정리돼요" />
      <Card radius="var(--r-xxl)" pad="0" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'var(--surface-muted)', borderBottom: '1px solid var(--divider)' }}>
          <img src={ASSET.aiDraft} alt="" style={{ width: 48, height: 48, objectFit: 'contain', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="t-body-strong text-primary">AI 요청서 미리보기</div>
            <div className="t-small text-tertiary" style={{ marginTop: 2, fontWeight: 500 }}>예시 · 베란다 방충망</div>
          </div>
        </div>
        <div style={{ padding: '4px 18px 8px' }}>
          {rows.map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', gap: 16, padding: '13px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--divider)' : 'none' }}>
              <span className="t-caption text-tertiary" style={{ width: 66, flexShrink: 0 }}>{k}</span>
              <span className="t-body-strong text-primary" style={{ flex: 1 }}>{v}</span>
            </div>
          ))}
        </div>
      </Card>
      <div className="t-caption text-tertiary" style={{ marginTop: 10, lineHeight: '18px', padding: '0 4px' }}>사진과 선택 정보를 바탕으로 전문가가 이해하기 쉬운 요청서 초안을 만듭니다.</div>
    </div>
  );
}

/* Price guide preview — horizontal scroll */
function PriceGuidePreview() {
  return (
    <div style={{ marginBottom: 22 }}>
      <SectionTitle title="참고 시공 단가" />
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', margin: '0 -24px', padding: '2px 24px 6px', scrollbarWidth: 'none' }} className="screen-scroll">
        {PRICE_PREVIEW.map((p) => (
          <div key={p.label} className="pressable" onClick={() => alert('참고 단가는 요청서 작성 중 더 자세히 확인할 수 있어요.')}
            style={{ flex: '0 0 auto', width: 156, background: 'var(--surface)', borderRadius: 'var(--r-xl)', padding: 16, boxShadow: 'var(--shadow-soft)' }}>
            <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 8 }}>
              <img src={p.img} alt="" style={{ width: 60, height: 60, objectFit: 'contain' }} />
            </div>
            <div className="t-caption text-secondary">{p.label}</div>
            <div className="t-h3 text-primary" style={{ marginTop: 4, letterSpacing: -0.4 }}>{p.price}</div>
          </div>
        ))}
      </div>
      <div className="t-caption text-tertiary" style={{ marginTop: 8, padding: '0 4px' }}>최종 비용은 전문가 확인 후 달라질 수 있어요.</div>
    </div>
  );
}

/* Expert response preview */
function ExpertPreviewCard({ onPress }) {
  const rows = [['작업 방식', '부분 교체'], ['비용 감각', '소규모 작업'], ['방문 여부', '사진 기반 확인 가능']];
  return (
    <div style={{ marginBottom: 22 }}>
      <SectionTitle title="전문가 응답은 같은 기준으로 비교해요" />
      <Card radius="var(--r-xxl)" pad="18px" onPress={onPress}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 13 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="user" size={21} color="var(--primary)" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="t-body-strong text-primary">김반장 홈케어</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <Icon name="star" size={12} color="var(--warning)" />
              <span className="t-small text-secondary" style={{ fontWeight: 600 }}>4.8 · 후기 312</span>
            </div>
          </div>
          <Badge label="작업 확인서" variant="neutral" icon="shield" />
        </div>
        <div style={{ borderLeft: '3px solid var(--surface-soft)', paddingLeft: 13, marginBottom: 14 }}>
          <div className="t-caption text-secondary" style={{ fontStyle: 'italic', lineHeight: '20px' }}>“사진상 망 손상 중심으로 보여요. 현장에서 바로 부분 교체 가능합니다.”</div>
        </div>
        <div style={{ background: 'var(--surface-soft)', borderRadius: 'var(--r-l)', padding: '4px 14px' }}>
          {rows.map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < rows.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
              <span className="t-caption text-secondary">{k}</span>
              <span className="t-caption text-primary" style={{ fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* Trust guide */
function TrustGuideCard({ onPress }) {
  const bullets = ['작업 전후 사진 기록', '작업 범위 정리', '사후관리 조건 확인'];
  return (
    <div style={{ marginBottom: 4 }}>
      <SectionTitle title="안심 선택을 돕는 기준" />
      <div className="pressable" onClick={onPress} style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--r-xxl)', background: 'var(--premium-dark)', padding: '20px 22px', boxShadow: 'var(--shadow-medium)' }}>
        <div style={{ position: 'absolute', top: -40, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,108,255,0.4), transparent 70%)' }} />
        <img src={ASSET.warranty} alt="" style={{ position: 'absolute', right: -6, bottom: -8, width: 108, height: 108, objectFit: 'contain', zIndex: 0, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.28))' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 212 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="shield" size={20} color="var(--accent)" />
            </div>
            <span className="t-h3" style={{ color: '#fff' }}>작업 확인서 · 안심 보증</span>
          </div>
          <div className="t-caption" style={{ color: 'var(--on-dark-soft)', lineHeight: '20px', marginBottom: 14 }}>작업 확인서와 사후관리 조건을 통해 작업 범위와 이후 확인 가능 여부를 함께 비교할 수 있어요.</div>
          {bullets.map((b) => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
              <Icon name="check" size={15} color="var(--accent)" strokeWidth={2.6} />
              <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.92)', fontWeight: 500 }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Variant A — Hero icon + numbered timeline */
function HomeA() {
  return (
    <div className="stagger">
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4, marginBottom: 8 }}>
        <img src={HERO} alt="고치다" style={{ width: 208, height: 'auto', filter: 'drop-shadow(0 18px 26px rgba(91,108,255,0.28))' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <Eyebrow>AI 생활시공 어시스턴트</Eyebrow>
        <div className="t-display text-primary" style={{ marginTop: 8 }}>고치다</div>
        <div className="t-body text-secondary" style={{ marginTop: 10, padding: '0 8px' }}>
          사진 한 장이면 끝. AI가 전문가의 언어로<br />요청서를 정리해 드려요.
        </div>
      </div>

      <div style={{ marginTop: 30, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 21, top: 26, bottom: 26, width: 2, background: 'var(--surface-soft)' }} />
        {HOME_STEPS.map((s, i) => (
          <div key={s.n} style={{ display: 'flex', gap: 16, marginBottom: i < 2 ? 22 : 0, position: 'relative' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
              background: i === 0 ? 'var(--primary)' : 'var(--surface)', color: i === 0 ? '#fff' : 'var(--primary)',
              border: i === 0 ? 'none' : '2px solid var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 17, boxShadow: i === 0 ? 'var(--shadow-primary)' : 'none', zIndex: 1 }}>{s.n}</div>
            <div style={{ paddingTop: 3 }}>
              <div className="t-h3 text-primary">{s.title}</div>
              <div className="t-caption text-secondary" style={{ marginTop: 3 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Variant B — Premium navy hero card with icon */
function HomeB() {
  const icons = ['camera', 'sparkle', 'shield'];
  return (
    <div className="stagger">
      <div style={{ background: 'var(--premium-dark)', borderRadius: 'var(--r-3xl)', padding: '26px 24px 22px', boxShadow: 'var(--shadow-medium)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,108,255,0.50), transparent 70%)' }} />
        <Eyebrow color="var(--accent)">AI 생활시공 어시스턴트</Eyebrow>
        <div style={{ marginTop: 10, fontSize: 32, fontWeight: 800, letterSpacing: -0.8, color: '#fff' }}>고치다</div>
        <div className="t-caption" style={{ marginTop: 8, color: 'var(--on-dark-soft)', lineHeight: '20px' }}>
          사진만 찍으면 공종 분류부터<br />요청서 초안까지 한 번에.
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <img src={HERO} alt="고치다" style={{ width: 200, height: 'auto', filter: 'drop-shadow(0 14px 22px rgba(0,0,0,0.35))' }} />
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        {HOME_STEPS.map((s, i) => (
          <Card key={s.n} pad="16px" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={icons[i]} size={22} color="var(--primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="t-body-strong text-primary">{s.title}</div>
              <div className="t-caption text-secondary" style={{ marginTop: 2 }}>{s.desc}</div>
            </div>
            <span className="t-small text-tertiary" style={{ fontWeight: 800 }}>0{s.n}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* Variant C — Bold headline + hero icon + stats */
function HomeC() {
  return (
    <div className="stagger">
      <Eyebrow>AI 생활시공 어시스턴트</Eyebrow>
      <div className="text-primary" style={{ marginTop: 14, fontSize: 34, fontWeight: 800, lineHeight: '42px', letterSpacing: -1 }}>
        사진 한 장으로<br />
        <span style={{ color: 'var(--primary)' }}>시공 요청</span> 끝.
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
        <img src={HERO} alt="고치다" style={{ width: 200, height: 'auto', filter: 'drop-shadow(0 16px 24px rgba(91,108,255,0.26))' }} />
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-xxl)', overflow: 'hidden', boxShadow: 'var(--shadow-soft)' }}>
        {HOME_STEPS.map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderTop: i === 0 ? 'none' : '1px solid var(--divider)' }}>
            <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1, color: 'var(--primary)', width: 28 }}>{s.n}</span>
            <div style={{ flex: 1 }}>
              <div className="t-h3 text-primary">{s.title}</div>
              <div className="t-caption text-secondary" style={{ marginTop: 2 }}>{s.desc}</div>
            </div>
            <Icon name="arrowR" size={17} color="var(--text-tertiary)" />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        {[['12년+', '평균 경력'], ['3-5명', '비교 견적'], ['30초', '요청 작성']].map(([a, b]) => (
          <div key={a} style={{ flex: 1, textAlign: 'center', padding: '14px 4px', background: 'var(--surface)', borderRadius: 'var(--r-l)', boxShadow: 'var(--shadow-soft)' }}>
            <div className="t-h3" style={{ color: 'var(--primary)' }}>{a}</div>
            <div className="t-small text-tertiary" style={{ marginTop: 3, fontWeight: 500 }}>{b}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PHOTO SLOTS ── */
function PhotoSlots({ onCountChange }) {
  const wrapRef = useRefC(null);
  useEffectC(() => {
    const el = wrapRef.current;
    if (!el) return;
    const recount = () => onCountChange(el.querySelectorAll('image-slot[data-filled]').length);
    const mo = new MutationObserver(recount);
    mo.observe(el, { attributes: true, subtree: true, attributeFilter: ['data-filled'] });
    recount();
    return () => mo.disconnect();
  }, [onCountChange]);
  return (
    <div ref={wrapRef} style={{ display: 'flex', gap: 12 }}
      dangerouslySetInnerHTML={{ __html: `
        <image-slot id="gochida-photo-1" style="width:104px;height:106px;flex:1" shape="rounded" radius="16" placeholder="사진 추가"></image-slot>
        <image-slot id="gochida-photo-2" style="width:104px;height:106px;flex:1" shape="rounded" radius="16" placeholder="사진 추가"></image-slot>
        <image-slot id="gochida-photo-3" style="width:104px;height:106px;flex:1" shape="rounded" radius="16" placeholder="사진 추가"></image-slot>
      ` }} />
  );
}

/* ── UPLOAD ── */
function UploadScreen({ state, setState, onBack, onNext }) {
  const [photoCount, setPhotoCount] = useStateC(0);
  const { location, symptom } = state;
  const done = [photoCount > 0, !!location, !!symptom].filter(Boolean).length;
  const remaining = 3 - done;
  const canProceed = remaining === 0;

  return (
    <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <AppHeader title="요청서 작성" onBack={onBack} />
      <div className="screen-scroll" style={{ flex: 1, padding: '0 24px', paddingBottom: 150 }}>
        <div style={{ marginBottom: 22 }}>
          <StepIndicator current={1} total={2} label="요청서 작성" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, background: 'var(--surface)', borderRadius: 'var(--r-xxl)', padding: '14px 16px', boxShadow: 'var(--shadow-soft)' }}>
          <img src={ASSET.uploadCamera} alt="" style={{ width: 60, height: 60, objectFit: 'contain', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="t-body-strong text-primary">사진을 올리면 시작돼요</div>
            <div className="t-caption text-secondary" style={{ marginTop: 3 }}>문제 부위가 잘 보이게 찍어주세요.</div>
          </div>
        </div>

        <div style={{ marginBottom: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <div className="t-h3 text-primary">문제 사진</div>
            <div className="t-small text-tertiary">{photoCount} / 3 · 최대 3장</div>
          </div>
          <div className="t-caption text-secondary" style={{ marginBottom: 14 }}>다양한 각도로 찍을수록 분석이 정확해져요.</div>
          <PhotoSlots onCountChange={setPhotoCount} />
        </div>

        <div style={{ marginBottom: 30 }}>
          <div className="t-h3 text-primary" style={{ marginBottom: 14 }}>어디서 발생했나요?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {LOCATIONS.map((l) => (
              <Chip key={l} label={l} selected={location === l} onPress={() => setState((p) => ({ ...p, location: p.location === l ? '' : l }))} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div className="t-h3 text-primary" style={{ marginBottom: 14 }}>어떤 증상인가요?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {SYMPTOMS.map((s) => (
              <Chip key={s} label={s} selected={symptom === s} onPress={() => setState((p) => ({ ...p, symptom: p.symptom === s ? '' : s }))} />
            ))}
          </div>
        </div>
      </div>

      <FloatingFooter>
        {!canProceed && (
          <div className="t-caption text-tertiary" style={{ textAlign: 'center', marginBottom: 12 }}>
            {remaining}개 항목을 완료하면 분석을 시작할 수 있어요
          </div>
        )}
        <Button title="AI 분석 시작" disabled={!canProceed} onPress={onNext}
          leftIcon={<Icon name="sparkle" size={20} color="#fff" />} />
      </FloatingFooter>
    </div>
  );
}

Object.assign(window, { HomeScreen, UploadScreen, PhotoSlots, SectionTitle });
