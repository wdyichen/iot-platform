//播放器
const http = uni.$u.http;
export function startPlay(deviceId, channelId) {
    return http.get('/sip/player/play/' + deviceId + "/" + channelId);
}

export function closeStream(deviceId, channelId, streamId) {
    return http.get('/sip/player/closeStream/' + deviceId + "/" + channelId + "/" + streamId);
}
