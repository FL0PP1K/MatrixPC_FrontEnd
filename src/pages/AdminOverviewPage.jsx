
import './AdminOverviewPage.css';

const stats = [
    { title: 'Усього товарів', value: 0 },
    { title: 'Категорії', value: 0 },
    { title: 'Нові замовлення', value: 0 },
    { title: 'Низькі залишки', value: 0 }
];

export default function AdminOverviewPage() {
    return (
        <section className="admin-overview">
            <div className="admin-overview-header">
                <h1>ОГЛЯД МАГАЗИНУ</h1>
                <p>Статистика та керування MatrixPC</p>
            </div>

            <div className="admin-overview-stats">
                {stats.map(stat => (
                    <div className="admin-overview-card" key={stat.title}>
                        <span>{stat.title}</span>
                        <strong>{stat.value}</strong>
                    </div>
                ))}
            </div>

            <div className="admin-overview-content">
                <h2>ОСТАННІ ЗАМОВЛЕННЯ</h2>
                <p>
                    Замовлення з'являться тут після
                    підключення Backend.
                </p>
            </div>
        </section>
    );
}
