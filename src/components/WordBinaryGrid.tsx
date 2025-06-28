// src/components/WordBinaryGrid.tsx
import React, { useMemo } from 'react';

function toBinary(char: string): string {
    const binary = char.charCodeAt(0).toString(2).padStart(8, '0');
    // Divide a string binária em duas metades de 4 bits e insere um espaço
    return `${binary.substring(0, 4)} ${binary.substring(4, 8)}`;
}

function generateGrid(words: string[], rows = 10, cols = 10): string[][] {
    const grid: (string | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));

    words.forEach((word, index) => {
        if (index < rows) {
            const chars = word.toUpperCase().split('');
            for (let i = 0; i < chars.length && i < cols; i++) {
                grid[index][i] = chars[i];
            }
        }
    });

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === null) {
                const randomCharCode = Math.floor(Math.random() * (90 - 65 + 1)) + 65;
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
    const grid = useMemo(() => {
        return generateGrid(wordsToHide, 10, 10);
    }, [wordsToHide]);

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