import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendContactMessage } from '../api/publicApi';

// Contact Zod Schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(100, 'Name is too long.'),
  email: z.string().email('Invalid email address formatting.').min(1, 'Email is required.'),
  message: z.string().min(10, 'Message details must be at least 10 characters.').max(2000, 'Message is too long.'),
});

export default function Contact({ profile }) {
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmitForm = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitStatus({ success: null, message: '' });
      await sendContactMessage(data);
      setSubmitStatus({
        success: true,
        message: 'Your message has been sent successfully to the dashboard!',
      });
      reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus({
        success: false,
        message: 'Failed to send message. Please reach out via email directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full py-24 bg-background border-t border-white/5 relative overflow-hidden">

      {/* Background decoration orb */}
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full radial-glow pointer-events-none opacity-25 blur-3xl z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Title */}
        <div className="mb-16 text-center md:text-left">
          <span className="mono-label text-primary mb-3">Get In Touch</span>
          <h2 className="headline-heading text-white">
            Let's
            <span className="text-gradient"> Connect</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

          {/* Left Column: Contact details */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl glass-card p-8 border border-white/5 space-y-8">
            <div className="space-y-6">
              <h3 className="font-montserrat font-bold text-xl text-white">
                Contact Information
              </h3>
              <p className="body-text text-sm md:text-base">
                Have a project in mind, want to collaborate, or just want to say hi? Fill out the contact form, and I'll get back to you as soon as possible.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container border border-white/5 flex items-center justify-center text-primary">
                  <i className="fas fa-envelope text-lg" />
                </div>
                <div>
                  <h4 className="mono-label text-xs text-tertiary">Email Address</h4>
                  <a href={`mailto:${profile?.email || 'mohamedasik.in2004@gmail.com'}`} className="text-on-surface hover:text-primary transition-colors text-sm md:text-base font-medium">
                    {profile?.email || 'mohamedasik.in2004@gmail.com'}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container border border-white/5 flex items-center justify-center text-primary">
                  <i className="fas fa-map-marker-alt text-lg" />
                </div>
                <div>
                  <h4 className="mono-label text-xs text-tertiary">Location</h4>
                  <p className="text-on-surface text-sm md:text-base font-medium">
                    Chennai, Tamil Nadu
                  </p>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container border border-white/5 flex items-center justify-center text-primary">
                  <i className="fas fa-briefcase text-lg" />
                </div>
                <div>
                  <h4 className="mono-label text-xs text-tertiary">Current Status</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${profile?.isAvailable ? 'bg-green-500' : 'bg-orange-400'}`} />
                    <p className="text-on-surface text-sm font-semibold">
                      {profile?.isAvailable ? 'Available for Hire' : 'Not Active / Freelancing'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Find me on socials block */}
            <div className="border-t border-white/10 pt-6 space-y-4">
              <span className="mono-label text-[11px] text-tertiary tracking-widest uppercase font-semibold block">
                Find Me On
              </span>
              <div className="flex gap-4">
                <a
                  href={profile?.instagramUrl || 'https://instagram.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl border border-white/10 bg-[#fff]/2 hover:bg-[#fff]/5 hover:border-primary/40 text-on-surface hover:text-primary transition-all duration-300 flex items-center justify-center text-xl"
                  title="Instagram Profile"
                >
                  <i className="fab fa-instagram" />
                </a>
                <a
                  href={`https://wa.me/${(profile?.whatsappNumber || '6382555230').replace(/[\s\+\-\(\)]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl border border-white/10 bg-[#fff]/2 hover:bg-[#fff]/5 hover:border-primary/40 text-on-surface hover:text-primary transition-all duration-300 flex items-center justify-center text-xl"
                  title="Chat on WhatsApp"
                >
                  <i className="fab fa-whatsapp" />
                </a>
              </div>
            </div>

            {/* Sub-label banner */}
            <div className="border-t border-white/10 pt-6 flex justify-between items-center">
              <span className="mono-label text-[11px]">Brand: Asik.Dev</span>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 rounded-2xl glass-card p-8 border border-white/5 flex flex-col justify-between">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <h3 className="font-montserrat font-bold text-xl text-white">
                Send a Message
              </h3>

              {/* Status Notice alerts */}
              {submitStatus.message && (
                <div
                  className={`p-4 rounded-xl text-sm border ${submitStatus.success
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}
                >
                  <i className={`fas ${submitStatus.success ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`} />
                  {submitStatus.message}
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="mono-label text-xs">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className={`w-full bg-surface-container border ${errors.name ? 'border-red-500' : 'border-white/10'
                    } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-3 text-on-surface text-sm transition-colors`}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs font-mono">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="mono-label text-xs">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className={`w-full bg-surface-container border ${errors.email ? 'border-red-500' : 'border-white/10'
                    } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-3 text-on-surface text-sm transition-colors`}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs font-mono">{errors.email.message}</p>
                )}
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label htmlFor="message" className="mono-label text-xs">
                  Message Details
                </label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder={`Hey ${profile?.name ? profile.name.trim().split(/\s+/)[0] : 'Habib'}, I would love to talk about building...`}
                  className={`w-full bg-surface-container border ${errors.message ? 'border-red-500' : 'border-white/10'
                    } focus:border-primary/50 focus:outline-none rounded-xl px-4 py-3 text-on-surface text-sm transition-colors`}
                  {...register('message')}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs font-mono">{errors.message.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  onClick={handleSubmit(onSubmitForm)}
                  disabled={isSubmitting}
                  className="w-full bg-primary text-on-primary font-semibold text-sm tracking-wide uppercase py-4 rounded-xl primary-glow hover:bg-white hover:text-background border border-primary transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <i className="far fa-paper-plane text-lg" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
