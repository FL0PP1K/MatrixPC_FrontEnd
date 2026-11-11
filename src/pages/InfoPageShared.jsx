import { Link } from 'react-router-dom';

export function Breadcrumb({ current, section = null }) {
  return (
    <nav className="info-breadcrumb" aria-label="Навігаційний ланцюжок">
      <Link to="/">Головна</Link>
      {section && <><span aria-hidden="true">/</span><span>{section}</span></>}
      <span aria-hidden="true">/</span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}

export function PageIntro({ current, title, subtitle, section = 'Інформація' }) {
  return (
    <>
      <Breadcrumb current={current} section={section} />
      <header className="info-heading">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
    </>
  );
}

export function InfoCard({ icon, title, children, className = '' }) {
  return (
    <article className={`info-card ${className}`.trim()}>
      {icon && <div className="info-card-icon" aria-hidden="true">{icon}</div>}
      <h3>{title}</h3>
      {children}
    </article>
  );
}

export function DataRows({ rows }) {
  return (
    <dl className="info-data-rows">
      {rows.map(([label, value]) => (
        <div className="info-data-row" key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ContactCta({ title = 'Твій ПК. Твої правила.', children }) {
  return (
    <aside className="info-cta">
      <div>
        <h2>{title}</h2>
        <p>{children || 'Не знаєш, з чого почати? Опиши свої задачі та бюджет — обговоримо конфігурацію.'}</p>
      </div>
      <Link className="info-button info-button-outline" to="/contacts#contact-form">
        ЗВ’ЯЗАТИСЯ З НАМИ
      </Link>
    </aside>
  );
}

export function ArrowLink({ to, children, variant = 'outline' }) {
  return <Link className={`info-button info-button-${variant}`} to={to}>{children}</Link>;
}

