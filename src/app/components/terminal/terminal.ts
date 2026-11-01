import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TerminalService } from './terminal.service';

interface ChatMessage {
  sender: 'user' | 'system';
  text: string;
}

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './terminal-card.html',
})
export class Terminal {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  private terminalService = inject(TerminalService);

  presets = [
    'what is your stack?',
    'are you available for hire?',
    'tell me about a recent project',
    'how do you self-host?',
  ];

  private scrollToBottom() {
    setTimeout(() => {
      try {
        this.scrollContainer.nativeElement.scrollTop =
          this.scrollContainer.nativeElement.scrollHeight;
      } catch (err) {}
    }, 0); // setTimeout ensures the DOM updates before calculating the new height
  }

  currentInput = '';
  history = signal<ChatMessage[]>([
    { sender: 'system', text: 'Welcome! Ask me anything about Danyal Ahmed :)' },
  ]);

  isTyping = signal(false);

  selectPrompt(prompt: string) {
    this.currentInput = prompt;
    this.handleSubmit(new Event('submit'));
  }

  clearChat() {
    this.history.set([]);
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    const userText = this.currentInput.trim();
    if (!userText) return;

    const lowerCmd = userText.toLowerCase();

    // 1. Intercept 'clear' command
    if (lowerCmd === 'clear') {
      this.clearChat();
      this.currentInput = '';
      return;
    }

    // 2. Intercept 'help' command
    if (lowerCmd === 'help') {
      const helpText = `Available commands:
  help  - Show this list of available commands
  clear - Clear the terminal screen
  [any] - Ask the AI about my professional experience, skills, or portfolio`;

      this.history.update((h) => [
        ...h,
        { sender: 'user', text: userText },
        { sender: 'system', text: helpText },
      ]);
      this.currentInput = '';
      this.isTyping.set(true);
      return;
    }
    this.scrollToBottom();
    // 3. Add user message AND temporary 'typing...' message to UI
    this.history.update((h) => [
      ...h,
      { sender: 'user', text: userText },
      { sender: 'system', text: 'typing...' }, // Placeholder state
    ]);
    this.currentInput = '';
    this.isTyping.set(true);

    // 4. Process command via NestJS backend
    this.terminalService.sendCommand(userText).subscribe({
      next: (response) => {
        this.typewriterEffect(response.reply);
      },
      error: (error) => {
        console.error('Terminal API Error:', error);
        this.history.update((h) => {
          const updatedHistory = [...h];
          // Replace 'typing...' with the error message
          updatedHistory[updatedHistory.length - 1].text =
            'Error: Cannot connect to the NestJS backend. Is it running?';
          return updatedHistory;
        });
        this.isTyping.set(false);
      },
    });
  }

  private typewriterEffect(fullText: string) {
    let currentIndex = 0;

    // Clear the 'typing...' placeholder before starting the animation
    this.history.update((h) => {
      const updated = [...h];
      updated[updated.length - 1].text = '';
      return updated;
    });

    const intervalId = setInterval(() => {
      this.history.update((h) => {
        const updated = [...h];
        // Append the next single character
        updated[updated.length - 1].text += fullText.charAt(currentIndex);
        return updated;
      });
      this.scrollToBottom();
      currentIndex++;

      // Stop the interval once the full string is printed
      if (currentIndex === fullText.length) {
        clearInterval(intervalId);
        this.isTyping.set(false); // Unlock the input field
      }
    }, 15); // Adjust speed here (15ms is usually a good terminal speed)
  }
}
