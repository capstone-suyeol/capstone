from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .serializers import UserSerializer, UserSignupSerializer

@api_view(['POST'])
def user_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        serializer = UserSerializer(user)
        return Response({'success': True, 'message': '로그인 성공', 'user': serializer.data}, status=status.HTTP_200_OK)
    else:
        return Response({'success': False, 'message': '로그인 실패', 'error': '유효하지 않은 사용자 이름 또는 비밀번호'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def user_logout(request):
    logout(request)
    return Response({'success': True, 'message': '로그아웃 성공'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
def change_password(request):
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    user = request.user
    if user.check_password(old_password):
        user.set_password(new_password)
        user.save()
        return Response({'success': True, 'message': '비밀번호 변경 성공'}, status=status.HTTP_200_OK)
    else:
        return Response({'success': False, 'message': '유효하지 않은 비밀번호'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def user_signup(request):
    serializer = UserSignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'success': True, 'message': '회원가입 성공', 'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
