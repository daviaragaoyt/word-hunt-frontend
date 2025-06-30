// src/components/ProfessorDashboard.tsx
import React, { useState, useEffect } from 'react';
import WordBinaryGrid from './WordBinaryGrid';

interface ProfessorDashboardProps {
    onLogout: () => void;
}

const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ onLogout }) => {
    const [rawWordsInput, setRawWordsInput] = useState('');
    const [savedWords, setSavedWords] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWords = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('https://word-hunt-backend-api.onrender.com/api/words');
            if (!response.ok) {
                throw new Error('Erro ao carregar palavras do backend.');
            }
            const data: string[] = await response.json();
            setSavedWords(data);
            setRawWordsInput(data.join(', '));
        } catch (err) {
            console.error('Erro ao buscar palavras:', err);
            setError('Não foi possível carregar as palavras. Verifique se o backend está rodando.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWords();
    }, []);

    const handleSaveWords = async () => {
        const wordsArray = rawWordsInput
            .toUpperCase()
            .split(/[\s,]+/)
            .filter(word => word.length > 0);

        try {
            const response = await fetch('https://word-hunt-backend-api.onrender.com/api/words', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ words: wordsArray }),
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar palavras no backend.');
            }

            const data = await response.json();
            setSavedWords(data.words);
            alert('Palavras salvas com sucesso!');
        } catch (err) {
            console.error('Erro ao salvar palavras:', err);
            setError('Não foi possível salvar as palavras. Verifique se o backend está rodando.');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }} className="no-print">
                <h2>Dashboard do Professor</h2>
                <button onClick={onLogout} style={{ backgroundColor: '#dc3545' }}>
                    Sair
                </button>
            </div>

            <div className="card-container no-print">
                <h3>Cadastrar Palavras para o Caça-Palavras</h3>
                <label htmlFor="wordsInput" style={{ display: 'block', marginBottom: '10px' }}>
                    Digite as palavras (separadas por vírgula ou espaço):
                </label>
                <textarea
                    id="wordsInput"
                    value={rawWordsInput}
                    onChange={(e) => setRawWordsInput(e.target.value)}
                    rows={4}
                    style={{ maxWidth: '600px', resize: 'vertical' }}
                />
                <button onClick={handleSaveWords} style={{ marginTop: '15px' }}>
                    Salvar Palavras
                </button>
            </div>

            {loading ? (
                <p className="no-print">Carregando palavras...</p>
            ) : error ? (
                <p style={{ color: 'red' }} className="no-print">{error}</p>
            ) : (
                savedWords.length > 0 && (
                    <>
                        <div id="printable-area-professor" className="card-container" style={{ marginBottom: '20px' }}>


                            <WordBinaryGrid wordsToHide={savedWords} />
                        </div>
                        <button onClick={handlePrint} style={{ marginTop: 20 }} className="no-print">
                            Imprimir Caça-Palavras
                        </button>
                    </>
                )
            )}
        </div>
    );
};

export default ProfessorDashboard;