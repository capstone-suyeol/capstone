import json
import base64
import cv2
import numpy as np
from deepface import DeepFace
import speech_recognition as sr
import threading
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import os
import time

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

class VideoChatConsumer(AsyncWebsocketConsumer):
    def __init__(self):
        super().__init__()
        self.running = True
        self.face_cascade = cv2.CascadeClassifier('c:/Users/kmg02/Downloads/haarcascade_frontalface_default.xml')
        self.last_emotion_score = 0

        self.r = sr.Recognizer()
        self.mic = sr.Microphone()

    async def connect(self):
        self.room_group_name = 'video_chat'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        self.running = True
        threading.Thread(target=self.audio_processing, daemon=True).start()

    async def disconnect(self, close_code):
        self.running = False
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == 'frame':
            await self.process_frame(data['data'])
        else:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'video_chat_message',
                    'message': data
                }
            )

    async def video_chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))

    def get_audio(self):
        with self.mic as source:
            self.r.adjust_for_ambient_noise(source)
            audio = self.r.listen(source)
            try:
                return self.r.recognize_google(audio, language="ko-KR")
            except sr.UnknownValueError:
                print("Speech Recognition could not understand audio")
                return None
            except sr.RequestError as e:
                print(f"Google Speech Recognition service error: {e}")
                return None

    def audio_processing(self):
        while self.running:
            text = self.get_audio()
            if text:
                print(f"말씀하신 내용: {text}, Emotion Score: {self.last_emotion_score:.0f}")
                asyncio.run(self.send_audio(text))
            if "굿바이" in (text or ""):
                self.running = False
                break
            time.sleep(0.01)  # Give some time to prevent tight loop when no audio detected

    async def send_audio(self, text):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'video_chat_message',
                'message': {'type': 'audio', 'text': text, 'emotion_score': self.last_emotion_score}
            }
        )

    async def process_frame(self, data_url):
        header, encoded = data_url.split(",", 1)
        data = base64.b64decode(encoded)
        np_arr = np.frombuffer(data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        rgb_frame = cv2.cvtColor(gray_frame, cv2.COLOR_GRAY2RGB)
        faces = self.face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        for (x, y, w, h) in faces:
            face_roi = rgb_frame[y:y+h, x:x+w]
            results = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)
            emotion_data = results[0]['emotion'] if isinstance(results, list) else results['emotion']
            self.last_emotion_score = 0
            for emotion, prob in emotion_data.items():
                if emotion in ["angry", "disgust"]:
                    self.last_emotion_score += prob * 0.1
                elif emotion == "fear":
                    self.last_emotion_score += prob * 0.2
                elif emotion == "sad":
                    self.last_emotion_score += prob * 0.3
                elif emotion in ["neutral", "surprise"]:
                    self.last_emotion_score += prob * 0.5
                else:
                    self.last_emotion_score += prob * 1
            await self.send_video(self.last_emotion_score)

    async def send_video(self, score):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'video_chat_message',
                'message': {'type': 'video', 'score': score}
            }
        )
