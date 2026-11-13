export class CSyncError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/** Erreur jetée quand le token de session Auriga est expiré ou invalide (HTTP 401/403) */
export class SessionExpiredError extends CSyncError {
    constructor() {
        super('Your Auriga session has expired. Please sign in again.');
    }
}

/** Erreur jetée quand le payload envoyé à Auriga est rejeté par le serveur (HTTP 400) */
export class MalformedPayloadError extends CSyncError {
    constructor(public apiMessage: string, public url?: string) {
        super(`Invalid request structure: ${apiMessage}`);
    }
}

/** Erreur jetée si une ressource spécifique est introuvable (HTTP 404) */
export class ResourceNotFoundError extends CSyncError {
    constructor(resourceType: string, id: string | number) {
        super(`Resource of type [${resourceType}] with identifier [${id}] was not found.`);
    }
}

/** Erreur générique en cas de panne totale d'Auriga ou coupure réseau */
export class AurigaNetworkError extends CSyncError {
    constructor() {
        super('The Auriga server is unavailable or your network connection is unstable.');
    }
}
