/**
 * 로딩 스피너 컴포넌트
 */
export function Loading({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500`}
      />
    </div>
  );
}

/**
 * 전체 화면 로딩
 */
export function FullPageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loading size="lg" />
        <p className="mt-4 text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
}
