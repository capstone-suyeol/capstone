from django.db import models
# from django.contrib.auth.models import User # 주석 처리
from django.conf import settings  # settings.AUTH_USER_MODEL을 사용하기 위함
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.functional import SimpleLazyObject


# 커스텀 유저 모델을 사용할 경우 아래 User 모델 정의, 내장 User 모델을 사용할 경우 주석 처리
class CustomUser(AbstractBaseUser):
    nickname = models.CharField(max_length=100)
    password = models.CharField(max_length=100)  # 실제 애플리케이션에서는 비밀번호를 직접 저장하지 말고 Django의 내장 기능을 사용하세요.
    #profile_picture = models.ImageField(upload_to='profile_pics/')
    email = models.EmailField(max_length=255, unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nickname']
    # is_anonymous와 is_authenticated 속성 추가
    @property
    def is_anonymous(self):
        # 익명 사용자가 아니므로 항상 False 반환
        return False

    @property
    def is_authenticated(self):
        # 인증된 사용자이므로 항상 True 반환
        return True

class Meeting(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    time = models.TimeField()
    host = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='hosted_meetings')
    password = models.CharField(max_length=100)
    meeting_link = models.URLField(max_length=255)
    expression_score = models.IntegerField()
    comments = models.TextField()
    atmosphere_score = models.FloatField()

class Participant(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    join_time = models.DateTimeField()
    leave_time = models.DateTimeField()
    status = models.BooleanField()

class Friend(models.Model):
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='requested_friends', on_delete=models.CASCADE)
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_friends', on_delete=models.CASCADE)
    status = models.BooleanField()

class RecordingFile(models.Model):
    recording_file_id = models.AutoField(primary_key=True)
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    file_path = models.FileField(upload_to='meeting_recordings/')
    size = models.FloatField()
    creation_time = models.DateTimeField()

