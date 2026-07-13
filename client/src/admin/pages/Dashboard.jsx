import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, getAdminMessages, markMessageRead } from '../../api/adminApi';

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch metrics stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
  });

  // Fetch recent messages list
  const { data: messages, isLoading: msgLoading } = useQuery({
    queryKey: ['recentMessages'],
    queryFn: () => getAdminMessages(5),
  });

  // Mutation to toggle message isRead status on double check click
  const readMutation = useMutation({
    mutationFn: markMessageRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['recentMessages']);
      queryClient.invalidateQueries(['adminStats']);
    },
  });

  const handleToggleRead = (id, currentVal) => {
    readMutation.mutate({ id, isRead: !currentVal });
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: statsLoading ? '...' : stats?.totalProjects || 0,
      icon: 'fas fa-project-diagram',
      color: 'text-indigo-400 border-indigo-500/20',
      actionLabel: 'Manage projects',
      actionPath: '/admin/projects',
    },
    {
      title: 'Total Messages',
      value: statsLoading ? '...' : stats?.totalMessages || 0,
      icon: 'fas fa-envelope',
      color: 'text-emerald-400 border-emerald-500/20',
      actionLabel: 'Review inbox',
      actionPath: '/admin/messages',
    },
    {
      title: 'Skills Configured',
      value: statsLoading ? '...' : stats?.totalSkills || 0,
      icon: 'fas fa-laptop-code',
      color: 'text-purple-400 border-purple-500/20',
      actionLabel: 'Modify skills',
      actionPath: '/admin/skills',
    },
  ];

  return (
    <div className="space-y-10">
      
      {/* Header title */}
      <div>
        <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-white">
          System Overview
        </h1>
        <p className="body-text text-sm mt-1">
          Welcome back to the Panda Coders webmaster pipeline dashboard.
        </p>
      </div>

      {/* Grid Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`rounded-2xl glass-card border p-6 flex flex-col justify-between h-44 hover:border-primary/20 transition-all duration-300 relative overflow-hidden`}
          >
            {/* Background glowing layer */}
            <div className="absolute right-0 bottom-0 w-24 h-24 rounded-full radial-glow pointer-events-none opacity-20 blur-xl" />

            <div className="flex justify-between items-start">
              <div>
                <p className="mono-label text-[11px] text-tertiary">
                  {card.title}
                </p>
                <p className="text-3xl font-extrabold text-white mt-3 font-montserrat">
                  {card.value}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center ${card.color}`}>
                <i className={`${card.icon} text-lg`} />
              </div>
            </div>

            <button
              onClick={() => navigate(card.actionPath)}
              className="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5 w-fit border-t border-white/5 pt-4 mt-auto font-medium"
            >
              Verify details
              <i className="fas fa-arrow-right text-[10px]" />
            </button>
          </div>
        ))}
      </div>

      {/* Recent Contact Submissions */}
      <div className="rounded-2xl glass-card border border-white/5 p-6 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <i className="fas fa-envelope-open-text" />
            </div>
            <h2 className="font-montserrat font-bold text-lg text-white">
              Recent Message Queries
            </h2>
          </div>
          <button
            onClick={() => navigate('/admin/messages')}
            className="text-xs text-primary hover:text-white transition-all font-mono"
          >
            View Full Inbox
          </button>
        </div>

        {msgLoading ? (
          <div className="py-12 flex justify-center">
            <div className="relative w-8 h-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5 text-[11px] font-mono text-tertiary">
                  <th className="pb-3 px-4 uppercase font-semibold">User details</th>
                  <th className="pb-3 px-4 uppercase font-semibold">Message snippet</th>
                  <th className="pb-3 px-4 uppercase font-semibold">Date received</th>
                  <th className="pb-3 px-4 uppercase font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages && messages.slice(0, 5).map((msg) => (
                  <tr
                    key={msg._id}
                    className={`border-b border-white/5 hover:bg-white/2 text-sm transition-colors ${
                      !msg.isRead ? 'font-semibold text-white' : 'text-on-surface-variant'
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1.5 ">
                          {!msg.isRead && <span className="w-2 h-2 rounded-full bg-primary" />}
                          {msg.name}
                        </span>
                        <span className="text-xs text-on-surface-variant font-mono mt-0.5">{msg.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 max-w-xs truncate">
                      {msg.message}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono">
                      {new Date(msg.submittedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleToggleRead(msg._id, msg.isRead)}
                          title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                          className="w-8 h-8 rounded-lg bg-surface-container hover:bg-white/10 text-on-surface flex items-center justify-center transition-colors border border-white/5"
                        >
                          <i className={`fas ${msg.isRead ? 'fa-envelope' : 'fa-envelope-open'} text-xs`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!messages || messages.length === 0) && (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-on-surface-variant italic">
                      There are no recent messages received in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
