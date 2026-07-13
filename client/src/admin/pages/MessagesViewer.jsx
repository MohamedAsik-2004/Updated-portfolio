import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminMessages, markMessageRead, deleteMessage } from '../../api/adminApi';

export default function MessagesViewer() {
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch all messages
  const { data: messages, isLoading, isError } = useQuery({
    queryKey: ['adminMessages'],
    queryFn: () => getAdminMessages(0), // fetch all
  });

  // Mutations
  const readMutation = useMutation({
    mutationFn: markMessageRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMessages']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMessages']);
      if (selectedMessage && !queryClient.getQueryData(['adminMessages'])?.find(m => m._id === selectedMessage._id)) {
        setSelectedMessage(null);
      }
    },
  });

  const handleToggleRead = (id, currentVal) => {
    readMutation.mutate({ id, isRead: !currentVal });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you holding complete intent to permanently delete this contact request?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    // Mark as read automatically when opened, if not already read
    if (!msg.isRead) {
      readMutation.mutate({ id: msg._id, isRead: true });
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header controls */}
      <div>
        <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-white">
          Inbound Queries
        </h1>
        <p className="body-text text-sm">Review, structure, reply, or delete correspondence from your portfolio forms.</p>
      </div>

      {isLoading ? (
        <div className="py-24 flex justify-center">
          <div className="relative w-12 h-12 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
        </div>
      ) : isError ? (
        <div className="glass-card rounded-2xl p-8 text-center text-red-400">
          <i className="fas fa-exclamation-triangle text-2xl mb-2" />
          <p className="text-sm font-semibold">Failed to load system inbox items.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Message Grid List */}
          <div className="lg:col-span-7 space-y-4">
            {messages && messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => handleSelectMessage(msg)}
                className={`rounded-2xl glass-card border p-5 cursor-pointer transition-all duration-205 flex flex-col justify-between hover:scale-[1.01] ${
                  selectedMessage?._id === msg._id
                    ? 'border-primary bg-primary/5'
                    : !msg.isRead
                    ? 'border-primary/20 bg-white/2'
                    : 'border-white/5 bg-transparent'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="flex items-center gap-2">
                      {!msg.isRead && <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />}
                      <h3 className="font-bold text-white text-base leading-none">{msg.name}</h3>
                    </span>
                    <p className="text-xs text-on-surface-variant/80 font-mono">{msg.email}</p>
                  </div>
                  <span className="text-[10px] font-mono text-tertiary">
                    {new Date(msg.submittedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-on-surface-variant line-clamp-2 mt-4">
                  {msg.message}
                </p>

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-white/5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleRead(msg._id, msg.isRead);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-surface-container border border-white/5 text-xs text-secondary hover:text-white transition-colors"
                  >
                    {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg._id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {(!messages || messages.length === 0) && (
              <div className="glass-card rounded-2xl p-12 text-center text-on-surface-variant italic">
                No inbox communications received.
              </div>
            )}
          </div>

          {/* Right: Message Reader details panel */}
          <div className="lg:col-span-5 sticky top-6">
            {selectedMessage ? (
              <div className="rounded-2xl glass-card border border-primary/20 p-8 space-y-6 shadow-2xl relative overflow-hidden">
                {/* Background ambient glow */}
                <div className="absolute right-0 top-0 w-24 h-24 rounded-full radial-glow pointer-events-none opacity-20 blur-xl" />

                <div className="space-y-4 pb-4 border-b border-white/10">
                  <h2 className="font-montserrat font-bold text-lg text-white">
                    Message Details
                  </h2>
                  
                  {/* Sender details Card */}
                  <div className="bg-surface-container rounded-xl p-4 border border-white/5 space-y-2">
                    <p className="text-xs text-on-surface-variant"><span className="mono-label text-[10px] text-tertiary">Sender:</span> {selectedMessage.name}</p>
                    <p className="text-xs text-on-surface-variant"><span className="mono-label text-[10px] text-tertiary">Email:</span> <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">{selectedMessage.email}</a></p>
                    <p className="text-xs text-on-surface-variant"><span className="mono-label text-[10px] text-tertiary">Date:</span> {new Date(selectedMessage.submittedAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="mono-label text-[10px] text-tertiary">Message Body</span>
                  <div className="bg-[#0b0e0f] rounded-xl p-5 border border-white/5 min-h-[150px]">
                    <p className="text-sm leading-relaxed text-on-surface-variant whitespace-pre-wrap select-text">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Reply Actions */}
                <div className="flex gap-4 pt-4">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re:%20Panda%20Coders%20Contact&body=%0A%0A---%0AOriginal%20Message%20from%20${selectedMessage.name}:%0A${selectedMessage.message}`}
                    className="w-1/2 bg-primary text-on-primary text-center py-3 rounded-xl text-xs font-semibold uppercase primary-glow hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-1.5"
                  >
                    <i className="fas fa-reply text-[10px]" /> Direct Reply
                  </a>
                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="w-1/2 bg-red-500/10 border border-red-500/20 text-red-400 py-3 rounded-xl text-xs font-semibold uppercase hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <i className="fas fa-trash-alt text-[10px]" /> Delete Record
                  </button>
                </div>

              </div>
            ) : (
              <div className="rounded-2xl glass-card border border-white/5 p-12 text-center text-on-surface-variant italic h-60 flex items-center justify-center">
                Select a message on the left panel to review its contents.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
