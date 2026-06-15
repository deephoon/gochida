/**
 * ==========================================
 * 1. 흐름 (Data & State Flow Diagram)
 * ==========================================
 * [View Layer] (upload.tsx)
 *   -- (imageUris, location, symptom) -->
 * [Context Layer] (RequestContext.tsx)
 *   -- (Call fetchAnalysis) -->
 * [Service Layer] (aiService.ts)
 *   -- (Check EXPO_PUBLIC_USE_MOCK_AI)
 *       ├─(True)──> Return Mock JSON with delay (Fallback)
 *       └─(False)─> Call Gemini API (Promise.race for Timeout)
 *            ├─(Success)────────> Return AIRepairAnalysis (status: SUCCESS)
 *            ├─(Rate Limit 429)─> Throw Error "API 한도 초과"
 *            ├─(Irrelevant)─────> Return AIRepairAnalysis (status: REJECTED)
 *            └─(Timeout)────────> Throw Error "응답 시간 초과"
 *   <-- (Return Result or Throw Error) --
 * [Context Layer]
 *   -- (Update global state: analysisResult, loading, error) -->
 * [View Layer] (analysis.tsx)
 *   -- (Render UI based on state)
 */

/**
 * ==========================================
 * 2. 역할 분해 (Separation of Concerns)
 * ==========================================
 * - aiService.ts (Service Layer): 순수 비즈니스 및 통신 로직. AI 프롬프트 구성, 타임아웃, 예외 처리 등 네트워크 페이로드를 가공하고 반환하는 책임만 가집니다. (상태 없음)
 * - RequestContext.tsx (State Layer): View에서 호출된 Service 결과를 전역 상태(state)에 저장하고 상태 전환(로딩, 에러, 완료)을 관리하여 View 컴포넌트에 주입합니다.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIRepairAnalysis } from '../types';
import { buildMockAnalysis, getSuggestedPriceGuide } from '../data/mockData';
import { normalizeAiText, splitSentences } from '../utils/text';

// 프롬프트/스키마 버전. 응답 로그 추적용 (변경 시 올린다).
const PROMPT_VERSION = 'v2-2026-06';

// ==========================================
// 3. 프롬프트 정의 (요청서 작성 보조자)
// ==========================================
// 응답 속도를 위해 규칙과 JSON 스키마 중심으로 압축한다. (장문 설명 최소화)

const buildPrompt = (location: string, symptom: string, imageCount: number) => `너는 대한민국 주거 생활시공 분야의 베테랑 견적 코디네이터다. 사진과 사용자 입력을 분석해, 해당 공종 전문가가 "추가 질문 없이도 작업 범위를 가늠할 수 있는" 수준의 전문가용 요청서를 작성한다. 진단·확정견적은 하지 않되, 누구나 쓸 수 있는 두루뭉술한 일반론은 절대 금지한다.

[입력] 위치:${location || '미입력'} / 증상:${symptom || '미입력'} / 이미지:${imageCount}장

[분석 원칙]
1. 먼저 사진 단서로 공종(tradeCategory)과 "의심 부품/부위"를 구체적으로 특정하라. 막연히 "OO 점검"이 아니라 어느 부품이 어떤 메커니즘으로 문제인지 좁혀라. (예: 방충망 "망 자체 찢어짐" vs "롤러/프레임 변형", 수전 "카트리지·패킹 노후" vs "벽 매립배관", 누수 "위생도기 실링" vs "방수층 손상")
2. visibleEvidence: 사진에서 실제로 보이는 단서만, 공종 용어로 구체적으로 적어라. 보이지 않는데 추측한 내용은 금지(그건 uncertainty로).
3. uncertainty: 사진만으로 확정 못 하는 부분과 그 이유.
4. 위험공종(전기·누수·배관·구조균열·가스·화재·고소)은 riskLevel "높음", 자가수리 권장 금지(doNotAttemptIf에 명시).
5. 생활시공과 무관(인물/음식/풍경/문서 등)하거나 문제부위가 안 보이면 status="REJECTED"+rejection_reason. 흐리지만 일부 판단 가능하면 additionalPhotosNeeded=true.
6. tradeCategory 예: 방충망/창호, 욕실 실리콘, 수전/위생기구, 문/문틀, 도배/벽지, 전기/조명, 누수/배관, 가구/수납 보수, 기타 생활시공.

[요청서 품질 — 가장 중요]
requestDraft.message는 "상황을 잘 아는 사람이 대신 정리해 준" 느낌의 자연스러운 존댓말 3~5문장이어야 한다. 다음을 반드시 녹여라:
- 의심 부품/부위와 증상을 구체적으로
- 가능성 있는 작업 방식 1~2가지(예: 부분 교체 vs 전체 교체)와, 무엇을 보고 결정하면 되는지
- 전문가가 방문/견적 전에 확인하면 좋은 포인트
- 관련될 수 있는 부품/자재가 있으면 언급
"점검 부탁드립니다", "확인 후 안내 부탁드립니다" 같은 일반론만으로 채우지 마라.
- requestDraft.title: "위치+의심 문제+요청 유형" (예: "욕실 세면대 하부 누수 점검·배관 보수 요청")
- structured.suspected_issue: 의심 부품 + 고장 메커니즘
- structured.requested_work: 구체적 작업 옵션 (예: "방충망 망 교체(미세망/일반망 택1) 또는 롤러·프레임 동반 보수 여부 확인")
- structured.additional_note: 작업 범위를 좁히는 데 도움 되는 정보(접근성/크기·개수/발생 시점 등) 안내
- additionalQuestions: 그 공종에 특화된, 견적 범위를 좁히는 질문만

[비용] costSense는 "소규모/중간 규모 작업 가능성" 수준의 감각으로만. "확정 견적/최저가" 금지.
[배열 길이] visibleEvidence≤4, uncertainty≤3, selfCheckGuide.steps≤3, doNotAttemptIf≤3, additionalQuestions≤3.

[출력] 순수 JSON만. 마크다운 펜스/설명/접두사 금지. 아래 스키마 전 필드 포함:
{"status":"SUCCESS|REJECTED","rejection_reason":"","problemCandidate":"","tradeCategory":"","confidence":"낮음|보통|높음","visibleEvidence":[],"uncertainty":[],"riskLevel":"낮음|보통|높음","visitRequired":true,"costSense":"","actionRecommendation":"","selfCheckGuide":{"available":true,"steps":[],"doNotAttemptIf":[]},"additionalQuestions":[],"additionalPhotosNeeded":false,"requestDraft":{"title":"","message":"","structured":{"location":"","symptom":"","suspected_issue":"","requested_work":"","additional_note":""}},"disclaimer":"사진과 입력 정보를 바탕으로 정리한 요청서 초안이며, 최종 작업 범위와 비용은 전문가 확인 후 결정됩니다."}`;

// 마크다운 펜스 제거 후, 응답에 부가 텍스트가 섞여 있어도 첫 '{'부터 마지막 '}'까지를
// JSON 본문으로 간주해 파싱 성공률을 높인다.
const stripJsonFences = (raw: string) => {
  const cleaned = raw.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
  if (cleaned.startsWith('{') && cleaned.endsWith('}')) return cleaned;
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  return start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
};

const FALLBACK_DISCLAIMER =
  '사진과 입력 정보를 바탕으로 정리한 요청서 초안이며, 최종 작업 범위와 비용은 전문가 확인 후 결정됩니다.';

const LEVELS = ['낮음', '보통', '높음'] as const;

// 배열 필드를 문자열만 남기고 정규화 후 최대 길이로 자른다. (응답이 길어 가독성을 해치는 것 방지)
const asStringArray = (v: unknown, max?: number): string[] => {
  const list = Array.isArray(v)
    ? v.filter((x): x is string => typeof x === 'string').map((x) => normalizeAiText(x)).filter(Boolean)
    : [];
  return typeof max === 'number' ? list.slice(0, max) : list;
};

// requestDraft.message를 정규화하고 3~5문장으로 제한한다.
const limitMessage = (raw: string): string => {
  const sentences = splitSentences(raw, 5);
  return sentences.length > 0 ? sentences.join(' ') : normalizeAiText(raw);
};

const asLevel = (v: unknown, fallback: '낮음' | '보통' | '높음') =>
  LEVELS.includes(v as any) ? (v as '낮음' | '보통' | '높음') : fallback;

/**
 * Gemini 응답이 일부 필드를 누락하거나 타입이 어긋나도 UI가 crash하지 않도록
 * 모든 필드를 스키마에 맞게 보정한다. (배열 → [], 누락 문자열 → 안전한 기본값)
 */
const normalizeAnalysis = (raw: any, location: string, symptom: string): AIRepairAnalysis => {
  const loc = location || '실내';
  const sym = symptom || '문제';
  const structured = raw?.requestDraft?.structured ?? {};

  return {
    status: raw?.status === 'REJECTED' ? 'REJECTED' : 'SUCCESS',
    rejection_reason: typeof raw?.rejection_reason === 'string' && raw.rejection_reason
      ? raw.rejection_reason
      : undefined,
    problemCandidate: normalizeAiText(raw?.problemCandidate) || `${loc} ${sym} 전문가 확인 필요`,
    tradeCategory: raw?.tradeCategory || '기타 생활시공',
    confidence: asLevel(raw?.confidence, '낮음'),
    visibleEvidence: asStringArray(raw?.visibleEvidence, 4),
    uncertainty: asStringArray(raw?.uncertainty, 3),
    riskLevel: asLevel(raw?.riskLevel, '보통'),
    visitRequired: typeof raw?.visitRequired === 'boolean' ? raw.visitRequired : true,
    costSense: normalizeAiText(raw?.costSense) || '전문가 확인 후 안내',
    actionRecommendation: normalizeAiText(raw?.actionRecommendation) || '전문가 현장 확인 요청',
    selfCheckGuide: {
      available: raw?.selfCheckGuide?.available === true,
      steps: asStringArray(raw?.selfCheckGuide?.steps, 3),
      doNotAttemptIf: asStringArray(raw?.selfCheckGuide?.doNotAttemptIf, 3),
    },
    additionalQuestions: asStringArray(raw?.additionalQuestions, 3),
    additionalPhotosNeeded: raw?.additionalPhotosNeeded === true,
    requestDraft: {
      title: normalizeAiText(raw?.requestDraft?.title) || `${loc} ${sym} 점검/보수 요청`,
      message: raw?.requestDraft?.message
        ? limitMessage(raw.requestDraft.message)
        : `${loc}에서 ${sym} 증상이 있어 점검을 요청드립니다. 정확한 작업 범위는 확인 후 안내 부탁드립니다.`,
      structured: {
        location: structured.location || `${loc} · ${sym}`,
        symptom: structured.symptom || sym,
        suspected_issue: structured.suspected_issue || raw?.problemCandidate || '전문가 확인 필요',
        requested_work: structured.requested_work || '현장 확인 요청',
        additional_note: structured.additional_note || '',
      },
    },
    disclaimer: raw?.disclaimer || FALLBACK_DISCLAIMER,
    priceGuide: raw?.priceGuide,
  };
};

// ==========================================
// 4. 엣지케이스 처리 (Rate Limit, Timeout 등)
// ==========================================
const callGeminiWithEdgeCases = async (
  apiKey: string,
  location: string,
  symptom: string,
  imageBase64s: string[]
): Promise<AIRepairAnalysis> => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      // JSON 응답이므로 mime을 지정해 펜스/잡음 없는 순수 JSON 유도 → 파싱 안정 + 속도.
      responseMimeType: 'application/json',
      // gemini-2.5-flash는 thinking 모델이라 thinking 토큰이 maxOutputTokens에 함께 카운트된다.
      // thinking을 완전히 끄면 빠르지만 사진을 깊이 분석하지 못해 요청서가 일반론으로 흐른다.
      // 적당한 thinking 예산(512)을 주면 공종/부품을 더 정확히 좁혀 "전문가용 요청서" 품질이 올라가고,
      // maxOutputTokens는 thinking(512)+한국어 본문을 모두 담도록 넉넉히 잡아 truncation을 막는다.
      // (실측: 512예산+3072토큰 ≈ 7초, 완전한 JSON, 일반론 대비 부품·작업옵션이 구체적)
      thinkingConfig: { thinkingBudget: 512 },
      maxOutputTokens: 3072,
      temperature: 0.5,
    } as any,
  });

  const imageParts = imageBase64s
    .filter((b) => !!b)
    .map((base64) => ({
      inlineData: { data: base64, mimeType: 'image/jpeg' },
    }));

  const prompt = buildPrompt(location, symptom, imageParts.length);

  // Timeout 구현 (45초)
  const TIMEOUT_MS = 45000;
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('TIMEOUT_ERROR')), TIMEOUT_MS)
  );

  try {
    console.log(`[Gochida AI] calling Gemini API... (prompt ${PROMPT_VERSION}, images: ${imageParts.length})`);
    const result = await Promise.race([
      model.generateContent([prompt, ...imageParts]),
      timeoutPromise
    ]);

    // 방어: thinking 토큰 소진/세이프티 등으로 본문이 비거나 잘리면 파싱 전에 걸러
    // 사용자에게 모호한 파싱 오류 대신 재시도 가능한 메시지를 준다.
    const finishReason = result.response.candidates?.[0]?.finishReason;
    const rawText = result.response.text();
    console.log(`[Gochida AI] Gemini response received (finishReason=${finishReason}, len=${rawText?.length ?? 0})`);
    if (!rawText || !rawText.trim() || finishReason === 'MAX_TOKENS') {
      console.warn('[Gochida AI] empty/truncated response. finishReason:', finishReason);
      throw new Error('요청서 정리 결과가 완성되지 않았어요. 다시 시도해 주세요.');
    }
    const cleaned = stripJsonFences(rawText);

    try {
      // 누락 필드/타입 오류를 보정해 UI crash를 방지한다.
      const parsed = normalizeAnalysis(JSON.parse(cleaned), location, symptom);
      // Gemini 응답 스키마에는 priceGuide가 없으므로, 결과 화면의 참고 비용 카드가
      // 비지 않도록 위치·증상 기반 참고 시세를 보강한다. (Mock 경로와 동일하게 맞춤)
      if (parsed.status === 'SUCCESS' && !parsed.priceGuide) {
        parsed.priceGuide = getSuggestedPriceGuide(location, symptom).guide;
      }
      return parsed;
    } catch (parseError) {
      // raw response는 콘솔에만 남기고 사용자에게 노출하지 않는다.
      console.warn('[Gochida AI] JSON parse error:', parseError);
      throw new Error('요청서 정리 결과를 처리하지 못했어요. 다시 시도해 주세요.');
    }
  } catch (error: any) {
    console.warn('[Gochida AI] Gemini call failed:', error);
    // 1) Timeout 에러 처리
    if (error.message === 'TIMEOUT_ERROR') {
      throw new Error('AI 분석 응답 시간이 초과되었습니다. 다시 시도해주세요.');
    }
    // 2) 429 Rate Limit / 할당량 초과 (무료 티어 일일 한도 포함)
    //    상위(analyzeImage)에서 Mock fallback으로 처리하도록 code로 태깅해 전달한다.
    if (
      error.status === 429 ||
      (error.message && (error.message.includes('429') || error.message.toLowerCase().includes('quota')))
    ) {
      const rl: any = new Error('현재 이용량이 많아 분석이 지연되고 있습니다. (Rate Limit)');
      rl.code = 'RATE_LIMIT';
      throw rl;
    }
    // 3) 내부에서 이미 사용자용 메시지로 가공한 에러는 그대로 전달 (이중 래핑 방지)
    if (error.message && error.message.includes('요청서 정리 결과')) {
      throw error;
    }
    // 기타 에러
    throw new Error(`AI 연동 중 알 수 없는 오류가 발생했습니다: ${error.message}`);
  }
};

export const analyzeImage = async (
  location: string,
  symptom: string,
  imageBase64s: string[]
): Promise<AIRepairAnalysis> => {
  const validBase64s = (imageBase64s || []).filter(b => typeof b === 'string' && b.trim() !== '');

  console.log(`[Gochida AI] Valid image count: ${validBase64s.length}`);

  if (validBase64s.length === 0) {
    throw new Error('이미지 데이터가 없습니다.');
  }

  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim();
  const useMock = process.env.EXPO_PUBLIC_USE_MOCK_AI === 'true';

  console.log(`[Gochida AI] useMockAI: ${useMock}`);
  console.log(`[Gochida AI] hasApiKey: ${!!apiKey}`);

  // Mock 시연이 답답하지 않도록 지연을 1.2~1.8초 수준으로 줄인다.
  const MOCK_DELAY_MS = 1500;

  if (useMock) {
    console.log('[Gochida AI] Falling back to mock because EXPO_PUBLIC_USE_MOCK_AI is true.');
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
    const mockData = buildMockAnalysis(location, symptom);
    return { ...mockData, status: 'SUCCESS' } as AIRepairAnalysis;
  }

  if (!apiKey) {
    console.warn('[Gochida AI] Missing Gemini API key. Falling back to mock analysis.');
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
    const mockData = buildMockAnalysis(location, symptom);
    return { ...mockData, status: 'SUCCESS' } as AIRepairAnalysis;
  }

  try {
    return await callGeminiWithEdgeCases(apiKey, location, symptom, validBase64s);
  } catch (error: any) {
    // 무료 티어 일일 한도(20건/일) 등 할당량 초과(429)는 "오늘은 호출 불가" 상태다.
    // 이때 막다른 에러로 사용자를 멈추게 하지 않고, 사진/입력 기반 Mock 요청서로
    // graceful degradation 한다. (느려서 숨기는 게 아니라, 호출이 불가능할 때의 대체)
    if (error?.code === 'RATE_LIMIT') {
      console.warn('[Gochida AI] Gemini 할당량 초과 → Mock 요청서로 대체합니다. (무료 티어 일일 한도일 수 있음)');
      await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
      const mockData = buildMockAnalysis(location, symptom);
      return { ...mockData, status: 'SUCCESS' } as AIRepairAnalysis;
    }
    throw error;
  }
};

// ==========================================
// 5. 최소 테스트 (단위 테스트 스크립트 예제)
// ==========================================
/*
// __tests__/aiService.test.ts
import { analyzeImage } from '../services/aiService';

describe('aiService Edge Cases', () => {
  it('Mock 환경에서 딜레이 후 SUCCESS 상태의 JSON을 반환해야 한다', async () => {
    process.env.EXPO_PUBLIC_USE_MOCK_AI = 'true';
    const result = await analyzeImage('욕실', '누수', ['fake_base64']);
    expect(result.status).toBe('SUCCESS');
    expect(result.one_line_summary).toBeDefined();
  });

  it('비정상적이거나 흐린 이미지인 경우 REJECTED 상태를 반환해야 한다 (Gemini Response 흉내)', async () => {
    // Jest mock setup for GoogleGenerativeAI to return { status: 'REJECTED', rejection_reason: '...' }
    // ...
    // expect(result.status).toBe('REJECTED');
  });
});
*/
