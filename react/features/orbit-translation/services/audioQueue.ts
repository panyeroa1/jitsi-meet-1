// orbit-rtc/react/features/orbit-translation/services/audioQueue.ts
// Sequential audio playback queue to prevent overlapping TTS
// Owner: Miles (Eburon Development)

/**
 * AudioQueue manages sequential execution of async audio tasks.
 * Prevents overlapping TTS playback from rapid translation updates.
 */
export class AudioQueue {
    private queue: Array<() => Promise<void>> = [];
    private running = false;

    /**
     * Add an async task to the queue
     * Task will be executed when all previous tasks complete
     */
    enqueue(task: () => Promise<void>): void {
        this.queue.push(task);
        void this.run();
    }

    /**
     * Clear all pending tasks (stop playback)
     */
    clear(): void {
        this.queue = [];
    }

    /**
     * Process tasks sequentially
     */
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
