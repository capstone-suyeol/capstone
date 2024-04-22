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
from rest_framework import status
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import Q

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
from .models import CustomUser, Meeting, Participant, Friend, RecordingFile,ExpressionScore,VoiceTranscription
from .serializers import CustomUserSerializer, MeetingSerializer, ParticipantSerializer, FriendSerializer, RecordingFileSerializer,ExpressionscoreSerializer,VoicetranscriptionSerializer

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
    @action(detail=False, methods=['post'])
    def send_request(self, request):
        requester_id = request.data.get('requester_id')
        receiver_id = request.data.get('receiver_id')
        
        if not requester_id or not receiver_id:
            return Response({'error': 'Missing requester or receiver information'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Ensure both users exist
        requester = get_object_or_404(CustomUser, id=requester_id)
        receiver = get_object_or_404(CustomUser, id=receiver_id)
        
        # Check if a friend request already exists
        if Friend.objects.filter(requester=requester, receiver=receiver).exists():
            return Response({'error': 'Friend request already sent'}, status=status.HTTP_409_CONFLICT)
        
        # Create new friend request
        friend_request = Friend(requester=requester, receiver=receiver, status=False)  # status=False indicates pending
        friend_request.save()
        
        return Response({'message': 'Friend request sent successfully'}, status=status.HTTP_201_CREATED)
    @action(detail=True, methods=['post'])
    def accept_request(self, request, pk=None):
        # 친구 요청 수락 로직 구현
        friend_request = self.get_object()
        friend_request.status = True
        friend_request.save()
        return Response({"message": "Friend request accepted"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='my-friends')
    def list_friends(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        # Get all friends where the current user is either the requester or the receiver and the status is True
        friends = Friend.objects.filter(
            Q(requester=user, status=True) | Q(receiver=user, status=True)
        )

        # Serialize the friend relationships
        friends_data = self.get_serializer(friends, many=True).data
        # Extract the friend details
        friend_list = []
        for friend in friends_data:
            if friend['requester']['id'] == user.id:
                friend_list.append(friend['receiver'])
            else:
                friend_list.append(friend['requester'])

        return Response({'friends': friend_list}, status=status.HTTP_200_OK)
    
class RecordingFileViewSet(viewsets.ModelViewSet):
    queryset = RecordingFile.objects.all()
    serializer_class = RecordingFileSerializer


class ExpressionScoreViewSet(viewsets.ModelViewSet):
    queryset = ExpressionScore.objects.all()
    serializer_class = ExpressionscoreSerializer

class VoicetranscriptionViewSet(viewsets.ModelViewSet):
    queryset = VoiceTranscription.objects.all()
    serializer_class = VoicetranscriptionSerializer

