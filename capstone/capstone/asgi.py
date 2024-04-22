# asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import Facemeet.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Facemeet.settings')

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": AuthMiddlewareStack(
        URLRouter(
            Facemeet.routing.websocket_urlpatterns
        )
    ),
})
