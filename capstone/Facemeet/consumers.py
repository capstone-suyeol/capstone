
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class VideoConferenceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # WebSocket 연결 시 실행
        self.room_name = self.scope['url_route']['kwargs']['room_name']  # URL 경로에서 방 이름 추출
        self.room_group_name = 'room_%s' % self.room_name  # 채널 레이어에서 사용할 그룹 이름 설정

        # 방 그룹에 참여
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # 클라이언트와의 WebSocket 연결 수락
        await self.accept()

    async def disconnect(self, close_code):
        # WebSocket 연결이 끊길 때 실행
        # 방 그룹에서 탈퇴
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # WebSocket으로부터 메시지를 받을 때 실행
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)  # JSON 형식의 텍스트 데이터를 파싱
        message_type = text_data_json['type']   # 메시지 유형 추출
        
        # 메시지 유형에 따라 적절한 처리 수행
        if message_type == 'offer':
            await self.send_offer(text_data_json)
        elif message_type == 'answer':
            await self.send_answer(text_data_json)
        elif message_type == 'candidate':
            await self.send_candidate(text_data_json)

    async def send_offer(self, event):
        # 오퍼 메시지를 방 그룹에 전송
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send.sdp',
                'sdp': event['sdp'],
                'from': self.channel_name
            }
        )

    async def send_answer(self, event):
        # 응답 메시지를 방 그룹에 전송
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send.sdp',
                'sdp': event['sdp'],
                'from': self.channel_name
            }
        )

    async def send_candidate(self, event):
        # ICE 후보를 방 그룹에 전송
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send.candidate',
                'candidate': event['candidate'],
                'from': self.channel_name
            }
        )

    # 방 그룹으로부터 SDP와 후보 메시지를 받을 때 실행
    async def send_sdp(self, event):
        # 이 메시지가 다른 채널로부터 왔다면 클라이언트에 전송
        if event['from'] != self.channel_name:
            await self.send(text_data=json.dumps({
                'type': 'sdp',
                'sdp': event['sdp'],
            }))

    async def send_candidate(self, event):
        # 이 메시지가 다른 채널로부터 왔다면 클라이언트에 전송
        if event['from'] != self.channel_name:
            await self.send(text_data=json.dumps({
                'type': 'candidate',
                'candidate': event['candidate'],
            }))
