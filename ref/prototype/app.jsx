/* ─────────────────────────────────────────────────────────────
   고치다 — App shell: tab + stack navigation, tab bar, tweaks, mount
   ───────────────────────────────────────────────────────────── */
const { useState: useStateA, useEffect: useEffectA, useCallback: useCbA } = React;

/* Screen transition wrapper — CSS keyframe (transform-only, rests visible).
   Resting state is translateX(0); the small slide can never strand content off-screen. */
function Screen({ dir, children }) {
  const cls = dir === 'none' ? '' : dir === 'back' ? 'screen-enter-back' : 'screen-enter';
  return (
    <div className={cls} style={{ height: '100%', background: 'var(--background)' }}>
      {children}
    </div>
  );
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primary": "#5B6CFF",
  "accent": "#FFB38A"
}/*EDITMODE-END*/;

const SAVE_KEY = 'gochida-proto-v2';
const TAB_SCREENS = ['home', 'requests', 'chats', 'profile'];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [nav, setNav] = useStateA(() => {
    try { const raw = localStorage.getItem(SAVE_KEY); if (raw) return JSON.parse(raw); } catch (e) {}
    return { screen: 'home', tab: 'home', dir: 'none', expertId: null, requestId: null, chatId: null };
  });
  const [data, setData] = useStateA(() => {
    try { const raw = localStorage.getItem(SAVE_KEY + '-data'); if (raw) return JSON.parse(raw); } catch (e) {}
    return { location: '', symptom: '', memo: '', analysis: null, experts: null };
  });

  useEffectA(() => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(nav)); } catch (e) {} }, [nav]);
  useEffectA(() => { try { localStorage.setItem(SAVE_KEY + '-data', JSON.stringify(data)); } catch (e) {} }, [data]);

  useEffectA(() => {
    document.documentElement.style.setProperty('--primary', t.primary);
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.primary, t.accent]);

  const go = useCbA((screen, dir = 'forward', extra = {}) => {
    setNav((n) => ({ ...n, screen, dir, ...extra }));
  }, []);

  const selectTab = useCbA((tab) => {
    setNav((n) => ({ ...n, screen: tab, tab, dir: 'none', expertId: null, requestId: null, chatId: null }));
  }, []);

  // flow actions
  const startFlow = () => { setData({ location: '', symptom: '', memo: '', analysis: null, experts: null }); go('upload'); };
  const toAnalysis = () => { setData((d) => ({ ...d, analysis: null })); go('analysis'); };
  const toReview = () => go('review');
  const toExperts = () => { setData((d) => ({ ...d, experts: d.experts || buildExperts(d.analysis) })); go('experts'); };
  const openExpert = (id) => go('expertDetail', 'forward', { expertId: id });
  const setAnalysis = (a) => setData((d) => ({ ...d, analysis: a }));
  const openRequest = (id) => go('requestDetail', 'forward', { requestId: id });
  const openChat = (id) => go('chatDetail', 'forward', { chatId: id });
  // experts from a mock request (home/requests preview) — ensure experts exist
  const compareExperts = () => { setData((d) => ({ ...d, experts: d.experts || buildExperts(d.analysis) })); go('experts'); };

  const isTab = TAB_SCREENS.includes(nav.screen);

  let screenEl = null;
  switch (nav.screen) {
    case 'home':
      screenEl = <HomeScreen onStart={startFlow} onOpenRequest={openRequest} onGoTab={selectTab} onPreviewExperts={compareExperts} />; break;
    case 'requests':
      screenEl = <RequestsScreen onOpenRequest={openRequest} onCompare={compareExperts} />; break;
    case 'chats':
      screenEl = <ChatsScreen onOpenChat={openChat} />; break;
    case 'profile':
      screenEl = <ProfileScreen onGoTab={selectTab} />; break;
    case 'upload':
      screenEl = <UploadScreen state={data} setState={setData} onBack={() => go('home', 'back')} onNext={toAnalysis} />; break;
    case 'analysis':
      screenEl = <AnalysisScreen state={data} setAnalysis={setAnalysis} onBack={() => go('upload', 'back')} onNext={toReview} />; break;
    case 'review':
      screenEl = <RequestReviewScreen state={data} setState={setData} onBack={() => go('analysis', 'back')} onNext={toExperts} />; break;
    case 'experts':
      screenEl = <ExpertResponsesScreen state={data} onBack={() => go('home', 'back')} onOpenExpert={openExpert} />; break;
    case 'expertDetail':
      screenEl = <ExpertDetailScreen state={data} expertId={nav.expertId} onBack={() => go('experts', 'back')} />; break;
    case 'requestDetail':
      screenEl = <RequestDetailScreen requestId={nav.requestId} onBack={() => go(nav.tab, 'back')} onCompare={compareExperts} />; break;
    case 'chatDetail':
      screenEl = <ChatDetailScreen chatId={nav.chatId} onBack={() => go('chats', 'back')} />; break;
    default:
      screenEl = <HomeScreen onStart={startFlow} onOpenRequest={openRequest} onGoTab={selectTab} onPreviewExperts={compareExperts} />;
  }

  const transitionKey = nav.screen + (nav.expertId || '') + (nav.requestId || '') + (nav.chatId || '');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
      <IOSDevice>
        <div style={{ height: '100%', position: 'relative' }}>
          <Screen key={transitionKey} dir={nav.dir}>
            {screenEl}
          </Screen>
          {isTab && <TabBar active={nav.tab} onSelect={selectTab} onCamera={startFlow} badges={{ chats: 1 }} />}
        </div>
      </IOSDevice>

      <TweaksPanel>
        <TweakSection label="브랜드 컬러" />
        <TweakColor label="Primary" value={t.primary}
          options={['#5B6CFF', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
          onChange={(v) => setTweak('primary', v)} />
        <TweakColor label="Accent" value={t.accent}
          options={['#FFB38A', '#F5A623', '#34C759', '#FF6B6B']}
          onChange={(v) => setTweak('accent', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
