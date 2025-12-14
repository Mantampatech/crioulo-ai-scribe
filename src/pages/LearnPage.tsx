import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Trophy, Star, Check, X, Volume2, 
  ChevronRight, Heart, Zap, Target, Award,
  ArrowLeft, Sparkles, Brain, MessageCircle, Lock, Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Índices das lições gratuitas (0 = Saudações Básicas, 1 = Palavras Essenciais)
const FREE_LESSON_INDICES = [0, 1];

// Tipos
interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'basics' | 'greetings' | 'food' | 'family' | 'numbers' | 'phrases';
  isPremium?: boolean;
  exercises: Exercise[];
  xpReward: number;
}

interface Exercise {
  type: 'multiple-choice' | 'translate' | 'listen' | 'match';
  question: string;
  options?: string[];
  correctAnswer: string;
  audio?: string;
  hint?: string;
}

// Dados das lições
const lessons: Lesson[] = [
  {
    id: 'greetings-1',
    title: 'Saudações Básicas',
    description: 'Aprenda a cumprimentar em Crioulo',
    icon: '👋',
    category: 'greetings',
    xpReward: 50,
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Como se diz "Bom dia" em Crioulo?',
        options: ['Bon dia', 'Boa tardi', 'Bon noti', 'Kuma ku bo sta'],
        correctAnswer: 'Bon dia',
        hint: 'É muito parecido com Português!'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Kuma ku bo sta?"',
        options: ['Bom dia', 'Como você está?', 'Boa noite', 'Até logo'],
        correctAnswer: 'Como você está?',
        hint: '"Kuma" significa "como"'
      },
      {
        type: 'translate',
        question: 'Traduza: "Boa tarde"',
        options: ['Bon dia', 'Boa tardi', 'Bon noti', 'Adios'],
        correctAnswer: 'Boa tardi'
      },
      {
        type: 'multiple-choice',
        question: 'Como responder "Estou bem" em Crioulo?',
        options: ['N sta bon', 'Bo sta bon', 'No sta mal', 'Kuma'],
        correctAnswer: 'N sta bon',
        hint: '"N" = eu, "sta" = estar, "bon" = bem'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Adios"?',
        options: ['Olá', 'Obrigado', 'Adeus/Tchau', 'Por favor'],
        correctAnswer: 'Adeus/Tchau'
      }
    ]
  },
  {
    id: 'basics-1',
    title: 'Palavras Essenciais',
    description: 'Vocabulário fundamental do dia a dia',
    icon: '📚',
    category: 'basics',
    xpReward: 50,
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Como se diz "Sim" em Crioulo?',
        options: ['Nau', 'Sin', 'Bon', 'Mal'],
        correctAnswer: 'Sin'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Nau"?',
        options: ['Sim', 'Não', 'Talvez', 'Agora'],
        correctAnswer: 'Não'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Obrigado" em Crioulo?',
        options: ['Porfabor', 'Obrigadu', 'Diskulpa', 'Adios'],
        correctAnswer: 'Obrigadu'
      },
      {
        type: 'translate',
        question: 'Traduza: "Por favor"',
        options: ['Obrigadu', 'Porfabor', 'Diskulpa', 'Sin'],
        correctAnswer: 'Porfabor'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Diskulpa"?',
        options: ['Obrigado', 'Por favor', 'Desculpa', 'De nada'],
        correctAnswer: 'Desculpa'
      }
    ]
  },
  {
    id: 'family-1',
    title: 'Família',
    description: 'Membros da família em Crioulo',
    icon: '👨‍👩‍👧‍👦',
    category: 'family',
    xpReward: 80,
    isPremium: true,
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Como se diz "Mãe" em Crioulo?',
        options: ['Pai', 'Mai', 'Irmon', 'Fidju'],
        correctAnswer: 'Mai'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Pai" em Crioulo?',
        options: ['Mãe', 'Pai', 'Filho', 'Irmão'],
        correctAnswer: 'Pai',
        hint: 'É igual ao Português!'
      },
      {
        type: 'translate',
        question: 'Traduza: "Filho"',
        options: ['Mai', 'Pai', 'Fidju', 'Irmon'],
        correctAnswer: 'Fidju'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Irmão" em Crioulo?',
        options: ['Irmon', 'Fidju', 'Tiu', 'Prima'],
        correctAnswer: 'Irmon'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Abo"?',
        options: ['Eu', 'Tu/Você', 'Ele', 'Nós'],
        correctAnswer: 'Tu/Você'
      },
      {
        type: 'translate',
        question: 'Traduza: "Avó"',
        options: ['Abo', 'Nha', 'Avo', 'Tia'],
        correctAnswer: 'Abo'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Tio" em Crioulo?',
        options: ['Tiu', 'Prima', 'Pai', 'Irmon'],
        correctAnswer: 'Tiu'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Prima"?',
        options: ['Primo', 'Prima', 'Tia', 'Irmã'],
        correctAnswer: 'Prima'
      }
    ]
  },
  {
    id: 'numbers-1',
    title: 'Números 1-10',
    description: 'Aprenda a contar em Crioulo',
    icon: '🔢',
    category: 'numbers',
    xpReward: 75,
    isPremium: true,
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Como se diz "Um" em Crioulo?',
        options: ['Dus', 'Un', 'Tres', 'Kuatro'],
        correctAnswer: 'Un'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Sinku"?',
        options: ['Quatro', 'Cinco', 'Seis', 'Sete'],
        correctAnswer: 'Cinco'
      },
      {
        type: 'translate',
        question: 'Traduza: "Dez"',
        options: ['Oitu', 'Novi', 'Des', 'Seti'],
        correctAnswer: 'Des'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Três" em Crioulo?',
        options: ['Tres', 'Dus', 'Kuatro', 'Un'],
        correctAnswer: 'Tres'
      },
      {
        type: 'multiple-choice',
        question: 'Qual é o número "Seti"?',
        options: ['Cinco', 'Seis', 'Sete', 'Oito'],
        correctAnswer: 'Sete'
      },
      {
        type: 'translate',
        question: 'Traduza: "Dois"',
        options: ['Un', 'Dus', 'Tres', 'Kuatro'],
        correctAnswer: 'Dus'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Oitu"?',
        options: ['Seis', 'Sete', 'Oito', 'Nove'],
        correctAnswer: 'Oito'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Nove" em Crioulo?',
        options: ['Seti', 'Oitu', 'Novi', 'Des'],
        correctAnswer: 'Novi'
      }
    ]
  },
  {
    id: 'food-1',
    title: 'Comida e Bebida',
    description: 'Vocabulário gastronômico',
    icon: '🍛',
    category: 'food',
    xpReward: 85,
    isPremium: true,
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Como se diz "Água" em Crioulo?',
        options: ['Agu', 'Pexe', 'Kumi', 'Aros'],
        correctAnswer: 'Agu'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Kumi"?',
        options: ['Água', 'Comida', 'Peixe', 'Arroz'],
        correctAnswer: 'Comida'
      },
      {
        type: 'translate',
        question: 'Traduza: "Arroz"',
        options: ['Pexe', 'Aros', 'Kumi', 'Agu'],
        correctAnswer: 'Aros'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Peixe" em Crioulo?',
        options: ['Karni', 'Pexe', 'Aros', 'Sal'],
        correctAnswer: 'Pexe'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "N tene fomi"?',
        options: ['Estou com sede', 'Estou com fome', 'Estou cansado', 'Estou bem'],
        correctAnswer: 'Estou com fome',
        hint: '"Fomi" = fome'
      },
      {
        type: 'translate',
        question: 'Traduza: "Carne"',
        options: ['Karni', 'Pexe', 'Aros', 'Agu'],
        correctAnswer: 'Karni'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Estou com sede" em Crioulo?',
        options: ['N tene fomi', 'N tene sedi', 'N sta bon', 'N ka gosta'],
        correctAnswer: 'N tene sedi'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Sal"?',
        options: ['Açúcar', 'Sal', 'Pimenta', 'Óleo'],
        correctAnswer: 'Sal',
        hint: 'É igual ao Português!'
      }
    ]
  },
  {
    id: 'phrases-1',
    title: 'Frases do Dia a Dia',
    description: 'Expressões úteis para conversação',
    icon: '💬',
    category: 'phrases',
    xpReward: 100,
    isPremium: true,
    exercises: [
      {
        type: 'multiple-choice',
        question: 'O que significa "Bu pudi djuda-m"?',
        options: ['Onde fica?', 'Pode me ajudar?', 'Quanto custa?', 'Como você está?'],
        correctAnswer: 'Pode me ajudar?'
      },
      {
        type: 'multiple-choice',
        question: 'Como perguntar "Quanto custa?" em Crioulo?',
        options: ['Undi ki sta?', 'Kuma ki sta?', 'Kantu ki e kusta?', 'Ki ora ki e?'],
        correctAnswer: 'Kantu ki e kusta?'
      },
      {
        type: 'translate',
        question: 'Traduza: "Eu não entendo"',
        options: ['N intendi', 'N ka intendi', 'N sabi', 'N sta bon'],
        correctAnswer: 'N ka intendi',
        hint: '"Ka" é a negação em Crioulo'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Undi ki bu sta?"',
        options: ['Como você está?', 'Onde você está?', 'O que você faz?', 'Quem é você?'],
        correctAnswer: 'Onde você está?'
      },
      {
        type: 'multiple-choice',
        question: 'Como dizer "Eu gosto de ti" em Crioulo?',
        options: ['N gosta di bo', 'N ama bo', 'Bo bonitu', 'N ka gosta'],
        correctAnswer: 'N gosta di bo'
      },
      {
        type: 'translate',
        question: 'Traduza: "Eu sei"',
        options: ['N sabi', 'N ka sabi', 'N sta', 'N bai'],
        correctAnswer: 'N sabi'
      },
      {
        type: 'multiple-choice',
        question: 'Como dizer "Onde fica?" em Crioulo?',
        options: ['Kuma ki sta?', 'Undi ki sta?', 'Kantu e?', 'Kin ki e?'],
        correctAnswer: 'Undi ki sta?'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "N bai agora"?',
        options: ['Estou indo agora', 'Volto logo', 'Fico aqui', 'Não vou'],
        correctAnswer: 'Estou indo agora'
      },
      {
        type: 'translate',
        question: 'Traduza: "Até amanhã"',
        options: ['Te logu', 'Te manjan', 'Adios', 'Bon noti'],
        correctAnswer: 'Te manjan'
      },
      {
        type: 'multiple-choice',
        question: 'Como perguntar "Qual é o seu nome?" em Crioulo?',
        options: ['Kuma ki bu sta?', 'Kin ki bo e?', 'Kuma ki bu tchoma?', 'Undi ki bu mora?'],
        correctAnswer: 'Kuma ki bu tchoma?'
      }
    ]
  },
  {
    id: 'animals-1',
    title: 'Animais',
    description: 'Nomes de animais em Crioulo',
    icon: '🐄',
    category: 'basics',
    xpReward: 90,
    isPremium: true,
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Como se diz "Vaca" em Crioulo?',
        options: ['Gatu', 'Baka', 'Galinha', 'Kobra'],
        correctAnswer: 'Baka',
        hint: 'Baka na kume padja'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Gatu"?',
        options: ['Cão', 'Gato', 'Rato', 'Pássaro'],
        correctAnswer: 'Gato'
      },
      {
        type: 'translate',
        question: 'Traduza: "Galinha"',
        options: ['Galinha', 'Galu', 'Patu', 'Fatu'],
        correctAnswer: 'Galinha'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Cobra" em Crioulo?',
        options: ['Ratu', 'Sapu', 'Kobra', 'Lebri'],
        correctAnswer: 'Kobra',
        hint: 'Kobra na dobra kurpu'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Ratu"?',
        options: ['Gato', 'Rato', 'Sapo', 'Coelho'],
        correctAnswer: 'Rato'
      },
      {
        type: 'translate',
        question: 'Traduza: "Porco"',
        options: ['Baka', 'Galinha', 'Purku', 'Gatu'],
        correctAnswer: 'Purku'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Galo" em Crioulo?',
        options: ['Galinha', 'Galu', 'Fatu', 'Patu'],
        correctAnswer: 'Galu'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Lebri"?',
        options: ['Lobo', 'Lebre/Coelho', 'Leão', 'Leopardo'],
        correctAnswer: 'Lebre/Coelho'
      },
      {
        type: 'translate',
        question: 'Traduza: "Sapo"',
        options: ['Kobra', 'Ratu', 'Sapu', 'Pexe'],
        correctAnswer: 'Sapu'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Lubu"?',
        options: ['Lobo', 'Leão', 'Leopardo', 'Lagarto'],
        correctAnswer: 'Lobo'
      }
    ]
  },
  {
    id: 'body-1',
    title: 'Corpo Humano',
    description: 'Partes do corpo em Crioulo',
    icon: '🫀',
    category: 'basics',
    xpReward: 95,
    isPremium: true,
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Como se diz "Corpo" em Crioulo?',
        options: ['Kabesa', 'Kurpu', 'Mon', 'Pe'],
        correctAnswer: 'Kurpu'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Kabesa"?',
        options: ['Cabeça', 'Cabelo', 'Cara', 'Coração'],
        correctAnswer: 'Cabeça'
      },
      {
        type: 'translate',
        question: 'Traduza: "Mão"',
        options: ['Pe', 'Mon', 'Kabesa', 'Boka'],
        correctAnswer: 'Mon'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Pé" em Crioulo?',
        options: ['Mon', 'Pe', 'Kurpu', 'Didu'],
        correctAnswer: 'Pe'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Boka"?',
        options: ['Bochecha', 'Boca', 'Braço', 'Barriga'],
        correctAnswer: 'Boca'
      },
      {
        type: 'translate',
        question: 'Traduza: "Bigode"',
        options: ['Kabelu', 'Barba', 'Bigodi', 'Boka'],
        correctAnswer: 'Bigodi',
        hint: 'Gatu tene bigodi'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Sangue" em Crioulo?',
        options: ['Sal', 'Sangui', 'Sedi', 'Suku'],
        correctAnswer: 'Sangui'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Kabelu"?',
        options: ['Cabeça', 'Cabelo', 'Cara', 'Coração'],
        correctAnswer: 'Cabelo'
      },
      {
        type: 'translate',
        question: 'Traduza: "Dedo"',
        options: ['Mon', 'Pe', 'Didu', 'Boka'],
        correctAnswer: 'Didu'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Udju"?',
        options: ['Ouvido', 'Olho', 'Unha', 'Orelha'],
        correctAnswer: 'Olho'
      }
    ]
  },
  {
    id: 'nature-1',
    title: 'Natureza',
    description: 'Elementos da natureza em Crioulo',
    icon: '🌍',
    category: 'basics',
    xpReward: 90,
    isPremium: true,
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Como se diz "Água" em Crioulo?',
        options: ['Tera', 'Iagu', 'Sol', 'Lun\'a'],
        correctAnswer: 'Iagu'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Tcuba"?',
        options: ['Nuvem', 'Chuva', 'Trovão', 'Vento'],
        correctAnswer: 'Chuva',
        hint: 'Labraduris ta pera tcuba'
      },
      {
        type: 'translate',
        question: 'Traduza: "Terra"',
        options: ['Iagu', 'Sol', 'Tera', 'Lun\'a'],
        correctAnswer: 'Tera'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Lua" em Crioulo?',
        options: ['Sol', 'Strela', 'Lun\'a', 'Seu'],
        correctAnswer: 'Lun\'a'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Foli"?',
        options: ['Flor', 'Folha', 'Fruto', 'Floresta'],
        correctAnswer: 'Folha',
        hint: 'Fatu na kume foli'
      },
      {
        type: 'translate',
        question: 'Traduza: "Árvore"',
        options: ['Foli', 'Pau', 'Matu', 'Padja'],
        correctAnswer: 'Pau'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Palha" em Crioulo?',
        options: ['Foli', 'Padja', 'Matu', 'Tera'],
        correctAnswer: 'Padja',
        hint: 'Baka na kume padja'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Matu"?',
        options: ['Mar', 'Mato/Floresta', 'Monte', 'Montanha'],
        correctAnswer: 'Mato/Floresta'
      },
      {
        type: 'translate',
        question: 'Traduza: "Mar"',
        options: ['Iagu', 'Mar', 'Tera', 'Seu'],
        correctAnswer: 'Mar'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Tabanka"?',
        options: ['Tabaco', 'Aldeia/Vila', 'Casa', 'Cidade'],
        correctAnswer: 'Aldeia/Vila',
        hint: 'Nha tabanka i bunitu'
      }
    ]
  },
  {
    id: 'verbs-1',
    title: 'Verbos Comuns',
    description: 'Ações do dia a dia em Crioulo',
    icon: '🏃',
    category: 'phrases',
    xpReward: 100,
    isPremium: true,
    exercises: [
      {
        type: 'multiple-choice',
        question: 'O que significa "Kume"?',
        options: ['Correr', 'Comer', 'Cantar', 'Caminhar'],
        correctAnswer: 'Comer',
        hint: 'Baka na kume padja'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Beber" em Crioulo?',
        options: ['Bibi', 'Bai', 'Binka', 'Badja'],
        correctAnswer: 'Bibi'
      },
      {
        type: 'translate',
        question: 'Traduza: "Dormir"',
        options: ['Durmi', 'Dana', 'Dobra', 'Darma'],
        correctAnswer: 'Durmi'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Bai"?',
        options: ['Ficar', 'Ir', 'Vir', 'Voltar'],
        correctAnswer: 'Ir'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Dançar" em Crioulo?',
        options: ['Kanta', 'Badja', 'Brinka', 'Dana'],
        correctAnswer: 'Badja'
      },
      {
        type: 'translate',
        question: 'Traduza: "Cantar"',
        options: ['Badja', 'Brinka', 'Kanta', 'Kuri'],
        correctAnswer: 'Kanta'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Brinka"?',
        options: ['Brincar', 'Brigar', 'Brilhar', 'Beber'],
        correctAnswer: 'Brincar'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Correr" em Crioulo?',
        options: ['Kuri', 'Kume', 'Kanta', 'Kreba'],
        correctAnswer: 'Kuri'
      },
      {
        type: 'translate',
        question: 'Traduza: "Trabalhar"',
        options: ['Brinka', 'Trabadja', 'Durmi', 'Kanta'],
        correctAnswer: 'Trabadja'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Serka"?',
        options: ['Servir', 'Procurar/Caçar', 'Sentar', 'Cercar'],
        correctAnswer: 'Procurar/Caçar',
        hint: 'Zezinhu na serka santcu'
      }
    ]
  },
  {
    id: 'objects-1',
    title: 'Objetos do Cotidiano',
    description: 'Coisas do dia a dia em Crioulo',
    icon: '🏠',
    category: 'basics',
    xpReward: 85,
    isPremium: true,
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Como se diz "Casa" em Crioulo?',
        options: ['Kama', 'Kaza', 'Kadeira', 'Kanua'],
        correctAnswer: 'Kaza'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Kadeira"?',
        options: ['Cama', 'Caderno', 'Cadeira', 'Caixa'],
        correctAnswer: 'Cadeira'
      },
      {
        type: 'translate',
        question: 'Traduza: "Canoa"',
        options: ['Kaza', 'Kama', 'Kanua', 'Karu'],
        correctAnswer: 'Kanua'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Carro" em Crioulo?',
        options: ['Kanua', 'Karu', 'Karta', 'Kama'],
        correctAnswer: 'Karu'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Tidjela"?',
        options: ['Tigela', 'Tesoura', 'Tecido', 'Tenda'],
        correctAnswer: 'Tigela'
      },
      {
        type: 'translate',
        question: 'Traduza: "Faca"',
        options: ['Fera', 'Faka', 'Fiu', 'Forsa'],
        correctAnswer: 'Faka'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Garrafa" em Crioulo?',
        options: ['Gatu', 'Garafa', 'Galinha', 'Guera'],
        correctAnswer: 'Garafa'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Tenda"?',
        options: ['Tecido', 'Tenda/Loja', 'Telha', 'Tempo'],
        correctAnswer: 'Tenda/Loja'
      },
      {
        type: 'translate',
        question: 'Traduza: "Banco" (assento)',
        options: ['Baka', 'Banku', 'Biku', 'Bodi'],
        correctAnswer: 'Banku'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Karta"?',
        options: ['Carro', 'Carta', 'Casa', 'Caixa'],
        correctAnswer: 'Carta'
      }
    ]
  },
  {
    id: 'pronouns-1',
    title: 'Pronomes e Gramática',
    description: 'Pronomes pessoais e estrutura gramatical',
    icon: '📝',
    category: 'phrases',
    xpReward: 110,
    isPremium: true,
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Como se diz "Eu" em Crioulo?',
        options: ['No', 'Bo', 'N\'', 'El'],
        correctAnswer: 'N\''
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Bo"?',
        options: ['Eu', 'Tu/Você', 'Ele', 'Nós'],
        correctAnswer: 'Tu/Você'
      },
      {
        type: 'translate',
        question: 'Traduza: "Nós"',
        options: ['N\'', 'Bo', 'No', 'Elis'],
        correctAnswer: 'No'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Ele/Ela" em Crioulo?',
        options: ['N\'', 'Bo', 'El', 'No'],
        correctAnswer: 'El'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Elis"?',
        options: ['Ele', 'Ela', 'Eles/Elas', 'Vocês'],
        correctAnswer: 'Eles/Elas'
      },
      {
        type: 'translate',
        question: 'Traduza: "Meu/Minha"',
        options: ['Bo', 'Nha', 'Si', 'No'],
        correctAnswer: 'Nha',
        hint: 'Nha tabanka i bunitu'
      },
      {
        type: 'multiple-choice',
        question: 'Como se forma a negação em Crioulo?',
        options: ['Nau', 'Ka', 'Sin', 'Na'],
        correctAnswer: 'Ka',
        hint: 'N ka intendi = Eu não entendo'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Na" em Crioulo?',
        options: ['Não', 'Negação', 'Indica ação contínua', 'Indica passado'],
        correctAnswer: 'Indica ação contínua',
        hint: 'Baka na kume = A vaca está comendo'
      },
      {
        type: 'translate',
        question: 'Traduza: "Eu tenho"',
        options: ['N\' sta', 'N\' tene', 'N\' bai', 'N\' kume'],
        correctAnswer: 'N\' tene'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "I" em "Nha tabanka i bunitu"?',
        options: ['E (conjunção)', 'É (verbo ser)', 'Eu', 'Você'],
        correctAnswer: 'É (verbo ser)'
      }
    ]
  },
  {
    id: 'numbers-2',
    title: 'Números 11-100',
    description: 'Números maiores em Crioulo',
    icon: '💯',
    category: 'numbers',
    xpReward: 95,
    isPremium: true,
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Como se diz "Vinte" em Crioulo?',
        options: ['Des', 'Kinze', 'Vinti', 'Trinta'],
        correctAnswer: 'Vinti',
        hint: 'N\' tene vinti ovu'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Kinze"?',
        options: ['Cinco', 'Quinze', 'Cinquenta', 'Quatro'],
        correctAnswer: 'Quinze'
      },
      {
        type: 'translate',
        question: 'Traduza: "Cem"',
        options: ['Sinku', 'Sinkuenta', 'Sen', 'Sesenta'],
        correctAnswer: 'Sen'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Trinta" em Crioulo?',
        options: ['Trez', 'Trinta', 'Treze', 'Tirinta'],
        correctAnswer: 'Trinta'
      },
      {
        type: 'multiple-choice',
        question: 'Qual é "Kuarenta"?',
        options: ['Quatro', 'Quarenta', 'Catorze', 'Cinquenta'],
        correctAnswer: 'Quarenta'
      },
      {
        type: 'translate',
        question: 'Traduza: "Cinquenta"',
        options: ['Sinku', 'Kinze', 'Sinkuenta', 'Kuarenta'],
        correctAnswer: 'Sinkuenta'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Onze" em Crioulo?',
        options: ['Un', 'Onzi', 'Dozi', 'Des'],
        correctAnswer: 'Onzi'
      },
      {
        type: 'multiple-choice',
        question: 'O que significa "Dozi"?',
        options: ['Dez', 'Dois', 'Doze', 'Dezesseis'],
        correctAnswer: 'Doze'
      },
      {
        type: 'translate',
        question: 'Traduza: "Sessenta"',
        options: ['Seti', 'Sinkuenta', 'Sesenta', 'Setenta'],
        correctAnswer: 'Sesenta'
      },
      {
        type: 'multiple-choice',
        question: 'Como se diz "Oitenta" em Crioulo?',
        options: ['Oitu', 'Oitenta', 'Noventa', 'Setenta'],
        correctAnswer: 'Oitenta'
      }
    ]
  }
];

// Componente de Card de Lição
function LessonCard({ 
  lesson, 
  lessonIndex,
  isLocked, 
  isCompleted, 
  isPremiumLocked,
  progress,
  onStart 
}: { 
  lesson: Lesson; 
  lessonIndex: number;
  isLocked: boolean;
  isCompleted: boolean;
  isPremiumLocked: boolean;
  progress: number;
  onStart: () => void;
}) {
  const actuallyLocked = isLocked && !isPremiumLocked;
  
  const handleClick = () => {
    if (isPremiumLocked) {
      window.open('https://buy.stripe.com/bJe9AVfKLbGU476fyEf3a00', '_blank');
      return;
    }
    if (!isLocked) {
      onStart();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!actuallyLocked ? { scale: 1.02, y: -4 } : {}}
      className={`relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
        actuallyLocked 
          ? 'bg-muted/30 border-border/30 opacity-70' 
          : isPremiumLocked
            ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800 hover:border-amber-400 hover:shadow-lg'
            : isCompleted
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800'
              : 'bg-card border-border hover:border-primary/50 hover:shadow-lg'
      }`}
      onClick={handleClick}
    >
      {isCompleted && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}
      
      {isPremiumLocked && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
          <Crown className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className={`text-4xl p-3 rounded-xl ${
          isPremiumLocked ? 'bg-amber-100 dark:bg-amber-900/30' : isLocked ? 'bg-muted' : 'bg-gradient-to-br from-primary/10 to-secondary/10'
        }`}>
          {isPremiumLocked ? '🔒' : isLocked ? '🔒' : lesson.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-display font-bold text-lg ${actuallyLocked ? 'text-muted-foreground' : isPremiumLocked ? 'text-amber-700 dark:text-amber-400' : 'text-foreground'}`}>
              {lesson.title}
            </h3>
            {isPremiumLocked && (
              <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-full">
                PREMIUM
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {lesson.description}
          </p>
          
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
              <Star className="w-4 h-4 fill-current" />
              <span>{lesson.xpReward} XP</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>{lesson.exercises.length} exercícios</span>
            </div>
          </div>
          
          {!actuallyLocked && !isPremiumLocked && !isCompleted && progress > 0 && (
            <div className="mt-3">
              <Progress value={progress} className="h-2" />
              <span className="text-xs text-muted-foreground mt-1">{progress}% concluído</span>
            </div>
          )}
        </div>
        
        {(!actuallyLocked || isPremiumLocked) && (
          <ChevronRight className={`w-5 h-5 ${isCompleted ? 'text-green-500' : isPremiumLocked ? 'text-amber-500' : 'text-muted-foreground'}`} />
        )}
      </div>
    </motion.div>
  );
}

// Componente do Exercício
function ExerciseView({
  exercise,
  onAnswer,
  showResult,
  isCorrect
}: {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
  showResult: boolean;
  isCorrect: boolean | null;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (showResult) return;
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      onAnswer(selectedAnswer);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          {exercise.type === 'translate' && <Brain className="w-4 h-4" />}
          {exercise.type === 'multiple-choice' && <Target className="w-4 h-4" />}
          {exercise.type === 'translate' ? 'Traduza' : 'Escolha a resposta correta'}
        </span>
        
        <h2 className="text-2xl font-display font-bold text-foreground">
          {exercise.question}
        </h2>
        
        {exercise.hint && !showResult && (
          <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Dica: {exercise.hint}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
        {exercise.options?.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === exercise.correctAnswer;
          
          let buttonClass = 'p-4 rounded-xl border-2 text-left transition-all duration-200 font-medium ';
          
          if (showResult) {
            if (isCorrectOption) {
              buttonClass += 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300';
            } else if (isSelected && !isCorrectOption) {
              buttonClass += 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300';
            } else {
              buttonClass += 'border-border/50 bg-muted/30 text-muted-foreground';
            }
          } else {
            if (isSelected) {
              buttonClass += 'border-primary bg-primary/10 text-primary';
            } else {
              buttonClass += 'border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-foreground';
            }
          }
          
          return (
            <motion.button
              key={index}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              className={buttonClass}
              onClick={() => handleSelect(option)}
              disabled={showResult}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-sm font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
                {showResult && isCorrectOption && (
                  <Check className="w-5 h-5 text-green-500 ml-auto" />
                )}
                {showResult && isSelected && !isCorrectOption && (
                  <X className="w-5 h-5 text-red-500 ml-auto" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {!showResult && (
        <div className="flex justify-center pt-4">
          <Button 
            variant="hero" 
            size="lg"
            disabled={!selectedAnswer}
            onClick={handleSubmit}
            className="px-12"
          >
            Verificar
          </Button>
        </div>
      )}
    </div>
  );
}

// Página Principal de Aprendizagem
export default function LearnPage() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const isPremiumUser = profile?.plan === 'premium';
  
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [lives, setLives] = useState(3);
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('crioulo-xp');
    return saved ? parseInt(saved) : 0;
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('crioulo-streak');
    return saved ? parseInt(saved) : 0;
  });
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('crioulo-completed');
    return saved ? JSON.parse(saved) : [];
  });
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Salvar progresso
  useEffect(() => {
    localStorage.setItem('crioulo-xp', xp.toString());
    localStorage.setItem('crioulo-streak', streak.toString());
    localStorage.setItem('crioulo-completed', JSON.stringify(completedLessons));
  }, [xp, streak, completedLessons]);

  const isLessonPremiumLocked = (index: number) => {
    if (isPremiumUser) return false;
    return !FREE_LESSON_INDICES.includes(index);
  };

  const startLesson = (lesson: Lesson, index: number) => {
    if (isLessonPremiumLocked(index)) {
      window.open('https://buy.stripe.com/bJe9AVfKLbGU476fyEf3a00', '_blank');
      return;
    }
    setActiveLesson(lesson);
    setCurrentExerciseIndex(0);
    setShowResult(false);
    setIsCorrect(null);
    setLives(3);
    setCorrectAnswers(0);
  };

  const handleAnswer = (answer: string) => {
    if (!activeLesson) return;
    
    const correct = answer === activeLesson.exercises[currentExerciseIndex].correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
    }
  };

  const nextExercise = () => {
    if (!activeLesson) return;

    if (lives <= 0) {
      toast({
        title: "💔 Sem vidas!",
        description: "Tente novamente mais tarde ou pratique outra lição.",
        variant: "destructive"
      });
      setActiveLesson(null);
      return;
    }

    if (currentExerciseIndex < activeLesson.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setShowResult(false);
      setIsCorrect(null);
    } else {
      // Lição concluída
      const earnedXp = Math.round(activeLesson.xpReward * (correctAnswers / activeLesson.exercises.length));
      setXp(prev => prev + earnedXp);
      
      if (!completedLessons.includes(activeLesson.id)) {
        setCompletedLessons(prev => [...prev, activeLesson.id]);
      }

      toast({
        title: "🎉 Lição Concluída!",
        description: `Você ganhou ${earnedXp} XP! Continue assim!`,
      });
      
      setActiveLesson(null);
    }
  };

  const currentExercise = activeLesson?.exercises[currentExerciseIndex];
  const lessonProgress = activeLesson 
    ? ((currentExerciseIndex) / activeLesson.exercises.length) * 100 
    : 0;

  // Determinar nível baseado em XP
  const level = Math.floor(xp / 200) + 1;
  const xpForNextLevel = level * 200;
  const xpProgress = ((xp % 200) / 200) * 100;

  if (activeLesson && currentExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Header />
        
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header da Lição */}
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setActiveLesson(null)}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Sair
              </Button>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Heart 
                      key={i} 
                      className={`w-6 h-6 transition-all ${
                        i < lives 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-muted-foreground/30'
                      }`} 
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="mb-8">
              <Progress value={lessonProgress} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {currentExerciseIndex + 1} de {activeLesson.exercises.length}
              </p>
            </div>

            {/* Exercício */}
            <motion.div
              key={currentExerciseIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-2xl border border-border p-8 shadow-lg"
            >
              <ExerciseView
                exercise={currentExercise}
                onAnswer={handleAnswer}
                showResult={showResult}
                isCorrect={isCorrect}
              />
            </motion.div>

            {/* Resultado e Próximo */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mt-6 p-6 rounded-2xl ${
                    isCorrect 
                      ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <>
                          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-green-700 dark:text-green-300">Excelente! 🎉</h3>
                            <p className="text-sm text-green-600 dark:text-green-400">Continue assim!</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                            <X className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-red-700 dark:text-red-300">Resposta incorreta</h3>
                            <p className="text-sm text-red-600 dark:text-red-400">
                              A resposta certa era: <strong>{currentExercise.correctAnswer}</strong>
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <Button onClick={nextExercise} variant="hero">
                      Continuar
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
            >
              <BookOpen className="w-4 h-4" />
              Curso de Crioulo
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Aprenda <span className="text-gradient">Crioulo</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Domine o Crioulo da Guiné-Bissau com lições interativas e exercícios práticos!
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-4 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-foreground">{xp}</p>
              <p className="text-xs text-muted-foreground">XP Total</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-4 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-foreground">Nível {level}</p>
              <p className="text-xs text-muted-foreground">{xpProgress.toFixed(0)}% próximo</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-2xl p-4 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-foreground">{streak}</p>
              <p className="text-xs text-muted-foreground">Sequência</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-2xl p-4 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-2xl font-bold text-foreground">{completedLessons.length}</p>
              <p className="text-xs text-muted-foreground">Lições Completas</p>
            </motion.div>
          </div>

          {/* Lessons Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Lições Disponíveis
            </h2>
            
            <div className="grid gap-4">
              {lessons.map((lesson, index) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  lessonIndex={index}
                  isLocked={index > 0 && !completedLessons.includes(lessons[index - 1].id) && completedLessons.length < index}
                  isCompleted={completedLessons.includes(lesson.id)}
                  isPremiumLocked={isLessonPremiumLocked(index)}
                  progress={0}
                  onStart={() => startLesson(lesson, index)}
                />
              ))}
            </div>
          </div>

          {/* Back to Translator */}
          <div className="text-center mt-10">
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Tradutor
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
