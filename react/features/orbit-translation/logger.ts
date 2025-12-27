import { getLogger } from '../base/logging/functions';

/**
 * Logger interface for orbit-translation feature.
 */
interface Logger {
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    trace: (...args: any[]) => void;
}

export default getLogger('features/orbit-translation') as unknown as Logger;
