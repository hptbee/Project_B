import Skeleton from './index'

export default function StatsSkeleton({ count = 4 }) {
    return (
        <div className="stats-grid">
            {Array.from({ length: count }).map((_, i) => (
                <div className="glass-card stat-skeleton-card" key={i}>
                    <Skeleton width="40px" height="40px" variant="circle" className="mb-16" />
                    <Skeleton width="60%" height="16px" className="mb-8" />
                    <Skeleton width="80%" height="28px" />
                </div>
            ))}
        </div>
    )
}
