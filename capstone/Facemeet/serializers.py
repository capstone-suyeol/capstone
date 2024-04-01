from rest_framework import serializers
from .models import CustomUser, Meeting, Participant, Friend, RecordingFile

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = '__all__'

class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = '__all__'

class RecordingFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecordingFile
        fields = '__all__'
