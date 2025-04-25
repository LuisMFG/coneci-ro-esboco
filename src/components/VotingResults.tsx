import React, { useState, useEffect, useRef } from 'react';
import { onCandidatesChange, downloadCSV } from '../utils/firebase-storage';
import { Candidate, ChartData } from '../types';
import { BarChart, ArrowDownToLine } from 'lucide-react';

const VotingResults: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [chartData, setChartData] = useState<ChartData>({ labels: [], values: [] });
  const [totalVotes, setTotalVotes] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // Inscrever-se para atualizações em tempo real do Firebase
    const unsubscribe = onCandidatesChange((candidateData) => {
      setCandidates(candidateData);
      
      // Calcular total de votos
      const total = candidateData.reduce((sum, candidate) => sum + candidate.votes, 0);
      setTotalVotes(total);
      
      // Preparar dados do gráfico
      setChartData({
        labels: candidateData.map(c => c.name),
        values: candidateData.map(c => c.votes)
      });
    });
    
    // Cancelar inscrição ao desmontar
    return () => unsubscribe();
  }, []);

  const renderChart = () => {
    // Visualização simples de barras sem bibliotecas externas
    const maxVotes = Math.max(...chartData.values, 1);
    
    return (
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
          <BarChart className="mr-2" size={20} />
          Resultados da Votação
        </h3>
        
        <div className="space-y-4">
          {candidates.map((candidate, index) => {
            const percentage = totalVotes > 0 
              ? Math.round((candidate.votes / totalVotes) * 100) 
              : 0;
            
            return (
              <div key={candidate.id} className="relative">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-700">{candidate.name}</span>
                  <span className="text-gray-600">{candidate.votes} votos ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        
        {totalVotes === 0 && (
          <div className="text-center py-4 text-gray-500">
            Nenhum voto registrado ainda.
          </div>
        )}
      </div>
    );
  };
  
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
              Acompanhe em tempo real os resultados da votação para presidente do CONECI-RO.
              Total de {totalVotes} votos computados.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
            {renderChart()}
            
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