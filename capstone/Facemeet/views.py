from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from .serializers import CustomUserSerializer
from .models import CustomUser, CustomUserManager


@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        # 클라이언트에서 전달해야 하는 필수 정보: 이메일, 닉네임, 비밀번호
        required_fields = ['email', 'nickname', 'password']

        # 클라이언트에서 받은 데이터 중 필수 정보가 누락되었는지 확인
        missing_fields = [field for field in required_fields if field not in request.data]
        if missing_fields:
            return Response({'error': f'Missing required fields: {", ".join(missing_fields)}'}, status=status.HTTP_400_BAD_REQUEST)

        # 클라이언트에서 전달된 비밀번호를 해시하여 저장
        request.data['password'] = make_password(request.data['password'])

        # Serializer를 사용하여 데이터 유효성 검사 및 저장
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(username=email, password=password)  # `username` 파라미터로 `email` 사용
    if user is not None:
        if user.is_active:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': '계정이 비활성화 상태입니다.'}, status=status.HTTP_403_FORBIDDEN)
    else:
        return Response({'error': '이메일 또는 비밀번호가 잘못되었습니다.'}, status=status.HTTP_401_UNAUTHORIZED)

from rest_framework import viewsets
from .models import CustomUser, Meeting, Participant, Friend, RecordingFile
from .serializers import CustomUserSerializer, MeetingSerializer, ParticipantSerializer, FriendSerializer, RecordingFileSerializer

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer

class ParticipantViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer

class FriendViewSet(viewsets.ModelViewSet):
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer

class RecordingFileViewSet(viewsets.ModelViewSet):
    queryset = RecordingFile.objects.all()
    serializer_class = RecordingFileSerializer