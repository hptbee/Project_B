import Skeleton from './index'

export default function GridSkeleton({ count = 12, className = '' }) {
    return (
        <div className={`grid ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div className="glass-card skeleton-card" key={i}>
                    <Skeleton width="60%" height="20px" className="skeleton-title" />
                    <Skeleton width="40%" height="16px" />
                </div>
            ))}
        </div>
    )
}
