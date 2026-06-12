# 고치다(Gochida) MVP 디자인 시스템 가이드

본 문서는 **고치다(Gochida)** 모바일 앱의 UI/UX 일관성을 유지하고, 새롭게 합류하는 디자이너 및 프론트엔드 개발자가 즉시 프로젝트에 기여할 수 있도록 작성된 **디자인 시스템 및 스펙 정의서**입니다.

---

## 1. Design Philosophy (디자인 철학)

고치다는 '불안하고 어려운 생활시공'을 다루는 서비스입니다. 따라서 사용자에게 **가장 높은 수준의 신뢰감과 편안함**을 주어야 합니다.

- **Soft & Floating**: 날카로운 테두리(Border)를 배제하고, 극도로 둥근 모서리(Extreme Border Radius)와 부드러운 그림자(Soft Drop Shadow)를 사용하여 UI 컴포넌트가 배경 위에 가볍게 떠 있는 듯한 모던한 룩을 지향합니다.
- **High Contrast & Readability**: 정보의 위계를 확실히 하기 위해 텍스트 굵기 대비를 강하게 주며, 장문의 AI 분석 결과도 편안하게 읽히도록 넉넉한 행간을 유지합니다.
- **Brand Consistency**: 차가운 블랙/화이트를 넘어서, 메인 컬러인 **Blue(전문성, 신뢰)** 와 서브 컬러인 **Orange/Yellow(경고, 강조)** 를 적재적소에 배치하여 브랜드 아이덴티티를 유지합니다.

---

## 2. Color Palette (색상 규격)

전체 색상은 `src/theme/index.ts`의 `palette` 객체에 정의되어 있습니다. 

### Brand Colors
- **Primary (Blue)**: `#5B6CFF` - 서비스의 메인 컬러. CTA 버튼, 현재 진행 중인 상태, 긍정적인 강조(추천 조치 등)에 사용합니다.
- **Primary Light**: `#EEF0FF` - Primary 컬러가 적용된 뱃지나 아이콘의 부드러운 배경색으로 사용합니다.
- **Primary Dark**: `#4654D9` - 텍스트나 강한 대비가 필요한 Primary 요소에 사용합니다.
- **Accent (Orange)**: `#FFB38A` - 다크 카드 내의 강조 아이콘 등 특별한 시각적 포인트가 필요할 때 사용합니다.

### Neutral & Backgrounds
- **Background**: `#F5F5F7` - 앱의 최하단 캔버스 배경색. 완전한 흰색이 아닌 약간 쿨톤이 섞인 밝은 회색을 사용하여 눈의 피로를 덜고 그 위에 올라가는 흰색 카드를 돋보이게 합니다.
- **Surface**: `#FFFFFF` - 기본 카드, 바텀 시트 등의 배경색.
- **Surface Soft**: `#F0F0F3` - 텍스트 입력창, 칩(Chip)의 기본 상태, 카드 내부의 서브 영역(박스형 인용구 등) 배경으로 사용합니다.
- **Premium Dark**: `#1E2335` - 완전한 검은색(#000)을 피하고, 딥 네이비 톤을 사용하여 프리미엄 강조 카드(예: 예상 시공 비용)의 배경으로 사용합니다.

### Semantic Colors
- **Success**: `#34C759` (Light: `#E8F8EE`) - 안심 보증서, 작업 가능 등 긍정적 상태
- **Warning**: `#F5A623` (Light: `#FFF5E5`) - 고위험, 추가 확인 필요, 방문 필요 등 주의 상태
- **Danger**: `#FF3B30` (Light: `#FFEBEA`) - 에러, 실패 상태

---

## 3. Typography (타이포그래피)

모바일 환경에서의 가독성을 극대화하기 위해 자간(Letter Spacing)은 살짝 좁히고, 행간(Line Height)은 넉넉하게 세팅했습니다. (기본 폰트 패밀리는 시스템 폰트(San Francisco / Roboto)를 따릅니다.)

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **display** | 32px | 800 (ExtraBold) | 40px | -0.8px | 화면의 가장 중요한 금액, 최종 판정 등 시선 집중용 |
| **h1** | 24px | 700 (Bold) | 32px | -0.5px | 페이지 메인 타이틀 |
| **h2** | 20px | 700 (Bold) | 28px | -0.4px | 카드 내 섹션 타이틀 |
| **h3** | 16px | 700 (Bold) | 24px | -0.2px | 서브 타이틀, 버튼 텍스트 |
| **bodyStrong** | 15px | 600 (SemiBold) | 22px | -0.1px | 리스트의 Label, 강조되어야 할 본문 |
| **body** | 15px | 400 (Regular) | 22px / 26px* | -0.1px | 일반 본문 (*장문의 AI 결과 등은 행간을 24~26px로 오버라이드하여 가독성 확보) |
| **caption** | 13px | 500 (Medium) | 18px | 0px | 부가 설명, 안내 문구 |
| **small** | 12px | 500 (Medium) | 16px | 0px | 뱃지, 상태 표시 텍스트 |

---

## 4. Layout & Spacing (레이아웃 및 여백)

8pt 그리드 시스템을 변형하여 사용합니다. 컴포넌트 간의 간격은 넉넉하게 주어 시원한 느낌을 줍니다.

- **화면 좌우 패딩**: 기본적으로 `24px (xl)`을 사용하여 여백을 충분히 확보합니다.
- **컴포넌트 간격**: 카드와 카드 사이는 `24px` 또는 `20px`, 리스트 아이템 간격은 `12~16px`을 사용합니다.
- **하단 여백**: 플로팅(Floating) CTA 버튼이 있는 화면은 스크롤 콘텐츠 가장 아래에 최소 `100px` 이상의 빈 패딩을 주어 콘텐츠가 버튼에 가려지지 않도록 합니다.

---

## 5. Components Specs (핵심 컴포넌트 스펙)

### 5.1 Card (카드)
- **Background**: `theme.colors.white`
- **Border Radius**: `24px` 또는 `32px` (매우 둥근 모서리)
- **Shadow**: 
  - 기본 카드: `shadowColor: '#000', opacity: 0.04, radius: 12, elevation: 2` (매우 옅은 그림자로 떠오른 느낌만 줌)
  - 다크 프리미엄 카드: `shadowColor: '#000', opacity: 0.08, radius: 24, elevation: 4`
- **Border**: 선을 사용하지 않는 것을 원칙으로 하나, 아주 옅은 구분선이 필요할 경우 `rgba(0,0,0,0.04)`를 사용합니다.

### 5.2 Button (버튼)
- **Shape**: 완전한 알약 형태 (`borderRadius: 9999`)
- **Height**: `56px` (기본 md 사이즈, 터치 영역을 넉넉히 확보)
- **Primary Variant**: Background `#5B6CFF`, Text `#FFFFFF`
- **Secondary Variant**: Background `#F0F0F3`, Text `#111111`
- 버튼은 화면 하단에 플로팅 상태로 배치되며, 뒤에 깔리는 콘텐츠가 살짝 비치도록 배경에 투명도를 줄 수 있습니다 (예: `rgba(245,245,247,0.9)`).

### 5.3 Chip / Badge (칩 및 뱃지)
- **선택된 Chip**: Primary Blue 배경 + 흰색 텍스트 + Primary 컬러의 옅은 그림자 (Elevation 3) 추가로 눌렸다는 피드백을 강하게 줍니다.
- **비활성 Chip**: Soft 회색 배경 + 옅은 회색 텍스트. 테두리는 사용하지 않습니다.
- **Badge**: 상태를 나타내는 뱃지(고위험, 추천 등)는 해당 Semantic Color의 **가장 밝은 Light 색상을 배경**으로, **원색을 텍스트와 아이콘 색상**으로 조합하여 눈에 잘 띄면서도 세련되게 표현합니다. (예: `backgroundColor: '#E8F8EE', color: '#34C759'`)

---

## 6. Do's and Don'ts (권장 및 금지 사항)

- ✅ **DO**: 장문의 텍스트(예: AI 종합 의견)를 배치할 때는 좌측에 굵은 브랜드 컬러 선(border-left)을 넣거나, `Surface Soft` 색상의 별도 박스 안에 감싸서 '인용문'처럼 시각적으로 분리해주세요.
- ❌ **DON'T**: 딱딱하고 얇은 검은색 테두리(Border `1px solid #000`)를 화면 분할에 사용하지 마세요. 대신 배경색의 대비(White vs Soft Gray)를 통해 구역을 분리하세요.
- ❌ **DON'T**: 정보를 무조건 크게 보여주려고 하지 마세요. 화면을 꽉 채우는 거대한 텍스트보다는, 충분한 여백(Whitespace)과 적절한 굵기(Weight) 대비를 통해 위계를 만드는 것이 프리미엄 디자인의 핵심입니다.
