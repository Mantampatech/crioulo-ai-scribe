import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  reload
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

interface UserData {
  email: string;
  displayName: string;
  plan: 'free' | 'basic' | 'premium';
  translationsUsed: number;
  translationsLimit: number;
  emailVerified: boolean;
  createdAt: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  canTranslate: () => boolean;
  useTranslation: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  checkEmailVerified: () => Promise<boolean>;
  // Aliases for backwards compatibility
  user: User | null;
  profile: UserData | null;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  incrementTranslation: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

// Export UserProfile type for backwards compatibility
export type UserProfile = UserData;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Buscar dados do usuário
  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Cadastro com verificação de email
  const signup = async (email: string, password: string, name: string) => {
    try {
      // Criar conta
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar perfil com nome
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Criar documento no Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        displayName: name,
        plan: 'free',
        translationsUsed: 0,
        translationsLimit: 10,
        emailVerified: false,
        createdAt: new Date()
      });

      // ENVIAR EMAIL DE VERIFICAÇÃO
      await sendEmailVerification(userCredential.user);

      await fetchUserData(userCredential.user.uid);
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  // Login (verificar email após login)
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Recarregar para pegar status atualizado
      await reload(userCredential.user);
      
      await fetchUserData(userCredential.user.uid);
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  // Verificar se pode traduzir (precisa ter email verificado)
  const canTranslateCheck = () => {
    if (!userData || !currentUser) return false;
    
    // BLOQUEAR se email não verificado
    if (!currentUser.emailVerified) return false;
    
    if (userData.plan === 'premium') return true;
    
    return userData.translationsUsed < userData.translationsLimit;
  };

  // Usar uma tradução
  const useTranslation = async () => {
    if (!currentUser || !userData) {
      throw new Error('Usuário não autenticado');
    }

    if (!currentUser.emailVerified) {
      throw new Error('Por favor, verifique seu email antes de traduzir!');
    }

    if (!canTranslateCheck()) {
      throw new Error('Limite de traduções atingido. Faça upgrade!');
    }

    // Incrementar contador
    await updateDoc(doc(db, 'users', currentUser.uid), {
      translationsUsed: increment(1)
    });

    // Atualizar estado local
    setUserData({
      ...userData,
      translationsUsed: userData.translationsUsed + 1
    });
  };

  // Reenviar email de verificação
  const resendVerificationEmail = async () => {
    if (!currentUser) {
      throw new Error('Nenhum usuário logado');
    }

    try {
      await sendEmailVerification(currentUser);
    } catch (error: any) {
      throw new Error('Erro ao enviar email. Tente novamente em alguns minutos.');
    }
  };

  // Verificar se email foi confirmado
  const checkEmailVerified = async (): Promise<boolean> => {
    if (!currentUser) return false;

    await reload(currentUser);
    
    // Atualizar Firestore se verificado
    if (currentUser.emailVerified && userData && !userData.emailVerified) {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        emailVerified: true
      });
      
      setUserData({
        ...userData,
        emailVerified: true
      });
    }

    return currentUser.emailVerified;
  };

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    logout,
    canTranslate: canTranslateCheck,
    useTranslation,
    resendVerificationEmail,
    checkEmailVerified,
    // Backwards compatibility aliases
    user: currentUser,
    profile: userData,
    signUp: signup,
    logIn: login,
    logOut: logout,
    incrementTranslation: useTranslation,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Mensagens de erro em português
function getErrorMessage(errorCode: string): string {
  const errors: { [key: string]: string } = {
    'auth/email-already-in-use': 'Este email já está em uso',
    'auth/invalid-email': 'Email inválido',
    'auth/operation-not-allowed': 'Operação não permitida',
    'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres',
    'auth/user-disabled': 'Usuário desabilitado',
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet'
  };

  return errors[errorCode] || 'Ocorreu um erro. Tente novamente';
}
