# 이벤트/보상 관리 플랫폼

## 1. 개요

* **설명**: 이벤트와 보상을 관리하고, 사용자가 보상을 지급 받을 수 있는 플랫폼 입니다.
* **기술 스택**: Node.js 18 · NestJS · MongoDB(Replica Set) · JWT 인증 · Docker/Docker‑Compose
* **서비스 구성**:

  | 서비스         | 포트   | 주요 책임                                    |
    | ----------- |------| ---------------------------------------- |
  | **gateway** | 3000 | 모든 API 진입점 · JWT 검증 · 역할/권한 체크 · 프록시 라우팅 |
  | **auth**    | 3001 | 회원가입/로그인 · 역할 관리 · API 권한 관리             |
  | **event**   | 3002 | 이벤트/마일스톤/보상 CRUD · 보상 요청 처리              |

## 2. 실행

```bash
# 1) 환경파일 
환경 파일은 일반적으로 git에 올리지 않고 .env.example을 제공해야 하나,
테스트 편의성을 위해 그대로 올립니다.

# 2) 인스톨
npm i

# 3) docker-compose 실행 (도커 실행 후)
docker-compose up --build
```


## 3. Seed 데이터 초기화

```bash
# 서버를 띄운 후 초기 데이터 세팅
docker-compose -f docker-compose.seed.yml up --build --abort-on-container-exit
```

## 4. 테스트용 주요 API

### 4‑1. 인증(Auth)

| 메서드   | 경로                        | 설명          | 권한        |
| ----- | ------------------------- | ----------- | --------- |
| POST  | `/api/v1/auth/signup`     | 회원가입        | -         |
| POST  | `/api/v1/auth/login`      | 로그인(JWT 발급) | -         |
| PATCH | `/api/v1/users/:id/roles` | 사용자 역할 변경   | **ADMIN** |

### 4‑2. 이벤트(Event)

| 메서드    | 경로                   | 설명     | 권한           |
| ------ | -------------------- | ------ | ------------ |
| POST   | `/api/v1/events`     | 이벤트 생성 | **OPERATOR** |
| GET    | `/api/v1/events`     | 이벤트 목록 | OPERATOR     |
| GET    | `/api/v1/events/:id` | 상세 조회  | OPERATOR     |
| PATCH  | `/api/v1/events/:id` | 수정     | OPERATOR     |
| DELETE | `/api/v1/events/:id` | 삭제     | OPERATOR     |

### 4‑3. 마일스톤·보상(Milestone & Reward)

| 메서드    | 경로                                                | 설명         | 권한       |
| ------ | ------------------------------------------------- | ---------- | -------- |
| POST   | `/api/v1/events/:eventId/milestones`              | 마일스톤+보상 등록 | OPERATOR |
| GET    | `/api/v1/events/:eventId/milestones`              | 마일스톤 목록    | OPERATOR |
| GET    | `/api/v1/events/:eventId/milestones/:milestoneId` | 상세         | OPERATOR |
| PATCH  | `/api/v1/events/:eventId/milestones/:milestoneId` | 수정         | OPERATOR |
| DELETE | `/api/v1/events/:eventId/milestones/:milestoneId` | 삭제         | OPERATOR |

### 4‑4. 보상 요청(Reward Claim)

| 메서드  | 경로                                                      | 설명       | 권한                   |
| ---- | ------------------------------------------------------- | -------- |----------------------|
| POST | `/api/v1/events/:eventId/milestones/:milestoneId/claim` | 보상 요청    | **USER**             |
| GET  | `/api/v1/events/reward-claims/me`                       | 내 보상 이력  | USER                 |
| GET  | `/api/v1/events/reward-claims`                          | 전체 보상 이력 | OPERATOR<br/>AUDITOR |

> API 요청 시 **Authorization: Bearer <JWT>** 헤더가 필요합니다. Gateway는 JWT 검증 후 역할(Role)을 확인하여 프록시합니다.
> 
> Postman 사용시 회원가입 Scripts - Post-response에 다음을 입력하여 토큰을 사용합니다.
> const res = pm.response.json();
if (res.data && res.data.accessToken) {
pm.environment.set("ACCESS_TOKEN", res.data.accessToken);
}

## 5. 프로젝트 구조 요약

```
apps/
  gateway/        ← API 진입점, 프록시 · 인증 · 권한
  auth/           ← 회원/역할 관리, JWT 발급
  event/          ← 이벤트+보상 도메인
  seed/           ← DB 세팅
libs/
  shared/         ← 공통 데코레이터, DTO, Enum
  database/       ← MongoTransaction 헬퍼,
  common/         ← 유틸, 응답 래퍼, 인터셉터 등
```

---


## 6. 테스트
테스트 코드가 작성되지 않았습니다.