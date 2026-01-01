import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function VerifyEmailPage() {
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  
  const { currentUser, checkEmailVerified, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    // Se já está verificado, redireciona
    if (currentUser.emailVerified) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleCheckVerification = async () => {
    setChecking(true);
    setMessage('');
    
    try {
      const isVerified = await checkEmailVerified();
      
      if (isVerified) {
        setMessage('✅ Email verificado com sucesso!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage('❌ Email ainda não foi verificado. Verifique sua caixa de entrada.');
      }
    } catch (error) {
      setMessage('⚠️ Erro ao verificar. Tente novamente.');
    } finally {
      setChecking(false);
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    setMessage('');
    
    try {
      await resendVerificationEmail();
      setMessage('✅ Email de verificação reenviado! Verifique sua caixa de entrada.');
    } catch (error: any) {
      setMessage('❌ ' + error.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <span style={styles.icon}>📧</span>
        </div>

        <h1 style={styles.title}>Verifique seu Email</h1>
        
        <p style={styles.text}>
          Enviamos um email de verificação para:
        </p>
        
        <p style={styles.email}>{currentUser?.email}</p>
        
        <p style={styles.text}>
          Por favor, clique no link do email para ativar sua conta e começar a usar o tradutor.
        </p>

        {message && (
          <div style={{
            ...styles.message,
            background: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24',
            border: message.includes('✅') ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
          }}>
            {message}
          </div>
        )}

        <div style={styles.actions}>
          <button
            onClick={handleCheckVerification}
            disabled={checking}
            style={{
              ...styles.button,
              ...styles.primaryButton,
              opacity: checking ? 0.7 : 1
            }}
          >
            {checking ? '🔄 Verificando...' : '✓ Já verifiquei'}
          </button>

          <button
            onClick={handleResendEmail}
            disabled={resending}
            style={{
              ...styles.button,
              ...styles.secondaryButton,
              opacity: resending ? 0.7 : 1
            }}
          >
            {resending ? '📤 Enviando...' : '📧 Reenviar Email'}
          </button>
        </div>

        <div style={styles.tips}>
          <p style={styles.tipsTitle}>💡 Dicas:</p>
          <ul style={styles.tipsList}>
            <li>Verifique sua caixa de spam/lixo eletrônico</li>
            <li>O email pode levar alguns minutos para chegar</li>
            <li>Você pode fechar esta página e voltar depois</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    textAlign: 'center' as const
  },
  iconContainer: {
    marginBottom: '24px'
  },
  icon: {
    fontSize: '64px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: '16px'
  },
  text: {
    fontSize: '16px',
    color: '#4a5568',
    marginBottom: '12px',
    lineHeight: '1.6'
  },
  email: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#667eea',
    marginBottom: '24px',
    padding: '12px',
    background: '#f7fafc',
    borderRadius: '8px'
  },
  message: {
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'left' as const
  },
  actions: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginBottom: '24px'
  },
  button: {
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },
  secondaryButton: {
    background: 'white',
    color: '#667eea',
    border: '2px solid #667eea'
  },
  tips: {
    background: '#f7fafc',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'left' as const
  },
  tipsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '12px'
  },
  tipsList: {
    paddingLeft: '20px',
    margin: 0,
    fontSize: '14px',
    color: '#4a5568',
    lineHeight: '1.8'
  }
};
