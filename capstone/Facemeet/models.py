from django.db import models
# Django의 기본 User 모델을 사용하는 대신 사용자 정의 모델을 사용하기 위해 주석 처리
# from django.contrib.auth.models import User 
from django.conf import settings  # settings.AUTH_USER_MODEL을 사용하기 위함
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.functional import SimpleLazyObject

from django.contrib.auth.models import BaseUserManager

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
import uuid

# CustomUser 모델의 객체를 생성하고 관리하는 클래스
class CustomUserManager(BaseUserManager):
    def create_user(self, email, nickname, password=None, **extra_fields):
        """
        일반 사용자 생성 메서드. 이메일, 닉네임, 비밀번호(선택 사항)와 추가 필드를 받아 사용자를 생성합니다.
        """
        if not email:
            raise ValueError('The Email field must be set')  # 이메일이 제공되지 않으면 에러 발생
        email = self.normalize_email(email)  # 이메일을 정규화
        user = self.model(email=email, nickname=nickname, **extra_fields)  # 사용자 객체 생성
        user.set_password(password)  # 비밀번호 설정
        user.save(using=self._db)  # 데이터베이스에 저장
        return user

    def create_superuser(self, email, nickname, password=None, **extra_fields):
        """
        관리자 사용자 생성 메서드. 일반 사용자 생성 메서드를 확장하여, 관리자 권한을 가진 사용자를 생성합니다.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, nickname, password, **extra_fields)

# 사용자 정의 사용자 모델
class CustomUser(AbstractBaseUser, PermissionsMixin):
    nickname = models.CharField(max_length=100)  # 닉네임 필드
    password = models.CharField(max_length=100)  # 비밀번호 필드
    email = models.EmailField(max_length=255, unique=True)  # 이메일 필드, 유일해야 함
    is_staff = models.BooleanField(default=False)  # 관리자 페이지 접근 권한
    is_active = models.BooleanField(default=True)  # 계정 활성화 상태
    USERNAME_FIELD = 'email'  # 사용자 이름 필드로 이메일을 사용
    REQUIRED_FIELDS = ['nickname']  # 필수 필드로 닉네임 지정

    objects = CustomUserManager()  # 사용자 모델 관리자 설정
    
    def get_friends(self):
        """
        현재 사용자의 친구 목록을 반환합니다.
        """
        friends = Friend.objects.filter(requester=self, status=True)
        friend_users = [friend.receiver for friend in friends]
        return friend_users
    
    # 사용자 인증 관련 메서드
    @property
    def is_anonymous(self):
        return False

    @property
    def is_authenticated(self):
        return True



# 회의 모델
class Meeting(models.Model):
    title = models.CharField(max_length=100)  # 회의 제목
    description = models.CharField(max_length=100)  # 회의 설명
    time = models.TimeField()  # 회의 시간
    host = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='hosted_meetings')  # 회의 주최자
    password = models.CharField(max_length=100)  # 회의 비밀번호
    meeting_link = models.URLField(max_length=255)  # 회의 링크
    expression_score = models.IntegerField()  # 표현 점수
    comments = models.TextField()  # 회의에 대한 코멘트
    atmosphere_score = models.FloatField()  # 분위기 점수
    transcription = models.TextField(blank=True, null=True)  # 음성 인식을 통해 생성된 회의록
    meeting_id = models.CharField(max_length=100, default=uuid.uuid4().hex)  # UUID 기반 기본값

# 참가자 모델
class Participant(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # 참가자
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)  # 해당 참가자가 참여한 회의
    join_time = models.DateTimeField()  # 참여 시간
    leave_time = models.DateTimeField()  # 퇴장 시간
    status = models.BooleanField()  # 참가 상태
    engagement_score = models.FloatField(default=0.0)  # 참가자의 참여도 점수
    mood_score = models.FloatField(default=0.0)  # 참가자의 기분 점수

# 친구 모델
class Friend(models.Model):
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='requested_friends', on_delete=models.CASCADE)  # 친구 요청자
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_friends', on_delete=models.CASCADE)  # 친구 요청 받는 사람
    status = models.BooleanField()  # 친구 관계 상태
    class Meta:
        unique_together = ['requester', 'receiver']  # 중복된 친구 요청 방지


# 녹화 파일 모델
class RecordingFile(models.Model):
    recording_file_id = models.AutoField(primary_key=True)  # 녹화 파일 ID
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)  # 해당 녹화 파일이 속한 회의
    file_path = models.FileField(upload_to='meeting_recordings/')  # 파일 경로
    size = models.FloatField()  # 파일 크기
    creation_time = models.DateTimeField()  # 파일 생성 시간

class ExpressionScore(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='expression_scores')
    timestamp = models.DateTimeField()  # 점수가 기록된 시간
    score = models.IntegerField()  # 표정 점수

class VoiceTranscription(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='voice_transcriptions')
    timestamp = models.DateTimeField()  # 텍스트가 기록된 시간
    text = models.TextField()  # 인식된 음성의 텍스트



