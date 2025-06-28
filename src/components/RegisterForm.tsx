// src/components/RegisterForm.tsx
import React, { useState } from 'react';

interface RegisterFormProps {
    onRegisterSuccess: () => void;
    onGoToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onGoToLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message || 'Aluno cadastrado com sucesso! Faça login agora.');
                setUsername('');
                setPassword('');
                // onRegisterSuccess(); // Poderia redirecionar para login
            } else {
                setError(data.message || 'Erro ao cadastrar aluno.');
            }
        } catch (err) {
            setError('Não foi possível conectar ao servidor para cadastro.');
            console.error(err);
        }
    };

    return (
        <div className="card-container" style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>Cadastro de Aluno</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Nome de Usuário (Aluno):</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Senha:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                {success && <p style={{ color: 'green', marginBottom: '10px' }}>{success}</p>}
                <button type="submit">Cadastrar Aluno</button>
            </form>
            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Já tem uma conta de aluno? <button onClick={onGoToLogin} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--primary-color)', textDecoration: 'underline', cursor: 'pointer', marginLeft: '5px' }}>Faça Login</button>
            </p>
        </div>
    );
};

export default RegisterForm;