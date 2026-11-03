import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { AdminMessagesService, Message } from './messages.service';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [DatePipe, NgClass],
  template: `
    <div class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 relative z-10 font-mono">
      <div class="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <h2 class="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
          <span class="text-green-400">#</span> Incoming Transmissions
        </h2>
        <div class="text-xs text-slate-500 flex gap-4">
          <span>Unread: {{ getUnreadCount() }}</span>
          <span>Total: {{ messages().length }}</span>
        </div>
      </div>

      <div class="space-y-4">
        @if (isLoading()) {
          <div class="py-12 text-center text-slate-500 animate-pulse">
            Decrypting inbox stream...
          </div>
        } @else if (messages().length === 0) {
          <div
            class="py-12 text-center text-slate-500 border border-slate-800 border-dashed rounded-xl"
          >
            Inbox empty. Awaiting connections.
          </div>
        } @else {
          @for (msg of messages(); track msg._id) {
            <div
              class="group flex flex-col rounded-lg p-5 transition-all relative overflow-hidden border"
              [ngClass]="
                msg.isRead
                  ? 'bg-black/40 border-slate-800 opacity-70'
                  : 'bg-slate-900/80 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
              "
            >
              <!-- Header: Name, Email, Date -->
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                <div class="flex items-center gap-3">
                  @if (!msg.isRead) {
                    <span
                      class="inline-block h-2 w-2 rounded-full bg-indigo-400 animate-pulse"
                    ></span>
                  }
                  <div>
                    <h3
                      class="font-bold text-lg"
                      [ngClass]="msg.isRead ? 'text-slate-400' : 'text-indigo-400'"
                    >
                      {{ msg.name }}
                    </h3>
                    <a
                      href="mailto:{{ msg.email }}"
                      class="text-xs text-slate-500 hover:text-indigo-300 transition-colors"
                    >
                      {{ msg.email }}
                    </a>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <span class="text-xs text-slate-600">{{
                    msg.createdAt | date: 'MMM d, y, h:mm a'
                  }}</span>

                  <div class="opacity-0 group-hover:opacity-100 flex gap-2 transition-all">
                    <button
                      (click)="toggleReadStatus(msg)"
                      class="text-xs font-bold px-2 py-1 rounded transition-colors"
                      [ngClass]="
                        msg.isRead
                          ? 'text-slate-400 border border-slate-700 bg-slate-800/50 hover:text-white'
                          : 'text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 hover:text-indigo-300'
                      "
                    >
                      {{ msg.isRead ? '[MARK UNREAD]' : '[MARK READ]' }}
                    </button>

                    <button
                      (click)="deleteMessage(msg._id)"
                      class="text-xs text-red-500 hover:text-red-400 transition-colors font-bold px-2 py-1 rounded border border-red-500/30 bg-red-500/10"
                    >
                      [DEL]
                    </button>
                  </div>
                </div>
              </div>

              <!-- Message Content -->
              <div
                class="text-sm leading-relaxed whitespace-pre-wrap mt-2"
                [ngClass]="msg.isRead ? 'text-slate-500' : 'text-slate-300'"
              >
                {{ msg.content }}
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class MessagesList implements OnInit {
  private messagesService = inject(AdminMessagesService);

  messages = signal<Message[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.messagesService.getMessages().subscribe({
      next: (data) => {
        this.messages.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load messages', err);
        this.isLoading.set(false);
      },
    });
  }

  getUnreadCount(): number {
    return this.messages().filter((m) => !m.isRead).length;
  }

  toggleReadStatus(msg: Message) {
    const newStatus = !msg.isRead;
    this.messagesService.updateReadStatus(msg._id, newStatus).subscribe({
      next: () => {
        // Update the signal locally for instant UI response
        this.messages.update((msgs) =>
          msgs.map((m) => (m._id === msg._id ? { ...m, isRead: newStatus } : m)),
        );
      },
      error: (err) => console.error('Failed to update read status', err),
    });
  }

  deleteMessage(id: string) {
    if (confirm('WARN: Are you sure you want to permanently delete this transmission?')) {
      this.messagesService.deleteMessage(id).subscribe({
        next: () => {
          this.messages.update((msgs) => msgs.filter((m) => m._id !== id));
        },
        error: (err) => console.error('Failed to delete message', err),
      });
    }
  }
}
