from django.db import models
# from django.contrib.auth.models import User # 주석 처리
from django.conf import settings  # settings.AUTH_USER_MODEL을 사용하기 위함
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.functional import SimpleLazyObject


from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, nickname, password=None, **extra_fields):
        """
        일반 사용자 생성
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, nickname=nickname, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nickname, password=None, **extra_fields):
        """
        관리자 사용자 생성
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, nickname, password, **extra_fields)


from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

class CustomUser(AbstractBaseUser, PermissionsMixin):
    nickname = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    email = models.EmailField(max_length=255, unique=True)
    is_staff = models.BooleanField(default=False)  # 관리자 페이지 접근 권한
    is_active = models.BooleanField(default=True)  # 계정 활성화 상태
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nickname']

    objects = CustomUserManager()

    @property
    def is_anonymous(self):
        return False

    @property
    def is_authenticated(self):
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

