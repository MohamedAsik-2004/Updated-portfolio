import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAdminCertifications, createCertification, updateCertification, deleteCertification } from '../../api/adminApi';

// Validation Schema
const certificationFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  issuer: z.string().min(1, 'Issuer is required.'),
  issueDate: z.string().min(1, 'Issue date is required (e.g. Jun 2026).'),
  credentialId: z.string().default(''),
  description: z.string().min(1, 'Description is required.'),
  displayOrder: z.coerce.number().min(0, 'Must be 0 or higher.'),
});

export default function CertificationsManager() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [formError, setFormError] = useState('');

  // Fetch Certifications
  const { data: certifications, isLoading, isError } = useQuery({
    queryKey: ['adminCertifications'],
    queryFn: getAdminCertifications,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(certificationFormSchema),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createCertification,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCertifications']);
      queryClient.invalidateQueries(['certifications']);
      handleCloseModal();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create certification.';
      setFormError(msg);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateCertification,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCertifications']);
      queryClient.invalidateQueries(['certifications']);
      handleCloseModal();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to update certification.';
      setFormError(msg);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCertification,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCertifications']);
      queryClient.invalidateQueries(['certifications']);
    },
  });

  // Form togglers
  const handleOpenCreate = () => {
    setEditingCert(null);
    setFormError('');
    reset({
      title: '',
      issuer: '',
      issueDate: '',
      credentialId: '',
      description: '',
      displayOrder: 0,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cert) => {
    setEditingCert(cert);
    setFormError('');
    reset({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      credentialId: cert.credentialId,
      description: cert.description,
      displayOrder: cert.displayOrder,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCert(null);
    setFormError('');
  };

  // Submit Handler
  const onSubmit = (data) => {
    setFormError('');
    if (editingCert) {
      updateMutation.mutate({ id: editingCert._id, certData: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header controls bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-white">
            Certifications & Internships
          </h1>
          <p className="body-text text-sm">Add, remove, and manage your verified qualifications.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-primary text-on-primary font-bold text-xs tracking-wider uppercase px-4 py-3 rounded-xl hover:bg-white hover:text-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <i className="fas fa-plus text-[10px]" /> Add Certification
        </button>
      </div>

      {isLoading ? (
        <div className="py-24 flex justify-center">
          <div className="relative w-12 h-12 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
        </div>
      ) : isError ? (
        <div className="glass-card rounded-2xl p-8 text-center text-red-400">
          <i className="fas fa-exclamation-triangle text-2xl mb-2" />
          <p className="text-sm font-semibold">Failed to fetch certifications.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications?.map((c) => (
            <div 
              key={c._id} 
              className="flex flex-col justify-between group p-6 rounded-2xl glass-card border border-white/5 hover:border-white/10 transition-all font-sans relative"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary font-bold tracking-wider uppercase">
                    {c.issuer}
                  </span>
                  <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="w-7 h-7 rounded-md bg-surface-container border border-white/5 text-on-surface hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
                      title="Edit Certification"
                    >
                      <i className="fas fa-edit text-[10px]" />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="w-7 h-7 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete Certification"
                    >
                      <i className="fas fa-trash-alt text-[10px]" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-white text-base md:text-lg mt-4 mb-2">{c.title}</h3>
                
                <div className="space-y-1 text-xs text-on-surface-variant font-mono mb-4">
                  <div>Issued: {c.issueDate}</div>
                  {c.credentialId && <div>ID: {c.credentialId}</div>}
                  <div>Display Order: {c.displayOrder}</div>
                </div>

                <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                  {c.description}
                </p>
              </div>
            </div>
          ))}
          {(!certifications || certifications.length === 0) && (
            <div className="col-span-full py-16 text-center glass-card rounded-2xl border border-white/5">
              <i className="fas fa-certificate text-3xl text-on-surface-variant mb-3" />
              <p className="text-on-surface-variant text-sm italic">No certifications listed. Add one to see it live.</p>
            </div>
          )}
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#000]/65 backdrop-blur-sm" onClick={handleCloseModal} />
          
          <div className="relative glass-card rounded-2xl border border-white/10 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-8 z-10 shadow-2xl">
            <h2 className="font-montserrat font-bold text-xl text-white mb-6">
              {editingCert ? 'Modify Credentials' : 'Add New Credentials'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Form Error */}
              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold">
                  {formError}
                </div>
              )}

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-on-surface-variant tracking-wider uppercase font-semibold">
                  Title / Qualification Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Internship in Full Stack Development"
                  className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all w-full"
                  {...register('title')}
                />
                {errors.title && <span className="text-red-400 text-[10px] font-semibold">{errors.title.message}</span>}
              </div>

              {/* Issuer */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-on-surface-variant tracking-wider uppercase font-semibold">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Novitech R&D Private Limited"
                  className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all w-full"
                  {...register('issuer')}
                />
                {errors.issuer && <span className="text-red-400 text-[10px] font-semibold">{errors.issuer.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Issue Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-on-surface-variant tracking-wider uppercase font-semibold">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jun 2026"
                    className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all w-full"
                    {...register('issueDate')}
                  />
                  {errors.issueDate && <span className="text-red-400 text-[10px] font-semibold">{errors.issueDate.message}</span>}
                </div>

                {/* Credential ID */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-on-surface-variant tracking-wider uppercase font-semibold">
                    Credential ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AB12345Z"
                    className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all w-full"
                    {...register('credentialId')}
                  />
                  {errors.credentialId && <span className="text-red-400 text-[10px] font-semibold">{errors.credentialId.message}</span>}
                </div>
              </div>

              {/* Display Order */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-on-surface-variant tracking-wider uppercase font-semibold">
                  Display Priority order
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all w-full"
                  {...register('displayOrder')}
                />
                {errors.displayOrder && <span className="text-red-400 text-[10px] font-semibold">{errors.displayOrder.message}</span>}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-on-surface-variant tracking-wider uppercase font-semibold">
                  Description of Activities
                </label>
                <textarea
                  placeholder="Describe your role, skills gained, and key technologies implemented..."
                  rows={4}
                  className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all w-full resize-none"
                  {...register('description')}
                />
                {errors.description && <span className="text-red-400 text-[10px] font-semibold">{errors.description.message}</span>}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs tracking-wider uppercase px-4 py-3 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                  className="bg-primary text-on-primary hover:bg-white hover:text-black font-bold text-xs tracking-wider uppercase px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  {(createMutation.isLoading || updateMutation.isLoading) ? (
                    <>
                      <div className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save changes'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
