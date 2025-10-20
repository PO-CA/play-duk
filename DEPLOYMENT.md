# 🚀 PlayDuk 배포 가이드

## 환경 요구사항

### 백엔드

- Java 17 이상
- MySQL 8.0
- Gradle 8.x
- 최소 2GB RAM

### 프론트엔드

- Node.js 18 이상
- npm 9 이상

## 배포 순서

### 1. 데이터베이스 설정

```sql
-- MySQL 데이터베이스 생성
CREATE DATABASE playduk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 사용자 생성 및 권한 부여
CREATE USER 'playduk'@'%' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON playduk.* TO 'playduk'@'%';
FLUSH PRIVILEGES;
```

### 2. 백엔드 배포

#### application.yaml 설정

```yaml
spring:
  datasource:
    url: jdbc:mysql://your-db-host:3306/playduk?serverTimezone=Asia/Seoul&characterEncoding=UTF-8
    username: playduk
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update # 운영환경에서는 validate로 변경

b2c:
  jwt:
    secret: [base64-encoded-secret-key-at-least-256-bits]
    access-token-validity-in-seconds: 1800
    refresh-token-validity-in-seconds: 604800
```

#### 빌드 및 실행

```bash
cd api-server

# 빌드
./gradlew clean build

# 실행
java -jar build/libs/api-server-0.0.1-SNAPSHOT.jar

# 또는 Docker
docker build -t playduk-api .
docker run -p 8080:8080 playduk-api
```

### 3. 프론트엔드 배포

#### 환경 변수 설정 (.env.production)

```env
NEXT_PUBLIC_API_URL=https://api.playduk.com/api/b2c
NEXT_PUBLIC_SITE_NAME=PlayDuk
NEXT_PUBLIC_SITE_URL=https://www.playduk.com
```

#### Vercel 배포

```bash
cd play-duk

# Vercel CLI 설치
npm install -g vercel

# 배포
vercel --prod
```

#### 또는 자체 서버 배포

```bash
# 빌드
npm run build

# PM2로 실행
npm install -g pm2
pm2 start npm --name "playduk" -- start

# 또는 Docker
docker build -t playduk-web .
docker run -p 3000:3000 playduk-web
```

## CORS 설정

백엔드의 `CorsConfig.java`에 프론트엔드 도메인 추가:

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "https://www.playduk.com"
));
```

## SSL 인증서

Let's Encrypt 사용 권장:

```bash
sudo certbot --nginx -d api.playduk.com
sudo certbot --nginx -d www.playduk.com
```

## 모니터링

- 백엔드 로그: `/var/log/playduk-api/`
- 프론트엔드 로그: Vercel 대시보드
- 데이터베이스: MySQL Workbench or DBeaver

## 백업

```bash
# MySQL 백업
mysqldump -u playduk -p playduk > backup_$(date +%Y%m%d).sql

# 복원
mysql -u playduk -p playduk < backup_20241018.sql
```

## 성능 최적화

### 백엔드

- Connection Pool 설정
- QueryDSL 쿼리 최적화
- Redis 캐싱 (선택)

### 프론트엔드

- Next.js Image 최적화
- Code Splitting
- React Query 캐싱 전략

## 보안 체크리스트

- [ ] JWT Secret 키 안전하게 관리
- [ ] HTTPS 적용
- [ ] CORS 정확히 설정
- [ ] SQL Injection 방어 (JPA 사용)
- [ ] XSS 방어
- [ ] Rate Limiting
- [ ] 환경 변수 보안

## 문제 해결

### 백엔드가 시작되지 않음

- MySQL 연결 정보 확인
- 포트 8080 사용 중인지 확인
- 로그 확인: `tail -f logs/spring.log`

### 프론트엔드 빌드 실패

- Node.js 버전 확인 (18 이상)
- `node_modules` 삭제 후 재설치
- 환경 변수 확인

### 401 Unauthorized

- JWT 토큰 확인
- 토큰 만료 시간 확인
- CORS 설정 확인
