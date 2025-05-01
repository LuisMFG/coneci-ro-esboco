import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, runTransaction } from 'firebase/database';
import { Candidate, VoterData } from "../types";


const firebaseConfig = {
  apiKey: "-",
  authDomain: "-",
  databaseURL: "-",
  projectId: "coneci-ro",
  storageBucket: "coneci-ro.firebasestorage.app",
  messagingSenderId: "276280854470",
  appId: "1:276280854470:web:2f00d2b3242244f7ea14c7",
  measurementId: "G-5RM9GG0H50"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const DB_KEYS = {
  CANDIDATES: 'candidates',
  VOTERS: 'voters',
};

// Inicializar candidatos padrão se não existirem
export const initializeCandidates = async (): Promise<Candidate[]> => {
  const candidatesRef = ref(database, DB_KEYS.CANDIDATES);
  const snapshot = await get(candidatesRef);
  
  if (!snapshot.exists()) {
    const defaultCandidates: Candidate[] = [
      { id: 1, name: 'Godok', votes: 0 },
      { id: 2, name: 'Frank Ocean', votes: 0 },
      { id: 3, name: 'Leon Scott', votes: 0 },
    ];
    
    await set(candidatesRef, defaultCandidates);
    return defaultCandidates;
  }
  
  return snapshot.val();
};

// Obter candidatos (versão com promessa para uso único)
export const getCandidatesOnce = async (): Promise<Candidate[]> => {
  const candidatesRef = ref(database, DB_KEYS.CANDIDATES);
  const snapshot = await get(candidatesRef);
  
  if (!snapshot.exists()) {
    return initializeCandidates();
  }
  
  return snapshot.val();
};

// Obter candidatos (versão com callback para atualizações em tempo real)
export const onCandidatesChange = (callback: (candidates: Candidate[]) => void): (() => void) => {
  const candidatesRef = ref(database, DB_KEYS.CANDIDATES);
  
  // Primeiro, verificamos se os candidatos existem
  get(candidatesRef).then(snapshot => {
    if (!snapshot.exists()) {
      initializeCandidates().then(candidates => callback(candidates));
    }
  });
  
  // Configuramos o listener para mudanças
  const unsubscribe = onValue(candidatesRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  });
  
  // Retorna função para cancelar a inscrição
  return unsubscribe;
};

// Obter votantes
export const getVoters = async (): Promise<VoterData[]> => {
  const votersRef = ref(database, DB_KEYS.VOTERS);
  const snapshot = await get(votersRef);
  
  if (!snapshot.exists()) {
    return [];
  }
  
  // Converte o objeto para array
  const votersObj = snapshot.val();
  return Object.keys(votersObj).map(key => votersObj[key]);
};

// Salvar voto
export const saveVote = async (voterData: VoterData): Promise<boolean> => {
  try {
    // Verificar se esta pessoa já votou
    const votersRef = ref(database, `${DB_KEYS.VOTERS}`);
    const snapshot = await get(votersRef);
    
    if (snapshot.exists()) {
      const votersData = snapshot.val();
      // Verifica se já existe documento
      for (const key in votersData) {
        if (votersData[key].documentId === voterData.documentId) {
          return false; // Já votou
        }
      }
    }
    
    // Atualizar candidato com transação para evitar conflitos
    const candidateRef = ref(database, `${DB_KEYS.CANDIDATES}/${voterData.candidateId - 1}`);
    await runTransaction(candidateRef, (candidate) => {
      if (candidate) {
        candidate.votes = (candidate.votes || 0) + 1;
      }
      return candidate;
    });
    
    // Salvar dados do votante (usando documentId como chave)
    const voterRef = ref(database, `${DB_KEYS.VOTERS}/${voterData.documentId}`);
    await set(voterRef, voterData);
    
    return true;
  } catch (error) {
    console.error("Erro ao salvar voto:", error);
    return false;
  }
};

// Exportar para CSV
export const exportToCSV = async (): Promise<string> => {
  const candidates = await getCandidatesOnce();
  const voters = await getVoters();
  
  // Criar CSV para candidatos
  const candidatesCSV = [
    'ID,Nome,Votos',
    ...candidates.map(c => `${c.id},${c.name},${c.votes}`)
  ].join('\n');
  
  // Criar CSV para votantes
  const votersCSV = [
    'Nome,Email,Documento,Candidato ID',
    ...voters.map(v => `${v.name},${v.email},${v.documentId},${v.candidateId}`)
  ].join('\n');
  
  return `CANDIDATOS\n${candidatesCSV}\n\nVOTANTES\n${votersCSV}`;
};

// Download CSV
export const downloadCSV = async () => {
  const csv = await exportToCSV();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `coneci-ro-votacao-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
