import re

with open('README.md', 'r') as f:
    content = f.read()

# Update section 7 and 8
new_section = """   - 하단 플로팅 푸터(`floatingFooter`)에 위치하며, 약간의 투명도가 있는 배경 위로 섀도우가 적용된 CTA 버튼이 제공됩니다. 탭 시 상담 준비 화면(`/consultation/[expertId]`)으로 이동합니다.

---

### 7. 상담 준비 화면 — `consultation/[expertId].tsx`

전문가와 실제 채팅을 시작하기 전, 양측의 정보를 점검하고 신뢰를 형성하는 허브 화면입니다.

#### 구성 요소
1. **전문가 요약 카드**: 상호명, 평점, 그리고 안심 보증서/작업 확인서 발급 가능 여부를 명확한 배지로 표시합니다.
2. **요청서 요약**: 전문가에게 전달될 AI 분석 기반의 요약 정보(위치, 작업, 공종)를 다시 한번 확인합니다.
3. **상담 전 체크리스트**: `CONSULTATION_CHECKLIST` 상수를 통해 "현장 방문비", "추가금 발생 조건" 등 사전에 물어보면 좋은 팁을 제공합니다.
4. **첫 메시지 미리보기**: 사용자가 직접 타이핑할 필요 없이, AI 분석 결과와 선택 항목을 바탕으로 자동 생성된 첫 인사말(`buildConsultationPreviewMessage`)을 시각적으로 보여줍니다.
5. **상담 시작 액션**: 하단 `ProcessBottomNav`의 버튼을 누르면 전역 `RequestContext`에 상담방(Room) 데이터를 생성(`startConsultation`)하고, 채팅 탭(`/chats`)으로 이동합니다.

---

### 8. 1:1 채팅 화면 — `chat/[id].tsx`

전문가와의 실시간 커뮤니케이션(Mock)을 담당하는 인터페이스입니다.

#### 주요 기능
- **통합 데이터 소스**: `RequestContext`에 생성된 동적 상담방(`consultations`)이 있으면 그 데이터를 사용하고, 없으면 정적 `MOCK_CHATS` 데이터를 Fallback으로 사용하여 탭 이동 후에도 대화 내역이 유지됩니다.
- **채팅 UI/UX**:
  - 사용자(나)의 메시지는 우측(Primary 컬러), 전문가 메시지는 좌측(Surface 컬러)에 배치됩니다.
  - 전문가 메시지 연속 수신 시, 프로필 아바타는 마지막 메시지(가장 아래)에만 표시되어 시각적 일관성을 높입니다.
  - `KeyboardAvoidingView`와 하단 안전 영역(`useSafeAreaInsets`)을 고려한 인풋 바 디자인을 적용했습니다.
- **실시간 상호작용**: 메시지 전송 시 로컬 상태 또는 전역 Context(`appendConsultationMessage`)에 메시지가 즉시 추가되며, 100ms 지연 후 `ScrollView`가 자동으로 최하단으로 스크롤(`scrollToEnd`)됩니다.

---

### 9. Mock / 데모 환경 지원"""

content = content.replace("   - 하단 플로팅 푸터(`floatingFooter`)에 위치하며, 약간의 투명도가 있는 배경 위로 섀도우가 적용된 CTA 버튼이 제공됩니다. (MVP 범위 밖으로, 탭 시 안내 Alert 발생)\n\n---\n\n### 7. Mock / 데모 환경 지원", new_section)

# Update the flowchart
flowchart_old = """[전문가 상세] expert/[id].tsx
  │ 전문가 소견 + 5개 상세 행 (가능여부/방문/작업/비용/일정)
  │ "이 전문가와 상담하기" 버튼 (MVP 범위 외 Alert)"""

flowchart_new = """[전문가 상세] expert/[id].tsx
  │ 전문가 소견 + 5개 상세 행 (가능여부/방문/작업/비용/일정)
  │ "이 전문가와 상담하기" 버튼
  │
  ↓ 탭 → router.push(`/consultation/${expert.id}`)
  │
[상담 준비] consultation/[expertId].tsx
  │ 전문가 요약 카드 (보증서 배지)
  │ 전문가가 받는 요청서 요약
  │ 상담 전 체크리스트
  │ 첫 메시지 미리보기 (AI 자동 생성)
  │
  ↓ "상담 시작하기" 버튼 (startConsultation 호출 후 /chats 이동)
  │
[채팅 탭] (tabs)/chats.tsx
  │ 신규 상담방 상단 노출
  │
  ↓ 방 입장 → router.push(`/chat/${roomId}`)
  │
[1:1 채팅] chat/[id].tsx
  │ 전역 상태(Context) 기반 실시간 채팅 UI
  │ 말풍선, 타임스탬프, 자동 스크롤"""

content = content.replace(flowchart_old, flowchart_new)

# Make sure we didn't miss it
with open('README.md', 'w') as f:
    f.write(content)

print("Updated README.md")
