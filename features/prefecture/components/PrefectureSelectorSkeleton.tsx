import { PREFECTURE_COUNT } from "../constants";

/**
 * 都道府県選択UIのスケルトンコンポーネント
 *
 * データフェッチ中に表示されるローディングUIです。
 * 47都道府県分のチェックボックススケルトンをグリッド形式で表示します。
 *
 * @returns スケルトンUI
 *
 * @example
 * ```tsx
 * <Suspense fallback={<PrefectureSelectorSkeleton />}>
 *   <PrefectureSelector onToggle={handleToggle} />
 * </Suspense>
 * ```
 */
export default function PrefectureSelectorSkeleton() {
  return (
    <div className="grid grid-cols-8 gap-2">
      {Array.from({ length: PREFECTURE_COUNT }).map((_, index) => (
        <div key={index} className="flex items-center animate-pulse">
          <div className="w-4 h-4 bg-gray-300 rounded mr-2" />
          <div className="h-4 bg-gray-300 rounded w-16" />
        </div>
      ))}
    </div>
  );
}
