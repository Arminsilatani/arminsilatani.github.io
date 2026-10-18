/* :::::::::::::::::::::::::: TELEGRAM NOTIFY HELPER :::::::::::::::::::::::::: */
/**
 * @param {string} formName
 * @param {object} fields
 * @returns {Promise<boolean>}
 */
export async function notifyTelegram(formName, fields) {
    const SUPABASE_URL = 'https://vzqicidepdmraygulrey.supabase.co';
    const PUBLISHABLE_KEY = 'sb_publishable_kqRWgOmLISOE2EuLL1s8fw_WN6FJRTI';

    try {
        const res = await fetch(SUPABASE_URL + '/functions/v1/notify-form', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + PUBLISHABLE_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: formName,
                fields: fields
            })
        });

        const data = await res.json();
        return data?.ok === true;
    } catch (err) {
        console.warn('[Telegram Notify] failed:', err);
        return false;
    }
}