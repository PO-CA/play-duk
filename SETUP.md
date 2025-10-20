# 프로젝트 초기 설정 가이드

## 🎉 설정 완료 항목

### ✅ 설치된 패키지

- **@tanstack/react-query**: 서버 상태 관리
- **axios**: HTTP 클라이언트
- **zustand**: 클라이언트 상태 관리
- **react-hook-form**: 폼 관리
- **zod**: 스키마 유효성 검증
- **sonner**: 토스트 알림
- **date-fns**: 날짜 처리
- **clsx & tailwind-merge**: 클래스 유틸리티
- **prettier & prettier-plugin-tailwindcss**: 코드 포맷터

### ✅ 생성된 파일 및 디렉토리

```
/app
  /api
    - products.ts          # 상품 API
    - orders.ts            # 주문 API
  /components
    /ui
      - button.tsx         # 버튼 컴포넌트
      - input.tsx          # 입력 컴포넌트
      - card.tsx           # 카드 컴포넌트
    /layout
      - header.tsx         # 헤더
      - footer.tsx         # 푸터
  /store
    - auth-store.ts        # 인증 상태 관리
    - cart-store.ts        # 장바구니 상태 관리
  /hooks
    - useAuth.ts           # 인증 훅
    - useProducts.ts       # 상품 훅
    - useOrders.ts         # 주문 훅
  /lib
    - axios.ts             # Axios 설정 (인터셉터 포함)
    - utils.ts             # 유틸리티 함수
  /types
    - index.ts             # TypeScript 타입 정의
  /(shop)
    /products
      - page.tsx           # 상품 목록 페이지
      /[id]
        - page.tsx         # 상품 상세 페이지
  - providers.tsx          # React Query Provider
  - layout.tsx             # 루트 레이아웃
  - page.tsx               # 홈 페이지
```

### ✅ 설정 파일

- `.prettierrc.json`: Prettier 설정
- `.vscode/settings.json`: VSCode 설정
- `.gitignore`: Git 무시 파일
- `README.md`: 프로젝트 문서

## 🚀 다음 단계

### 1. 환경 변수 설정

`.env.local` 파일을 만들고 다음 내용을 입력하세요:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=Play-Duk Shop
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**중요**: 백엔드 API 서버의 실제 URL로 `NEXT_PUBLIC_API_URL`을 변경하세요.

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열어 확인하세요.

### 3. 백엔드 API 연동

현재 프론트엔드는 다음 API 엔드포인트를 사용하도록 설정되어 있습니다:

#### 인증 API

- `POST /auth/login` - 로그인
- `POST /auth/register` - 회원가입
- `GET /auth/me` - 현재 사용자 정보
- `POST /auth/logout` - 로그아웃
- `POST /auth/refresh` - 토큰 갱신

#### 상품 API

- `GET /products` - 상품 목록
- `GET /products/:id` - 상품 상세
- `GET /products/featured` - 추천 상품
- `GET /products/popular` - 인기 상품
- `GET /products/:id/related` - 관련 상품

#### 주문 API

- `POST /orders` - 주문 생성
- `GET /orders` - 주문 목록
- `GET /orders/:id` - 주문 상세
- `POST /orders/:id/cancel` - 주문 취소
- `GET /orders/track/:orderNumber` - 주문 추적

백엔드 API가 이러한 엔드포인트를 제공하는지 확인하세요.

### 4. 추가 페이지 구현

다음 페이지들을 추가로 구현해야 합니다:

- [ ] `/login` - 로그인 페이지
- [ ] `/register` - 회원가입 페이지
- [ ] `/cart` - 장바구니 페이지
- [ ] `/checkout` - 결제 페이지
- [ ] `/orders` - 주문 내역 페이지
- [ ] `/orders/[id]` - 주문 상세 페이지
- [ ] `/mypage` - 마이페이지

### 5. 추가 기능 구현

- [ ] 카테고리 필터링
- [ ] 상품 검색
- [ ] 리뷰 시스템
- [ ] 결제 시스템 통합
- [ ] 이미지 업로드
- [ ] 알림 시스템

## 📝 개발 가이드

### 코드 스타일

Prettier가 설정되어 있으므로 다음 명령어로 코드를 포맷팅하세요:

```bash
npm run format
```

### 타입 체크

TypeScript 타입 에러를 확인하려면:

```bash
npm run type-check
```

### ESLint

코드 품질을 확인하려면:

```bash
npm run lint
npm run lint:fix  # 자동 수정
```

### 새 컴포넌트 생성

1. `/app/components/ui` 또는 `/app/components/layout`에 파일 생성
2. TypeScript로 타입 정의
3. forwardRef 사용 (필요시)
4. className props 지원 (cn 유틸리티 사용)

예시:

```tsx
import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/app/lib/utils';

export interface MyComponentProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary';
}

export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'base-classes',
          variant === 'primary' && 'primary-classes',
          className
        )}
        {...props}
      />
    );
  }
);

MyComponent.displayName = 'MyComponent';
```

### API 호출

1. `/app/api/`에 API 함수 정의
2. `/app/hooks/`에 React Query 훅 생성
3. 컴포넌트에서 훅 사용

예시:

```tsx
// app/api/categories.ts
export const categoriesApi = {
  getCategories: async () => {
    const { data } = await api.get('/categories');
    return data.data;
  },
};

// app/hooks/useCategories.ts
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
  });
}

// 컴포넌트에서
const { data: categories } = useCategories();
```

### 상태 관리

- **서버 상태**: React Query 사용
- **전역 클라이언트 상태**: Zustand 사용
- **지역 상태**: useState 사용

## 🎨 디자인 토큰

### 색상

```css
Primary: blue-600 (#2563eb)
Secondary: gray-200 (#e5e7eb)
Danger: red-600 (#dc2626)
Success: green-600 (#16a34a)
Warning: yellow-500 (#eab308)
```

### 간격

```css
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
```

## 🔧 트러블슈팅

### 1. CORS 에러

백엔드 서버에서 CORS를 허용하도록 설정하세요.

### 2. 토큰 만료

`/app/lib/axios.ts`의 인터셉터가 자동으로 토큰을 갱신합니다.
리프레시 토큰도 만료되면 로그인 페이지로 리다이렉트됩니다.

### 3. 이미지 최적화

Next.js Image 컴포넌트를 사용하세요:

```tsx
<Image src="/image.jpg" alt="..." width={500} height={300} />
```

외부 이미지를 사용하려면 `next.config.ts`에 도메인을 추가하세요.

## 📞 도움이 필요하신가요?

- [Next.js 문서](https://nextjs.org/docs)
- [React Query 문서](https://tanstack.com/query/latest)
- [Zustand 문서](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

Happy Coding! 🚀
