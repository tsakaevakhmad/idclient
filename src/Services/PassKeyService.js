import axios, { all } from "axios";

export async function registerPasskey() {
    try {
        // 1. Получить options с сервера
        const optionsResponse = await axios.post(
            `${process.env.REACT_APP_BASE_URI}/api/passkey/BeginRegistration`,
            null, // тело запроса (если нужно — вставь сюда userId и username)
            {
                headers: { "Content-Type": "application/json-patch+json" },
                withCredentials: true
            }
        );

        const publicKey = await optionsResponse.data;

        // Преобразовать из base64url в нужные форматы
        publicKey.challenge = base64UrlToUint8Array(publicKey.challenge);
        publicKey.user.id = base64UrlToUint8Array(publicKey.user.id);
        const algMap = {
            ES256: -7,
            RS256: -257,
            PS256: -37,
            ES384: -35,
            RS384: -258,
            PS384: -38,
            ES512: -36,
            RS512: -259,
            PS512: -39,
            EdDSA: -8
        };
        publicKey.pubKeyCredParams = publicKey.pubKeyCredParams.map(param => ({
            type: param.type,
            alg: algMap[param.alg] || param.alg // Оставляем оригинал, если алгоритм неизвестен
        }));

        for (const exCred of publicKey.excludeCredentials) {
            exCred.id = base64UrlToUint8Array(exCred.id);
        }

        if (publicKey.authenticatorSelection.authenticatorAttachment === null)
            publicKey.authenticatorSelection.authenticatorAttachment = undefined;

        const credential = await navigator.credentials.create({
            publicKey
        });

        await axios.post(`${process.env.REACT_APP_BASE_URI}/api/passkey/FinishRegistration`,
            credential,
            {
                headers: { "Content-Type": "application/json" },
            });
    } catch (error) {
        console.error('Passkey registration error:', error);
        alert('Something went wrong.');
    }
};


export async function LoginPasskey(identifire) {
    try {
        const optionsResponse = await axios.post(
            `${process.env.REACT_APP_BASE_URI}/api/passkey/BeginLogin`,
            { identifire },
            {
                headers: { "Content-Type": "application/json-patch+json" },
                withCredentials: true
            }
        );

        const options = optionsResponse.data;
        console.log("Options:", options);

        options.challenge = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0));
        if (options.allowCredentials) {
            options.allowCredentials = options.allowCredentials.map(cred => {
                const mapped = {
                    ...cred,
                    id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0))
                };
                if (!Array.isArray(mapped.transports)) {
                    delete mapped.transports;
                }
                return mapped;
            });
        }
        console.log("2: Options:", options);

        const credential = await navigator.credentials.get({ publicKey: options });

        console.log("3: Credential:", credential);
        await axios.post(`${process.env.REACT_APP_BASE_URI}/api/passkey/FinishLogin`,
            credential,
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

    } catch (error) {
        console.error('Passkey login error:', error);
        alert('Something went wrong.');
    }
};


function base64url_encode(buffer) {
    return btoa(Array.from(new Uint8Array(buffer), b => String.fromCharCode(b)).join(''))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function base64url_decode(value) {
    const m = value.length % 4;
    return Uint8Array.from(atob(
        value.replace(/-/g, '+')
            .replace(/_/g, '/')
            .padEnd(value.length + (m === 0 ? 0 : 4 - m), '=')
    ), c => c.charCodeAt(0)).buffer
}

function base64UrlToUint8Array(base64Url) {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const len = binary.length;
    const buffer = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        buffer[i] = binary.charCodeAt(i);
    }
    return buffer;
}