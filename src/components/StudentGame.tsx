// src/components/StudentGame.tsx
import React, { useState, useEffect } from 'react';


interface StudentGameProps {
    onLogout: () => void;
}

const StudentGame: React.FC<StudentGameProps> = ({ onLogout }) => {
    const [hiddenWords, setHiddenWords] = useState<string[]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [userGuess, setUserGuess] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWords = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('https://word-hunt-backend-api.onrender.com/api/words');
                if (!response.ok) {
                    throw new Error('Erro ao carregar palavras do backend.');
                }
                const data: string[] = await response.json();
                setHiddenWords(data);
            } catch (err) {
                console.error('Erro ao buscar palavras para o aluno:', err);
                setError('Não foi possível carregar as palavras. Peça para o professor cadastrar.');
            } finally {
                setLoading(false);
            }
        };
        fetchWords();
    }, []);

    const handleGuess = () => {
        const normalizedGuess = userGuess.toUpperCase().trim();

        if (hiddenWords.includes(normalizedGuess)) {
            if (!foundWords.includes(normalizedGuess)) {
                setFoundWords([...foundWords, normalizedGuess]);
                alert(`Parabéns! Você encontrou a palavra "${normalizedGuess}"!`);
            } else {
                alert(`Você já encontrou a palavra "${normalizedGuess}".`);
            }
        } else {
            alert(`"${normalizedGuess}" não é uma das palavras escondidas. Tente novamente!`);
        }
        setUserGuess('');
    };

    const allWordsFound = hiddenWords.length > 0 && foundWords.length === hiddenWords.length;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>Caça-Palavras em Binário para Alunos</h2>
                <button onClick={onLogout} style={{ backgroundColor: '#dc3545' }}>
                    Sair
                </button>
            </div>

            {loading ? (
                <p>Carregando palavras para o jogo...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : hiddenWords.length === 0 ? (
                <p>Nenhuma palavra foi cadastrada ainda. Peça para o professor cadastrar as palavras!</p>
            ) : (
                <>
                    <div style={{ marginBottom: '20px' }}>

                    </div>

                    <div className="card-container">
                        <h3>Suas Palavras Encontradas:</h3>
                        {foundWords.length > 0 ? (
                            <ul>
                                {foundWords.map((word, index) => (
                                    <li key={index}>{word}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>Nenhuma palavra encontrada ainda.</p>
                        )}
                        {allWordsFound && <p style={{ color: 'green' }}>Parabéns! Você encontrou todas as palavras!</p>}
                    </div>

                    {!allWordsFound && (
                        <div className="card-container">
                            <h3>Tente Encontrar as Palavras</h3>
                            <input
                                type="text"
                                value={userGuess}
                                onChange={(e) => setUserGuess(e.target.value)}
                                placeholder="Digite uma palavra que você encontrou"
                                style={{ marginRight: '10px', width: '250px' }}
                            />
                            <button onClick={handleGuess}>
                                Verificar
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default StudentGame;