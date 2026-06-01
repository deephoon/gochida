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
import { buildMockAnalysis } from '../data/mockData';

// ==========================================
// 3. 주석 코드: 실제 로직 작성 및 프롬프트 정의
// ==========================================

const buildPrompt = (location: string, symptom: string) => `
너는 대한민국 주거 환경의 생활시공 요청을 전문가에게 전달하기 쉽게 정리하는 AI 요청서 작성 보조자다.

사용자 입력:
- 위치: ${location}
- 증상: ${symptom}

판단 규칙:
1. 사진이 지나치게 흐리거나, 주거/생활시공과 전혀 무관한 사진일 경우 분석을 거부하고 \`status\`를 "REJECTED"로 설정한 뒤 \`rejection_reason\`을 상세히 적어라.
2. 정상적인 사진이라면 \`status\`를 "SUCCESS"로 설정하고 아래 필드들을 모두 채워라.
3. 사진에서 보이는 내용만 근거로 삼고, 보이지 않는 부분은 불확실하다고 표시한다.
4. 전기, 누수, 배관, 구조 균열 등은 고위험으로 판단하여 자가 수리를 권장하지 않는다.
5. 반드시 순수한 JSON 문자열로만 반환한다. 마크다운(\`\`\`json) 등 부가적인 설명은 절대 포함하지 마라.

반환 JSON 스키마:
{
  "status": "SUCCESS | REJECTED",
  "rejection_reason": "",
  "problemCandidate": "",
  "tradeCategory": "",
  "confidence": "낮음 | 보통 | 높음",
  "visibleEvidence": [],
  "uncertainty": [],
  "riskLevel": "낮음 | 보통 | 높음",
  "visitRequired": true,
  "costSense": "",
  "actionRecommendation": "",
  "selfCheckGuide": {
    "available": true,
    "steps": [],
    "doNotAttemptIf": []
  },
  "additionalQuestions": [],
  "additionalPhotosNeeded": false,
  "requestDraft": {
    "title": "",
    "message": "",
    "structured": {
      "location": "",
      "symptom": "",
      "suspected_issue": "",
      "requested_work": "",
      "additional_note": ""
    }
  },
  "disclaimer": "사진 기반 1차 분석 결과이며, 최종 진단과 정확한 비용은 전문가 확인 후 달라질 수 있습니다."
}
`;

const stripJsonFences = (raw: string) =>
  raw.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();

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
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const imageParts = imageBase64s
    .filter((b) => !!b)
    .map((base64) => ({
      inlineData: { data: base64, mimeType: 'image/jpeg' },
    }));

  const prompt = buildPrompt(location, symptom);

  // Timeout 구현 (45초)
  const TIMEOUT_MS = 45000;
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('TIMEOUT_ERROR')), TIMEOUT_MS)
  );

  try {
    const result = await Promise.race([
      model.generateContent([prompt, ...imageParts]),
      timeoutPromise
    ]);

    const cleaned = stripJsonFences(result.response.text());
    const parsed = JSON.parse(cleaned) as AIRepairAnalysis;
    
    // 만약 파싱된 JSON에서 status가 REJECTED라면 서비스 레이어에서 그대로 반환 (View에서 처리)
    return parsed;
  } catch (error: any) {
    // 1) Timeout 에러 처리
    if (error.message === 'TIMEOUT_ERROR') {
      throw new Error('AI 분석 응답 시간이 초과되었습니다. 다시 시도해주세요.');
    }
    // 2) 429 Rate Limit 에러 처리 (Gemini API 에러 응답 파싱)
    if (error.status === 429 || (error.message && error.message.includes('429'))) {
      throw new Error('현재 이용량이 많아 분석이 지연되고 있습니다. 잠시 후 시도해주세요. (Rate Limit)');
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
  if (!imageBase64s || imageBase64s.length === 0) {
    throw new Error('이미지 데이터가 없습니다.');
  }

  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const useMock = process.env.EXPO_PUBLIC_USE_MOCK_AI === 'true';

  // 3. Fallback 아키텍처: EXPO_PUBLIC_USE_MOCK_AI 평가
  if (useMock || !apiKey) {
    console.log('[aiService] Mocking mode 활성화: 로컬 딜레이 2초 후 JSON 반환');
    await new Promise((r) => setTimeout(r, 2000));
    const mockData = buildMockAnalysis(location, symptom);
    return { ...mockData, status: 'SUCCESS' } as AIRepairAnalysis;
  }

  return await callGeminiWithEdgeCases(apiKey, location, symptom, imageBase64s);
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
