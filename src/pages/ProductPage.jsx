import { useParams } from 'react-router-dom';

export default function ProductPage() {
  const { id } = useParams();

  return (
    <main className="page-content">
      <h1>Сторінка товару</h1>
      <p>ID товару: {id}</p>
    </main>
  );
}
