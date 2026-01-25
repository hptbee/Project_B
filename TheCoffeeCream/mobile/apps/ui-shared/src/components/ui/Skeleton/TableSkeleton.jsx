import Skeleton from './index'

export default function TableSkeleton({ rows = 5, cols = 5 }) {
    return (
        <div className="orders-table-wrapper glass-card">
            <table className="orders-table">
                <thead>
                    <tr>
                        {Array.from({ length: cols }).map((_, i) => (
                            <th key={i}><Skeleton width="80px" height="16px" /></th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i}>
                            {Array.from({ length: cols }).map((_, j) => (
                                <td key={j}><Skeleton width="90%" height="20px" /></td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
