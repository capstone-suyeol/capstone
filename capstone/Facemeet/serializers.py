# Django REST framework의 serializers 모듈에서 ModelSerializer를 임포트합니다.
# ModelSerializer를 사용하면 모델 인스턴스를 JSON으로 쉽게 변환하고 그 반대도 가능합니다.
from rest_framework import serializers
# 현재 패키지의 models 모듈에서 CustomUser, Meeting, Participant, Friend, RecordingFile 모델을 임포트합니다.
from .models import CustomUser, Meeting, Participant, Friend, RecordingFile

# CustomUser 모델을 위한 시리얼라이저를 정의합니다.
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser  # 이 시리얼라이저가 사용할 모델을 지정합니다.
        fields = '__all__'  # 모델의 모든 필드를 포함하도록 지정합니다.

# Meeting 모델을 위한 시리얼라이저를 정의합니다.
class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting  # 이 시리얼라이저가 사용할 모델을 지정합니다.
        fields = '__all__'  # 모델의 모든 필드를 포함하도록 지정합니다.

# Participant 모델을 위한 시리얼라이저를 정의합니다.
class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant  # 이 시리얼라이저가 사용할 모델을 지정합니다.
        fields = '__all__'  # 모델의 모든 필드를 포함하도록 지정합니다.

# Friend 모델을 위한 시리얼라이저를 정의합니다.
class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend  # 이 시리얼라이저가 사용할 모델을 지정합니다.
        fields = '__all__'  # 모델의 모든 필드를 포함하도록 지정합니다.

# RecordingFile 모델을 위한 시리얼라이저를 정의합니다.
class RecordingFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecordingFile  # 이 시리얼라이저가 사용할 모델을 지정합니다.
        fields = '__all__'  # 모델의 모든 필드를 포함하도록 지정합니다.
