from django.conf.urls import include, url
from rest_framework import routers
from . import views

todo_router = routers.DefaultRouter()
todo_router.register(r'tasks', views.TaskViewSet, base_name='tasks')

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url('', include('social.apps.django_app.urls', namespace='social')),
   	url('', include('django.contrib.auth.urls', namespace='auth')),
   	url('^api/', include(todo_router.urls)),
]