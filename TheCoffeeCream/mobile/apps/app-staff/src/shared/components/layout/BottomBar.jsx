import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'

export default function BottomBar({ total = 0 }) {
    const cart = useCart()
    const computed = cart.items.reduce((s, i) => s + i.product.price * i.qty + (i.toppings || []).reduce((t, tt) => t + tt.price, 0) * i.qty, 0)
    return (
        <div className="bottom-bar">
            <div className="left">Tổng tiền <span className="badge">{(cart.items || []).reduce((s, it) => s + (it.qty ?? it.quantity ?? 1), 0)}</span></div>
            <div className="right">
                <div className="amount">{computed.toLocaleString()}</div>
                <Link to="/cart" className="pay">Thanh toán</Link>
            </div>
        </div>
    )
}
