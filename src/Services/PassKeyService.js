import axios, { all } from "axios";

export async function registerPasskey() {
    try {
        // 1. Получить options с сервера
        const optionsResponse = await axios.post(
            `${process.env.REACT_APP_BASE_URI}/api/passkey/BeginRegistration`,
            {}, // тело запроса (если нужно — вставь сюда userId и username)
            {
                headers: { "Content-Type": "application/json-patch+json" },
                withCredentials: true
            }
        );

        const options = await optionsResponse.data;
        console.log("BEFORE", optionsResponse.data);
        
        // Преобразовать из base64url в нужные форматы
         options.challenge = base64UrlToUint8Array(options.challenge);
         options.user.id = base64UrlToUint8Array(options.user.id);
        
        
        // 2. Запустить регистрацию на клиенте
        const credential = await navigator.credentials.create({
            publicKey: options
        });
        console.log("credential", credential);
        // 3. Отправить результат обратно на сервер
        const response = await axios.post(`${process.env.REACT_APP_BASE_URI}/api/passkey/FinishRegistration`,
            {
                id: credential.id,
                rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
                type: credential.type,
                response: {
                    attestationObject: btoa(String.fromCharCode(...new Uint8Array(credential.response.attestationObject))),
                    clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON)))
                }
            },
            {
                headers: { "Content-Type": "application/json-patch+json" },
                withCredentials: true
            });

        const result = await response.json();
        alert(result.status === 'ok' ? 'Passkey registered successfully!' : 'Registration failed.');
    } catch (error) {
        console.error('Passkey registration error:', error);
        alert('Something went wrong.');
    }
};


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