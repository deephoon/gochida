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

### 0. 메인 대시보드 — `index.tsx`

- **Hero CTA 배너**: "사진 한 장이면 충분해요" 메시지와 함께 매력적인 그라데이션 배너 및 중앙 집중형 FAB(Floating Action Button)을 통한 사진 업로드 유도
- **최근 요청 내역**: 진행 중이거나 완료된 내 요청 건의 응답 횟수 및 상태를 한눈에 볼 수 있는 요약 카드 제공
- **AI 요청서 미리보기**: 베란다 방충망 예시를 통해 앱의 핵심 기능인 '사진 기반 AI 분석'을 직관적으로 안내
- **참고 시공 단가**: 자주 찾는 7가지 시공 영역(수전, 실리콘, 방충망 등)의 대략적인 시세를 가로 스크롤 형태의 카드로 제공하여 기준점 제시
- **전문가 응답 비교 예시**: 작업 방식, 방문 여부 등 동일한 기준으로 여러 전문가를 비교할 수 있음을 보여주는 인터랙티브 카드 제공
- **안심 선택 기준 가이드**: 작업 전후 사진 기록, 사후 관리 등 프리미엄 보증에 대한 신뢰감을 주는 안내 가이드 포함

---

### 1. 간편한 문제 접수 (사진 기반) — `upload.tsx`

#### 이미지 업로드 시스템
- **최대 3장 다각도 사진 첨부**: `useRequestFlow`의 `addPhotos()` 함수를 통해 카메라 직접 촬영 또는 갤러리 선택을 ActionSheet로 제공합니다.
- **Base64 인코딩 동시 수행**: 사진 선택/촬영 시 `base64: true` 옵션으로 URI와 Base64 데이터를 동시에 획득하여, 별도의 인코딩 단계 없이 즉시 AI API에 전달 가능합니다.
- **페어 동기화 보장**: `imageUris`와 `imageBase64s`가 항상 동일한 길이를 유지하도록 base64가 유효한 asset만 쌍으로 추가됩니다.
- **다중 선택 지원 (갤러리)**: `allowsMultipleSelection: true`로 한 번에 여러 장을 선택할 수 있으며, 남은 슬롯 수만큼만 선택을 허용합니다 (`selectionLimit: remainingSlots`).
- **이미지 품질 최적화**: `quality: 0.7`로 압축하여 API 전송 용량을 줄이면서도 분석에 충분한 화질을 유지합니다.
- **개별 삭제**: 각 썸네일의 우상단 × 버튼으로 개별 삭제가 가능하며, `imageUris`/`imageBase64s` 두 배열을 동시에 인덱스 기준으로 필터링합니다.
- **권한 관리**: 카메라/갤러리 접근 권한을 사전에 요청하며, 거부 시 안내 Alert를 표시합니다.

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
- `StepIndicator` (upload.tsx 인라인 컴포넌트)가 현재 단계(1/2)를 타이틀 + 카운트 형태로 시각화합니다.
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
┌──────────────────────────────────────────────┐
│ ⚡ 예상 시공 비용                             │
│  소규모 작업 가능성 (부품비 제외 기준)           │
│ ──────────────────────────────────────────── │
│  방충망 망 손상 또는 프레임 변형 의심           │
│  [방충망/창호]  [방문 확인 필요]  [신뢰도: 보통]│
│                                              │
│  ┌─── 추천 조치 ──────────────────────────┐  │
│  │ 망 부분 교체 또는 프레임 포함 부분 교체 │  │
│  └────────────────────────────────────────┘  │
│  ┌─── AI 발견 사항 ───────────────────────┐  │
│  │ • 망 일부에 찢어짐 또는 늘어짐 발견     │  │
│  └────────────────────────────────────────┘  │
│  ┌─── 추가 확인 필요 (경고) ──────────────┐  │
│  │ • 프레임 내부 휘어짐 여부 확인 필요      │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  사진 기반 1차 분석 결과이며...              │
│ ┌──────────────────────────────────────────┐ │
│ │          이대로 요청서 확인하기            │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

- **Premium Brand Cost Card**: 화면 최상단에 다크 네이비 테마(`blackMuted`)와 오렌지 번개 아이콘(`accent`), `body` 폰트로 표현된 예상 비용 감각 영역이 배치됩니다.
- **Header Area**: 분석된 문제 후보명(`problemCandidate`)과 공종(`primary`), 방문 여부(`warning`), 위험도(`danger`)를 나타내는 둥근 모서리 배지(`Badge`)가 한 행에 렌더링됩니다.
- **추천 조치 / AI 발견 사항 / 추가 확인 필요 카드**: 각각 개별적인 흰색 카드(`Card`)에 담겨 섀도우가 적용되어 있으며, 테마 토큰(`theme.borderRadius.l`, `theme.spacing.l`)을 바탕으로 정밀한 레이아웃을 제공합니다.
- **면책 문구 및 CTA**: 하단에 회색 톤(`textTertiary`)으로 면책 문구가 작게 표시되며, 고정 하단에 완전 둥근 캡슐형(`theme.borderRadius.pill`) CTA 버튼인 "이대로 요청서 확인하기"가 배치됩니다.

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
┌──────────────────────────────────────────────────────────┐
│ (👤) 김반장 홈케어                          [🛡️ 안심 보증서] │
│                                                          │
│  "사진상 망만 찢어진 것으로 보여                          │
│   현장에서 바로 부분 교체 가능합니다."                      │
│                                                          │
│  ┌─── 작업 조건 안내 ──────────────────────────────────┐  │
│  │ 작업 방식: 부분 교체                                │  │
│  │ 비용 감각: 소규모 작업                              │  │
│  │ 방문 여부: 사진 기반 확인 가능                      │  │
│  │ 가능 여부: 🟢 작업 가능                              │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 상세 조건 보기                                     (>) │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**카드에 표시되는 정보 및 디자인:**

| 항목 | 소스 필드 | 설명 | 디자인 구현 |
|---|---|---|---|
| **전문가 이름** | `expertName` | 상호명 | 왼쪽 프로필 아바타(`account` 아이콘)와 함께 `h2` 굵은 텍스트로 표시 |
| **보증 배지** | `warranty.type` | 보증서 유형 | `WarrantyBadge` 컴포넌트로 안심 보증서(초록), 작업 확인서(블랙), 없음(그레이) 분기 처리 |
| **의견 코멘트** | `comment` | 전문가 소견 | `italic` 폰트와 왼쪽 보더(`borderLeftColor: theme.colors.surfaceSoft`)로 인용구처럼 표현 (최대 3줄) |
| **정보 테이블** | `infoTable` | 시공 세부 조건 | `surfaceSoft` 배경의 둥근 박스 안에 테두리가 있는 표 형태로 구조화 |
| **상세보기 푸터** | `cardFooter` | 상세 페이지 링크 | 블랙 배경(`theme.colors.black`)과 라운드 모서리를 활용한 슬릭한 캡슐 모양 버튼 |

#### 네비게이션 특이사항
- `expert-responses` 화면에서 뒤로가기 버튼이 제거되어 있습니다 (`headerLeft: () => null`). 요청 전송 후 이전 단계로의 실수 복귀를 방지합니다.

---

### 6. 전문가 상세 페이지 — `expert/[id].tsx`

동적 라우팅(`useLocalSearchParams`)으로 선택한 전문가의 상세 정보를 표시합니다.

#### 로딩 → 에러 → 데이터 표시 (3단 상태 관리)
- `useEffect` 내에서 `cancelled` 플래그를 활용한 **클린업 패턴**으로 컴포넌트 언마운트 시 상태 업데이트를 방지합니다.

#### 상세 정보 및 사후관리 구성

1. **상세 정보 테이블**
   - **작업 가능 여부**: `작업 가능`(초록) / `추가 확인 필요`(주황) / `작업 불가`(빨강) 표시
   - **작업 방식, 예상 비용, 방문 필요 여부**: 전문가 의견 카드와 함께 정밀한 라인 테이블 구조로 표시
2. **사후관리 조건 카드 (Warranty Card)**
   - **보증서 배지**: `LargeWarrantyBadge`가 제공 여부(안심 보증서/작업 확인서/없음)를 큼직하게 표시
   - **사후관리 항목**: 포함된 서비스 목록(`includedCare`)을 체크 아이콘과 함께 리스트 형태로 렌더링
   - **안내 문구**: 하단에 법적 책임 면책 문구를 둥근 안내 박스(`legalNoticeBox`)에 담아 제공
3. **상담/의뢰하기 CTA**
   - 하단 플로팅 푸터(`floatingFooter`)에 위치하며, 약간의 투명도가 있는 배경 위로 섀도우가 적용된 CTA 버튼이 제공됩니다. (MVP 범위 밖으로, 탭 시 안내 Alert 발생)

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
[Custom Tab Bar] _layout.tsx (Tabs)
  │ BlurView 기반의 반투명 플로팅 탭 바
  │ 4개의 탭 (홈, 요청, 채팅, 내 정보) 구성
  │ 중앙에 위치한 촬영용 둥근 Floating Action Button (FAB)
  │
  ├─ [홈] index.tsx (대시보드 형태의 고도화된 홈 화면)
  │   │ 상단 Hero Banner: "사진 한 장이면 충분해요" 안내 및 촬영 CTA
  │   │ 최근 요청 내역 (진행 상태 요약 카드)
  │   │ AI 요청서 미리보기 (베란다 방충망 예시)
  │   │ 참고 시공 단가 (가로 스크롤 카드)
  │   │ 전문가 응답 비교 예시 및 안심 선택(작업 확인서/보증서) 가이드
  │
  ├─ [요청] history.tsx
  │   │ 내 요청 상태 추적 (진행 중 / 완료)
  │
  ├─ [채팅] chats.tsx
  │   │ 전문가와의 상담/채팅 목록 (Mock 데이터 표시)
  │
  └─ [내 정보] profile.tsx
      │ 앱 정보, 데모 안내, 자주 묻는 질문 등 메뉴 제공

  ↓ 중앙 FAB 카메라 버튼 또는 "사진으로 시작" 탭 (상태 초기화 후 이동)
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
  ├─ [로딩] Skeleton 3줄 + 인라인 참고 시세 카드 (공종별 가격, 변동 요인, 비교 기준)
  ├─ [에러/REJECTED] 에러 원 + 사유 + 재시도/재업로드/직접작성 버튼 (StatusScreen 컴포넌트)
  └─ [성공] 고도화된 AI 분석 결과 리포트
       │ 최상단 프리미엄 디자인의 예상 비용 감각 카드 (Premium Cost Card)
       │ 문제 후보 타이틀 및 상태 배지(공종, 방문 필요, 신뢰도, 위험도)
       │ 전문가에게 전달할 요청 방향 (추천 조치)
       │ 사진에서 확인한 내용 (체크 리스트)
       │ 추가 확인이 필요한 내용 (경고 UI 리스트)
       │ 직접 확인 가이드 및 "직접 시도하지 마세요" (고위험 차단) 경고 박스
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
│              │ ┌─────────────────────┐ │                       │
│              │ │ imageUris           │ │                       │
│              │ │ imageBase64s        │ │                       │
│              │ │ location            │ │                       │
│              │ │ symptom             │ │                       │
│              │ │ aiDraft             │ │                       │
│              │ │ selectedExpertId    │ │                       │
│              │ │ analysisResult      │ │                       │
│              │ │ isLoading           │ │                       │
│              │ │ error               │ │                       │
│              │ ├─────────────────────┤ │                       │
│              │ │ setImageUris()      │ │ ← State + Service 연결│
│              │ │ setImageBase64s()   │ │                       │
│              │ │ setLocation()       │ │                       │
│              │ │ setSymptom()        │ │                       │
│              │ │ setAiDraft()        │ │                       │
│              │ │ setSelectedExpertId()│ │                      │
│              │ │ setAnalysisResult() │ │                       │
│              │ │ submitAnalysis()    │ │                       │
│              │ │ clearRequest()      │ │                       │
│              │ └─────────────────────┘ │                       │
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
| **View (Screens)** | `src/app/(tabs)/*` (index, history, chats, profile), `src/app/upload.tsx`, `src/app/analysis.tsx`, `src/app/request-review.tsx`, `src/app/expert-responses.tsx`, `src/app/expert/[id].tsx` | UI 렌더링 및 네비게이션 제어 | 없음 (비즈니스 로직은 Custom Hook에 위임) | `useRequestFlow()`, `useRequest()`, `expo-router` |
| **Hooks** | `src/hooks/useRequestFlow.ts` | 사진 촬영/앨범 선택, 햅틱(Haptics) 피드백 등 화면 비즈니스 로직 격리 | 지역 UI 보조 상태 | `ImagePicker`, `Haptics` |
| **State** | `src/context/RequestContext.tsx` | 전역 상태 관리 (요청 상태 흐름, 로딩, 에러 핸들링) | 9개 전역 상태 + 9개 액션 | `analyzeImage()` |
| **Components** | `src/components/` 산하 (Badge, Button, Card, Chip, Skeleton 등) | 재사용 가능한 아토믹 디자인 단위 UI 컴포넌트 | 자체 스타일 및 단순 프롭스 | `src/theme/` 디자인 토큰 |
| **Service** | `src/services/aiService.ts`, `src/services/expertService.ts` | AI API 통신, 프롬프트 생성, Mock API 응답 시뮬레이션 | 없음 (Stateless 순수 함수) | `@google/generative-ai` |
| **Data** | `src/data/mockData.ts`, `src/data/repairPriceGuides.ts` | 정적 상수 데이터 및 시세 휴리스틱 데이터 제공 | 없음 (정적 상수) | 없음 |
| **Theme** | `src/theme/index.ts` | 일관된 디자인 사양(Colors, Shadows, Radius 등) 관리 | 없음 (`as const`) | 없음 |
| **Types** | `src/types/index.ts` | 공유 TypeScript 모델 및 타입 정의 | 없음 | 없음 |
| **Utils** | `src/utils/expertDisplay.ts` | 상태값 조건부 색상 매핑 등 유틸리티 함수 | 없음 | `theme` |
| **Layout** | `src/app/_layout.tsx`, `src/app/(tabs)/_layout.tsx` | 전체 내비게이션 Stack 및 Tab 구조화, RequestProvider 주입 | 없음 | `expo-router` |

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

### UI/UX 디자인 철학 (Premium Clean UI)

| 원칙 | 설명 | 구현 방식 |
|---|---|---|
| **Minimal & Professional** | 토스(Toss) 및 애플(Apple) 스타일의 감각적인 유틸리티 앱 UI | 여백 중심 레이아웃, 정교한 타이포그래피, 절제된 레이아웃 |
| **낮은 인지 부하** | 복잡한 입력 양식을 배제하고 행동 유도 | Chip 토글형 UI, 라인 입력폼 및 직관적인 CTA 버튼 배치 |
| **상태 기반 피드백** | 모든 비동기 처리 및 데이터 상태에 대응 | 로딩(Skeleton, Animated Progress), 에러(Error/Rejected View), 성공(Badge, Card 리포트) |
| **일관된 토큰 시스템** | 모든 시각적 계층이 정해진 테마 토큰을 엄격하게 준수 | `src/theme/index.ts`의 타이포그래피, Spacing, Radius, Shadow 토큰 참조 |
| **계층감을 주는 섀도우** | 섀도우와 레이어링을 활용하여 플로팅 및 입체감 표현 | `theme.shadows.soft` 및 `theme.shadows.medium` 적용 |

### 색상 팔레트 (theme.colors)

| 토큰 | Hex 값 | 용도 | 사용 위치 |
|---|---|---|---|
| `primary` | `#5B6CFF` | 메인 브랜드 컬러 (Primary Blue) | 주요 CTA 버튼, 활성화된 Chip, 포인트 하이라이트 |
| `primaryLight` | `#EEF0FF` | Primary 연한 배경 | Badge(primary) 배경, 아이콘 배경 |
| `primaryDark` | `#4654D9` | Primary 다크 톤 변형 | 버튼 활성화 피드백 |
| `background` | `#F5F5F7` | 전체 화면 배경 (Cool Gray) | 모든 화면의 배경색 |
| `surface` | `#FFFFFF` | 일반 카드 및 컨텐츠 영역 표면 | Card(outlined), 내부 테이블 등 |
| `surfaceMuted` | `#F9F9F9` | 비활성 또는 서브 카드 표면 | Card(muted), 입력창 배경 등 |
| `surfaceSoft` | `#F0F0F3` | 칩 비선택 상태 배경 등 | Chip(idle), Button(secondary) |
| `white` | `#FFFFFF` | 순수 흰색 | 텍스트, 버튼 라벨, 밝은 테마 배경 |
| `black` | `#111111` | 리치 블랙 (Rich Black) | 주요 헤더 텍스트, 다크 테두리 등 |
| `blackMuted` | `#1C1C1E` | 어두운 그레이 | 프리미엄 어두운 카드 배경 등 |
| `textPrimary` | `#111111` | 주요 텍스트 색상 | 타이틀, 본문 주요 항목, 버튼 배경 |
| `textSecondary` | `#6E6E73` | 보조 텍스트 색상 (Apple-esque) | 서브타이틀, 설명 텍스트, 메타 정보 |
| `textTertiary` | `#A1A1A6` | 힌트 및 면책 문구 | placeholder, disclaimer |
| `border` | `#E5E5EA` | 기본 테두리 | Card 테두리 |
| `borderStrong` | `#D1D1D6` | 강한 테두리 | Button(outline) 테두리 |
| `divider` | `#F0F0F3` | 구분선 및 Skeleton 배경 | Section 구분선 |
| `accent` | `#FFB38A` | 악센트 컬러 (Accent Orange) | 오렌지 계열 포인트 및 번개 아이콘 등 |
| `warning` / `warningLight` | `#F5A623` / `#FFF5E5` | 경고 (Orange) | Badge(warning), 에러 상태 |
| `success` / `successLight` | `#34C759` / `#E8F8EE` | 성공 (Green) | Badge(success), 안심 보증서 |
| `danger` / `dangerLight` | `#FF3B30` / `#FFEBEA` | 위험/불가 (Red) | Badge(danger), 불가 상태 |

### 타이포그래피 스케일 (theme.typography)

| 토큰 | fontSize | fontWeight | lineHeight | letterSpacing | 용도 |
|---|---|---|---|---|---|
| `display` | 32px | 800 | 40px | -0.8 | 메인 타이틀, 대표 문제명 |
| `h1` | 24px | 700 | 32px | -0.5 | 화면 대제목, 에러 상태 제목 |
| `h2` | 20px | 700 | 28px | -0.4 | SectionHeader(md), 전문가명 |
| `h3` | 16px | 700 | 24px | -0.2 | SectionHeader(sm), Button 텍스트, 추가입력 라벨 |
| `body` | 15px | 400 | 22px | -0.1 | 본문 텍스트, 전문가 코멘트, KV 값 |
| `bodyStrong` | 15px | 600 | 22px | -0.1 | KV 강조 값, 별점, 전문가 상세 값 |
| `caption` | 13px | 500 | 18px | 0 | Chip 텍스트, 메타 정보, CTA 텍스트 |
| `small` | 12px | 500 | 16px | 0 | Eyebrow, Badge, 면책문구, StepIndicator, 사진 카운트 |

### 간격 (theme.spacing)

| 토큰 | 값 | 용도 |
|---|---|---|
| `xs` | 4px | 미세 간격 (카테고리-제목 사이 등) |
| `s` | 8px | 요소 간 좁은 간격 (Badge 사이, Skeleton 행 간격) |
| `m` | 12px | 기본 내부 여백, 구분선 상하 간격 |
| `l` | 16px | 중간 간격, 카드 패딩 |
| `xl` | 24px | 페이지 전체 패딩, 큰 카드 패딩, 넓은 여백 |
| `xxl` | 32px | 큰 섹션 간격, 넓은 레이아웃 분할 |
| `xxxl` | 48px | 최대 간격 (화면 하단 여유, 긴 스크롤 여백) |

### 테두리 반경 (theme.borderRadius)

| 토큰 | 값 | 용도 |
|---|---|---|
| `s` | 8px | Badge 모서리 |
| `m` | 12px | 보조 버튼(sm) 모서리 |
| `l` | 16px | 기본 카드(Card), 버튼(md), 텍스트 입력창 |
| `xl` | 24px | 큰 카드 모서리, 시각적으로 강조된 박스 |
| `xxl` | 32px | 매우 큰 프리미엄 카드 모서리 (예: 분석 화면의 예상 시공가 안내 카드) |
| `pill` | 9999px | Chip (완전 둥근 모서리), 햅틱 버튼, Badge(둥근형) |

### 그림자 (theme.shadows)

| 토큰 | 설정 값 | 용도 |
|---|---|---|
| `soft` | `shadowColor: '#000000'`, `offset: {0, 4}`, `opacity: 0.04`, `radius: 12`, `elevation: 2` | 플로팅 카드, 기본 칩 컴포넌트의 은은한 입체감 |
| `medium` | `shadowColor: '#000000'`, `offset: {0, 8}`, `opacity: 0.08`, `radius: 24`, `elevation: 4` | 활성화된 메인 카드, 강조 영역의 깊이감 표현 |

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
| `primary` | `primaryLight (#EEF0FF)` | `primary (#5B6CFF)` | 공종 분류 Badge |
| `success` | `successLight (#E8F8EE)` | `success (#34C759)` | 안심 보증서 상태 등 |
| `warning` | `warningLight (#FFF5E5)` | `warning (#F5A623)` | 방문 확인 필요 등 |
| `danger` | `dangerLight (#FFEBEA)` | `danger (#FF3B30)` | 위험도 높음 등 |
| `neutral` | `surfaceMuted (#F9F9F9)` | `textSecondary (#6E6E73)` | 신뢰도 표시 등 |

**스타일 특징:** paddingHorizontal 8px, paddingVertical 4px, borderRadius `s (8px)`, `alignSelf: 'flex-start'` (내용 크기에 맞게 축소)

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
| `primary` | `primary (#5B6CFF)` | `white (#FFFFFF)` | — | 메인 CTA (브랜드 컬러 배경) |
| `secondary` | `surfaceSoft (#F0F0F3)` | `textPrimary` | — | 보조 액션 |
| `outline` | `white (#FFFFFF)` | `textPrimary` | `borderStrong (#D1D1D6)` 1.5px | 재시도, 뒤로가기 |
| `ghost` | 투명 | `textPrimary` | — | 인라인 액션 |

**Size 매핑:**
| size | 높이 | paddingHorizontal | borderRadius |
|---|---|---|---|
| `md` (기본) | 56px | 24px | `pill (9999px)` |
| `sm` | 44px | 16px | `pill (9999px)` |

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
| `outlined` (기본) | `surface (#FFFFFF)` | `border (#E5E5EA)` 1px | 시세 카드, 상세 정보 카드 |
| `muted` | `surfaceMuted (#F9F9F9)` | — | 비활성/배경 카드 |

**스타일 특징:** borderRadius `l (16px)`, padding `l (16px)`, marginBottom `m (12px)`

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
| 상태 | 배경 | 텍스트 색 | 섀도우 |
|---|---|---|---|
| `idle` (비선택) | `surfaceSoft (#F0F0F3)` | `textSecondary (#6E6E73)` | 없음 |
| `selected` (선택) | `primary (#5B6CFF)` | `white (#FFFFFF)` | `primary` 테마 섀도우 + elevation 3 |

**크기:** height 40px, paddingHorizontal 18px, `borderRadius: pill (9999px)` (완전 둥근 pill 형태)

---

### StepIndicator — `upload.tsx` 인라인 컴포넌트

별도 파일 없이 `upload.tsx` 내에 인라인으로 정의된 단계 표시 컴포넌트.

**Props:**
```typescript
{ current: number; total: number; label: string }
```

**구조:**
- 왼쪽 라벨(단계명) + 오른쪽 `current / total` 카운트 (회색 슬래시 스타일)
- `h3` 타이포그래피 기반, `margin-bottom: 22px`

---

### Skeleton — `components/Skeleton.tsx`

로딩 중 콘텐츠 자리를 채우는 애니메이션 사각형.

**Props:**
```typescript
interface SkeletonProps {
  width?: number | `${number}%`;  // 기본 '100%'
  height?: number;                 // 기본 14px
  radius?: number;                 // 기본 borderRadius.s (8px)
  style?: ViewStyle;
}
```

**애니메이션:** `Animated.loop`으로 opacity 0.5 → 1.0 → 0.5를 700ms 주기로 무한 반복 (`useNativeDriver: true`로 네이티브 스레드에서 수행)

---

### TabHeader & Icon — `components/Header.tsx`, `components/Icon.tsx`

**AppHeader**: 스택 화면(upload, analysis, request-review 등)에서 뒤로가기 버튼과 함께 표시되는 헤더 컴포넌트입니다. `TabHeader`는 탭 화면 상단에 대형 타이틀과 서브타이틀을 렌더링합니다.
**Icon**: SFSymbols(`expo-symbols`) 및 `@expo/vector-icons`의 Ionicons를 래핑하여 일관된 사이즈와 색상을 주입하는 통합 아이콘 컴포넌트입니다.

---

### PressableScale — `components/ui/PressableScale.tsx`

중앙 FAB 버튼 탭 시 살짝 눌리는 듯한 스케일 축소 애니메이션(`react-native-reanimated`)을 제공하여 인터랙션 경험을 고급화하는 래퍼 컴포넌트입니다.

---

## 🪝 커스텀 훅 (Custom Hooks)

### useRequestFlow — `src/hooks/useRequestFlow.ts`

UI와 비즈니스 로직을 분리하는 핵심 커스텀 훅입니다. 홈 CTA·FAB·업로드 화면이 공유하는 사진 추가 로직(`addPhotos`)을 담당합니다. 내부적으로 카메라 직접 촬영(`takePhoto`)과 갤러리 선택(`pickFromLibrary`)을 ActionSheet로 제공하며, 최대 3장 제한과 함께 `imageUris`/`imageBase64s` 쌍이 항상 동기화되도록 보장합니다. 햅틱 피드백(`expo-haptics`)과 권한 처리도 훅 내부에서 완전히 격리합니다.

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
  priceGuide?: RepairPriceGuide;  // 로딩 중 표시될 참고 시세 (AI 응답에 포함될 수 있음)
}
```

### `ExpertResponse` — 전문가 응답 인터페이스

```typescript
interface ExpertResponse {
  id: string;
  expertName: string;
  available: boolean;
  workType: string;
  costLevel: string;
  visitRequired: boolean;
  comment: string;
  warranty: WarrantyOption;
  // 백엔드 연동 시 확장 가능한 선택 필드
  rating?: number;
  schedule?: string;
  trustElements?: string[];        // 신뢰 요소 (예: "작업 확인서 가능", "경력 10년 이상")
  responseBasis?: string;          // 응답 근거 (예: "사진 기반 확인 / 현장 실측 필요")
  recommendedReason?: string;      // 추천순 정렬 시 사용자에게 보여줄 추천 이유
}
```

### `WarrantyOption` — 보증 옵션 인터페이스

```typescript
interface WarrantyOption {
  type: "작업 확인서" | "안심 보증서" | "없음";
  includedCare: string[];          // 포함 서비스 (예: ["재시공"], ["무상 점검"])
  // 백엔드 연동 시 채워질 수 있는 선택 필드
  available?: boolean;
  period?: string;                 // "1년", "6개월", ""
  description?: string;            // 보증 설명
}
```

### `RequestCompleteness` — 요청서 완성도 인터페이스

```typescript
interface RequestCompleteness {
  score: number;
  completedItems: string[];
  missingItems: string[];
  recommendation: string;
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

### `RequestState` / `RequestData` — 요청 상태 인터페이스

```typescript
interface RequestState {
  imageUris: string[];
  imageBase64s: string[];
  location: string;
  symptom: string;
  aiDraft: string;              // AI가 생성한 요청서 메시지 (사용자 편집 전)
  selectedExpertId: string;     // 상담 요청할 전문가 ID
  analysisResult: AIRepairAnalysis | null;
  isLoading: boolean;
  error: string | null;
}

// RequestData는 RequestState와 동일 타입 (type alias)
type RequestData = RequestState;
```

---

## 📁 프로젝트 디렉토리 구조

```text
gochida/
├── src/
│   ├── app/                               # Expo Router 파일 기반 라우팅
│   │   ├── (tabs)/                        # 메인 탭 내비게이터 (CustomTabBar & FAB)
│   │   │   ├── _layout.tsx                # 하단 탭 바 레이아웃 및 중앙 카메라 FAB 설정
│   │   │   ├── index.tsx                  # 홈 화면 (서비스 안내 가이드, 사진 요청 시작)
│   │   │   ├── history.tsx                # 요청 내역 화면
│   │   │   ├── chats.tsx                  # 채팅 화면 (전문가 상담 내역 Mock UI)
│   │   │   └── profile.tsx                # 내 정보 화면 (메뉴, 데모 안내 등)
│   │   │
│   │   ├── _layout.tsx                    # 루트 레이아웃 (RequestContext 주입, Stack 설정)
│   │   ├── upload.tsx                     # 1단계: 사진 업로드 및 위치/증상 선택
│   │   ├── analysis.tsx                   # 2단계: AI 실시간 진단 결과 확인 (시공 비용, 발견근거 등)
│   │   ├── request-review.tsx             # 3단계: AI 생성 요청서 검토 및 최종 의뢰 전송
│   │   ├── expert-responses.tsx           # 4단계: 매칭된 전문가별 카드형 견적서/응답 비교
│   │   └── expert/
│   │       └── [id].tsx                   # 5단계: 전문가 상세 프로필 및 안심 보증서/확인서 확인
│   │
│   ├── components/                        # 재사용 가능한 UI 컴포넌트
│   │   ├── ui/
│   │   │   └── PressableScale.tsx         # 터치 시 스케일 축소 애니메이션 래퍼
│   │   ├── Badge.tsx                      # 5가지 변형 상태 레이블
│   │   ├── Header.tsx                     # AppHeader(스택) / TabHeader(탭) 헤더 컴포넌트
│   │   ├── Icon.tsx                       # expo-symbols + Ionicons 통합 아이콘 컴포넌트
│   │   ├── Button.tsx                     # 4가지 타입의 둥근 CTA/보조 버튼
│   │   ├── Card.tsx                       # Outlined/Muted 레이어드 카드 박스
│   │   ├── Chip.tsx                       # Pill 형태의 토글 선택 버튼 (햅틱 피드백 적용)
│   │   └── Skeleton.tsx                   # 투명도 애니메이션 자리표시자
│   │
│   ├── context/
│   │   └── RequestContext.tsx             # 전역 상태 관리 컨텍스트
│   │
│   ├── hooks/                             # 비즈니스 로직 격리용 커스텀 훅
│   │   └── useRequestFlow.ts              # 사진 촬영/앨범 선택, 권한 처리, Haptics 연동 (홈·FAB·업로드 공유)
│   │
│   ├── data/
│   │   ├── mockData.ts                    # 시공자 Mock 데이터 및 분석 Mock 생성
│   │   └── repairPriceGuides.ts           # 7대 시공 영역 시세 데이터 및 매칭 휴리스틱
│   │
│   ├── services/
│   │   ├── aiService.ts                   # Gemini API 멀티모달 프롬프트 송수신 및 방어적 파싱
│   │   └── expertService.ts               # 전문가 응답 API 요청 시뮬레이션
│   │
│   ├── theme/
│   │   └── index.ts                       # 프리미엄 UI 디자인 토큰 시스템 (Colors, Shadows, Radius 등)
│   │
│   ├── types/
│   │   └── index.ts                       # 공용 TypeScript 인터페이스 모음
│   │
│   └── utils/
│       └── expertDisplay.ts               # 상태값 조건부 색상 매핑 등 유틸리티
│
├── assets/                                # 정적 자원
│   └── images/                            # 아이콘, 스플래시, 파비콘, 일러스트
│       ├── icon.png                       # iOS 앱 아이콘
│       ├── android-icon-foreground.png    # Android 적응형 아이콘 전경
│       ├── android-icon-background.png    # Android 적응형 아이콘 배경
│       ├── android-icon-monochrome.png    # Android 단색 아이콘
│       ├── splash-icon.png                # 스플래시 화면 로고 (200px)
│       ├── favicon.png                    # Web 파비콘
│       ├── hero.png                       # 홈 헤더 로고 아이콘
│       ├── Hero_RepairFlow.png            # 홈 Hero 배너 일러스트
│       └── Asset_*.png                    # 홈 대시보드 목업 일러스트 8장
│                                          #   (AI 요청서, 시세 가이드, 업로드 카메라, 보증서,
│                                          #    전문가 카드, 방충망/실리콘/문 수리 예시)
│
├── docs/
│   └── PRD.md                             # 제품 요구사항 정의서 (AX/DX 전략, MoSCoW, 지표)
│
├── ref/                                   # 참고 자료
│   ├── IMG_*.PNG                          # 참고 스크린샷 이미지 (8장)
│   └── prototype/                         # 리디자인 기준이 된 웹 프로토타입 (HTML/JSX + 스크린샷 + 기록 문서)
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
| react-native-reanimated | ~4.1.1 | 네이티브 드라이버 애니메이션 (Skeleton 펄스, PressableScale) |
| react-native-gesture-handler | ~2.28.0 | 제스처 처리 |
| react-native-safe-area-context | ~5.6.0 | SafeAreaView (노치/홈바 대응) |
| react-native-screens | ~4.16.0 | 네이티브 화면 최적화 |
| react-native-svg | 15.12.1 | SVG 아이콘 렌더링 |
| react-native-worklets | 0.5.1 | Reanimated 워크릿 지원 |
| expo-linear-gradient | ~15.0.8 | Hero 배너·탭 바 그라데이션 |
| expo-blur | ~15.0.8 | BlurView 기반 반투명 플로팅 탭 바 |
| expo-symbols | ~1.0.8 | SF Symbols 네이티브 아이콘 |

### 기타

| 기술 | 버전 | 역할 |
|---|---|---|
| expo-haptics | ~15.0.8 | 햅틱 피드백 |
| expo-splash-screen | ~31.0.13 | 스플래시 화면 |
| expo-status-bar | ~3.0.9 | 상태바 스타일 관리 |
| expo-image | ~3.0.11 | 고성능 이미지 렌더링 |
| expo-font | ~14.0.11 | 커스텀 폰트 로딩 |
| expo-constants | ~18.0.13 | 앱 상수 접근 |
| expo-linking | ~8.0.11 | 딥링크 처리 |
| expo-system-ui | ~6.0.9 | 시스템 UI 설정 |
| expo-web-browser | ~15.0.10 | 인앱 웹 브라우저 |
| @expo/vector-icons | ^15.0.3 | Ionicons 등 벡터 아이콘 |
| @react-navigation/native | ^7.1.8 | React Navigation 코어 |
| @react-navigation/bottom-tabs | ^7.4.0 | 하단 탭 네비게이션 |
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
- [x] 카메라 직접 촬영 기능 (`expo-image-picker` 카메라 모드 — `useRequestFlow.takePhoto()`로 구현 완료)
- [ ] 실제 전문가 매칭 백엔드 연동
- [ ] 서버 사이드 AI 프록시 (API 키 보안)
- [ ] 사용자 요청 이력 관리 백엔드 연동 (현재 요청/내 정보 탭은 Mock UI)
- [ ] 푸시 알림 (전문가 응답 수신 시)

### 🟢 Could Have (고도화)
- [ ] 사용자-전문가 인앱 채팅 (현재 UI Mockup 완료)
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
