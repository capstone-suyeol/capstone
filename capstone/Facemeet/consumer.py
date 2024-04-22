# your_app/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MeetingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.meeting_id = self.scope['url_route']['kwargs']['meeting_id']
        self.meeting_group_name = 'meeting_%s' % self.meeting_id
        # Join meeting group
        await self.channel_layer.group_add(
            self.meeting_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave meeting group
        await self.channel_layer.group_discard(
            self.meeting_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to meeting group
        await self.channel_layer.group_send(
            self.meeting_group_name,
            {
                'type': 'meeting_message',
                'message': message,
            }
        )

    # Receive message from meeting group
    async def meeting_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
        }))
