import { REQUEST_TIME_OUT } from '../constants/const';
export default function (url, options, timeout = REQUEST_TIME_OUT) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), timeout)
        )
    ]);
}