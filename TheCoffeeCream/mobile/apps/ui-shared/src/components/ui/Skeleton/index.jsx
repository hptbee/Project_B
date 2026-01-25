import './Skeleton.scss'

/**
 * Skeleton Loader Component
 * @param {string} variant - 'text' | 'rect' | 'circle'
 * @param {string} width - CSS width value (e.g. '100%', '50px')
 * @param {string} height - CSS height value
 * @param {string} className - Additional classes
 */
export default function Skeleton({ variant = 'text', width, height, className = '', style = {} }) {
    const styles = {
        width,
        height,
        ...style
    }

    return (
        <div
            className={`skeleton skeleton-${variant} ${className}`}
            style={styles}
        />
    )
}
