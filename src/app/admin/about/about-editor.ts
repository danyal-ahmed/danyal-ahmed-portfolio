import { Component, inject, OnInit } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
  FormArray,
  FormGroup,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';

@Component({
  selector: 'app-about-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm font-mono">
      <div class="mb-8 border-b border-slate-800 pb-4">
        <h2 class="text-2xl font-bold text-white flex items-center gap-3">
          <span class="text-green-400">#</span> Edit About Content
        </h2>
      </div>

      <form [formGroup]="aboutForm" (ngSubmit)="onSubmit()" class="space-y-8">
        <!-- Intro Summary -->
        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-300 flex items-center gap-2">
            <span class="text-slate-500">></span> Intro Summary
          </label>
          <textarea
            rows="3"
            formControlName="intro"
            class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded-lg px-4 py-3 text-slate-200 outline-none transition-colors text-sm leading-relaxed resize-none"
          ></textarea>
        </div>

        <!-- The Longer Version -->
        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-300 flex items-center gap-2">
            <span class="text-slate-500">></span> 01 The Longer Version (HTML)
          </label>
          <textarea
            rows="8"
            formControlName="longerVersion"
            class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded-lg px-4 py-3 text-slate-200 outline-none transition-colors text-sm leading-relaxed resize-y"
          ></textarea>
        </div>

        <!-- Core Technologies / Skills -->
        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-300 flex items-center gap-2">
            <span class="text-slate-500">></span> Core Technologies (Comma Separated)
          </label>
          <textarea
            rows="2"
            formControlName="skills"
            placeholder="Node.js & NestJS, Laravel, React & Angular..."
            class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded-lg px-4 py-3 text-slate-200 outline-none transition-colors text-sm leading-relaxed resize-none"
          ></textarea>
        </div>

        <!-- Dynamic Timeline FormArray -->
        <div class="space-y-4 pt-4 border-t border-slate-800/50" formArrayName="timeline">
          <div class="flex justify-between items-center mb-4">
            <label class="text-sm font-bold text-slate-300 flex items-center gap-2">
              <span class="text-slate-500">></span> 03 How I Got Here (Timeline)
            </label>
            <button
              type="button"
              (click)="addTimelineItem()"
              class="text-xs font-bold text-green-400 bg-green-400/10 px-3 py-1.5 rounded border border-green-500/30 hover:bg-green-400/20 transition-colors"
            >
              + ADD EVENT
            </button>
          </div>

          @for (ctrl of timeline.controls; track ctrl; let i = $index) {
            <div
              [formGroupName]="i"
              class="bg-black/20 border border-slate-800 rounded-lg p-5 relative group transition-colors hover:border-slate-700"
            >
              <!-- Delete Node Button -->
              <button
                type="button"
                (click)="removeTimelineItem(i)"
                class="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition-colors text-xs font-bold px-2 py-1 rounded"
              >
                [DEL]
              </button>

              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 pr-12">
                <div class="md:col-span-1 space-y-1">
                  <label class="text-[10px] text-slate-500 font-bold uppercase tracking-widest"
                    >Year</label
                  >
                  <input
                    formControlName="year"
                    placeholder="e.g. 2026"
                    class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded px-3 py-2 text-slate-200 outline-none transition-colors text-sm"
                  />
                </div>
                <div class="md:col-span-3 space-y-1">
                  <label class="text-[10px] text-slate-500 font-bold uppercase tracking-widest"
                    >Title / Role</label
                  >
                  <input
                    formControlName="title"
                    placeholder="e.g. Engineering at DealSense"
                    class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded px-3 py-2 text-slate-200 outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] text-slate-500 font-bold uppercase tracking-widest"
                  >Description</label
                >
                <textarea
                  formControlName="description"
                  rows="3"
                  class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded px-3 py-2 text-slate-200 outline-none transition-colors text-sm resize-y"
                ></textarea>
              </div>
            </div>
          }

          @if (timeline.length === 0) {
            <div
              class="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-800 rounded-lg"
            >
              No temporal nodes found. Add an event to begin.
            </div>
          }
        </div>

        <div class="pt-6 border-t border-slate-800 flex justify-between items-center">
          <span class="text-green-400 text-xs">
            @if (saveSuccess) {
              ✓ Config updated
            }
          </span>
          <button
            type="submit"
            [disabled]="aboutForm.invalid || isSaving"
            class="bg-green-500/10 text-green-400 border border-green-500/30 px-6 py-3 rounded-lg text-sm font-bold hover:bg-green-500/20 transition-colors disabled:opacity-50 flex items-center gap-2 uppercase tracking-wider"
          >
            @if (isSaving) {
              <span
                class="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"
              ></span>
              COMMITTING...
            } @else {
              ./commit_changes.sh
            }
          </button>
        </div>
      </form>
    </div>
  `,
})
export class AboutEditor implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/about-content`;

  isSaving = false;
  saveSuccess = false;

  aboutForm = this.fb.group({
    intro: ['', Validators.required],
    longerVersion: ['', Validators.required],
    skills: [''], // Will handle comma-separated string
    timeline: this.fb.array([]), // FormArray for dynamic objects
  });

  // Getter for easy access to the FormArray in the template
  get timeline(): FormArray {
    return this.aboutForm.get('timeline') as FormArray;
  }

  ngOnInit() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        // Clear default empty state
        this.timeline.clear();

        // Populate FormArray with incoming timeline data
        if (data.timeline && data.timeline.length) {
          data.timeline.forEach((item: any) => this.addTimelineItem(item));
        }

        // Patch standard values
        this.aboutForm.patchValue({
          intro: data.intro || '',
          longerVersion: data.longerVersion || '',
          // Convert string array to comma-separated string for editing
          skills: data.skills ? data.skills.join(', ') : '',
        });
      },
      error: (err) => console.error('Failed to load about content', err),
    });
  }

  // Method to push a new FormGroup into the FormArray
  addTimelineItem(item?: { year: string; title: string; description: string }) {
    const itemGroup = this.fb.group({
      year: [item?.year || '', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
    });
    this.timeline.push(itemGroup);
  }

  removeTimelineItem(index: number) {
    this.timeline.removeAt(index);
  }

  onSubmit() {
    if (this.aboutForm.valid) {
      this.isSaving = true;
      this.saveSuccess = false;

      // Extract raw values
      const formValue = this.aboutForm.getRawValue();

      // Convert comma-separated string back to string[] before sending to backend
      const payload = {
        ...formValue,
        skills: formValue.skills
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0),
      };

      this.http.put(this.apiUrl, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.saveSuccess = true;
          setTimeout(() => (this.saveSuccess = false), 3000);
        },
        error: (err) => {
          console.error('Failed to update about content', err);
          this.isSaving = false;
        },
      });
    }
  }
}
