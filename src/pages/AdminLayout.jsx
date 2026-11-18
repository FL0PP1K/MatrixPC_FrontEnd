
import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const adminNavigation = [
    { name: 'Огляд', path: '/admin', end: true },
    { name: 'Товари', path: '/admin/products' },
    { name: 'Категорії', path: '/admin/categories' },
    { name: 'Замовлення', path: '/admin/orders' }
];

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h2 className="admin-sidebar-title">
                    MATRIX<span>PC</span>
                </h2>

                <p className="admin-sidebar-subtitle">
                    ПАНЕЛЬ АДМІНІСТРАТОРА
                </p>

                <nav className="admin-sidebar-nav">
                    {adminNavigation.map(link => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.end}
                            className={({ isActive }) =>
                                `admin-nav-link ${isActive ? 'active' : ''}`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                <a href="/" className="admin-back-link">
                    ← Повернутися на сайт
                </a>
            </aside>

            <div className="admin-main">
                <Outlet />
            </div>
        </div>
    );
}
