import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getProfile } from '../../api/publicApi';
import { updateProfile } from '../../api/adminApi';

// Validation Schema
const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  tagline: z.string().min(1, 'Tagline is required.'),
  bio1: z.string().min(10, 'Bio paragraph 1 must be at least 10 characters.'),
  bio2: z.string().min(10, 'Bio paragraph 2 must be at least 10 characters.'),
  isAvailable: z.boolean().default(true),
  whatsappNumber: z.string().optional().or(z.literal('')),
  instagramUrl: z.string().optional().or(z.literal('')),
});

export default function ProfileManager() {
  const queryClient = useQueryClient();
  const [submitMessage, setSubmitMessage] = useState({ success: null, text: '' });
  
  // Files States
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [heroPhotoFile, setHeroPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  // Fetch current profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileFormSchema),
  });

  // Pre-populate input values on fetch complete
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        tagline: profile.tagline,
        bio1: profile.bio1,
        bio2: profile.bio2,
        isAvailable: profile.isAvailable,
        whatsappNumber: profile.whatsappNumber || '',
        instagramUrl: profile.instagramUrl || '',
      });
    }
  }, [profile, reset]);

  // Mutation
  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['profile']);
      setSubmitMessage({ success: true, text: 'Profile configurations saved successfully!' });
      // Reset upload files inputs
      setProfilePhotoFile(null);
      setHeroPhotoFile(null);
      setResumeFile(null);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to update profile settings.';
      setSubmitMessage({ success: false, text: msg });
    }
  });

  const onSubmit = (data) => {
    setSubmitMessage({ success: null, text: '' });

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('tagline', data.tagline);
    formData.append('bio1', data.bio1);
    formData.append('bio2', data.bio2);
    formData.append('isAvailable', String(data.isAvailable));
    formData.append('whatsappNumber', data.whatsappNumber || '');
    formData.append('instagramUrl', data.instagramUrl || '');

    if (profilePhotoFile) {
      formData.append('profilePhoto', profilePhotoFile);
    }
    if (heroPhotoFile) {
      formData.append('heroPhoto', heroPhotoFile);
    }
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    updateMutation.mutate(formData);
  };

  const getFullAssetUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
  };

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="relative w-12 h-12 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header title */}
      <div>
        <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-white">
          Profile Settings
        </h1>
        <p className="body-text text-sm">Configure landing page copy, profile captures, and CV links.</p>
      </div>

      {submitMessage.text && (
        <div
          className={`p-4 rounded-xl text-sm border ${
            submitMessage.success
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          <i className={`fas ${submitMessage.success ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`} />
          {submitMessage.text}
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 space-y-6">
        
        {/* Row 1: Name and Tagline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="mono-label text-xs">Full Name</label>
            <input
              type="text"
              className={`w-full bg-surface-container border ${
                errors.name ? 'border-red-500' : 'border-white/10'
              } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-3 text-on-surface text-sm transition-colors`}
              {...register('name')}
            />
            {errors.name && <p className="text-red-500 text-xs font-mono">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="mono-label text-xs">Hero Tagline</label>
            <input
              type="text"
              className={`w-full bg-surface-container border ${
                errors.tagline ? 'border-red-500' : 'border-white/10'
              } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-3 text-on-surface text-sm transition-colors`}
              {...register('tagline')}
            />
            {errors.tagline && <p className="text-red-500 text-xs font-mono">{errors.tagline.message}</p>}
          </div>
        </div>

        {/* Row 2: Bio paragraph 1 */}
        <div className="space-y-2">
          <label className="mono-label text-xs">Bio Paragraph 1 (Landing Profile)</label>
          <textarea
            rows="4"
            className={`w-full bg-surface-container border ${
              errors.bio1 ? 'border-red-500' : 'border-white/10'
            } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-3 text-on-surface text-sm transition-colors`}
            {...register('bio1')}
          />
          {errors.bio1 && <p className="text-red-500 text-xs font-mono">{errors.bio1.message}</p>}
        </div>

        {/* Row 3: Bio paragraph 2 */}
        <div className="space-y-2">
          <label className="mono-label text-xs">Bio Paragraph 2 (Landing Profile Secondary)</label>
          <textarea
            rows="4"
            className={`w-full bg-surface-container border ${
              errors.bio2 ? 'border-red-500' : 'border-white/10'
            } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-3 text-on-surface text-sm transition-colors`}
            {...register('bio2')}
          />
          {errors.bio2 && <p className="text-red-500 text-xs font-mono">{errors.bio2.message}</p>}
        </div>

        {/* Row 3.5: WhatsApp and Instagram social handles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
          <div className="space-y-2">
            <label className="mono-label text-xs">WhatsApp Number (eg: 923001234567, without + or 00)</label>
            <input
              type="text"
              placeholder="e.g. 923000000000"
              className={`w-full bg-surface-container border ${
                errors.whatsappNumber ? 'border-red-500' : 'border-white/10'
              } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-3 text-on-surface text-sm transition-colors`}
              {...register('whatsappNumber')}
            />
            {errors.whatsappNumber && <p className="text-red-500 text-xs font-mono">{errors.whatsappNumber.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="mono-label text-xs">Instagram Link URL</label>
            <input
              type="text"
              placeholder="e.g. https://instagram.com/panda.coders"
              className={`w-full bg-surface-container border ${
                errors.instagramUrl ? 'border-red-500' : 'border-white/10'
              } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-3 text-on-surface text-sm transition-colors`}
              {...register('instagramUrl')}
            />
            {errors.instagramUrl && <p className="text-red-500 text-xs font-mono">{errors.instagramUrl.message}</p>}
          </div>
        </div>

        {/* Row 4: File Uploads & Thumbs grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
          {/* Profile Photo */}
          <div className="space-y-4">
            <label className="mono-label text-xs">Profile Card Photo</label>
            {profile?.profilePhoto && (
              <img
                src={getFullAssetUrl(profile.profilePhoto)}
                alt="Current profile card"
                className="w-20 h-24 object-cover rounded-xl border border-white/10"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fit=crop&w=100&h=120&q=85'; }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setProfilePhotoFile(e.target.files[0]);
                }
              }}
              className="w-full text-xs text-on-surface-variant file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-primary/20 file:text-primary file:cursor-pointer"
            />
          </div>

          {/* Hero Photo */}
          <div className="space-y-4">
            <label className="mono-label text-xs">Hero Circular Photo</label>
            {profile?.heroPhoto && (
              <img
                src={getFullAssetUrl(profile.heroPhoto)}
                alt="Current hero circular"
                className="w-24 h-24 object-cover rounded-full border border-white/10"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150&q=85'; }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setHeroPhotoFile(e.target.files[0]);
                }
              }}
              className="w-full text-xs text-on-surface-variant file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-primary/20 file:text-primary file:cursor-pointer"
            />
          </div>

          {/* Resume PDF */}
          <div className="space-y-4">
            <label className="mono-label text-xs">Curriculum Vitae (PDF)</label>
            {profile?.resumePath && (
              <div className="flex items-center gap-2 text-xs bg-surface-container px-3 py-2 rounded-xl border border-white/5 w-fit">
                <i className="fas fa-file-pdf text-red-400 text-sm" />
                <a href={getFullAssetUrl(profile.resumePath)} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary font-mono truncate max-w-[150px]">
                  resume.pdf
                </a>
              </div>
            )}
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setResumeFile(e.target.files[0]);
                }
              }}
              className="w-full text-xs text-on-surface-variant file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-primary/20 file:text-primary file:cursor-pointer"
            />
          </div>
        </div>

        {/* Row 5: Availability Checkbox */}
        <div className="flex items-center gap-2.5 pt-4 border-t border-white/5">
          <input
            id="isAvailable"
            type="checkbox"
            className="rounded border-white/10 text-primary bg-surface-container focus:ring-primary w-5 h-5 cursor-pointer"
            {...register('isAvailable')}
          />
          <label htmlFor="isAvailable" className="mono-label text-xs select-none cursor-pointer">
            Open to Hire (renders green indicator badge on public site)
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={updateMutation.isLoading}
          className="w-full bg-primary text-on-primary font-semibold text-sm tracking-wide uppercase py-4 rounded-xl primary-glow hover:bg-white hover:text-background transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
        >
          {updateMutation.isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving config...
            </>
          ) : (
            <>
              <i className="fas fa-check-circle" />
              Save Configurations
            </>
          )}
        </button>

      </form>

    </div>
  );
}
