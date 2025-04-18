let mediaStream;
let mediaRecorder;
let recordedChunks = [];

// Seleção dos elementos da interface
const videoPreview = document.getElementById('preview');
const startCaptureBtn = document.getElementById('startCapture');
const startRecordingBtn = document.getElementById('startRecording');
const stopRecordingBtn = document.getElementById('stopRecording');

// Função para formatar a data no formato desejado (dia/mês/ano)
function formatDate() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0'); // Adiciona 0 à frente se o dia for menor que 10
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Meses começam do 0, então somamos 1
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
}

// Atualiza o conteúdo do copyright com a data atual
document.getElementById("copyright").textContent = `© ${formatDate()} Wilson - Todos os direitos reservados.`;

// Função para atualizar o relógio em tempo real
function atualizarRelogio() {
    const agora = new Date();
    const horas = agora.getHours().toString().padStart(2, '0');
    const minutos = agora.getMinutes().toString().padStart(2, '0');
    const segundos = agora.getSeconds().toString().padStart(2, '0');
    document.getElementById("relogio").textContent = `🕒 ${horas}:${minutos}:${segundos}`;
}

// Atualiza o relógio a cada segundo
setInterval(atualizarRelogio, 1000);
atualizarRelogio(); // Executa imediatamente

// Função para iniciar a captura de mídia
startCaptureBtn.addEventListener('click', async () => {
    try {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100
            }
        });

        videoPreview.srcObject = mediaStream;
        videoPreview.play();

        startRecordingBtn.disabled = false;
        stopRecordingBtn.disabled = true;

        // Exibe alerta sobre a captura de áudio
        alert("⚠️ Para o áudio do jogo funcionar corretamente, clique na tela capturada e ative o modo de tela cheia.");
    } catch (err) {
        alert("Erro ao iniciar a captura: " + err);
    }
});

// Função para iniciar a gravação
startRecordingBtn.addEventListener('click', () => {
    recordedChunks = [];

    mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp9,opus'
    });

    mediaRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }
    };

    mediaRecorder.onstop = function () {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        // Cria um link de download automático para o vídeo gravado na pasta de Downloads
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gravacao.webm';  // Nome fixo para o arquivo
        a.click();  // Dispara o download automaticamente
    };

    mediaRecorder.start();
    startRecordingBtn.disabled = true;
    stopRecordingBtn.disabled = false;
});

// Parar gravação
stopRecordingBtn.addEventListener('click', () => {
    mediaRecorder.stop();
    startRecordingBtn.disabled = false;
    stopRecordingBtn.disabled = true;
});
