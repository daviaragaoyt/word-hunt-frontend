// src/components/WordBinaryGrid.tsx
import React, { useMemo } from 'react';

function toBinary(char: string): string {
    const binary = char.charCodeAt(0).toString(2).padStart(8, '0');
    return `${binary.substring(0, 4)} ${binary.substring(4, 8)}`;
}

// --- FUNÇÃO generateGrid ATUALIZADA ---
function generateGrid(words: string[], rows = 10, cols = 10): string[][] {
    const grid: (string | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));

    // Define as direções de colocação (dr = delta row, dc = delta column)
    // [dr, dc]
    // [0, 1] -> Horizontal (direita)
    // [1, 0] -> Vertical (baixo)
    // [1, 1] -> Diagonal (baixo-direita)
    // [1, -1] -> Diagonal (baixo-esquerda)
    // Para mais desafio, poderia incluir direções inversas ou diagonais para cima.
    const directions = [
        [0, 1],  // Direita
        [1, 0],  // Baixo
        [1, 1],  // Baixo-direita
        [1, -1]  // Baixo-esquerda
    ];

    const MAX_ATTEMPTS_PER_WORD = 200; // Número máximo de tentativas para colocar uma palavra

    // Tenta colocar cada palavra na grade
    words.forEach(word => {
        const chars = word.toUpperCase().split('');
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < MAX_ATTEMPTS_PER_WORD) {
            attempts++;

            // Escolhe uma posição inicial aleatória
            const startRow = Math.floor(Math.random() * rows);
            const startCol = Math.floor(Math.random() * cols);

            // Escolhe uma direção aleatória
            const [dr, dc] = directions[Math.floor(Math.random() * directions.length)];

            // Verifica se a palavra cabe nessa posição e direção
            let canPlace = true;
            let currentPath: { r: number; c: number }[] = []; // Para armazenar o caminho da palavra

            for (let i = 0; i < chars.length; i++) {
                const currentRow = startRow + i * dr;
                const currentCol = startCol + i * dc;

                // Fora dos limites da grade
                if (currentRow < 0 || currentRow >= rows || currentCol < 0 || currentCol >= cols) {
                    canPlace = false;
                    break;
                }

                // Conflito com outra letra (apenas se não for a mesma letra)
                if (grid[currentRow][currentCol] !== null && grid[currentRow][currentCol] !== chars[i]) {
                    canPlace = false;
                    break;
                }
                currentPath.push({ r: currentRow, c: currentCol });
            }

            // Se a palavra cabe, coloca ela na grade
            if (canPlace) {
                for (let i = 0; i < chars.length; i++) {
                    const { r, c } = currentPath[i];
                    grid[r][c] = chars[i];
                }
                placed = true;
            }
        }

        if (!placed) {
            console.warn(`[Caça-Palavras] Não foi possível colocar a palavra "${word}" na grade.`);
        }
    });

    // Preenche os espaços vazios (nulls) com letras aleatórias
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === null) {
                const randomCharCode = Math.floor(Math.random() * (90 - 65 + 1)) + 65; // A-Z ASCII
                grid[r][c] = String.fromCharCode(randomCharCode);
            }
        }
    }
    return grid as string[][];
}


interface WordBinaryGridProps {
    wordsToHide: string[];
}

const WordBinaryGrid: React.FC<WordBinaryGridProps> = ({ wordsToHide }) => {
    // Memoiza a grade para que só seja gerada novamente se as palavras mudarem
    const grid = useMemo(() => {
        return generateGrid(wordsToHide, 10, 10);
    }, [wordsToHide]);

    // Memoiza a grade binária
    const binaryGrid = useMemo(() =>
        grid.map(row => row.map(char => toBinary(char))),
        [grid]
    );

    return (
        <div>
            <div style={{ display: 'inline-block' }}>
                {binaryGrid.map((row, rowIndex) => (
                    <div key={rowIndex} style={{ display: 'flex' }}>
                        {row.map((binary, colIndex) => (
                            <span key={colIndex} style={{ display: 'inline-block' }}>
                                {binary}
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WordBinaryGrid;