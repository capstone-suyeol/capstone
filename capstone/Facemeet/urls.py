from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register_user'),
    path('login/', views.login_user, name='login_user'),
]


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.CustomUserViewSet)
router.register(r'meetings', views.MeetingViewSet)
router.register(r'participants', views.ParticipantViewSet)
router.register(r'friends', views.FriendViewSet)
router.register(r'recordingfiles', views.RecordingFileViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
