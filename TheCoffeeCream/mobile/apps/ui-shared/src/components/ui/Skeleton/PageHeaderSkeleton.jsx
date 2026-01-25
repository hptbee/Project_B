import Skeleton from './index'

export default function PageHeaderSkeleton({ hasAction = true }) {
    return (
        <header className="page-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Skeleton width="40px" height="40px" variant="rect" />
                <Skeleton width="150px" height="24px" />
            </div>
            {hasAction && <Skeleton width="100px" height="40px" variant="rect" />}
        </header>
    )
}
