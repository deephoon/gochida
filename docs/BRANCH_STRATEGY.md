# Gochida 브랜치 전략

고치다는 소규모 팀이 하나의 최신 모바일 앱 버전을 빠르게 개선하는 프로젝트다. 따라서
상시 `develop`, `release`, `hotfix` 브랜치를 모두 유지하는 Git Flow보다 단순한
GitHub Flow를 기본으로 사용한다. 모바일 스토어 배포 이력은 `main`의 Git 태그로 관리하고,
배포 장애처럼 긴급한 경우에만 `hotfix/*` 브랜치를 사용한다.

이 전략은 [Git 브랜치 전략 (feat. Git Flow, Github Flow)](https://hudi.blog/git-branch-strategy/)에서
설명한 안정적인 Main 브랜치, 짧게 유지하는 Topic 브랜치, 지속적인 push, PR과 CI 기반
병합 원칙을 프로젝트 상황에 맞게 적용한 것이다.

## 핵심 원칙

1. `main`은 언제든 빌드하고 배포할 수 있는 상태를 유지한다.
2. 모든 작업은 이슈를 먼저 만들고 `main`에서 분기한 Topic 브랜치에서 진행한다.
3. 작업 중인 브랜치도 원격에 자주 push하고 Draft PR로 진행 상황을 공유한다.
4. `main`에는 직접 push하지 않고 PR 검토와 자동 검사를 통과한 변경만 병합한다.
5. 하나의 브랜치는 하나의 이슈와 목적만 다루며, 병합 후 삭제한다.
6. 출시 버전은 `vMAJOR.MINOR.PATCH` 형식의 태그로 기록한다.

## 브랜치 구조

| 브랜치 | 용도 | 분기 기준 | 병합 대상 | 예시 |
|---|---|---|---|---|
| `main` | 배포 가능한 기준 브랜치 | - | - | `main` |
| `feature/<issue>-<slug>` | 사용자 기능 추가 | `main` | `main` | `feature/12-consultation-chat` |
| `fix/<issue>-<slug>` | 일반 버그 수정 | `main` | `main` | `fix/18-analysis-timeout` |
| `docs/<issue>-<slug>` | 문서만 변경 | `main` | `main` | `docs/21-branch-strategy` |
| `refactor/<issue>-<slug>` | 동작 변경 없는 구조 개선 | `main` | `main` | `refactor/24-request-context` |
| `chore/<issue>-<slug>` | 설정·의존성·도구 작업 | `main` | `main` | `chore/27-expo-upgrade` |
| `hotfix/<issue>-<slug>` | 배포 장애 긴급 수정 | 배포 태그 또는 `main` | `main` | `hotfix/31-startup-crash` |

`develop`과 상시 `release/*` 브랜치는 운영하지 않는다. 여러 출시 버전을 병렬 지원하거나
스토어 심사 기간 동안 다음 버전 개발과 출시 안정화가 충돌하기 시작하면, 그 시점에만
임시 `release/vX.Y.Z` 브랜치 도입을 검토한다.

## 작업 흐름

```text
Issue 생성
  -> main 최신화
  -> Topic 브랜치 생성
  -> Conventional Commit 단위로 개발 및 push
  -> Draft PR 생성
  -> lint / typecheck / 리뷰 통과
  -> Squash merge 또는 목적 단위 merge
  -> Topic 브랜치 삭제
  -> 배포 시 main에 버전 태그 생성
```

시작 예시:

```bash
git switch main
git pull --ff-only origin main
git switch -c feature/12-consultation-chat
```

검증 및 게시 예시:

```bash
npm run lint
npx tsc --noEmit
git add <작업 파일>
git commit -m "feat: 상담 채팅 흐름 추가"
git push -u origin feature/12-consultation-chat
gh pr create --draft --base main
```

## 커밋 규칙

Conventional Commit 형식을 사용한다.

```text
<type>: <한국어 요약>
```

| 타입 | 사용 시점 | 예시 |
|---|---|---|
| `feat` | 사용자 기능 추가 | `feat: 상담 준비 화면 추가` |
| `fix` | 버그 수정 | `fix: AI 분석 중복 호출 방지` |
| `docs` | 문서만 변경 | `docs: 브랜치 전략 문서화` |
| `refactor` | 동작 변경 없는 코드 개선 | `refactor: 요청 상태 갱신 로직 분리` |
| `test` | 테스트 추가·수정 | `test: 상담방 생성 케이스 추가` |
| `chore` | 설정·도구·의존성 변경 | `chore: Expo 의존성 갱신` |

커밋은 리뷰와 롤백이 가능한 목적 단위로 나눈다. 임시 저장이 필요하면 원격 Topic 브랜치에
push하되, 병합 전에는 불필요한 WIP 커밋을 정리한다.

## PR 규칙

- 제목은 최종 커밋과 같은 Conventional Commit 형식을 사용한다.
- 본문에는 변경 이유, 주요 변경사항, 사용자 영향, 검증 결과를 적는다.
- 관련 이슈는 `Closes #<issue>`로 연결한다.
- UI 변경에는 가능하면 스크린샷 또는 화면 녹화를 첨부한다.
- 큰 작업은 구현 초기에 Draft PR을 만들고 진행 상황을 공유한다.
- 병합 전 `npm run lint`, `npx tsc --noEmit`을 반드시 통과한다.
- 기본 병합 방식은 **Squash merge**로 하여 `main`의 이력을 기능 단위로 유지한다.

## 릴리스와 핫픽스

정식 배포 시 `main`의 검증된 커밋에 태그를 생성한다.

```bash
git switch main
git pull --ff-only origin main
git tag -a v1.1.0 -m "release: v1.1.0"
git push origin v1.1.0
```

배포 장애는 관련 이슈 생성 후 `hotfix/*` 브랜치에서 수정한다. 동일한 PR·검증 절차를
적용하되 우선순위를 높이고, 병합 후 PATCH 버전 태그를 생성한다.

## GitHub 저장소 설정

현재 `main`에는 Branch Protection Rule이 없으므로 다음 설정을 적용해야 한다.

- Require a pull request before merging
- Require at least 1 approval
- Dismiss stale approvals when new commits are pushed
- Require status checks: `lint`, `typecheck`
- Require conversation resolution before merging
- Block force pushes and branch deletion
- Allow squash merging
- Automatically delete head branches

CI가 아직 없기 때문에 현재는 로컬 검증 결과를 PR 본문에 기록한다. 다음 단계에서 GitHub
Actions에 `lint`와 `typecheck` 작업을 추가한 뒤 필수 상태 검사로 연결한다.
