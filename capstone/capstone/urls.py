from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('Facemeet.urls')),  # 'myapp'을 여러분의 앱 이름으로 변경하세요
]
