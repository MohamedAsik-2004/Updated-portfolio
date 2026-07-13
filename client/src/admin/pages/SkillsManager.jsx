import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAdminSkills, createSkill, updateSkill, deleteSkill } from '../../api/adminApi';

// Validation Schema
const skillFormSchema = z.object({
  name: z.string().min(1, 'Skill name is required.'),
  category: z.enum(['frontend', 'backend'], {
    errorMap: () => ({ message: 'Category must be either frontend or backend.' }),
  }),
  percentage: z.coerce.number()
    .min(0, 'Percentage cannot be below 0.')
    .max(100, 'Percentage cannot exceed 100.'),
  iconClass: z.string().min(1, 'Icon class code is required (e.g. fab fa-react).'),
  displayOrder: z.coerce.number().min(0, 'Must be 0 or higher.'),
});

export default function SkillsManager() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formError, setFormError] = useState('');

  // Fetch Skills
  const { data: skills, isLoading, isError } = useQuery({
    queryKey: ['adminSkills'],
    queryFn: getAdminSkills,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(skillFormSchema),
  });

  // Watch variables to update the live preview of progress bar
  const watchName = watch('name', '');
  const watchPercent = watch('percentage', 0);
  const watchIconClass = watch('iconClass', 'fab fa-react');

  // Mutations
  const createMutation = useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminSkills']);
      handleCloseModal();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create skill.';
      setFormError(msg);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateSkill,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminSkills']);
      handleCloseModal();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to update skill.';
      setFormError(msg);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminSkills']);
    },
  });

  // Form togglers
  const handleOpenCreate = () => {
    setEditingSkill(null);
    setFormError('');
    reset({
      name: '',
      category: 'frontend',
      percentage: 80,
      iconClass: 'fab fa-js-square',
      displayOrder: 0,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setFormError('');
    reset({
      name: skill.name,
      category: skill.category,
      percentage: skill.percentage,
      iconClass: skill.iconClass,
      displayOrder: skill.displayOrder,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingSkill(null);
    setFormError('');
  };

  // Submit Handler
  const onSubmit = (data) => {
    setFormError('');
    if (editingSkill) {
      updateMutation.mutate({ id: editingSkill._id, skillData: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this skill from standard categories?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header controls bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-white">
            Technical Capabilities
          </h1>
          <p className="body-text text-sm">Organize, structure, and categorize progress levels.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-primary text-on-primary font-bold text-xs tracking-wider uppercase px-4 py-3 rounded-xl hover:bg-white hover:text-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <i className="fas fa-plus text-[10px]" /> Add Skill
        </button>
      </div>

      {isLoading ? (
        <div className="py-24 flex justify-center">
          <div className="relative w-12 h-12 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
        </div>
      ) : isError ? (
        <div className="glass-card rounded-2xl p-8 text-center text-red-400">
          <i className="fas fa-exclamation-triangle text-2xl mb-2" />
          <p className="text-sm font-semibold">Failed to fetch technical capabilities log.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Frontend Column */}
          <div className="rounded-2xl glass-card border border-white/5 p-6 space-y-6">
            <h2 className="font-montserrat font-bold text-lg text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <i className="fas fa-laptop-code text-primary text-base" />
              Frontend Skills
            </h2>
            <div className="space-y-4">
              {skills && skills.filter(s => s.category === 'frontend').map((s) => (
                <div key={s._id} className="flex items-center justify-between group p-3 bg-white/2 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <i className={s.iconClass} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{s.name}</h4>
                      <p className="text-[10px] text-tertiary font-mono">Percentage: {s.percentage}% | Priority: {s.displayOrder}</p>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="w-7 h-7 rounded-md bg-surface-container border border-white/5 text-on-surface hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <i className="fas fa-edit text-[10px]" />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="w-7 h-7 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <i className="fas fa-trash-alt text-[10px]" />
                    </button>
                  </div>
                </div>
              ))}
              {skills && skills.filter(s => s.category === 'frontend').length === 0 && (
                <p className="text-on-surface-variant text-sm italic py-4">No Frontend skills in Database.</p>
              )}
            </div>
          </div>

          {/* Backend Column */}
          <div className="rounded-2xl glass-card border border-white/5 p-6 space-y-6">
            <h2 className="font-montserrat font-bold text-lg text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <i className="fas fa-server text-primary text-base" />
              Backend Skills
            </h2>
            <div className="space-y-4">
              {skills && skills.filter(s => s.category === 'backend').map((s) => (
                <div key={s._id} className="flex items-center justify-between group p-3 bg-white/2 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <i className={s.iconClass} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{s.name}</h4>
                      <p className="text-[10px] text-tertiary font-mono">Percentage: {s.percentage}% | Priority: {s.displayOrder}</p>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="w-7 h-7 rounded-md bg-surface-container border border-white/5 text-on-surface hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <i className="fas fa-edit text-[10px]" />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="w-7 h-7 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <i className="fas fa-trash-alt text-[10px]" />
                    </button>
                  </div>
                </div>
              ))}
              {skills && skills.filter(s => s.category === 'backend').length === 0 && (
                <p className="text-on-surface-variant text-sm italic py-4">No Backend skills in Database.</p>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Modal drawer for Create/Edit skill */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl glass-card border border-white/10 p-6 md:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h3 className="font-montserrat font-bold text-lg text-white">
                {editingSkill ? 'Modify Skill' : 'Create New Skill'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
              >
                <i className="fas fa-times text-lg" />
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <i className="fas fa-exclamation-circle text-sm" />
                {formError}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Skill Name */}
              <div className="space-y-1.5">
                <label className="mono-label text-[11px] text-tertiary">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. React 18"
                  className={`w-full bg-surface-container border ${
                    errors.name ? 'border-red-500' : 'border-white/10'
                  } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-2.5 text-on-surface text-sm`}
                  {...register('name')}
                />
                {errors.name && <p className="text-red-500 text-xs font-mono">{errors.name.message}</p>}
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="mono-label text-[11px] text-tertiary">Category</label>
                <select
                  className={`w-full bg-surface-container border ${
                    errors.category ? 'border-red-500' : 'border-white/10'
                  } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-2.5 text-on-surface text-sm cursor-pointer`}
                  {...register('category')}
                >
                  <option value="frontend">Frontend Skill</option>
                  <option value="backend">Backend Skill</option>
                </select>
                {errors.category && <p className="text-red-500 text-xs font-mono">{errors.category.message}</p>}
              </div>

              {/* Icon Class */}
              <div className="space-y-1.5">
                <label className="mono-label text-[11px] text-tertiary">FontAwesome Icon Class</label>
                <input
                  type="text"
                  placeholder="e.g. fab fa-react"
                  className={`w-full bg-surface-container border ${
                    errors.iconClass ? 'border-red-500' : 'border-white/10'
                  } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-2.5 text-on-surface text-sm`}
                  {...register('iconClass')}
                />
                {errors.iconClass && <p className="text-red-500 text-xs font-mono">{errors.iconClass.message}</p>}
              </div>

              {/* Grid: Order Priority & Percentage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Priority order */}
                <div className="space-y-1.5">
                  <label className="mono-label text-[11px] text-tertiary">Display Priority</label>
                  <input
                    type="number"
                    className={`w-full bg-surface-container border ${
                      errors.displayOrder ? 'border-red-500' : 'border-white/10'
                    } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-2.5 text-on-surface text-sm`}
                    {...register('displayOrder')}
                  />
                </div>

                {/* Percentage */}
                <div className="space-y-1.5">
                  <label className="mono-label text-[11px] text-tertiary">Percentage (0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className={`w-full bg-surface-container border ${
                      errors.percentage ? 'border-red-500' : 'border-white/10'
                    } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-2.5 text-on-surface text-sm`}
                    {...register('percentage')}
                  />
                  {errors.percentage && <p className="text-red-500 text-xs font-mono">{errors.percentage.message}</p>}
                </div>
              </div>

              {/* Live Preview Container bar */}
              <div className="border border-white/10 rounded-xl p-4 bg-white/2 space-y-2 mt-4">
                <p className="text-[10px] font-mono text-tertiary uppercase tracking-wider">Live Preview progress widget</p>
                <div className="flex justify-between text-xs font-medium text-on-surface">
                  <span className="flex items-center gap-1.5">
                    <i className={watchIconClass || 'fab fa-react'} />
                    {watchName || 'Untitled skill'}
                  </span>
                  <span className="font-mono text-primary font-bold">{watchPercent || 0}%</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-inverse-primary rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, Number(watchPercent) || 0))}%` }}
                  />
                </div>
              </div>

              {/* Buttons footer */}
              <div className="flex gap-4 pt-4 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-1/2 bg-surface-container border border-white/10 py-3 rounded-xl text-center text-xs font-semibold uppercase hover:bg-white/5 text-on-surface transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                  className="w-1/2 bg-primary text-on-primary py-3 rounded-xl text-center text-xs font-semibold uppercase primary-glow hover:bg-white hover:text-black transition-colors cursor-pointer disabled:opacity-50"
                >
                  {createMutation.isLoading || updateMutation.isLoading ? 'Processing...' : 'Save details'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
