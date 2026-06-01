# 📄 제품 요구사항 정의서 (PRD): 고치다(Gochida) AX/DX MVP

## 1. 제품 비전 및 AX/DX 전략
**"단순한 AI 진단 기능을 넘어, 홈 케어 시장의 서비스 운영을 자동화하는(AX) 매치메이킹 엔진"**

기존의 '고치다' 앱은 사용자의 사진을 바탕으로 AI가 텍스트(요청서)를 생성해주는 **기능적 AI(Functional AI)** 스코프에 머물러 있습니다. 이를 **AX/DX(AI/Digital Transformation) 관점**으로 끌어올리기 위해서는, AI가 단순한 글쓰기 보조 도구가 아닌 **운영 자동화(Operation Automation)의 핵심 엔진**으로 작동해야 합니다.

*   **DX (디지털 전환)**: 전화와 구두 설명에 의존하던 파편화된 수리 요청 과정을 정형화된 디지털 데이터(구조화된 요청서, 사진 데이터)로 변환합니다.
*   **AX (인공지능 전환)**: 단순한 '초안 작성'을 넘어, AI가 1) CS 필터링(수리 불가 항목 차단), 2) 공종 자동 분류 및 전문가 라우팅, 3) 비용/위험도 기반의 작업 우선순위 판단을 수행하여 플랫폼의 운영 비용을 제로에 가깝게 만듭니다.

---

## 2. 기능 요구사항 (MoSCoW 기반 MVP 스코프)

현재 서비스의 복잡도를 낮추고 핵심 가설(AI가 작성한 요청서가 실제 매칭 성공률을 높이는가?)을 검증하기 위해 스코프를 MVP로 축소/정의합니다.

### 🔴 Must Have (핵심 가설 검증을 위한 필수 기능)
*   **다중 이미지 및 구조화된 입력**: 최대 3장의 사진과 위치/증상 메타데이터 수집 기능.
*   **AI 진단 파이프라인 (CS 자동화)**: 단순한 텍스트 생성이 아닌, JSON 형태의 정형화된 데이터(`공종`, `위험도`, `초안`)를 반환하는 AI 연동 기능.
*   **원클릭 요청서 발행 및 검토**: AI가 생성한 요청서 초안을 사용자가 확인하고 최종 제출하는 기능.
*   **로컬 기반 로깅 (Logging)**: 프롬프트 버전에 따른 응답 데이터 및 사용자 편집 내역을 추적하기 위한 기초 로깅 구조.

### 🟡 Should Have (서비스 완성도 및 운영 개선)
*   **원격 프롬프트 동적 교체 (Prompt CMS)**: 앱 업데이트(배포) 없이 외부 설정 파일(Remote Config)에서 프롬프트를 불러와 동적으로 교체하는 기능.
*   **Mock 기반 전문가 응답 시뮬레이터**: 실제 전문가 풀을 모으기 전, 가설 검증을 위해 다양한 조건(비용, 일정 등)의 가상 전문가 응답을 뿌려주는 기능.
*   **사용자 피드백 수집 (Draft Edit Distance)**: AI 초안과 사용자가 최종 수정한 요청서 간의 차이(수정량)를 추적하는 기능.

### 🟢 Could Have (추후 고도화 시 고려)
*   사용자-전문가 간 인앱 채팅 (현재는 매칭까지만 수행)
*   실시간 AI 답변 스트리밍 (UX 개선)
*   전문가용 별도 대시보드 앱

### ⚪ Won't Have (MVP 단계에서 명시적 제외)
*   **인앱 결제 및 에스크로**: 현재는 매칭 성사에만 집중하며, 결제는 현장 결제로 유도.
*   **AR 기반 치수 측정**: 기술적 복잡도가 너무 높으므로 MVP에서 제외.
*   **실시간 화상 진단 기능**: 비동기 사진 기반 진단에 집중.

---

## 3. 지표 정의 (Metrics) 및 로깅 전략

AX/DX 성공 여부를 측정하기 위해 "기능이 동작하는가?"가 아닌, **"운영 효율이 개선되었는가?"**에 집중하여 지표를 설정합니다.

### 3.1. 정량 지표 (Quantitative Metrics)
1.  **AI 요청서 생성 성공률 (Generation Success Rate)**: AI 호출 대비 유효한 JSON 결과값을 반환한 비율 (목표: 98% 이상)
2.  **API 응답 레이턴시 (API Latency)**: Gemini API 호출부터 UI 렌더링까지의 시간 (p50: 3초 이내, p90: 5초 이내)
3.  **초안 무수정 통과율 (Zero-Edit Rate)**: AI가 작성한 초안을 사용자가 단 한 글자도 수정하지 않고 그대로 전문가에게 전송한 비율. **(가장 중요한 AX 지표 - AI의 성능과 직결)**
4.  **CS 자동 필터링률**: AI가 "전문가 불필요(자가 수리 가능)" 또는 "위험성 높음(해결 불가)"으로 판단하여 CS 인입을 사전에 차단한 비율.

### 3.2. 정성 지표 (Qualitative Metrics)
*   **전문가 만족도 (Expert Satisfaction)**: AI가 구조화한 요청서를 받은 전문가의 피드백 (기존 전화 문의 대비 정확도 및 시간 단축 여부).
*   **사용자 안심도 (User Confidence)**: 수리 요청 전후, 비용이나 작업 과정에 대한 불안감이 얼마나 감소했는지 측정(간단한 인앱 서베이 활용).

### 3.3. 로깅(Logging) 구조 및 추적 파이프라인
앱 내 동작을 추적하기 위해 다음과 같은 이벤트 로깅 페이로드를 설계합니다.
```json
{
  "event_type": "ai_request_submitted",
  "timestamp": "2026-05-11T11:45:00Z",
  "session_id": "uuid-1234",
  "metrics": {
    "latency_ms": 3200,
    "prompt_version": "v1.2-zero-shot",
    "model_name": "gemini-2.5-flash"
  },
  "data": {
    "location": "욕실",
    "symptom": "누수",
    "ai_generated_draft": "욕실 세면대 아래에서 물이 떨어집니다...",
    "user_final_draft": "욕실 세면대 아래 배관에서 물이 떨어집니다...", // 수정본 비교용
    "edit_distance": 12 // 초안 대비 텍스트 수정량 (Levenshtein distance)
  }
}
```

---

## 4. 짧은 피드백 루프: 동적 프롬프트 버전 관리 (Prompt Versioning)

AI 기능 중심 앱(AX)의 핵심은 **코드를 수정하지 않고 프롬프트 엔지니어링만으로 제품 성능을 지속적으로 개선**하는 것입니다.

### 4.1. 문제점
현재 프롬프트는 `src/services/aiService.ts` 내부에 하드코딩되어 있습니다. AI 결과물을 개선하기 위해 프롬프트를 수정할 때마다 앱을 다시 빌드하고 심사/배포를 거쳐야 하는 치명적인 병목이 존재합니다.

### 4.2. 해결 방안: Remote Config 기반 Prompt CMS
1.  **원격 저장소 활용**: Firebase Remote Config, Supabase, 또는 단순한 AWS S3(Vercel Edge Config) 등에 JSON 형태로 프롬프트를 호스팅합니다.
2.  **동적 Fetching**: 앱 실행 시(또는 `upload.tsx` 진입 시) 최신 `prompt_template`과 `prompt_version`을 비동기로 받아옵니다.
3.  **A/B 테스트 가능성**: 서버 측에서 사용자(Device ID 등)에 따라 서로 다른 프롬프트(예: v1은 간결한 버전, v2는 상세한 버전)를 내려주어 성능을 테스트합니다.

**적용 예시 (의사 코드):**
```typescript
// 이전: 하드코딩된 프롬프트
// const buildPrompt = (loc, sym) => `너는 ... ${loc} ...`;

// 개선: 원격에서 받아오는 구조
async function fetchLatestPromptConfig() {
  const config = await remoteConfig.fetch("gochida_ai_prompt");
  return {
    template: config.template, // "너는 대한민국 주거 환경의... {{location}}..."
    version: config.version    // "v2.1-detailed-cost"
  };
}

function compilePrompt(template: string, location: string, symptom: string) {
  return template
    .replace('{{location}}', location)
    .replace('{{symptom}}', symptom);
}
```
### 4.3. 운영 사이클 (The Loop)
1.  운영자가 원격 CMS에서 프롬프트를 수정 및 배포 (앱 업데이트 없음).
2.  사용자가 새로운 프롬프트(`version: v1.3`) 기반으로 초안 생성.
3.  앞서 정의한 로깅 파이프라인에서 `초안 무수정 통과율(Zero-Edit Rate)` 데이터 수집.
4.  데이터 기반으로 프롬프트 성과 평가 후 즉각 재수정.
