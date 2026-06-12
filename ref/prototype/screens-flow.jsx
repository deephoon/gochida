/* ─────────────────────────────────────────────────────────────
   고치다 — Flow screens (Analysis · Review · Experts)
   Premium Clean · Brand Blue · Pretendard
   ───────────────────────────────────────────────────────────── */
const { useEffect: useEffF, useState: useStateF } = React;

function warrantyVariant(type) {
  if (type === '안심 보증서') return 'success';
  if (type === '작업 확인서') return 'neutral';
  return 'danger';
}
function availColor(a) { return a ? 'var(--success)' : '#C77F12'; }
function fmtWon(priceRange) {
  const m = priceRange && priceRange.match(/(\d+)\D+(\d+)/);
  return m ? `${m[1]}~${m[2]}만원` : priceRange;
}

/* ── Loading reference-price card ── */
function LoadingPriceGuideCard({ guide }) {
  return (
    <div>
      <Card radius="var(--r-xxl)" style={{ marginBottom: 12 }}>
        <div className="t-small" style={{ color: 'var(--primary)', fontWeight: 700 }}>{guide.tradeCategory} · 참고 시세</div>
        <div className="t-caption text-secondary" style={{ marginTop: 6 }}>{guide.title}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
          <span className="t-small text-tertiary">평균</span>
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.6, color: 'var(--primary)' }}>{guide.averagePrice}</span>
        </div>
      </Card>
      <Card radius="var(--r-l)" pad="16px 18px" style={{ marginBottom: 12 }}>
        <div className="t-body-strong text-primary">가격이 달라지는 이유</div>
        <div className="t-caption text-secondary" style={{ marginTop: 6 }}>{guide.factors.join(' · ')}</div>
      </Card>
      <Card radius="var(--r-l)" pad="16px 18px" style={{ marginBottom: 12 }}>
        <div className="t-body-strong text-primary">고치다의 비교 기준</div>
        <div className="t-caption text-secondary" style={{ marginTop: 6 }}>최저가보다 작업 범위와 사후관리 가능성을 함께 비교합니다.</div>
      </Card>
      <div className="t-small text-tertiary" style={{ textAlign: 'center', marginTop: 14, padding: '0 14px', lineHeight: '17px', fontWeight: 500 }}>
        참고용 시세이며, 최종 비용은 전문가 확인 후 달라질 수 있어요.
      </div>
    </div>
  );
}

/* ── ANALYSIS ── */
function AnalysisScreen({ state, setAnalysis, onBack, onNext }) {
  const [isLoading, setLoading] = useStateF(!state.analysis);
  const guide = getSuggestedPriceGuide(state.location, state.symptom);

  useEffF(() => {
    if (state.analysis) { setLoading(false); return; }
    setLoading(true);
    const t = setTimeout(() => { setAnalysis(buildAnalysis(state.location, state.symptom)); setLoading(false); }, 2400);
    return () => clearTimeout(t);
  }, []);

  const a = state.analysis;

  return (
    <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <AppHeader title="AI 분석" onBack={onBack} />
      <div className="screen-scroll" style={{ flex: 1, padding: '0 24px', paddingBottom: isLoading ? 40 : 150 }}>
        {isLoading ? (
          <>
            <div className="t-h1 text-primary">요청서를 정리하고 있어요</div>
            <div className="t-body text-secondary" style={{ marginTop: 8 }}>사진 속 문제 범위와 필요한 공종을 확인 중입니다. 보통 10초 안에 끝나요.</div>
            <div style={{ margin: '24px 0 28px' }}>
              <Skeleton width="58%" height={16} style={{ marginBottom: 12 }} />
              <Skeleton width="90%" height={16} style={{ marginBottom: 12 }} />
              <Skeleton width="74%" height={16} />
            </div>
            <LoadingPriceGuideCard guide={guide} />
          </>
        ) : a ? (
          <div className="stagger">
            {/* premium cost card */}
            <div style={{ background: 'var(--premium-dark)', borderRadius: 'var(--r-3xl)', padding: '24px', boxShadow: 'var(--shadow-medium)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -34, right: -24, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,108,255,0.45), transparent 70%)' }} />
              <img src={ASSET.priceGuide} alt="" style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', width: 104, height: 104, objectFit: 'contain', zIndex: 0, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }} />
              <div style={{ position: 'relative', zIndex: 1, paddingRight: 80 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(255,179,138,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="bolt" size={15} color="var(--accent)" />
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--accent)' }}>예상 시공 비용</span>
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.8, color: '#fff', marginTop: 14 }}>{fmtWon(a.priceGuide.priceRange)}</div>
              <div className="t-caption" style={{ marginTop: 8, color: 'var(--on-dark-soft)' }}>{a.costSense} · {a.priceGuide.tradeCategory} 참고 시세 · 부품비 제외</div>
              </div>
            </div>

            {/* problem header */}
            <div style={{ marginTop: 24 }}>
              <div className="t-h1 text-primary">{a.problemCandidate}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                <Badge label={a.tradeCategory} variant="primary" icon="wrench" />
                {a.visitRequired && <Badge label="방문 확인 필요" variant="warning" dot />}
                <Badge label={`신뢰도 ${a.confidence}`} variant="neutral" dot />
                {a.riskLevel === '높음' && <Badge label="위험도 높음" variant="danger" icon="warning" />}
              </div>
            </div>

            {/* recommendation */}
            <Card radius="var(--r-xxl)" style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Icon name="sparkle" size={18} color="var(--primary)" />
                <span className="t-h3 text-primary">추천 조치</span>
              </div>
              <div className="t-body text-primary" style={{ lineHeight: '24px', borderLeft: '3px solid var(--primary)', paddingLeft: 14 }}>{a.actionRecommendation}</div>
            </Card>

            {/* evidence */}
            <Card radius="var(--r-xxl)" style={{ marginTop: 12 }}>
              <div className="t-h3 text-primary" style={{ marginBottom: 14 }}>AI가 발견한 사항</div>
              {a.visibleEvidence.map((e, i) => (
                <div key={i} style={{ display: 'flex', gap: 11, marginBottom: i < a.visibleEvidence.length - 1 ? 12 : 0 }}>
                  <Icon name="checkCircle" size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span className="t-body text-secondary" style={{ lineHeight: '23px' }}>{e}</span>
                </div>
              ))}
            </Card>

            {/* uncertainty */}
            <Card radius="var(--r-xxl)" style={{ marginTop: 12, background: 'var(--warning-light)', boxShadow: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Icon name="warning" size={16} color="#C77F12" />
                <span className="t-h3" style={{ color: '#9A6E13' }}>추가 확인이 필요해요</span>
              </div>
              {a.uncertainty.map((u, i) => (
                <div key={i} style={{ display: 'flex', gap: 11, marginBottom: i < a.uncertainty.length - 1 ? 12 : 0 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C77F12', flexShrink: 0, marginTop: 9 }} />
                  <span className="t-body" style={{ color: '#7A5A1E', lineHeight: '23px' }}>{u}</span>
                </div>
              ))}
            </Card>

            {/* self-check */}
            <Card radius="var(--r-xxl)" style={{ marginTop: 12 }}>
              <div className="t-h3 text-primary" style={{ marginBottom: 14 }}>직접 확인해 볼 수 있어요</div>
              {a.selfCheckGuide.steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                  <span className="t-body text-secondary" style={{ lineHeight: '23px' }}>{s}</span>
                </div>
              ))}
              <div style={{ marginTop: 6, padding: '13px 15px', background: 'var(--danger-light)', borderRadius: 'var(--r-l)' }}>
                <div className="t-small" style={{ color: 'var(--danger)', fontWeight: 700, marginBottom: 7 }}>이런 경우 직접 시도하지 마세요</div>
                {a.selfCheckGuide.doNotAttemptIf.map((d, i) => (
                  <div key={i} className="t-caption" style={{ color: '#B3271F', lineHeight: '19px' }}>· {d}</div>
                ))}
              </div>
            </Card>

            <div className="t-small text-tertiary" style={{ textAlign: 'center', marginTop: 18, padding: '0 8px', lineHeight: '18px', fontWeight: 500 }}>{a.disclaimer}</div>
          </div>
        ) : null}
      </div>

      {!isLoading && a && (
        <FloatingFooter>
          <Button title="이대로 요청서 확인하기" onPress={onNext}
            leftIcon={<Icon name="check" size={20} color="#fff" strokeWidth={2.4} />} />
        </FloatingFooter>
      )}
    </div>
  );
}

/* ── REQUEST REVIEW ── */
function RequestReviewScreen({ state, setState, onBack, onNext }) {
  const a = state.analysis;
  const s = a ? a.requestDraft.structured : null;
  const docTitle = a ? a.requestDraft.title : '시공 점검 요청';
  const trade = a ? a.tradeCategory : '생활시공';
  const fields = [
    { label: '문제 위치', icon: 'pin', value: s ? s.location : `${state.location || '직접 확인 필요'} · ${state.symptom || ''}` },
    { label: '의심 원인', icon: 'sparkle', value: s ? s.suspected_issue : '직접 확인 필요' },
    { label: '요청 작업', icon: 'wrench', value: s ? s.requested_work : '전문가 상담 후 결정' },
  ];
  const memoLen = (state.memo || '').length;

  return (
    <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <AppHeader title="요청서 검토" onBack={onBack} />
      <div className="screen-scroll" style={{ flex: 1, padding: '0 24px', paddingBottom: 150 }}>
        <div style={{ marginBottom: 24 }}>
          <StepIndicator current={2} total={2} label="요청서 검토" />
        </div>

        <div className="stagger">
          <div className="t-h1 text-primary">요청서를 확인해 주세요</div>
          <div className="t-body text-secondary" style={{ marginTop: 8, marginBottom: 20 }}>전문가가 한눈에 이해할 수 있도록 정리했어요. 내용을 확인하고 메모를 더해보세요.</div>

          {/* Document card */}
          <Card radius="var(--r-3xl)" pad="0" style={{ overflow: 'hidden' }}>
            {/* header band */}
            <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--premium-dark)', padding: '20px 22px 22px' }}>
              <div style={{ position: 'absolute', top: -40, right: -28, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,108,255,0.45), transparent 70%)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={ASSET.aiDraft} alt="" style={{ width: 34, height: 34, objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--accent)', letterSpacing: 0.2 }}>AI 요청서 초안</span>
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,0.16)', borderRadius: 'var(--r-pill)', padding: '5px 11px' }}>{trade}</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 16, lineHeight: '25px', letterSpacing: -0.3 }}>{docTitle}</div>
              </div>
            </div>
            {/* fields */}
            <div style={{ padding: '6px 22px 10px' }}>
              {fields.map((f, i) => (
                <div key={f.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 0', borderBottom: i < fields.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={f.icon} size={17} color="var(--primary)" />
                  </div>
                  <div style={{ flex: 1, paddingTop: 1 }}>
                    <div className="t-small text-tertiary" style={{ fontWeight: 600 }}>{f.label}</div>
                    <div className="t-body-strong text-primary" style={{ marginTop: 3, lineHeight: '22px' }}>{f.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* memo */}
          <div style={{ marginTop: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="t-h3 text-primary">전문가에게 전하고 싶은 말</div>
              <span className="t-small text-tertiary" style={{ fontWeight: 500 }}>{memoLen}/200</span>
            </div>
            <div className="t-caption text-secondary" style={{ marginTop: 4, marginBottom: 12 }}>방문 가능 시간이나 상황 설명을 남겨주세요. (선택)</div>
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-l)', boxShadow: 'var(--shadow-soft)', padding: 4 }}>
              <textarea value={state.memo || ''} maxLength={200} onChange={(e) => setState((p) => ({ ...p, memo: e.target.value }))}
                placeholder="예: 평일 저녁이나 주말 오전에 방문 가능합니다."
                style={{ width: '100%', minHeight: 104, resize: 'none', border: 'none', outline: 'none', background: 'transparent',
                  borderRadius: 'var(--r-m)', padding: 14, fontFamily: 'inherit', fontSize: 15, lineHeight: '23px', color: 'var(--text-primary)' }} />
            </div>
          </div>

          {/* disclaimer */}
          <div style={{ display: 'flex', gap: 8, marginTop: 18, padding: '0 2px' }}>
            <Icon name="info" size={15} color="var(--text-tertiary)" style={{ flexShrink: 0, marginTop: 1 }} />
            <div className="t-small text-tertiary" style={{ lineHeight: '18px', fontWeight: 500 }}>AI가 사진과 입력 정보를 바탕으로 작성한 초안입니다. 최종 작업 범위와 비용은 전문가 상담 후 결정됩니다.</div>
          </div>
        </div>
      </div>

      <FloatingFooter>
        <Button title="이대로 전문가에게 요청하기" onPress={onNext}
          rightIcon={<Icon name="arrowR" size={19} color="#fff" strokeWidth={2.2} />} />
      </FloatingFooter>
    </div>
  );
}

/* ── EXPERT RESPONSES ── */
function ExpertResponsesScreen({ state, onOpenExpert, onBack }) {
  const [loading, setLoading] = useStateF(true);
  const experts = state.experts || [];
  const maxRating = experts.reduce((m, e) => Math.max(m, e.rating), 0);
  useEffF(() => { const t = setTimeout(() => setLoading(false), 1600); return () => clearTimeout(t); }, []);

  return (
    <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <AppHeader title="전문가 응답 비교" onBack={onBack} showBack={!!onBack} />
      <div className="screen-scroll" style={{ flex: 1, padding: '0 24px', paddingBottom: 40 }}>
        {loading ? (
          <>
            <div className="t-h1 text-primary">응답을 모으는 중</div>
            <div className="t-body text-secondary" style={{ marginTop: 8, marginBottom: 24 }}>믿을 수 있는 전문가 3-5명에게 요청을 보내고 있어요.</div>
            {[0, 1, 2].map((i) => (
              <Card key={i} radius="var(--r-xxl)" style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                  <Skeleton width={44} height={44} radius={22} />
                  <div style={{ flex: 1 }}>
                    <Skeleton width="40%" height={14} style={{ marginBottom: 8 }} />
                    <Skeleton width="58%" height={12} />
                  </div>
                </div>
                <Skeleton width="100%" height={12} style={{ marginBottom: 8 }} />
                <Skeleton width="78%" height={12} />
              </Card>
            ))}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
              <span style={{ width: 22, height: 22, border: '2.5px solid var(--surface-soft)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            </div>
          </>
        ) : (
          <div className="stagger">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="t-h1 text-primary">전문가 {experts.length}명이 응답했어요</div>
                <div className="t-body text-secondary" style={{ marginTop: 6 }}>작업 방식과 보증 조건을 같은 기준으로 비교해 보세요.</div>
              </div>
              <img src={ASSET.expertCards} alt="" style={{ width: 80, height: 80, objectFit: 'contain', flexShrink: 0 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--surface-soft)', borderRadius: 'var(--r-pill)', padding: '6px 12px', fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)' }}>
                <Icon name="sparkle" size={13} color="var(--primary)" />정렬 · 추천순
              </span>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-tertiary)' }}>모두 같은 요청서 기준</span>
            </div>
            {experts.map((ex) => {
              const isTop = ex.rating >= maxRating;
              const hasWarranty = ex.warranty.type !== '없음';
              const tiles = [
                ['작업 방식', ex.workType, 'wrench'],
                ['비용 감각', ex.costLevel, 'bolt'],
                ['방문 여부', ex.visitLabel, 'pin'],
              ];
              return (
                <Card key={ex.id} radius="var(--r-3xl)" pad="0" onPress={() => onOpenExpert(ex.id)} style={{ marginBottom: 16, overflow: 'hidden' }}>
                  {/* head */}
                  <div style={{ padding: '18px 18px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 50, height: 50, borderRadius: '50%', padding: 2, background: isTop ? 'linear-gradient(145deg, #6E7BFF, var(--primary))' : 'var(--surface-soft)', flexShrink: 0 }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name="user" size={24} color="var(--primary)" />
                        </div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <span className="t-h3 text-primary" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.expertName}</span>
                          {isTop && <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', borderRadius: 'var(--r-pill)', padding: '3px 8px' }}>추천</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                          <Icon name="star" size={13} color="var(--warning)" />
                          <span className="t-caption" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{ex.rating}</span>
                          <span className="t-caption text-tertiary">· 후기 {ex.reviews}</span>
                        </div>
                      </div>
                      <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: availColor(ex.available), background: ex.available ? 'var(--success-light)' : 'var(--warning-light)', borderRadius: 'var(--r-pill)', padding: '6px 11px' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: availColor(ex.available) }} />{ex.availableLabel}
                      </span>
                    </div>
                    {/* comment bubble */}
                    <div style={{ background: 'var(--surface-muted)', borderRadius: 'var(--r-l)', padding: '13px 15px', marginTop: 14 }}>
                      <div className="t-body text-secondary" style={{ lineHeight: '23px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>“{ex.comment}”</div>
                    </div>
                  </div>
                  {/* stat tiles */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '14px 18px 0' }}>
                    {tiles.map(([k, v, icon]) => (
                      <div key={k} style={{ background: 'var(--surface-soft)', borderRadius: 'var(--r-m)', padding: '11px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                          <Icon name={icon} size={12} color="var(--text-tertiary)" strokeWidth={2} />
                          <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-tertiary)' }}>{k}</span>
                        </div>
                        <div className="t-caption text-primary" style={{ fontWeight: 700, lineHeight: '17px' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {/* warranty strip */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '14px 18px', marginTop: 14, borderTop: '1px solid var(--divider)' }}>
                    <Icon name="shield" size={17} color={hasWarranty ? 'var(--success)' : 'var(--text-tertiary)'} />
                    <span className="t-caption text-primary" style={{ fontWeight: 700, flex: 1 }}>{hasWarranty ? `${ex.warranty.type} · ${ex.warranty.period} 보증` : '사후관리 미제공'}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>상세 보기<Icon name="chevronR" size={15} color="var(--primary)" strokeWidth={2.4} /></span>
                  </div>
                </Card>
              );
            })}
            <div className="t-small text-tertiary" style={{ textAlign: 'center', marginTop: 6, marginBottom: 12, fontWeight: 500, lineHeight: '17px' }}>최종 작업 범위와 비용은 전문가 상담 후 결정됩니다.</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── EXPERT DETAIL ── */
function ExpertDetailScreen({ state, expertId, onBack }) {
  const [loading, setLoading] = useStateF(true);
  const ex = (state.experts || []).find((e) => e.id === expertId);
  useEffF(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, [expertId]);

  if (loading || !ex) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <AppHeader title="전문가 상세" onBack={onBack} />
        <div style={{ flex: 1, padding: '0 24px' }}>
          <Skeleton width="50%" height={22} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={14} style={{ marginBottom: 10 }} />
          <Skeleton width="84%" height={14} style={{ marginBottom: 28 }} />
          <Skeleton width="100%" height={150} radius={24} />
        </div>
      </div>
    );
  }

  const detail = [
    ['가능 여부', ex.availableLabel, availColor(ex.available)],
    ['작업 방식', ex.workType, 'var(--text-primary)'],
    ['예상 비용', ex.costLevel, 'var(--text-primary)'],
    ['방문 필요', ex.visitLabel, 'var(--text-primary)'],
    ['가능 일정', ex.schedule, 'var(--text-primary)'],
  ];

  return (
    <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <AppHeader title="전문가 상세" onBack={onBack} />
      <div className="screen-scroll" style={{ flex: 1, padding: '0 24px', paddingBottom: 150 }}>
        <div className="stagger">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="user" size={28} color="var(--primary)" />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="t-h1 text-primary" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.expertName}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Icon name="star" size={14} color="var(--warning)" />
                <span className="t-body-strong text-primary">{ex.rating}</span>
                <span className="t-caption text-tertiary">· 후기 {ex.reviews}개</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            {ex.trustElements.map((t) => (
              <span key={t} style={{ background: 'var(--surface-soft)', borderRadius: 'var(--r-pill)', padding: '7px 13px', fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)' }}>{t}</span>
            ))}
          </div>

          <Card radius="var(--r-xxl)" style={{ marginTop: 22 }}>
            <div className="t-caption text-tertiary" style={{ marginBottom: 8, fontWeight: 700 }}>전문가 소견</div>
            <div className="t-body text-primary" style={{ fontStyle: 'italic', lineHeight: '24px' }}>“{ex.comment}”</div>
          </Card>

          <Card radius="var(--r-xxl)" pad="6px 22px" style={{ marginTop: 12 }}>
            {detail.map(([k, v, c], i) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: i < detail.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                <span className="t-body text-secondary">{k}</span>
                <span className="t-body-strong" style={{ color: c, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {i === 0 && <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />}{v}
                </span>
              </div>
            ))}
          </Card>

          <Card radius="var(--r-xxl)" style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden', background: ex.warranty.available ? 'var(--success-light)' : 'var(--surface-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {ex.warranty.available
                  ? <img src={ASSET.warranty} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                  : <Icon name="shield" size={20} color="var(--text-tertiary)" />}
              </div>
              <div>
                <div className="t-h3 text-primary">{ex.warranty.type === '없음' ? '사후관리 미제공' : ex.warranty.type}</div>
                {ex.warranty.period && <div className="t-caption text-secondary" style={{ marginTop: 2 }}>보증 기간 {ex.warranty.period}</div>}
              </div>
            </div>
            <div className="t-body text-secondary" style={{ lineHeight: '23px', marginBottom: ex.warranty.includedCare.length ? 14 : 0 }}>{ex.warranty.description}</div>
            {ex.warranty.includedCare.map((c) => (
              <div key={c} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <Icon name="check" size={16} color="var(--success)" strokeWidth={2.4} style={{ flexShrink: 0 }} />
                <span className="t-body text-primary">{c}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, padding: '13px 15px', background: 'var(--surface-muted)', borderRadius: 'var(--r-l)' }}>
              <div className="t-caption text-tertiary" style={{ lineHeight: '18px' }}>보증 조건과 책임 범위는 전문가와 직접 협의 후 확정됩니다. 고치다는 중개 정보를 제공하며 시공 결과에 직접 책임지지 않습니다.</div>
            </div>
          </Card>
        </div>
      </div>

      <FloatingFooter>
        <Button title="이 전문가와 상담하기" leftIcon={<Icon name="chat" size={18} color="#fff" />}
          onPress={() => alert('MVP 범위 외 기능입니다.\n실제 서비스에서는 전문가와 채팅/통화로 연결됩니다.')} />
      </FloatingFooter>
    </div>
  );
}

Object.assign(window, { AnalysisScreen, RequestReviewScreen, ExpertResponsesScreen, ExpertDetailScreen, LoadingPriceGuideCard });
