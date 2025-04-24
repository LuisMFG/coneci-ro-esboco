export interface Candidate {
  id: number;
  name: string;
  votes: number;
}

export interface VoterData {
  name: string;
  email: string;
  documentId: string;
  candidateId: number;
}

export interface ChartData {
  labels: string[];
  values: number[];
}