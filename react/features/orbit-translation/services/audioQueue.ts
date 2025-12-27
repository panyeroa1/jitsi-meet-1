// orbit-rtc/react/features/orbit-translation/services/audioQueue.ts
// Sequential audio playback queue to prevent overlapping TTS
// Owner: Miles (Eburon Development)

export class AudioQueue {
    private queue: Array<() => Promise<void>> = [];
    private running = false;

    enqueue(task: () => Promise<void>): void {
        this.queue.push(task);
        void this.run();
    }

    clear(): void {
        this.queue = [];
    }

    private async run(): Promise<void> {
        if (this.running) {
            return;
        }
        this.running = true;

        try {
            while (this.queue.length) {
                const task = this.queue.shift()!;

                await task();
            }
        } finally {
            this.running = false;
        }
    }
}
