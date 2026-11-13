import { AxiosError } from 'axios';
import {
    SessionExpiredError,
    MalformedPayloadError,
    ResourceNotFoundError,
    AurigaNetworkError
} from '../../errors/domain.errors';

export function handleAxiosError(error: unknown, context?: { resourceType?: string; id?: string | number }): never {
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as AxiosError<any>;
        const status = axiosError.response?.status;
        const apiMessage = axiosError.response?.data?.message || '';
        const url = axiosError.config?.url;

        if (!axiosError.response) {
            throw new AurigaNetworkError();
        }

        switch (status) {
            case 400:
                throw new MalformedPayloadError(apiMessage, url);
            case 401:
            case 403:
                throw new SessionExpiredError();
            case 404:
                throw new ResourceNotFoundError(context?.resourceType || 'Inconnu', context?.id || 'Inconnu');
            default:
                throw new AurigaNetworkError();
        }
    }

    throw error;
}
