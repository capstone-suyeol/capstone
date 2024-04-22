from vosk import Model, KaldiRecognizer
import os
import wave
import json

def load_model(model_path='model'):
    if not os.path.exists(model_path):
        print(f"Downloading the model to {model_path}...")
        from vosk import Model, SetLogLevel
        SetLogLevel(0)
        if not os.path.exists(model_path):
            os.makedirs(model_path)
            from urllib.request import urlretrieve
            urlretrieve(
                "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip",
                "model.zip"
            )
            import zipfile
            with zipfile.ZipFile("model.zip", 'r') as zip_ref:
                zip_ref.extractall(model_path)
            os.remove("model.zip")
    return Model(model_path)

def speech_to_text(audio_file, model):
    """
    오디오 파일의 내용을 텍스트로 변환합니다.
    :param audio_file: 변환할 오디오 파일 경로
    :param model: 로드된 vosk 모델
    :return: 변환된 텍스트
    """
    # 오디오 파일을 열고 읽기
    wf = wave.open(audio_file, "rb")
    if wf.getnframes() < 4000:
        return ""  # 너무 짧은 오디오는 처리하지 않음
    recognizer = KaldiRecognizer(model, wf.getframerate())

    results = []
    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if recognizer.AcceptWaveform(data):
            part_result = json.loads(recognizer.Result())
            results.append(part_result.get('text', ''))
    final_result = json.loads(recognizer.FinalResult())
    results.append(final_result.get('text', ''))

    return ' '.join(results)

# 모델을 로드합니다.
model = load_model()

# 테스트

if __name__ == "__main__":
    text = speech_to_text('test.wav', model)
    print(text)
