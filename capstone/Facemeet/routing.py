# django.urls에서 re_path 함수를 임포트합니다. 이 함수를 사용하여 URL 패턴을 정규 표현식으로 정의할 수 있습니다.
from django.urls import re_path
# 현재 패키지에서 consumers를 임포트합니다. 이 모듈에는 WebSocket 컨슈머 클래스가 포함되어 있습니다.
from . import consumers

# WebSocket 연결을 위한 URL 라우팅 설정을 담고 있는 리스트인 websocket_urlpatterns를 정의합니다.
# 이 리스트는 Django가 WebSocket 연결을 라우팅하는 데 사용됩니다.
# 리스트의 각 항목은 re_path() 호출로, 정규 표현식 패턴과 WebSocket 컨슈머를 매핑합니다.
websocket_urlpatterns = [
    # re_path() 함수는 정규 표현식 패턴과 컨슈머를 인자로 받습니다.
    # 여기서는 'ws/meeting/<meeting_id>/' URL 패턴을 MeetingConsumer WebSocket 컨슈머에 매핑합니다.
    # 패턴 'ws/meeting/(?P<meeting_id>\w+)/$'은 'ws/meeting/<meeting_id>/' 형식을 따르는
    # 모든 WebSocket 연결 URL과 일치하는 정규 표현식입니다. 여기서 <meeting_id>는 알파벳, 숫자, 밑줄(_)을 포함할 수 있습니다.
    # '(?P<meeting_id>\w+)' 부분은 <meeting_id> 부분을 캡처하여 컨슈머에 키워드 인자로 전달하는
    # 명명된 정규 표현식 그룹입니다. 이를 통해 MeetingConsumer는 어떤 미팅 ID를 다루고 있는지 알 수 있습니다.
    re_path(r'ws/meeting/(?P<meeting_id>\w+)/$', consumers.MeetingConsumer.as_asgi()),
    # MeetingConsumer에 .as_asgi() 메서드를 호출하여 컨슈머의 ASGI 어플리케이션 인스턴스를 생성합니다.
    # Django Channels는 비동기적으로 작동하며 WebSocket 연결을 처리하기 위해 ASGI가 필요하기 때문입니다.
]
