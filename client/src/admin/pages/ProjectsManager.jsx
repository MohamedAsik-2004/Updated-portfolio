import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAdminProjects, createProject, updateProject, deleteProject } from '../../api/adminApi';

// Validation Schema
const projectFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(5, 'Description must be at least 5 characters.'),
  githubUrl: z.string().url('Please enter a valid GitHub URL.'),
  liveUrl: z.string().url('Please enter a valid Live Demo URL.'),
  displayOrder: z.coerce.number().min(0, 'Must be 0 or higher.'),
  isFeatured: z.boolean().default(false),
  techTags: z.string().min(1, 'At least one tech tag is required.'),
});

export default function ProjectsManager() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formError, setFormError] = useState('');

  // Fetch projects list
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['adminProjects'],
    queryFn: getAdminProjects,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectFormSchema),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProjects']);
      handleCloseModal();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create project.';
      setFormError(msg);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProjects']);
      handleCloseModal();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to update project.';
      setFormError(msg);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProjects']);
    },
  });

  // Form controls
  const handleOpenCreate = () => {
    setEditingProject(null);
    setSelectedFile(null);
    setFormError('');
    reset({
      title: '',
      description: '',
      githubUrl: 'https://github.com/Panda-Coders',
      liveUrl: 'https://pandacoders.dev',
      displayOrder: 0,
      isFeatured: false,
      techTags: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setSelectedFile(null);
    setFormError('');
    reset({
      title: project.title,
      description: project.description,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      displayOrder: project.displayOrder,
      isFeatured: project.isFeatured,
      techTags: project.techTags ? project.techTags.join(', ') : '',
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProject(null);
    setSelectedFile(null);
    setFormError('');
  };

  // Submit Handler
  const onSubmit = async (data) => {
    setFormError('');
    
    // File validation check for new projects
    if (!editingProject && !selectedFile) {
      setFormError('A project image upload is required.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('githubUrl', data.githubUrl);
      formData.append('liveUrl', data.liveUrl);
      formData.append('displayOrder', String(data.displayOrder));
      formData.append('isFeatured', String(data.isFeatured));
      formData.append('techTags', data.techTags); // Comma string will split on server

      if (selectedFile) {
        formData.append('projectImage', selectedFile);
      }

      if (editingProject) {
        updateMutation.mutate({ id: editingProject._id, formData });
      } else {
        createMutation.mutate(formData);
      }
    } catch (e) {
      setFormError('Error formatting inputs. Try closing and refilling form.');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you absolutely sure you want to delete this project document? This is irreversible.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header controls bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-white">
            Projects Portfolio
          </h1>
          <p className="body-text text-sm">Create, review, edit, or delete items on your main grid.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-primary text-on-primary font-bold text-xs tracking-wider uppercase px-4 py-3 rounded-xl hover:bg-white hover:text-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <i className="fas fa-plus text-[10px]" /> Add Project
        </button>
      </div>

      {isLoading ? (
        <div className="py-24 flex justify-center">
          <div className="relative w-12 h-12 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
        </div>
      ) : isError ? (
        <div className="glass-card rounded-2xl p-8 text-center text-red-400">
          <i className="fas fa-exclamation-triangle text-2xl mb-2" />
          <p className="text-sm font-semibold">Failed to load projects from the database.</p>
        </div>
      ) : (
        <div className="rounded-2xl glass-card border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/2 text-[11px] font-mono text-tertiary">
                  <th className="py-4 px-6 uppercase font-semibold">Preview Image</th>
                  <th className="py-4 px-6 uppercase font-semibold">Title details</th>
                  <th className="py-4 px-6 uppercase font-semibold">Tech Stacks</th>
                  <th className="py-4 px-6 uppercase font-semibold text-center">Featured</th>
                  <th className="py-4 px-6 uppercase font-semibold text-center">Order priority</th>
                  <th className="py-4 px-6 uppercase font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects && projects.map((p) => {
                  const thumb = p.imageUrl
                    ? (p.imageUrl.startsWith('http') ? p.imageUrl : `http://localhost:5000${p.imageUrl}`)
                    : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?fit=crop&w=150&h=100&q=80';
                  
                  return (
                    <tr key={p._id} className="border-b border-white/5 hover:bg-white/2 text-sm transition-colors text-on-surface-variant">
                      <td className="py-4 px-6">
                        <img 
                          src={thumb} 
                          alt="" 
                          className="w-16 h-10 object-cover rounded-lg border border-white/10" 
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?fit=crop&w=150&h=100&q=80';
                          }}
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-base">{p.title}</span>
                          <span className="text-xs text-on-surface-variant font-mono max-w-xs truncate">{p.githubUrl}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.techTags && p.techTags.map((tag) => (
                            <span key={tag} className="text-[10px] bg-surface-container font-mono px-2 py-0.5 rounded text-secondary border border-white/5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {p.isFeatured ? (
                          <span className="text-xs text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                            Featured
                          </span>
                        ) : (
                          <span className="text-xs text-on-surface-variant/40 px-2 py-0.5">
                            Standard
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center font-mono">{p.displayOrder}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="w-8 h-8 rounded-lg bg-surface-container border border-white/5 text-on-surface hover:bg-white/10 hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
                            title="Edit project"
                          >
                            <i className="fas fa-edit text-xs" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete project"
                          >
                            <i className="fas fa-trash-alt text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {(!projects || projects.length === 0) && (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-on-surface-variant italic">
                      No projects currently loaded in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal drawer for Create/Edit project */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl glass-card border border-white/10 p-6 md:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h3 className="font-montserrat font-bold text-lg text-white">
                {editingProject ? 'Modify Project details' : 'Add New Project'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
              >
                <i className="fas fa-times text-lg" />
              </button>
            </div>

            {/* Error alerts */}
            {formError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <i className="fas fa-exclamation-circle text-sm" />
                {formError}
              </div>
            )}

            {/* Modal Form inputs */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Title */}
              <div className="space-y-1.5">
                <label className="mono-label text-[11px] text-tertiary">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Portfolio v2"
                  className={`w-full bg-surface-container border ${
                    errors.title ? 'border-red-500' : 'border-white/10'
                  } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-2.5 text-on-surface text-sm`}
                  {...register('title')}
                />
                {errors.title && <p className="text-red-500 text-xs font-mono">{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="mono-label text-[11px] text-tertiary">Description</label>
                <textarea
                  rows="3"
                  placeholder="Write a summary description of the application..."
                  className={`w-full bg-surface-container border ${
                    errors.description ? 'border-red-500' : 'border-white/10'
                  } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-2.5 text-on-surface text-sm`}
                  {...register('description')}
                />
                {errors.description && <p className="text-red-500 text-xs font-mono">{errors.description.message}</p>}
              </div>

              {/* Tech Tags */}
              <div className="space-y-1.5">
                <label className="mono-label text-[11px] text-tertiary">Tech Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, TailwindCSS, Express"
                  className={`w-full bg-surface-container border ${
                    errors.techTags ? 'border-red-500' : 'border-white/10'
                  } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-2.5 text-on-surface text-sm`}
                  {...register('techTags')}
                />
                {errors.techTags && <p className="text-red-500 text-xs font-mono">{errors.techTags.message}</p>}
              </div>

              {/* Grid: GitHub & Live URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GitHub link */}
                <div className="space-y-1.5">
                  <label className="mono-label text-[11px] text-tertiary">GitHub Link</label>
                  <input
                    type="text"
                    className={`w-full bg-surface-container border ${
                      errors.githubUrl ? 'border-red-500' : 'border-white/10'
                    } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-2.5 text-on-surface text-sm`}
                    {...register('githubUrl')}
                  />
                  {errors.githubUrl && <p className="text-red-500 text-xs font-mono">{errors.githubUrl.message}</p>}
                </div>

                {/* Live Link */}
                <div className="space-y-1.5">
                  <label className="mono-label text-[11px] text-tertiary">Live Link</label>
                  <input
                    type="text"
                    className={`w-full bg-surface-container border ${
                      errors.liveUrl ? 'border-red-500' : 'border-white/10'
                    } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-2.5 text-on-surface text-sm`}
                    {...register('liveUrl')}
                  />
                  {errors.liveUrl && <p className="text-red-500 text-xs font-mono">{errors.liveUrl.message}</p>}
                </div>
              </div>

              {/* Grid: Display Order & Image Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Display priority order */}
                <div className="space-y-1.5">
                  <label className="mono-label text-[11px] text-tertiary">Order Priority</label>
                  <input
                    type="number"
                    className={`w-full bg-surface-container border ${
                      errors.displayOrder ? 'border-red-500' : 'border-white/10'
                    } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-2.5 text-on-surface text-sm`}
                    {...register('displayOrder')}
                  />
                </div>

                {/* Image Upload Input */}
                <div className="space-y-1.5">
                  <label className="mono-label text-[11px] text-tertiary">Project Thumbnail Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary file:hover:bg-primary/30 file:cursor-pointer"
                  />
                </div>
              </div>

              {/* Checkbox toggles: Is Featured */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="isFeatured"
                  type="checkbox"
                  className="rounded border-white/10 text-primary bg-surface-container focus:ring-primary w-4 h-4"
                  {...register('isFeatured')}
                />
                <label htmlFor="isFeatured" className="mono-label text-[11px] text-tertiary select-none cursor-pointer">
                  Feature this project at the top of landing sections
                </label>
              </div>

              {/* Submit Buttons footer */}
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
                  {createMutation.isLoading || updateMutation.isLoading ? 'Uploading...' : 'Save details'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
