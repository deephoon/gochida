# 🛠️ 고치다 (Gochida) v1.0.0

> **사진 한 장으로 시작하는 똑똑한 생활시공 요청 앱**
>
> "어디가 고장난 건지는 알겠는데, 이걸 뭐라고 부르고 누구한테 고쳐달라고 해야 할까?"

**고치다(Gochida)**는 일상 속에서 발생하는 다양한 집수리 및 생활시공 문제를 **Gemini 2.5 Flash** AI 기술을 활용해 쉽고 정확하게 전문가에게 전달할 수 있도록 돕는 **React Native(Expo)** 기반 모바일 애플리케이션입니다.

사용자는 문제 부위의 사진만 찍으면 AI가 **공종 분류, 위험도 평가, 비용 감각 제공, 자가 점검 가이드, 전문가용 요청서 초안**까지 한 번에 생성합니다. 전문가 입장에서도 구조화된 요청서를 받기 때문에 현장 방문 전 사전 판단이 가능해지고, 결과적으로 **사용자-전문가 간 정보 비대칭 문제를 근본적으로 해소**합니다.

---

## 📖 목차

1. [프로젝트 목적 및 배경](#-프로젝트-목적-및-배경)
2. [AX/DX 전략](#-axdx-전략)
3. [핵심 기능 상세](#-핵심-기능-상세)
4. [화면별 상세 플로우](#-화면별-상세-플로우)
5. [아키텍처 설계](#-아키텍처-설계)
6. [AI 프롬프트 엔지니어링](#-ai-프롬프트-엔지니어링)
7. [디자인 시스템](#-디자인-시스템)
8. [컴포넌트 라이브러리](#-컴포넌트-라이브러리)
9. [데이터 모델 및 타입 시스템](#-데이터-모델-및-타입-시스템)
10. [프로젝트 구조](#-프로젝트-디렉토리-구조)
11. [기술 스택](#-기술-스택)
12. [시작하기](#-시작하기-getting-started)
13. [Expo 앱 설정](#-expo-앱-설정-appjson)
14. [참고 시세 데이터](#-참고-시세-데이터)
15. [지표 및 로깅 전략](#-지표-및-로깅-전략)
16. [보안 및 주의사항](#-보안-및-주의사항)
17. [향후 개선 방향](#-향후-개선-방향-roadmap)

---

## 🎯 프로젝트 목적 및 배경

### 해결하고자 하는 문제

집이나 사무실에 수리가 필요한 상황이 발생했을 때, 일반인들은 다음과 같은 어려움을 겪습니다:

1. **용어의 장벽**: 문제의 정확한 명칭(예: "실리콘 마감 불량", "트랩 봉수 파손")을 모릅니다.
2. **공종(Trade) 분류의 어려움**: 같은 "물이 새요"라는 증상도 설비(배관), 방수, 타일 등 서로 다른 전문가가 필요할 수 있습니다.
3. **비용 감각 부재**: 합리적인 가격이 어느 정도인지 기준이 없어, 과도한 견적을 받아도 판단이 어렵습니다.
4. **위험 인지 부족**: 전기 합선이나 구조 균열 같은 고위험 상황을 자가 수리하려다 더 큰 사고로 이어지는 경우가 있습니다.

### 고치다의 해결 방식

**고치다**는 이러한 정보의 비대칭성과 사용자 경험의 불편함을 해소하기 위해 만들어졌습니다.

사용자가 고장 난 곳의 **사진을 찍고 간단한 위치와 증상만 선택**하면, AI가 상황을 분석하여 **전문가들이 이해하기 쉬운 형태의 요청서 초안을 자동으로 작성**해 줍니다. 나아가 자가 점검 방법과 예상 비용 감각, 위험성 여부를 사전에 안내하여 사용자가 안심하고 수리 요청을 진행할 수 있도록 돕습니다.

---

## 🚀 AX/DX 전략

> **"단순한 AI 진단 기능을 넘어, 홈 케어 시장의 서비스 운영을 자동화하는(AX) 매치메이킹 엔진"**

### DX (디지털 전환)
전화와 구두 설명에 의존하던 **파편화된 수리 요청 과정**을 정형화된 디지털 데이터(구조화된 JSON 요청서, Base64 사진 데이터)로 변환합니다.

### AX (인공지능 전환)
단순한 '초안 작성'을 넘어, AI가 다음 세 가지를 자동으로 수행합니다:

| AX 기능 | 설명 | 구현 방식 |
|---|---|---|
| **CS 필터링** | 수리 불가/생활시공 무관 요청 자동 차단 | `status: 'REJECTED'` + `rejection_reason` 반환 |
| **공종 자동 분류 및 라우팅** | 사진 기반으로 필요한 전문가 유형 자동 매칭 | `tradeCategory` 필드로 공종 분류 |
| **위험도 기반 우선순위 판단** | 고위험 작업 식별 및 자가 수리 차단 | `riskLevel`, `doNotAttemptIf` 필드 |

---

## ✨ 핵심 기능 상세

### 1. 간편한 문제 접수 (사진 기반) — `upload.tsx`

#### 이미지 업로드 시스템
- **최대 3장 다각도 사진 첨부**: `expo-image-picker`를 활용하여 갤러리에서 이미지를 선택합니다.
- **Base64 인코딩 동시 수행**: 사진 선택 시 `base64: true` 옵션으로 URI와 Base64 데이터를 동시에 획득하여, 별도의 인코딩 단계 없이 즉시 AI API에 전달 가능합니다.
- **다중 선택 지원**: `allowsMultipleSelection: true`로 한 번에 여러 장을 선택할 수 있으며, 남은 슬롯 수만큼만 선택을 허용합니다 (`selectionLimit: 3 - imageUris.length`).
- **이미지 품질 최적화**: `quality: 0.7`로 압축하여 API 전송 용량을 줄이면서도 분석에 충분한 화질을 유지합니다.
- **개별 삭제**: 각 썸네일(100×100px, borderRadius 14px)의 우상단에 반투명 검정 원형 버튼(×)으로 개별 삭제가 가능합니다.
- **권한 관리**: 갤러리 접근 권한을 사전에 요청하며, 거부 시 안내 Alert를 표시합니다.

#### 위치 선택 (Chip)
사전 정의된 7가지 위치 옵션을 `Chip` 컴포넌트로 제공합니다:
```
거실 | 주방 | 욕실 | 침실 | 베란다 | 현관 | 기타
```

#### 증상 선택 (Chip)
사전 정의된 6가지 증상 옵션을 `Chip` 컴포넌트로 제공합니다:
```
파손/고장 | 소음 | 누수 | 작동 불량 | 악취 | 기타
```

#### 진행 상태 및 유효성 검증
- `StepIndicator` 컴포넌트가 현재 단계(1/2)를 프로그레스 바로 시각화합니다.
- 3가지 항목(사진, 위치, 증상) 중 미완료 항목 수를 하단 헬퍼 텍스트로 안내합니다: `"2개 항목을 완료하면 분석을 시작할 수 있어요"`.
- 모든 항목이 완료되어야 "AI 분석 시작" 버튼이 활성화됩니다 (`disabled={!canProceed}`).

---

### 2. AI 스마트 진단 (Gemini 2.5 Flash) — `aiService.ts`

#### 멀티모달 입력 처리
- 사용자가 업로드한 **사진(Base64, JPEG MIME)과 텍스트(위치·증상)**를 하나의 프롬프트로 합쳐 Gemini API에 전송합니다.
- 이미지는 `inlineData` 형태(`{ data: base64, mimeType: 'image/jpeg' }`)로 `imageParts` 배열에 담기며, 빈 문자열은 자동 필터링됩니다.

#### AI가 반환하는 분석 항목 (13개 필드)

| 필드 | 타입 | 설명 | 예시 |
|---|---|---|---|
| `status` | `"SUCCESS" \| "REJECTED"` | 분석 성공/거부 여부 | `"SUCCESS"` |
| `rejection_reason` | `string?` | 거부 사유 (status가 REJECTED일 때만) | `"생활시공과 무관한 사진입니다"` |
| `problemCandidate` | `string` | 의심되는 문제 명칭 | `"방충망 망 손상 또는 프레임 변형 의심"` |
| `tradeCategory` | `string` | 매칭되는 공종 분류 | `"방충망/창호"` |
| `confidence` | `"낮음" \| "보통" \| "높음"` | 분석 신뢰도 | `"보통"` |
| `visibleEvidence` | `string[]` | 사진에서 확인된 구체적 근거 | `["망 일부에 찢어짐 또는 늘어짐으로 보이는 흔적"]` |
| `uncertainty` | `string[]` | 사진만으로 판단 불가능한 부분 | `["프레임 내부 휘어짐 여부는 사진만으로 단정 어려움"]` |
| `riskLevel` | `"낮음" \| "보통" \| "높음"` | 위험도 수준 | `"낮음"` |
| `visitRequired` | `boolean` | 현장 방문 필수 여부 | `true` |
| `costSense` | `string` | 예상 비용 감각 (확정 금액 아님) | `"소규모 작업 가능성"` |
| `actionRecommendation` | `string` | 추천 작업 방향 | `"망 부분 교체 또는 프레임 포함 부분 교체"` |
| `selfCheckGuide` | `object` | 자가 점검 가이드 | 아래 상세 |
| `requestDraft` | `object` | 전문가용 요청서 초안 | 아래 상세 |

**`selfCheckGuide` 구조:**
```typescript
{
  available: boolean;          // 자가 점검 가능 여부
  steps: string[];             // 안전하게 확인할 수 있는 단계들
  doNotAttemptIf: string[];    // 직접 시도해서는 안 되는 상황
}
```

**`requestDraft` 구조:**
```typescript
{
  title: string;       // 요청서 제목 (예: "베란다 파손/고장 점검/보수 요청")
  message: string;     // 전문가에게 보내는 전체 메시지
  structured: {
    location: string;         // 문제 위치
    symptom: string;          // 증상
    suspected_issue: string;  // 의심 원인
    requested_work: string;   // 요청 작업
    additional_note: string;  // 추가 메모
  }
}
```

#### 엣지케이스 처리 (Resilience)

| 시나리오 | 처리 방식 | 사용자 화면 반응 |
|---|---|---|
| **정상 분석 (SUCCESS)** | `AIRepairAnalysis` 객체 반환 | 분석 결과 리포트 표시 |
| **사진 판독 불가 (REJECTED)** | `status: 'REJECTED'` + `rejection_reason` 반환 | 에러 화면 + "사진 다시 올리기" 버튼 |
| **API 타임아웃 (45초 초과)** | `Promise.race`로 45초 제한, 초과 시 `Error('TIMEOUT_ERROR')` throw | 에러 화면 + "다시 분석 시도하기" 버튼 |
| **Rate Limit (HTTP 429)** | `error.status === 429` 또는 메시지에 `'429'` 포함 시 감지 | 에러 화면 + "다시 분석 시도하기" 버튼 |
| **기타 네트워크 오류** | 범용 catch로 `error.message` 전달 | 에러 화면 + "직접 요청서 작성하기" 바로가기 |
| **API 키 없음** | Mock 모드로 자동 전환 | 정상 동작 (Mock 데이터) |
| **JSON 파싱 방어** | `stripJsonFences()`: ` ```json ` 마크다운 펜스 자동 제거 후 파싱 | 투명하게 처리 |

---

### 3. 분석 결과 리포트 — `analysis.tsx`

분석 화면은 **3가지 상태(로딩/에러/성공)**에 따라 완전히 다른 UI를 렌더링합니다.

#### 3-1. 로딩 상태 (isLoading === true)
```
┌──────────────────────────────────────┐
│  요청서를 정리하고 있어요              │
│  사진 속 문제 범위와 필요한 공종을      │
│  확인 중입니다. 보통 10초 안에 끝나요.  │
│                                      │
│  ░░░░░░░░░░░░░  (Skeleton 60%)       │
│  ░░░░░░░░░░░░░░░░░░  (Skeleton 90%) │
│  ░░░░░░░░░░░░░░░  (Skeleton 80%)    │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 방충망/창호 · 참고 시세        │  │
│  │ 약 5만 ~ 15만 원              │  │
│  │ ───────────────────           │  │
│  │ 가격 변동 요인                 │  │
│  │ 알루미늄 vs 미세방충망 · ...    │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

- **Skeleton UI**: 3줄의 애니메이션 스켈레톤(opacity 0.5↔1.0 반복, 700ms 주기)으로 로딩 중임을 시각적으로 안내합니다.
- **참고 시세 카드**: `getSuggestedPriceGuide(location, symptom)` 함수가 사용자가 선택한 위치/증상 조합에 가장 적합한 시세 데이터를 휴리스틱으로 매칭하여 표시합니다. 매칭 규칙이 없으면 7가지 시세 중 무작위로 표시하여 로딩 대기 시간의 지루함을 줄입니다.

#### 3-2. 에러/거부 상태

```
┌──────────────────────────────────────┐
│            ┌───┐                     │
│            │ ! │  (Warning Circle)    │
│            └───┘                     │
│     분석을 완료하지 못했어요            │
│     [에러/거부 사유 표시]              │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  다시 분석 시도하기 (outline)   │  │
│  │  또는 사진 다시 올리기          │  │
│  ├────────────────────────────────┤  │
│  │  직접 요청서 작성하기 (primary) │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

- 에러 메시지에 '초과', '오류', '지연' 키워드가 포함되면 → **"다시 분석 시도하기"** 버튼 (네트워크/타임아웃 오류)
- 그 외(사진 문제, REJECTED) → **"사진 다시 올리기"** 버튼 (`router.replace('/upload')`)
- 모든 경우 → **"직접 요청서 작성하기"** 버튼으로 AI 없이도 요청서 작성 가능

#### 3-3. 성공 상태

```
┌──────────────────────────────────────┐
│  AI 분석 완료                         │
│  방충망 망 손상 또는 프레임 변형 의심    │
│  [방충망/창호] [방문 확인 필요] [보통]   │
│                                      │
│  ── 확인된 근거 ─────────────────     │
│  • 망 일부에 찢어짐...                │
│  • 프레임 모서리 정렬이...             │
│                                      │
│  ── 추가 확인이 필요한 부분 ────────   │
│  • 프레임 내부 휘어짐 여부는...        │
│                                      │
│  ── 추천 작업 방향 ─────────────      │
│  망 부분 교체 또는 프레임 포함 부분 교체 │
│  예상 비용 감각    소규모 작업 가능성    │
│                                      │
│  사진 기반 1차 분석 결과이며...         │
│ ┌────────────────────────────────┐   │
│ │       요청서 확인하기            │   │
│ └────────────────────────────────┘   │
└──────────────────────────────────────┘
```

- **Eyebrow 텍스트**: "AI 분석 완료"를 Primary 색상(#3D5AFE)으로 표시
- **Badge Row**: 공종(`primary`), 방문필요 여부(`warning`), 신뢰도(`neutral`) 최대 3개 Badge
- **Section 구분**: 점선 상단 border로 구분된 정보 섹션
- **Bullet Line**: 확인된 근거는 검은 점, 불확실 항목은 회색(muted) 점으로 차별화
- **Key-Value Row**: 예상 비용 감각을 라벨/값 쌍으로 표시
- **면책문구**: 중앙 정렬로 "사진 기반 1차 분석 결과이며..."

---

### 4. 요청서 검토 및 전송 — `request-review.tsx`

#### 자동 생성된 요청서 카드
AI의 `requestDraft.structured` 데이터를 기반으로 **3개 행의 Key-Value 카드**로 표시합니다:

| 라벨 | 값 예시 |
|---|---|
| 문제 위치 | `베란다 · 파손/고장` |
| 의심 원인 | `방충망 망 손상 또는 프레임 변형 의심` |
| 요청 작업 | `망 부분 교체 또는 프레임 포함 부분 교체` |

- AI 분석 결과가 없을 경우(직접 작성 모드), fallback 값으로 "직접 확인 필요" / "전문가 상담 후 결정"이 표시됩니다.

#### 추가 메모 입력
- **Floating Label** 방식으로 "전문가에게 추가로 전하고 싶은 말" 제목과 "방문 가능 시간이나 상황 설명을 남겨주세요" 힌트를 제공합니다.
- `TextInput`은 `multiline` + `minHeight: 120px`로 충분한 입력 공간을 제공합니다.
- 배경은 `surfaceMuted(#F7F8FA)`로 입력 영역을 시각적으로 구분합니다.
- iOS에서 `KeyboardAvoidingView`(`behavior: 'padding'`)로 키보드가 입력란을 가리지 않도록 처리합니다.

#### StepIndicator
- **2/2 단계**: 프로그레스 바가 100% 채워져 마지막 단계임을 시각적으로 안내합니다.

#### 면책 문구
> "AI가 사진과 입력 정보를 바탕으로 작성한 초안입니다. 최종 작업 범위와 비용은 전문가 상담 후 결정됩니다."

---

### 5. 전문가 응답 목록 비교 — `expert-responses.tsx`

#### 로딩 상태
- "응답을 모으는 중" 제목 + "믿을 수 있는 전문가 3-5명에게 요청을 보내고 있어요" 서브타이틀
- 3개의 Skeleton 카드(이름 40%, 설명 60%, 본문 100%/80%)와 하단 ActivityIndicator로 대기 상태를 표현합니다.

#### 응답 목록 (성공 상태)
전문가 카드에는 다음 정보가 구조화되어 표시됩니다:

```
┌────────────────────────────────────────┐
│  김반장 홈케어           [안심 보증서]   │
│  ★ 4.8 · 부분 교체                     │
│                                        │
│  비용 감각     방문                      │
│  소규모 작업   사진으로 가능             │
│  ──────────────────────────────────    │
│  "사진상 망만 찢어진 것으로 보여          │
│   현장에서 바로 부분 교체 가능합니다."    │
│                          상세 보기 →     │
└────────────────────────────────────────┘
```

**카드에 표시되는 정보:**

| 항목 | 소스 필드 | 설명 |
|---|---|---|
| 전문가 이름 | `expertName` | 상호명 |
| 별점 | `rating` | 5점 만점 |
| 작업 방식 | `workType` | 부분 교체 / 전체 교체 / 추가 점검 |
| 보증서 | `warranty.type` | 안심 보증서(success) / 작업 확인서(success) / 없음 |
| 비용 감각 | `costLevel` | 소규모 / 중간 수준 / 현장 확인 후 확정 |
| 방문 여부 | `visitRequired` | 현장 확인 필수 / 사진으로 가능 |
| 코멘트 | `comment` | 전문가 소견 (최대 2줄, `numberOfLines={2}`) |

#### 네비게이션 특이사항
- `expert-responses` 화면에서 뒤로가기 버튼이 제거되어 있습니다 (`headerLeft: () => null`). 요청 전송 후 이전 단계로의 실수 복귀를 방지합니다.

---

### 6. 전문가 상세 페이지 — `expert/[id].tsx`

동적 라우팅(`useLocalSearchParams`)으로 선택한 전문가의 상세 정보를 표시합니다.

#### 로딩 → 에러 → 데이터 표시 (3단 상태 관리)
- `useEffect` 내에서 `cancelled` 플래그를 활용한 **클린업 패턴**으로 컴포넌트 언마운트 시 상태 업데이트를 방지합니다.

#### 상세 정보 테이블

| 항목 | 표시 내용 |
|---|---|
| 가능 여부 | `가능` (초록) / `불가` (빨강) / `현장 확인 필요` (주황) — `getAvailableColor()` 유틸리티 함수로 색상 결정 |
| 사전 방문 | 방문 확인 필요 / 방문 없이 바로 시공 |
| 작업 방식 | 부분 교체 / 전체 교체 / 추가 점검 |
| 예상 비용 | 소규모 작업 / 중간 수준 / 현장 확인 후 확정 |
| 가능 일정 | 내일 오전 / 모레 오후 / 이번 주 주말 등 |

- **상담하기 CTA**: "이 전문가와 상담하기" 버튼은 현재 MVP 범위 밖으로, Alert로 안내합니다.

---

### 7. Mock / 데모 환경 지원

#### Fallback 아키텍처

```
analyzeImage() 호출
  ├─ EXPO_PUBLIC_USE_MOCK_AI === 'true' ?
  │    └─ YES → 2초 딜레이 후 buildMockAnalysis(location, symptom) 반환
  │
  ├─ EXPO_PUBLIC_GEMINI_API_KEY 존재?
  │    └─ NO → 위와 동일하게 Mock 모드로 자동 전환
  │
  └─ 둘 다 아니면 → 실제 Gemini API 호출
```

- **Mock 데이터 내용**: 방충망/창호 공종의 표준 분석 결과를 반환하며, `location`과 `symptom` 파라미터를 `requestDraft`의 제목과 메시지에 동적으로 삽입합니다.
- **전문가 목록 Mock**: 3명의 가상 전문가(김반장 홈케어 ★4.8, 꼼꼼시공 이기사 ★4.9, 뚝딱뚝딱 만물상 ★4.5)가 각각 다른 작업 방식, 비용 수준, 보증서 유형으로 응답합니다.
- **네트워크 지연 시뮬레이션**: `expertService`는 전체 목록 1초, 상세 0.5초, 요청 제출 1.5초의 지연을 시뮬레이션합니다.

---

## 📱 화면별 상세 플로우

```
[홈] index.tsx
  │ SafeAreaView 래핑
  │ "AI 생활시공 어시스턴트" eyebrow 텍스트
  │ "고치다" 로고 (38px, weight 800)
  │ 3단계 가이드 (번호 원형 아이콘 + 제목 + 설명):
  │   ① 문제 사진 찍기 — "거실, 욕실, 어디든 한 장이면 OK"
  │   ② AI가 진단 — "공종 분류와 예상 비용까지 자동"
  │   ③ 전문가 응답 비교 — "검증된 시공자 견적을 한 번에"
  │ "사진으로 시작하기" CTA 버튼
  │ "30초면 충분해요" 하단 안내
  │
  ↓ 버튼 탭 (clearRequest() 호출 → 상태 초기화 후 이동)
  │
[업로드] upload.tsx
  │ StepIndicator: "요청서 작성" (1/2)
  │ 사진 갤러리 (최대 3장, 100×100px 타일)
  │ 위치 Chip 7종
  │ 증상 Chip 6종
  │ 유효성 검사 → canProceed 판단
  │
  ↓ "AI 분석 시작" 버튼 (setAnalysisResult(null) → router.push('/analysis'))
  │
[AI 분석] analysis.tsx
  │ useEffect에서 자동으로 submitAnalysis() 호출
  │ (analysisResult 없고, isLoading 아니고, error 없을 때만)
  │
  ├─ [로딩] Skeleton 3줄 + 참고 시세 카드
  ├─ [에러/REJECTED] 에러 원 + 사유 + 재시도/재업로드/직접작성 버튼
  └─ [성공] 분석 결과 리포트 (Badge + Section + BulletLine + KV Row)
       │
       ↓ "요청서 확인하기" 버튼
       │
[요청서 검토] request-review.tsx
  │ StepIndicator: "요청서 검토" (2/2)
  │ 자동 생성된 KV 카드 (위치, 의심 원인, 요청 작업)
  │ 추가 메모 TextInput
  │ 면책 문구
  │
  ↓ "이대로 전문가에게 요청하기" 버튼
  │
[전문가 응답] expert-responses.tsx
  │ headerLeft: null (뒤로가기 차단)
  │ 전문가 3건 카드 목록
  │
  ↓ 카드 탭 → router.push(`/expert/${expert.id}`)
  │
[전문가 상세] expert/[id].tsx
  │ 전문가 소견 + 5개 상세 행 (가능여부/방문/작업/비용/일정)
  │ "이 전문가와 상담하기" 버튼 (MVP 범위 외 Alert)
```

---

## 🏗️ 아키텍처 설계

### 전체 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                        View Layer                            │
│  ┌──────┐ ┌────────┐ ┌──────────┐ ┌───────────┐ ┌────────┐ │
│  │index │ │upload  │ │analysis  │ │request-   │ │expert- │ │
│  │.tsx  │ │.tsx    │ │.tsx      │ │review.tsx │ │resp.tsx│ │
│  └──┬───┘ └───┬────┘ └────┬─────┘ └─────┬─────┘ └───┬────┘ │
│     │         │           │              │            │      │
│     └─────────┴─────┬─────┴──────────────┴────────────┘      │
│                     │                                        │
│              ┌──────┴──────┐                                 │
│              │ useRequest()│ ← Custom Hook                   │
│              └──────┬──────┘                                 │
│                     │                                        │
├─────────────────────┼────────────────────────────────────────┤
│              State Layer │                                   │
│              ┌──────┴──────────────┐                         │
│              │ RequestContext.tsx   │                         │
│              │ ┌─────────────────┐ │                         │
│              │ │ imageUris       │ │                         │
│              │ │ imageBase64s    │ │                         │
│              │ │ location        │ │                         │
│              │ │ symptom         │ │                         │
│              │ │ analysisResult  │ │                         │
│              │ │ draftText       │ │                         │
│              │ │ isLoading       │ │                         │
│              │ │ error           │ │                         │
│              │ ├─────────────────┤ │                         │
│              │ │ submitAnalysis()│ │ ← State + Service 연결  │
│              │ │ clearRequest()  │ │                         │
│              │ └─────────────────┘ │                         │
│              └─────────┬───────────┘                         │
│                        │                                     │
├────────────────────────┼─────────────────────────────────────┤
│              Service Layer                                   │
│    ┌───────────┴────────────┐                                │
│    │                        │                                │
│    ▼                        ▼                                │
│  ┌──────────────┐  ┌─────────────────┐                      │
│  │aiService.ts  │  │expertService.ts │                      │
│  │- analyzeImage│  │- submitRequest  │                      │
│  │- buildPrompt │  │- fetchResponses │                      │
│  │- callGemini  │  │- fetchDetail    │                      │
│  └───────┬──────┘  └────────┬────────┘                      │
│          │                  │                                │
├──────────┼──────────────────┼────────────────────────────────┤
│   Data Layer                │                                │
│    ┌─────┴───────┐   ┌─────┴──────┐                         │
│    │Gemini API   │   │mockData.ts │                         │
│    │(External)   │   │priceGuides │                         │
│    └─────────────┘   └────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

### 상태 흐름 시퀀스 (submitAnalysis)

```
upload.tsx                RequestContext              aiService.ts              Gemini API
    │                         │                          │                         │
    │ ── handleNext() ──────→ │                          │                         │
    │                         │                          │                         │
    │ (router.push)           │                          │                         │
    │                         │                          │                         │
analysis.tsx                  │                          │                         │
    │                         │                          │                         │
    │ ── useEffect ─────────→ │                          │                         │
    │    submitAnalysis()     │                          │                         │
    │                         │ ─ setIsLoading(true) ──→ │                         │
    │                         │ ─ setError(null) ──────→ │                         │
    │                         │                          │                         │
    │                         │ ── analyzeImage() ─────→ │                         │
    │                         │                          │ ─ Check Mock? ────────→ │
    │                         │                          │   ├─ YES: delay 2s      │
    │                         │                          │   │  return mock        │
    │                         │                          │   └─ NO: buildPrompt()  │
    │                         │                          │        + imageParts      │
    │                         │                          │        Promise.race()   │
    │                         │                          │ ──────────────────────→ │
    │                         │                          │ ←── JSON response ───── │
    │                         │                          │   stripJsonFences()     │
    │                         │                          │   JSON.parse()          │
    │                         │ ←── AIRepairAnalysis ─── │                         │
    │                         │                          │                         │
    │                         │ ─ if REJECTED:            │                         │
    │                         │     setError(reason)      │                         │
    │                         │ ─ if SUCCESS:             │                         │
    │                         │     setAnalysisResult()   │                         │
    │                         │ ─ setIsLoading(false) ──→ │                         │
    │ ←── re-render ───────── │                          │                         │
```

### 관심사 분리 (Separation of Concerns) 상세

| 레이어 | 파일 | 책임 | 상태 보유 | 외부 의존성 |
|---|---|---|---|---|
| **View** | `index.tsx`, `upload.tsx`, `analysis.tsx`, `request-review.tsx`, `expert-responses.tsx`, `expert/[id].tsx` | UI 렌더링, 사용자 인터랙션 처리, 네비게이션 | 지역 UI 상태만 | `useRequest()`, `expo-router` |
| **State** | `RequestContext.tsx` | 전역 상태 관리, 서비스 호출 위임, 상태 전환(로딩/에러/완료) | 8개 전역 상태 + 2개 액션 | `analyzeImage()` |
| **Service** | `aiService.ts`, `expertService.ts` | AI API 통신, 프롬프트 생성, 타임아웃·에러 처리, Mock 전환 | 없음 (Stateless, 순수 함수) | `@google/generative-ai`, Mock 데이터 |
| **Data** | `mockData.ts`, `repairPriceGuides.ts` | 정적 데이터 소스 | 없음 (정적 상수) | 없음 |
| **Theme** | `theme/index.ts` | 디자인 토큰 (색상, 타이포, 간격, radius) | 없음 (`as const`) | 없음 |
| **Types** | `types/index.ts` | 공유 TypeScript 인터페이스 | 없음 | 없음 |
| **Utils** | `utils/expertDisplay.ts` | 표현 로직 유틸리티 | 없음 | `theme` |
| **Layout** | `_layout.tsx` | Stack 네비게이터 설정, RequestProvider 주입, 화면별 헤더 옵션 | 없음 | `expo-router`, `RequestContext` |

---

## 🤖 AI 프롬프트 엔지니어링

### 프롬프트 전문 (`buildPrompt` 함수)

```
너는 대한민국 주거 환경의 생활시공 요청을 전문가에게 전달하기 쉽게 정리하는 
AI 요청서 작성 보조자다.

사용자 입력:
- 위치: ${location}
- 증상: ${symptom}

판단 규칙:
1. 사진이 지나치게 흐리거나, 주거/생활시공과 전혀 무관한 사진일 경우 
   분석을 거부하고 `status`를 "REJECTED"로 설정한 뒤 
   `rejection_reason`을 상세히 적어라.
2. 정상적인 사진이라면 `status`를 "SUCCESS"로 설정하고 
   아래 필드들을 모두 채워라.
3. 사진에서 보이는 내용만 근거로 삼고, 
   보이지 않는 부분은 불확실하다고 표시한다.
4. 전기, 누수, 배관, 구조 균열 등은 고위험으로 판단하여 
   자가 수리를 권장하지 않는다.
5. 반드시 순수한 JSON 문자열로만 반환한다. 
   마크다운(```json) 등 부가적인 설명은 절대 포함하지 마라.

반환 JSON 스키마:
{ ... (13개 필드 정의) }
```

### 프롬프트 설계 원칙

| 원칙 | 설명 | 적용 위치 |
|---|---|---|
| **역할 지정 (Role Prompting)** | "AI 요청서 작성 보조자"로 구체적 역할 부여 | 프롬프트 첫 문장 |
| **구조화된 출력 강제** | JSON 스키마를 프롬프트에 직접 명시하여 파싱 실패 방지 | 반환 JSON 스키마 섹션 |
| **Negative Instruction** | 마크다운 펜스 사용 금지를 명시적으로 지시 | 판단 규칙 5번 |
| **근거 기반 판단** | "사진에서 보이는 내용만 근거로 삼고"로 환각(Hallucination) 방지 | 판단 규칙 3번 |
| **안전 우선 설계** | 고위험 작업에 대한 자가 수리 금지 규칙 | 판단 규칙 4번 |
| **방어적 후처리** | `stripJsonFences()`로 AI가 마크다운을 붙여도 안전하게 파싱 | `aiService.ts` 89행 |

### API 호출 구성

```typescript
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// 이미지 파트 구성 (빈 문자열 필터링)
const imageParts = imageBase64s
  .filter((b) => !!b)
  .map((base64) => ({
    inlineData: { data: base64, mimeType: 'image/jpeg' },
  }));

// 텍스트 프롬프트 + 이미지 파트 결합 전송
const result = await Promise.race([
  model.generateContent([prompt, ...imageParts]),
  timeoutPromise  // 45초 타임아웃
]);
```

---

## 🎨 디자인 시스템

### UI/UX 디자인 철학 (Clean UI)

| 원칙 | 설명 | 구현 방식 |
|---|---|---|
| **Minimal & Professional** | 토스(Toss) 스타일의 현대적 유틸리티 앱 UI | 여백 중심 레이아웃, 비장식적 컴포넌트 |
| **낮은 인지 부하** | 복잡한 입력 폼 배제 | Chip 선택형 UI, 최소 텍스트 입력 |
| **상태 기반 피드백** | 모든 비동기 상태에 맞는 전용 UI | 로딩(Skeleton), 에러(ErrorMark), 성공(Badge) |
| **일관된 토큰 시스템** | 모든 시각 요소가 단일 출처에서 관리 | `theme/index.ts`의 Design Tokens |
| **그림자 없는 플랫 디자인** | 깔끔한 시각적 계층 구조 | `shadows.soft`가 모두 0/transparent |

### 색상 팔레트 (theme.colors)

| 토큰 | Hex 값 | 용도 | 사용 위치 |
|---|---|---|---|
| `primary` | `#3D5AFE` | 메인 강조, CTA 텍스트 | Eyebrow, Badge(primary), 시세 카드 가격 |
| `primaryLight` | `#EEF1FF` | Primary 배경 | Badge(primary) 배경 |
| `primaryDark` | `#2D44C6` | Primary 다크 변형 | 예약됨 |
| `background` | `#FFFFFF` | 전체 화면 배경 | 모든 Screen container |
| `surface` | `#FFFFFF` | 카드 표면 | Card(outlined), 상세 테이블 |
| `surfaceMuted` | `#F7F8FA` | 비활성/입력 배경 | Chip(idle), TextInput, 사진 추가 타일 |
| `textPrimary` | `#0F1115` | 주요 텍스트 + Button(primary) 배경 | 제목, 본문, CTA 버튼 배경색 |
| `textSecondary` | `#5B6470` | 보조 텍스트 | 서브타이틀, 메타 정보 |
| `textTertiary` | `#98A0AC` | 힌트, 면책문구, 비활성 | placeholder, disclaimer, 카운트 텍스트 |
| `border` | `#ECEEF1` | 카드 테두리 | Card borderColor |
| `borderStrong` | `#D9DCE2` | 강한 테두리 | Button(outline) borderColor |
| `divider` | `#F1F2F5` | 구분선 | Section divider, KV Row 구분선, Skeleton 배경 |
| `accent` | `#FFB38A` | 악센트 | 예약됨 |
| `warning` / `warningLight` | `#B7791F` / `#FEF6E5` | 경고 | Badge(warning), 에러 원형 아이콘 |
| `success` / `successLight` | `#0E8A5F` / `#E6F7EF` | 성공 | Badge(success), 전문가 가능 상태 |
| `danger` / `dangerLight` | `#D24A48` / `#FCEBEA` | 위험 | Badge(danger), 전문가 불가 상태 |

### 타이포그래피 스케일 (theme.typography)

| 토큰 | fontSize | fontWeight | lineHeight | letterSpacing | 용도 |
|---|---|---|---|---|---|
| `display` | 28px | 700 | 36px | -0.5 | 메인 타이틀 (`problemCandidate`, 전문가명) |
| `h1` | 22px | 700 | 30px | -0.3 | 화면 대제목, 에러 상태 제목 |
| `h2` | 18px | 700 | 26px | -0.2 | SectionHeader(md), 전문가명 |
| `h3` | 16px | 600 | 24px | — | SectionHeader(sm), Button 텍스트, 추가입력 라벨 |
| `body` | 15px | 400 | 22px | — | 본문 텍스트, 전문가 코멘트, KV 값 |
| `bodyStrong` | 15px | 600 | 22px | — | KV 강조 값, 별점, 전문가 상세 값 |
| `caption` | 13px | 500 | 18px | — | Chip 텍스트, 메타 정보, CTA 텍스트 |
| `small` | 12px | 500 | 16px | — | Eyebrow, Badge, 면책문구, StepIndicator, 사진 카운트 |

### 간격 (theme.spacing)

| 토큰 | 값 | 용도 |
|---|---|---|
| `xs` | 4px | 미세 간격 (카테고리-제목 사이 등) |
| `s` | 8px | 요소 간 좁은 간격 (Badge 사이, Skeleton 행 간격) |
| `m` | 12px | 기본 내부 여백, 구분선 상하 간격 |
| `l` | 20px | 페이지 패딩, 카드 패딩, 섹션 상하 여백 |
| `xl` | 28px | 큰 섹션 간격, 푸터 하단 여백 |
| `xxl` | 44px | 최대 간격 (로딩 상단 여백, 스크롤 하단 여유) |

### 테두리 반경 (theme.borderRadius)

| 토큰 | 값 | 용도 |
|---|---|---|
| `s` | 6px | Badge 모서리 |
| `m` | 10px | Button(sm) 모서리 |
| `l` | 14px | Card, Button(md), TextInput, 사진 타일 |
| `xl` | 20px | 대형 컨테이너 (예약) |
| `round` | 9999px | Chip (완전 둥근 모서리), 프로그레스 바 |

---

## 🧩 컴포넌트 라이브러리

### Badge — `components/Badge.tsx`

상태나 카테고리를 시각적으로 구분하는 소형 레이블 컴포넌트.

**Props:**
```typescript
interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  icon?: string;  // 선택적 이모지/텍스트 아이콘 (왼쪽에 표시)
}
```

**Variant 매핑:**
| variant | 배경색 | 텍스트색 | 사용 예 |
|---|---|---|---|
| `primary` | `primaryLight (#EEF1FF)` | `primary (#3D5AFE)` | 공종 분류 Badge |
| `success` | `successLight (#E6F7EF)` | `success (#0E8A5F)` | 안심 보증서, 작업 확인서 |
| `warning` | `warningLight (#FEF6E5)` | `warning (#B7791F)` | 방문 확인 필요 |
| `danger` | `dangerLight (#FCEBEA)` | `danger (#D24A48)` | 위험도 높음 |
| `neutral` | `surfaceMuted (#F7F8FA)` | `textSecondary (#5B6470)` | 신뢰도 표시 |

**스타일 특징:** paddingHorizontal 8px, paddingVertical 4px, borderRadius `s(6px)`, `alignSelf: 'flex-start'` (내용 크기에 맞게 축소)

---

### Button — `components/Button.tsx`

메인 CTA 및 보조 액션 버튼.

**Props:**
```typescript
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'md' | 'sm';
  isLoading?: boolean;        // true 시 ActivityIndicator 표시
  leftIcon?: React.ReactNode; // 왼쪽 아이콘 슬롯
}
```

**Variant 매핑:**
| variant | 배경색 | 텍스트색 | 테두리 | 용도 |
|---|---|---|---|---|
| `primary` | `textPrimary (#0F1115)` | `white (#FFFFFF)` | — | 메인 CTA (진한 검정 배경) |
| `secondary` | `surfaceMuted (#F7F8FA)` | `textPrimary` | — | 보조 액션 |
| `outline` | `surface (#FFFFFF)` | `textPrimary` | `borderStrong (#D9DCE2)` 1px | 재시도, 뒤로가기 |
| `ghost` | 투명 | `textPrimary` | — | 인라인 액션 |

**Size 매핑:**
| size | 높이 | paddingHorizontal | borderRadius |
|---|---|---|---|
| `md` (기본) | 54px | 20px | `l (14px)` |
| `sm` | 40px | 12px | `m (10px)` |

**특수 동작:**
- `disabled` 또는 `isLoading` 시 opacity 0.45 + 터치 비활성
- `isLoading` 시 variant에 따라 흰색/Primary 색 ActivityIndicator 표시
- `activeOpacity: 0.85`로 자연스러운 탭 피드백

---

### Card — `components/Card.tsx`

범용 카드 컨테이너. 터치 가능/불가능 자동 전환.

**Props:**
```typescript
interface CardProps extends ViewProps {
  onPress?: TouchableOpacityProps['onPress'];  // 있으면 TouchableOpacity, 없으면 View
  variant?: 'outlined' | 'muted';
}
```

| variant | 배경 | 테두리 | 용도 |
|---|---|---|---|
| `outlined` (기본) | `surface (#FFFFFF)` | `border (#ECEEF1)` 1px | 시세 카드, 상세 정보 카드 |
| `muted` | `surfaceMuted (#F7F8FA)` | — | 비활성/배경 카드 |

---

### Chip — `components/Chip.tsx`

위치/증상 선택용 토글 버튼.

**Props:**
```typescript
interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}
```

**상태별 스타일:**
| 상태 | 배경 | 텍스트 색 |
|---|---|---|
| `idle` (비선택) | `surfaceMuted (#F7F8FA)` | `textSecondary (#5B6470)` |
| `selected` (선택) | `textPrimary (#0F1115)` | `white (#FFFFFF)` |

**크기:** height 36px, paddingHorizontal 14px, `borderRadius: round (9999px)` (완전 둥근 pill 형태)

---

### StepIndicator — `components/StepIndicator.tsx`

현재 진행 단계를 프로그레스 바로 시각화.

**Props:**
```typescript
interface StepIndicatorProps {
  current: number;   // 현재 단계
  total: number;     // 전체 단계 수
  label?: string;    // 단계 레이블 (없으면 "단계 {current}")
}
```

**구조:**
- 상단: 3px 높이의 프로그레스 바 (`width: (current/total) * 100%`)
  - 트랙: `divider (#F1F2F5)` 배경
  - 채움: `textPrimary (#0F1115)` 배경
- 하단: 왼쪽 라벨 + 오른쪽 "1 / 2" 카운트

---

### Skeleton — `components/Skeleton.tsx`

로딩 중 콘텐츠 자리를 채우는 애니메이션 사각형.

**Props:**
```typescript
interface SkeletonProps {
  width?: number | `${number}%`;  // 기본 '100%'
  height?: number;                 // 기본 14px
  radius?: number;                 // 기본 borderRadius.s (6px)
  style?: ViewStyle;
}
```

**애니메이션:** `Animated.loop`으로 opacity 0.5 → 1.0 → 0.5를 700ms 주기로 무한 반복 (`useNativeDriver: true`로 네이티브 스레드에서 수행)

---

### LoadingPriceGuideCard — `components/LoadingPriceGuideCard.tsx`

AI 분석 로딩 중 표시되는 참고 시세 안내 카드. **3개의 서브 카드**로 구성됩니다.

**Props:**
```typescript
interface Props {
  guide: RepairPriceGuide;  // 매칭된 시세 데이터
}
```

**서브 카드 구성:**
| 카드 | 내용 |
|---|---|
| **① 시세 카드** | 공종명 → 작업명 → "평균" + 가격(24px, Primary 색, weight 800) → 참고 범위 |
| **② 변동 요인 카드** | "가격이 달라지는 이유" → 요인들(쉼표 구분) → 면책문구 |
| **③ 비교 기준 카드** | "고치다의 비교 기준" → "최저가보다 작업 범위와 사후관리 가능성을 함께 비교합니다" |

**하단 면책:** "아래 금액은 참고용 시세이며, 최종 비용은 전문가 확인 후 달라질 수 있어요." (중앙 정렬, 12px)

---

### SectionHeader — `components/SectionHeader.tsx`

섹션 제목 + 서브타이틀 컴포넌트.

**Props:**
```typescript
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  size?: 'md' | 'sm';  // md: h2(18px), sm: h3(16px)
}
```

---

## 📊 데이터 모델 및 타입 시스템

### `AIRepairAnalysis` — AI 분석 결과 인터페이스

```typescript
interface AIRepairAnalysis {
  status?: "SUCCESS" | "REJECTED";
  rejection_reason?: string;
  problemCandidate: string;
  tradeCategory: string;
  confidence: "낮음" | "보통" | "높음";
  visibleEvidence: string[];
  uncertainty: string[];
  riskLevel: "낮음" | "보통" | "높음";
  visitRequired: boolean;
  costSense: string;
  actionRecommendation: string;
  selfCheckGuide: {
    available: boolean;
    steps: string[];
    doNotAttemptIf: string[];
  };
  additionalQuestions: string[];
  additionalPhotosNeeded: boolean;
  requestDraft: {
    title: string;
    message: string;
    structured: {
      location: string;
      symptom: string;
      suspected_issue: string;
      requested_work: string;
      additional_note: string;
    };
  };
  disclaimer: string;
}
```

### `ExpertResponse` — 전문가 응답 인터페이스

```typescript
interface ExpertResponse {
  id: string;
  expertName: string;
  rating: number;
  available: boolean;
  workType: string;
  costLevel: string;
  visitRequired: boolean;
  schedule: string;
  comment: string;
  trustElements: string[];    // 신뢰 요소 (예: "작업 확인서 가능", "경력 10년 이상")
  warranty: WarrantyOption;
}
```

### `WarrantyOption` — 보증 옵션 인터페이스

```typescript
interface WarrantyOption {
  available: boolean;
  type: "작업 확인서" | "안심 보증서" | "없음";
  period: string;              // "1년", "6개월", ""
  description: string;         // 보증 설명
  includedCare: string[];      // 포함 서비스 (예: ["재시공"], ["무상 점검"])
}
```

### `RepairPriceGuide` — 참고 시세 인터페이스

```typescript
interface RepairPriceGuide {
  id: string;
  tradeCategory: string;
  title: string;
  averagePrice: string;
  priceRange: string;
  factors: string[];
  disclaimer: string;
}
```

### `RequestData` — 요청 데이터 인터페이스

```typescript
interface RequestData {
  id: string;
  imageUri: string;
  location: string;
  symptom: string;
  analysis: AIRepairAnalysis;
  draftText: string;
}
```

---

## 📁 프로젝트 디렉토리 구조

```text
gochida/
├── src/
│   ├── app/                               # Expo Router 파일 기반 라우팅
│   │   ├── _layout.tsx                    # 루트 레이아웃
│   │   │                                   - RequestProvider로 전체 앱을 감싸 전역 상태 주입
│   │   │                                   - Stack 네비게이터 설정 (헤더 스타일, 그림자 제거)
│   │   │                                   - 6개 화면 등록 (index, upload, analysis,
│   │   │                                     request-review, expert-responses, expert/[id])
│   │   │
│   │   ├── index.tsx                      # 홈 화면
│   │   │                                   - 서비스 소개 + 3단계 가이드 + "사진으로 시작하기" CTA
│   │   │                                   - SafeAreaView 래핑, headerShown: false
│   │   │
│   │   ├── upload.tsx                     # 사진 업로드 + 위치/증상 선택
│   │   │                                   - expo-image-picker (다중 선택, base64, quality 0.7)
│   │   │                                   - LOCATIONS 7종 + SYMPTOMS 6종 Chip
│   │   │                                   - 3가지 유효성 검증 → canProceed 판단
│   │   │
│   │   ├── analysis.tsx                   # AI 분석 결과 리포트
│   │   │                                   - 3단 상태 UI (로딩/에러/성공)
│   │   │                                   - 로딩: Skeleton + LoadingPriceGuideCard
│   │   │                                   - 에러: ErrorMark + 재시도/재업로드/직접작성 분기
│   │   │                                   - 성공: Badge Row + Section + BulletLine + KV Row
│   │   │
│   │   ├── request-review.tsx             # 요청서 초안 확인 및 추가 메모
│   │   │                                   - StepIndicator 2/2
│   │   │                                   - AI 자동 생성 KV 카드 (3행)
│   │   │                                   - TextInput (multiline, minHeight 120px)
│   │   │                                   - KeyboardAvoidingView (iOS padding)
│   │   │
│   │   ├── expert-responses.tsx           # 전문가 응답 목록
│   │   │                                   - headerLeft: null (뒤로가기 차단)
│   │   │                                   - 로딩: 3개 Skeleton 카드 + ActivityIndicator
│   │   │                                   - 데이터: 전문가 카드 (이름/별점/보증/비용/방문/소견)
│   │   │
│   │   └── expert/
│   │       └── [id].tsx                   # 전문가 상세 (동적 라우팅)
│   │                                       - useLocalSearchParams로 ID 수신
│   │                                       - cancelled 플래그 클린업 패턴
│   │                                       - getAvailableColor() 유틸리티로 상태 색상 결정
│   │                                       - 5개 상세 행 테이블 + 상담하기 CTA
│   │
│   ├── components/                        # 재사용 가능한 원자적 UI 컴포넌트 (8개)
│   │   ├── Badge.tsx                      # 5-variant 상태 레이블 (primary/success/warning/danger/neutral)
│   │   ├── Button.tsx                     # 4-variant CTA 버튼 (primary/secondary/outline/ghost)
│   │   ├── Card.tsx                       # 2-variant 범용 카드 (outlined/muted, 터치 자동 전환)
│   │   ├── Chip.tsx                       # 토글 선택형 Pill 버튼 (idle/selected)
│   │   ├── LoadingPriceGuideCard.tsx      # AI 로딩 중 참고 시세 카드 (3개 서브 카드)
│   │   ├── SectionHeader.tsx              # 섹션 제목 (md: h2 / sm: h3) + 서브타이틀
│   │   ├── Skeleton.tsx                   # 애니메이션 로딩 자리표시자 (opacity 펄스, 700ms)
│   │   └── StepIndicator.tsx              # 프로그레스 바 + 단계 라벨 + 카운트
│   │
│   ├── context/
│   │   └── RequestContext.tsx             # 전역 상태 관리
│   │                                       - 8개 상태: imageUris, imageBase64s, location, symptom,
│   │                                         analysisResult, draftText, isLoading, error
│   │                                       - 2개 액션: submitAnalysis(), clearRequest()
│   │                                       - useMemo로 불필요한 re-render 방지
│   │                                       - useCallback으로 함수 참조 안정화
│   │
│   ├── data/
│   │   ├── mockData.ts                    # Mock 데이터
│   │   │                                   - mockExpertResponses: 3명의 가상 전문가 응답
│   │   │                                     (김반장 홈케어 ★4.8 / 꼼꼼시공 이기사 ★4.9 /
│   │   │                                      뚝딱뚝딱 만물상 ★4.5)
│   │   │                                   - buildMockAnalysis(): 방충망/창호 기준 분석 결과 생성기
│   │   │
│   │   └── repairPriceGuides.ts           # 7개 공종별 참고 시세 데이터
│   │                                       - getSuggestedPriceGuide(): 위치+증상 → 시세 매칭 함수
│   │                                         (14가지 휴리스틱 규칙, fallback은 무작위)
│   │
│   ├── services/
│   │   ├── aiService.ts                   # AI 연동 서비스
│   │   │                                   - buildPrompt(): 프롬프트 생성 (역할+규칙+스키마)
│   │   │                                   - stripJsonFences(): JSON 마크다운 펜스 제거
│   │   │                                   - callGeminiWithEdgeCases(): API 호출 + 45초 Timeout
│   │   │                                     + 429 Rate Limit + 기타 에러 처리
│   │   │                                   - analyzeImage(): 진입점 함수 (Mock/실제 분기)
│   │   │
│   │   └── expertService.ts               # 전문가 Mock API 서비스
│   │                                       - submitRequest(): 1.5초 딜레이 시뮬레이션
│   │                                       - fetchExpertResponses(): 1초 딜레이 후 3명 반환
│   │                                       - fetchExpertResponseDetail(): 0.5초 딜레이 후 단건 반환
│   │
│   ├── theme/
│   │   └── index.ts                       # 디자인 토큰 시스템
│   │                                       - colors: 18색 팔레트 + 2개 하위호환 별칭
│   │                                       - typography: 8단계 텍스트 스케일
│   │                                       - spacing: 6단계 간격 (4~44px)
│   │                                       - borderRadius: 5단계 모서리 (6~9999px)
│   │                                       - shadows: soft (모두 0/투명 — 플랫 디자인)
│   │
│   ├── types/
│   │   └── index.ts                       # 공유 TypeScript 인터페이스 (5개)
│   │                                       - AIRepairAnalysis, ExpertResponse, WarrantyOption,
│   │                                         RepairPriceGuide, RequestData
│   │
│   └── utils/
│       └── expertDisplay.ts               # 표현 로직 유틸리티
│                                           - getAvailableColor(): 가능여부 → 색상 매핑
│                                             ('가능'/true → success, '불가'/false → danger, 그 외 → warning)
│
├── assets/                                # 정적 자원
│   └── images/                            # 아이콘, 스플래시, 파비콘
│       ├── icon.png                       # iOS 앱 아이콘
│       ├── android-icon-foreground.png    # Android 적응형 아이콘 전경
│       ├── android-icon-background.png    # Android 적응형 아이콘 배경
│       ├── android-icon-monochrome.png    # Android 단색 아이콘
│       ├── splash-icon.png                # 스플래시 화면 로고 (200px)
│       └── favicon.png                    # Web 파비콘
│
├── docs/
│   └── PRD.md                             # 제품 요구사항 정의서 (AX/DX 전략, MoSCoW, 지표)
│
├── ref/                                   # 참고 스크린샷 이미지 (8장)
│
├── app.json                               # Expo 앱 설정 (번들 ID, 권한 메시지, 플러그인)
├── tsconfig.json                          # TypeScript 설정 (strict, path alias @/*)
├── eslint.config.js                       # ESLint 설정 (expo flat config)
├── package.json                           # 의존성 및 스크립트
├── .env                                   # 환경 변수 (GEMINI_API_KEY, USE_MOCK_AI)
└── .gitignore                             # Git 제외 패턴 (node_modules, .expo, ios, android)
```

---

## 🛠️ 기술 스택

### 핵심 기술

| 분류 | 기술 | 버전 | 역할 |
|---|---|---|---|
| Framework | React Native | 0.81.5 | 크로스 플랫폼 네이티브 UI |
| Platform | Expo | ~54.0.33 | 빌드/개발 도구 체인 |
| Navigation | Expo Router | ~6.0.23 | 파일 기반 라우팅 (Stack) |
| Language | TypeScript | ~5.9.2 | 정적 타입 (strict 모드) |
| AI | @google/generative-ai | ^0.24.1 | Gemini 2.5 Flash 멀티모달 API |
| Image | expo-image-picker | ~17.0.10 | 갤러리 선택, base64 인코딩 |

### UI / 인터랙션

| 기술 | 버전 | 역할 |
|---|---|---|
| react-native-reanimated | ~4.1.1 | 네이티브 드라이버 애니메이션 (Skeleton 펄스) |
| react-native-gesture-handler | ~2.28.0 | 제스처 처리 |
| react-native-safe-area-context | ~5.6.0 | SafeAreaView (노치/홈바 대응) |
| react-native-screens | ~4.16.0 | 네이티브 화면 최적화 |

### 기타

| 기술 | 버전 | 역할 |
|---|---|---|
| expo-haptics | ~15.0.8 | 햅틱 피드백 |
| expo-splash-screen | ~31.0.13 | 스플래시 화면 |
| expo-status-bar | ~3.0.9 | 상태바 스타일 관리 |
| @expo/vector-icons | ^15.0.3 | 벡터 아이콘 |
| react-native-web | ~0.21.0 | 웹 호환 레이어 |

### 개발 도구

| 도구 | 버전 | 설정 |
|---|---|---|
| ESLint | ^9.25.0 | `eslint-config-expo/flat` + `dist/*` 무시 |
| TypeScript | ~5.9.2 | `strict: true`, 경로 별칭 `@/*` |

### 실험적 기능 (app.json)

| 기능 | 설정 | 설명 |
|---|---|---|
| `typedRoutes` | `true` | 타입 안전한 라우팅 |
| `reactCompiler` | `true` | React Compiler (자동 메모이제이션) |
| `newArchEnabled` | `true` | React Native 새 아키텍처 (Fabric + TurboModules) |

---

## 🚀 시작하기 (Getting Started)

### 사전 요구사항

- **Node.js** 18 이상
- **npm** (package-lock.json 사용)
- **Expo CLI**: `npx expo` (별도 글로벌 설치 불필요)
- **실행 환경** (하나 이상):
  - macOS: iOS 시뮬레이터 (Xcode)
  - Windows/macOS/Linux: Android 에뮬레이터 (Android Studio)
  - 실제 기기: Expo Go 앱 (iOS App Store / Google Play)

### 1. 리포지토리 클론

```bash
git clone <repository-url>
cd gochida
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래 값을 입력합니다:

```env
# Google AI Studio(https://aistudio.google.com/)에서 발급받은 Gemini API 키
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# true로 설정하면 API 호출 없이 Mock 데이터로 전체 플로우를 테스트합니다.
# API 키가 없어도 이 값이 true이면 Mock 모드로 동작합니다.
# API 키가 없고 이 값도 false이면 자동으로 Mock 모드로 전환됩니다.
EXPO_PUBLIC_USE_MOCK_AI=false
```

> 💡 **발표/데모 시**: `EXPO_PUBLIC_USE_MOCK_AI=true`로 설정하면 네트워크 연결이나 API 키 없이도 전체 UX 플로우(홈 → 업로드 → 분석 → 요청서 → 전문가 목록 → 상세)를 완벽히 시연할 수 있습니다.

### 4. 앱 실행

```bash
# Expo 개발 서버 시작
npx expo start
```

터미널에서:
- **`i`** → iOS 시뮬레이터에서 실행
- **`a`** → Android 에뮬레이터에서 실행
- **`w`** → 웹 브라우저에서 실행
- **QR 코드 스캔** → 실제 기기(Expo Go 앱)에서 실행

### 5. 플랫폼별 직접 실행

```bash
npm run ios       # iOS 시뮬레이터
npm run android   # Android 에뮬레이터
npm run web       # 웹 브라우저
```

### 6. 코드 품질 검사

```bash
npm run lint      # ESLint 실행
```

---

## 📋 Expo 앱 설정 (app.json)

| 설정 | 값 | 설명 |
|---|---|---|
| `name` / `slug` | `gochida` | 앱 이름 및 URL slug |
| `version` | `1.0.0` | 앱 버전 |
| `orientation` | `portrait` | 세로 모드 고정 |
| `scheme` | `gochida` | 딥 링크 스킴 (`gochida://`) |
| `userInterfaceStyle` | `automatic` | 시스템 다크모드 자동 따름 |
| `newArchEnabled` | `true` | React Native 새 아키텍처 활성화 |

### 권한 메시지 (한국어)

| 권한 | 메시지 |
|---|---|
| `photosPermission` | "문제 상황을 사진으로 찍어 분석하기 위해 사진 라이브러리 접근 권한이 필요합니다." |
| `cameraPermission` | "문제 상황을 사진으로 찍어 분석하기 위해 카메라 접근 권한이 필요합니다." |

### 스플래시 화면

| 설정 | 값 |
|---|---|
| `image` | `./assets/images/splash-icon.png` |
| `imageWidth` | 200px |
| `resizeMode` | `contain` |
| 라이트 모드 배경 | `#ffffff` |
| 다크 모드 배경 | `#000000` |

### Android 적응형 아이콘

| 요소 | 파일 |
|---|---|
| 배경색 | `#E6F4FE` (연한 하늘색) |
| 전경 이미지 | `android-icon-foreground.png` |
| 배경 이미지 | `android-icon-background.png` |
| 단색 이미지 | `android-icon-monochrome.png` |

---

## 💰 참고 시세 데이터

`repairPriceGuides.ts`에 정의된 7가지 공종별 참고 시세:

| # | 공종 | 대표 작업 | 평균 시세 | 가격 변동 요인 |
|---|---|---|---|---|
| 1 | 수전/위생기구 | 수전 교체 (세면대/싱크대) | 약 7만 ~ 15만 원 | 부품 포함 여부, 수전 종류, 철거 난이도 |
| 2 | 욕실 실리콘 | 욕실 실리콘 재시공 | 약 15만 ~ 25만 원 | 곰팡이 실리콘 제거, 시공 면적 |
| 3 | 방충망/창호 | 방충망 교체 | 약 5만 ~ 15만 원 | 알루미늄 vs 미세방충망, 창호 크기/개수, 틀 수리 |
| 4 | 전기/조명 | LED 조명 교체 | 약 5만 ~ 15만 원 | 조명 기구 가격, 스위치 배선, 천장 타공 |
| 5 | 누수/배관 | 하수구/싱크대 막힘 뚫음 | 약 8만 ~ 15만 원 | 관통기 vs 석션 장비, 배관 내시경 |
| 6 | 문/도어 | 경첩 및 문 손잡이 수리 | 약 5만 ~ 10만 원 | 도어락/손잡이 부품가, 문틀 뒤틀림 조정 |
| 7 | 도배/장판 | 부분 도배 | 약 20만 ~ 40만 원 | 실크 vs 합지, 벽지 철거, 곰팡이 제거 |

### 위치+증상 → 시세 매칭 규칙 (14가지 휴리스틱)

| 조건 | 매칭 시세 |
|---|---|
| 주방 + 누수 | 수전/위생기구 |
| 주방 + 파손 | 수전/위생기구 |
| 욕실 + 누수 | 수전/위생기구 |
| 욕실 + 곰팡이 | 욕실 실리콘 |
| 욕실 + 파손 | 수전/위생기구 |
| 베란다 + 파손 | 방충망/창호 |
| 거실 + 작동 불량 | 전기/조명 |
| 욕실 + 악취 | 누수/배관 |
| 주방 + 악취 | 누수/배관 |
| 방 + 파손 | 문/도어 |
| 거실 + 누수 | 도배/장판 |
| 매칭 없음 | 7가지 중 무작위 |

---

## 📈 지표 및 로깅 전략

### 정량 지표 (PRD 기반)

| 지표 | 정의 | 목표치 |
|---|---|---|
| **AI 요청서 생성 성공률** | AI 호출 대비 유효 JSON 반환 비율 | ≥ 98% |
| **API 응답 레이턴시** | Gemini 호출 ~ UI 렌더링 시간 | p50 ≤ 3초, p90 ≤ 5초 |
| **초안 무수정 통과율** | AI 초안을 한 글자도 수정하지 않고 전송한 비율 | 핵심 AX 지표 |
| **CS 자동 필터링률** | AI가 사전 차단한 부적절 요청 비율 | — |

### 정성 지표

| 지표 | 측정 방법 |
|---|---|
| 전문가 만족도 | AI 구조화 요청서에 대한 전문가 피드백 |
| 사용자 안심도 | 비용/작업 과정 불안감 감소 여부 (인앱 서베이) |

### 로깅 페이로드 설계

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
    "ai_generated_draft": "욕실 세면대 아래에서 물이...",
    "user_final_draft": "욕실 세면대 아래 배관에서 물이...",
    "edit_distance": 12
  }
}
```

---

## 🔐 보안 및 주의사항

| 항목 | 현재 상태 | 권장 개선 |
|---|---|---|
| **API 키 노출** | `EXPO_PUBLIC_*` 접두어로 클라이언트에 노출됨 | 서버 사이드 프록시를 통한 API 키 보호 |
| **이미지 데이터** | Base64로 직접 Gemini에 전달 | 민감 사진 포함 가능성 주의 |
| **AI 결과 정확도** | 1차 분석 참고용 | "최종 진단은 전문가 확인 후" 면책문구 필수 |
| **`.env` 파일** | `.gitignore`에 `.env*.local`만 등록 | `.env` 자체도 `.gitignore`에 추가 권장 |
| **Mock 데이터** | 클라이언트 코드에 포함 | 프로덕션 빌드에서 트리 셰이킹 고려 |

---

## 🗺️ 향후 개선 방향 (Roadmap)

### 🔴 Must Have (다음 단계 필수)
- [ ] Remote Config 기반 동적 프롬프트 교체 (Prompt CMS)
- [ ] 로컬 이벤트 로깅 구조 구현
- [ ] 초안 무수정 통과율(Zero-Edit Rate) 측정

### 🟡 Should Have (서비스 완성도)
- [ ] 실제 전문가 매칭 백엔드 연동
- [ ] 카메라 직접 촬영 기능 (`expo-camera`)
- [ ] 서버 사이드 AI 프록시 (API 키 보안)
- [ ] 사용자 요청 이력 관리 (마이페이지)
- [ ] 푸시 알림 (전문가 응답 수신 시)

### 🟢 Could Have (고도화)
- [ ] 사용자-전문가 인앱 채팅
- [ ] 실시간 AI 답변 스트리밍 (UX 개선)
- [ ] 전문가용 별도 대시보드 앱
- [ ] 전문가 프로필 및 포트폴리오
- [ ] A/B 테스트 기반 프롬프트 최적화

### ⚪ Won't Have (MVP 명시적 제외)
- ~~인앱 결제 및 에스크로~~ (현장 결제 유도)
- ~~AR 기반 치수 측정~~ (기술적 복잡도)
- ~~실시간 화상 진단~~ (비동기 사진 기반에 집중)

---

## 📄 라이선스

이 프로젝트는 개인 및 학습 목적으로 제작되었습니다.
# gochida
