import React from 'react';
import { formatPrice, formatDate, formatTime, translations, STORE_INFO } from '@thecoffeecream/ui-shared';
import './BillTemplate.scss';

export default function BillTemplate({ order, items, subtotal, discount, total, tableId, lang = 'vi' }) {
    const t = translations[lang] || translations.vi;
    const now = new Date();

    return (
        <div id="bill-print-template" className="bill-print-template">
            <div className="bill-header">
                <h1 className="brand-name">{STORE_INFO.NAME}</h1>
                <p className="brand-address">{STORE_INFO.ADDRESS}</p>
                <p className="brand-phone">{STORE_INFO.PHONE}</p>
                <div className="bill-title">{t.common.receipt_title}</div>
            </div>

            <div className="bill-info">
                <div className="info-row">
                    <span>{t.common.table}: {tableId}</span>
                    <span>{t.common.time}: {formatTime(now)}</span>
                </div>
                <div className="info-row">
                    <span>{t.common.code}: {order?.orderId || 'Draft'}</span>
                    <span>{formatDate(now)}</span>
                </div>
            </div>

            <table className="bill-table">
                <thead>
                    <tr>
                        <th className="col-name">{t.form.product_name}</th>
                        <th className="col-unit-price">{t.common.unit_price}</th>
                        <th className="col-qty">{t.pos.qty}</th>
                        <th className="col-total">{t.common.item_total}</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                        <React.Fragment key={idx}>
                            <tr className="main-item">
                                <td className="col-name">
                                    <div className="product-title">{item.product.title}</div>
                                    {item.note && <div className="item-note">({item.note})</div>}
                                </td>
                                <td className="col-unit-price">{formatPrice(item.product.price)}</td>
                                <td className="col-qty">{item.qty}</td>
                                <td className="col-total">{formatPrice(item.product.price * item.qty)}</td>
                            </tr>
                            {item.toppings && item.toppings.length > 0 && item.toppings.map((topping, tIdx) => (
                                <tr key={`t-${tIdx}`} className="topping-item">
                                    <td className="col-name">+ {topping.title}</td>
                                    <td className="col-unit-price">{formatPrice(topping.price || 0)}</td>
                                    <td className="col-qty">1</td>
                                    <td className="col-total">{formatPrice(topping.price || 0)}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <div className="bill-summary">
                <div className="summary-row">
                    <span>{t.common.subtotal}</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                    <div className="summary-row">
                        <span>{t.common.discount}</span>
                        <span>-{formatPrice(discount)}</span>
                    </div>
                )}
                <div className="summary-row total">
                    <span>{t.common.grand_total}</span>
                    <span>{formatPrice(total)}</span>
                </div>
            </div>

            <div className="bill-footer">
                <p className="thank-you">{lang === 'en' ? 'Thank you! See you again!' : 'Cảm ơn quý khách. Hẹn gặp lại!'}</p>
                <p className="powered-by">{STORE_INFO.POWERED_BY}</p>
            </div>
        </div>
    );
}
