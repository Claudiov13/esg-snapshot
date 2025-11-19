'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type DocumentOption = {
  id: string;
  title: string;
  status: string;
};

const maturityOptions = ['Iniciante', 'Intermediário', 'Avançado'];
const sizeOptions = ['Pequena', 'Média', 'Grande'];
const riskOptions = ['Baixa', 'Média', 'Alta'];
const dataCoverageOptions = ['Limitada', 'Parcial', 'Completa'];
const engagementOptions = ['Inicial', 'Em desenvolvimento', 'Estruturado'];

export function EsgReportForm({ documents }: { documents: DocumentOption[] }) {
  const router = useRouter();
  const [formState, setFormState] = useState({
    companyName: '',
    industry: '',
    companySize: sizeOptions[0],
    region: '',
    maturity: maturityOptions[0],
    themes: '',
    website: ''
  });
  const [questionnaire, setQuestionnaire] = useState({
    esgGoals: '',
    supplyChainProfile: '',
    stakeholderConcerns: '',
    partnerRegions: '',
    riskTolerance: riskOptions[1],
    dataReliability: dataCoverageOptions[1],
    supplierEngagement: engagementOptions[1],
    supplierNotes: ''
  });
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionnaire = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setQuestionnaire((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDocument = (id: string) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          questionnaire,
          documentIds: selectedDocs
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? 'Não foi possível gerar o relatório.');
      }

      const data = await response.json();
      router.push(`/dashboard/reports/${data.report.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
      <section className="form-section">
        <div className="form-section__header">
          <h3 style={{ margin: 0 }}>Dados da empresa</h3>
          <p className="form-hint">Informações básicas para contextualizar o relatório.</p>
        </div>
        <div className="form-grid">
          <label className="form-field">
            Nome da empresa
            <input type="text" name="companyName" value={formState.companyName} onChange={handleInput} required />
          </label>
          <label className="form-field">
            Setor de atuação
            <input type="text" name="industry" value={formState.industry} onChange={handleInput} required />
          </label>
        </div>
        <div className="form-grid--columns">
          <label className="form-field">
            Porte
            <select name="companySize" value={formState.companySize} onChange={handleInput}>
              {sizeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="form-field">
            País / Região
            <input type="text" name="region" value={formState.region} onChange={handleInput} required />
          </label>
          <label className="form-field">
            Maturidade ESG
            <select name="maturity" value={formState.maturity} onChange={handleInput}>
              {maturityOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="form-field">
          Principais temas ESG
          <textarea name="themes" rows={4} value={formState.themes} onChange={handleInput} placeholder="Ex.: descarbonização, diversidade, governança..." required />
        </label>
        <label className="form-field">
          Site da empresa (opcional)
          <input type="url" name="website" value={formState.website} onChange={handleInput} placeholder="https://" />
        </label>
      </section>

      <section className="form-section">
        <div className="form-section__header">
          <h3 style={{ margin: 0 }}>Questionário orientado</h3>
          <p className="form-hint">Responda para que a IA adapte o relatório à sua realidade ou à de seus fornecedores.</p>
        </div>
        <label className="form-field">
          Metas e prioridades ESG (até 3 metas principais)
          <textarea name="esgGoals" rows={3} value={questionnaire.esgGoals} onChange={handleQuestionnaire} required />
        </label>
        <label className="form-field">
          Como funciona a sua cadeia de fornecedores/parceiros?
          <textarea name="supplyChainProfile" rows={3} value={questionnaire.supplyChainProfile} onChange={handleQuestionnaire} required />
        </label>
        <label className="form-field">
          Principais preocupações de stakeholders
          <textarea name="stakeholderConcerns" rows={3} value={questionnaire.stakeholderConcerns} onChange={handleQuestionnaire} required />
        </label>
        <label className="form-field">
          Regiões ou tipos de fornecedores mais críticos
          <input type="text" name="partnerRegions" value={questionnaire.partnerRegions} onChange={handleQuestionnaire} placeholder="Ex.: América Latina, fornecedores críticos de energia" required />
        </label>
        <div className="form-grid--columns">
          <label className="form-field">
            Tolerância a riscos ESG
            <select name="riskTolerance" value={questionnaire.riskTolerance} onChange={handleQuestionnaire}>
              {riskOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="form-field">
            Maturidade do engajamento com fornecedores
            <select name="supplierEngagement" value={questionnaire.supplierEngagement} onChange={handleQuestionnaire}>
              {engagementOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="form-field">
            Qualidade dos dados ESG disponíveis
            <select name="dataReliability" value={questionnaire.dataReliability} onChange={handleQuestionnaire}>
              {dataCoverageOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="form-field">
          Observações adicionais sobre fornecedores/parceiros (opcional)
          <textarea name="supplierNotes" rows={3} value={questionnaire.supplierNotes} onChange={handleQuestionnaire} placeholder="Inclua políticas existentes, riscos emergentes ou iniciativas em andamento." />
        </label>
      </section>

      <section className="form-section">
        <div className="form-section__header">
          <h3 style={{ margin: 0 }}>Documentos para referência</h3>
          <p className="form-hint">Envie PDFs primeiro para vinculá-los aos relatórios. Eles ajudam a IA a contextualizar.</p>
        </div>
        <div className="form-grid" style={{ gap: '0.75rem' }}>
          {documents.length === 0 && <p className="form-hint">Nenhum PDF enviado ainda.</p>}
          {documents.map((doc) => (
            <label key={doc.id} className="form-field" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={selectedDocs.includes(doc.id)}
                onChange={() => toggleDocument(doc.id)}
                style={{ width: 'auto' }}
              />
              <span>
                {doc.title} <small style={{ color: 'var(--gray-500)' }}>({doc.status})</small>
              </span>
            </label>
          ))}
        </div>
      </section>

      {error && <p style={{ color: 'var(--brand-primary)' }}>{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Gerando relatório...' : 'Gerar relatório ESG com IA'}
      </Button>
    </form>
  );
}
