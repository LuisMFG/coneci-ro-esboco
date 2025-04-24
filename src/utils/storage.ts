import { Candidate, VoterData } from "../types";

const STORAGE_KEYS = {
  CANDIDATES: 'coneci-ro-candidates',
  VOTERS: 'coneci-ro-voters',
};

// Initialize default candidates if none exist
export const initializeCandidates = (): Candidate[] => {
  const existingCandidates = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
  
  if (!existingCandidates) {
    const defaultCandidates: Candidate[] = [
      { id: 1, name: 'Godok', votes: 0 },
      { id: 2, name: 'Frank Ocean', votes: 0 },
      { id: 3, name: 'Leon Scott', votes: 0 },
    ];
    
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(defaultCandidates));
    return defaultCandidates;
  }
  
  return JSON.parse(existingCandidates);
};

export const getCandidates = (): Candidate[] => {
  const candidates = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
  return candidates ? JSON.parse(candidates) : initializeCandidates();
};

export const getVoters = (): VoterData[] => {
  const voters = localStorage.getItem(STORAGE_KEYS.VOTERS);
  return voters ? JSON.parse(voters) : [];
};

export const saveVote = (voterData: VoterData): boolean => {
  // Check if this person already voted
  const voters = getVoters();
  const alreadyVoted = voters.some(
    voter => voter.documentId === voterData.documentId
  );
  
  if (alreadyVoted) {
    return false;
  }
  
  // Update candidates
  const candidates = getCandidates();
  const updatedCandidates = candidates.map(candidate => 
    candidate.id === voterData.candidateId 
      ? { ...candidate, votes: candidate.votes + 1 } 
      : candidate
  );
  
  // Save updated data
  localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(updatedCandidates));
  localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify([...voters, voterData]));
  
  return true;
};

export const exportToCSV = (): string => {
  const candidates = getCandidates();
  const voters = getVoters();
  
  // Create CSV for candidates
  const candidatesCSV = [
    'ID,Nome,Votos',
    ...candidates.map(c => `${c.id},${c.name},${c.votes}`)
  ].join('\n');
  
  // Create CSV for voters
  const votersCSV = [
    'Nome,Email,Documento,Candidato ID',
    ...voters.map(v => `${v.name},${v.email},${v.documentId},${v.candidateId}`)
  ].join('\n');
  
  return `CANDIDATOS\n${candidatesCSV}\n\nVOTANTES\n${votersCSV}`;
};

export const downloadCSV = () => {
  const csv = exportToCSV();
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