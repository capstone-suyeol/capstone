from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
# models.py

class User(AbstractUser):
    email = models.EmailField(unique=True)
    # 추가 필드를 여기에 정의합니다.