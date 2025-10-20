# 🎵 PlayDuk - K-POP 음반 B2C 쇼핑몰

PlayDuk은 K-POP 팬들을 위한 음반 전문 온라인 쇼핑몰입니다.

## ✨ 주요 기능

### 🔐 인증

- 이메일 회원가입/로그인
- JWT 기반 인증
- 토큰 자동 갱신
- 소셜 로그인 (Google, Naver, Kakao) - UI 준비 완료

### 🛍️ 쇼핑

- 상품 목록 조회 (검색, 필터링, 페이지네이션)
- 상품 상세 정보
- 장바구니 (추가, 수량 변경, 삭제)
- 주문/결제
- 주문 내역 조회
- 주문 취소

### 👤 마이페이지

- 프로필 조회
- 주문 내역
- 배송지 관리 (예정)

## 🎨 디자인 테마

**밝은 녹색 (Emerald) 테마**

- Primary: #10b981
- Gradient: 135deg, #10b981 → #059669
- 반응형 디자인 (모바일, 태블릿, 데스크톱)

## 🛠 기술 스택

### 프론트엔드

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**:
  - Zustand (클라이언트 상태)
  - TanStack React Query (서버 상태)
- **HTTP Client**: Axios (자동 토큰 갱신 인터셉터)
- **Form**: React Hook Form + Zod
- **Toast**: Sonner

### 백엔드

- **Framework**: Spring Boot 3.2.2
- **Language**: Java 17
- **Database**: MySQL 8.0
- **ORM**: JPA + QueryDSL
- **Security**: Spring Security + JWT
- **API Docs**: SpringDoc OpenAPI 3

## 📁 프로젝트 구조

### 프론트엔드 (`./play-duk`)

```
app/
├── (auth)/              # 인증 페이지
│   ├── login/
│   └── register/
├── (shop)/              # 쇼핑 페이지
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   └── orders/
├── (user)/              # 사용자 페이지
│   └── mypage/
├── api/b2c/             # API 클라이언트
│   ├── auth.ts
│   ├── products.ts
│   ├── cart.ts
│   └── orders.ts
├── components/          # 컴포넌트
│   ├── layout/
│   └── ui/
├── hooks/               # React Query 훅
├── store/               # Zustand 스토어
├── lib/                 # 유틸리티
└── types/               # TypeScript 타입
```

### 백엔드 (`./api-server`)

```
src/main/java/com/api/apiserver/
├── domain/b2c/          # B2C 엔티티
│   ├── B2CUsers.java
│   ├── B2CCart.java
│   ├── B2CCartItem.java
│   ├── B2COrder.java
│   ├── B2COrderItem.java
│   ├── B2CShipping.java
│   ├── B2CPayment.java
│   └── B2CAddress.java
├── repository/b2c/      # Repository
├── service/b2c/         # Service
├── controller/b2c/      # Controller
├── DTO/b2c/             # DTO
├── type/b2c/            # Enum 타입
├── exception/           # Exception 처리
├── filter/              # JWT 필터
└── utils/               # 유틸리티
```

## 🚀 시작하기

### 환경 설정

1. **백엔드 설정** (`api-server/src/main/resources/application.yaml`)

```yaml
b2c:
  jwt:
    secret: [your-secret-key]
    access-token-validity-in-seconds: 1800
    refresh-token-validity-in-seconds: 604800
```

2. **프론트엔드 설정** (`play-duk/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/b2c
```

### 실행

**백엔드:**

```bash
cd api-server
./gradlew bootRun
```

**프론트엔드:**

```bash
cd play-duk
npm install
npm run dev
```

- 백엔드: http://localhost:8080
- 프론트엔드: http://localhost:3000
- Swagger: http://localhost:8080/swagger-ui.html

## 📡 API 엔드포인트

### 인증 (`/api/b2c/auth`)

- `POST /signup` - 회원가입
- `POST /login` - 로그인
- `POST /reissue` - 토큰 재발급
- `POST /logout` - 로그아웃

### 상품 (`/api/b2c/products`)

- `GET /` - 상품 목록 (검색, 필터링)
- `GET /{id}` - 상품 상세
- `GET /featured` - 추천 상품
- `GET /new` - 신상품

### 장바구니 (`/api/b2c/cart`)

- `GET /` - 장바구니 조회
- `POST /items` - 상품 추가
- `PATCH /items/{id}/quantity` - 수량 변경
- `PATCH /items/{id}/selected` - 선택 상태 변경
- `DELETE /items/{id}` - 아이템 삭제
- `DELETE /items` - 선택 아이템 삭제
- `DELETE /` - 장바구니 비우기

### 주문 (`/api/b2c/orders`)

- `POST /` - 주문 생성
- `GET /` - 주문 목록
- `GET /{id}` - 주문 상세
- `GET /number/{orderNumber}` - 주문번호로 조회
- `POST /{id}/cancel` - 주문 취소

## 🔑 핵심 특징

### 1. **B2B와 완전 분리**

- 독립적인 API 경로 (`/api/b2c/**`)
- 별도의 Security Filter Chain
- 독립적인 JWT 설정
- B2B의 `LogiProduct`만 읽기 전용으로 공유

### 2. **하위 호환성 보장**

- 기존 시스템에 영향 없음
- 독립적인 데이터베이스 테이블 (`b2c_*`)
- 별도의 인증 체계

### 3. **확장 가능한 구조**

- 계층형 아키텍처 (Controller → Service → Repository)
- DTO 기반 데이터 전송
- Exception Handler를 통한 일관된 에러 처리

### 4. **반응형 UI**

- 모바일 퍼스트 디자인
- 태블릿/데스크톱 최적화
- 터치 친화적 인터페이스

## 📦 데이터베이스 테이블

- `b2c_users` - 사용자
- `b2c_cart` - 장바구니
- `b2c_cart_item` - 장바구니 아이템
- `b2c_order` - 주문
- `b2c_order_item` - 주문 아이템
- `b2c_shipping` - 배송
- `b2c_payment` - 결제
- `b2c_address` - 배송지
- `b2c_refresh_token` - 리프레시 토큰

## 🔜 향후 개발 예정

- [ ] 결제 PG 연동 (토스페이먼츠, 이니시스)
- [ ] 배송 추적 시스템
- [ ] 상품 리뷰 시스템
- [ ] 위시리스트
- [ ] 소셜 로그인 실제 연동
- [ ] 이메일 알림
- [ ] 관리자 페이지

## 📄 라이센스

Copyright © 2024 PlayDuk. All rights reserved.
# play-duk
