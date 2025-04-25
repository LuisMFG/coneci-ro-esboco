import React, { useState, useEffect } from 'react';
import { onCandidatesChange, saveVote } from '../utils/firebase-storage';
import { Candidate, VoterData } from '../types';
import { Check, ChevronRight } from 'lucide-react';

const VotingForm: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<VoterData, 'candidateId'>>({
    name: '',
    email: '',
    documentId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Inscrever-se para atualizações em tempo real
    const unsubscribe = onCandidatesChange(newCandidates => {
      setCandidates(newCandidates);
    });
    
    // Cancelar inscrição ao desmontar
    return () => unsubscribe();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.documentId.trim()) {
      newErrors.documentId = 'Documento é obrigatório';
    } else if (formData.documentId.length < 5) {
      newErrors.documentId = 'Documento inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCandidateSelect = (id: number) => {
    setSelectedCandidate(id);
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedCandidate) return;
    
    setSubmitStatus('loading');
    
    try {
      const success = await saveVote({
        ...formData,
        candidateId: selectedCandidate
      });
      
      if (success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', documentId: '' });
        setTimeout(() => {
          setShowForm(false);
          setSelectedCandidate(null);
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
        setErrors(prev => ({ 
          ...prev, 
          documentId: 'Este documento já foi utilizado para votação' 
        }));
      }
    } catch (error) {
      console.error("Erro ao enviar voto:", error);
      setSubmitStatus('error');
      setErrors(prev => ({ 
        ...prev, 
        general: 'Ocorreu um erro ao processar seu voto. Tente novamente.' 
      }));
    }
  };

  return (
    <section id="votacao" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-950 mb-4">
              Votação
            </h2>
            <p className="text-lg text-gray-600">
              Escolha seu candidato
            </p>
          </div>

          {!showForm ? (
            <div className="space-y-6">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="group flex items-center bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
                    <img
                      src="https://preview.redd.it/msn-avatars-of-all-colors-v0-h70w8hxd5uha1.png?width=1024&format=png&auto=webp&s=ea9360b378a5f63881fc093f5c9097a60eadc47e"
                      alt={candidate.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-green-950 mb-2">
                          {candidate.name}
                        </h3>
                        <p className="text-gray-600">
                          Candidato
                        </p>
                      </div>
                      <button
                        onClick={() => handleCandidateSelect(candidate.id)}
                        className="flex items-center space-x-2 bg-green-950 text-white py-2 px-4 rounded-xl hover:bg-green-900 transition-colors duration-300"
                      >
                        <span>Votar</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-xl flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  Seu voto foi registrado com sucesso! Obrigado por participar.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-xl">
                  Erro ao registrar voto. Verifique os dados e tente novamente.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {['name', 'email', 'documentId'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field === 'name' ? 'Nome Completo' : 
                       field === 'email' ? 'Email' : 
                       'Número do Documento (CPF/RG)'}
                    </label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={formData[field as keyof typeof formData]}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors[field] ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors`}
                      placeholder={`Digite seu ${
                        field === 'name' ? 'nome completo' : 
                        field === 'email' ? 'email' : 
                        'documento'
                      }`}
                    />
                    {errors[field] && (
                      <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
                    )}
                  </div>
                ))}

                {errors.general && (
                  <p className="text-sm text-red-600">{errors.general}</p>
                )}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedCandidate(null);
                    }}
                    className="flex-1 py-3 px-6 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={submitStatus === 'loading'}
                    className="flex-1 bg-green-950 text-white py-3 px-6 rounded-xl hover:bg-green-900 transition-colors duration-300 disabled:bg-gray-400"
                  >
                    {submitStatus === 'loading' ? 'Enviando...' : 'Confirmar Voto'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VotingForm;