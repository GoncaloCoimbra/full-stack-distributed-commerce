import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTutorialDetail } from '../hooks/useTutorials';
import { Button, Input, Card, Badge, Alert } from '../components/common';

const TutorialDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tutorialId = id ? parseInt(id) : null;
  
  const { tutorial, loading, error } = useTutorialDetail(tutorialId);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-900 text-red-100 p-4 rounded">Error: {error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-gray-400">Loading tutorial...</div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Link to="/tutorials" className="text-sm text-gray-400">← Voltar aos tutoriais</Link>
        <div className="mt-4 text-gray-400">Tutorial não encontrado.</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="mb-6">
        <Link to="/tutorials" className="text-sm text-gray-400">← Voltar aos tutoriais</Link>
        <h1 className="text-3xl font-extrabold text-white mt-2">{tutorial.title}</h1>
        <p className="text-gray-400 mt-2">{tutorial.description}</p>
      </header>

      <main className="space-y-6">
        <div className="bg-gray-900 p-6 rounded">
          <div className="w-full h-64 bg-black rounded flex items-center justify-center text-white text-center">
            {tutorial.videoUrl ? (
              <video controls width="100%" height="auto" style={{ maxHeight: '400px' }}>
                <source src={tutorial.videoUrl} type="video/mp4" />
                Seu navegador não suporta vídeos.
              </video>
            ) : (
              <div>Player de vídeo (placeholder)</div>
            )}
          </div>
          <div className="mt-3 flex justify-between items-center">
            <p className="text-sm text-gray-400">Duração: {tutorial.duration}</p>
            <p className="text-sm text-gray-400">Categoria: <span className="text-red-400">{tutorial.category}</span></p>
          </div>
        </div>

        <section id="transcript" className="bg-gray-900 p-6 rounded">
          <h2 className="text-lg font-semibold text-white">Transcrição</h2>
          <pre className="mt-3 text-sm text-gray-300 whitespace-pre-wrap">{tutorial.transcript}</pre>
        </section>

        <div className="flex justify-end">
          <a
            href={`mailto:suporte@exemplo.com?subject=Sobre%20o%20tutorial%20${tutorial.id}:%20${encodeURIComponent(tutorial.title)}`}
            className="bg-green-600 px-4 py-2 rounded"
          >
            Contactar suporte
          </a>
        </div>
      </main>
    </div>
  );
};

export default TutorialDetail;

