import React, { useState, useEffect } from 'react';
import { onCandidatesChange, downloadCSV } from '../utils/firebase-storage';
import { Candidate } from '../types';
import { ArrowDownToLine } from 'lucide-react';

const VotingResults: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const unsubscribe = onCandidatesChange((candidateData) => {
      setCandidates(candidateData);
      const total = candidateData.reduce((sum, candidate) => sum + candidate.votes, 0);
      setTotalVotes(total);
    });
    return () => unsubscribe();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await downloadCSV();
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      alert("Erro ao exportar dados. Tente novamente.");
    }
    setIsExporting(false);
  };

  return (
    <section id="resultados" className="py-16 md:py-24 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Resultados da Eleição
            </h2>
            <p className="text-lg text-gray-600">
              Acompanhe em tempo real a quantidade de votos registrados para presidente do CONECI-RO.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 text-center">
            <h3 className="text-5xl font-bold text-green-700 mb-4">
              {totalVotes}
            </h3>
            <p className="text-xl text-gray-700">
              votos computados
            </p>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 shadow-md disabled:bg-gray-400"
              >
                <ArrowDownToLine className="mr-2" size={20} />
                {isExporting ? "Exportando..." : "Exportar Resultados (CSV)"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VotingResults;
