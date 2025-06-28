// src/components/LoginForm.tsx
import React, { useState } from 'react';

interface LoginFormProps {
    onLoginSuccess: (isProfessor: boolean) => void;
    onGoToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onGoToRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('currentUserRole', data.role);
                localStorage.setItem('currentUser', username);
                onLoginSuccess(data.role === 'professor');
            } else {
                setError(data.message || 'Erro ao fazer login.');
            }
        } catch (err) {
            setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando (http://localhost:3001).');
            console.error(err);
        }
    };

    return (
        <div className="card-container" style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Usuário:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Senha:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                <button type="submit">
                    Entrar
                </button>
            </form>
            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Não é professor?
                <button
                    onClick={onGoToRegister}
                    style={{ background: 'none', border: 'none', padding: 0, color: 'var(--primary-color)', textDecoration: 'underline', cursor: 'pointer', marginLeft: '5px' }}
                >
                    Cadastre-se como Aluno
                </button>
            </p>
        </div>
    );
};

export default LoginForm;