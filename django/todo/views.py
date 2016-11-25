from django.shortcuts import render
from rest_framework import viewsets, permissions
from todo.models import Task
from todo.serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    # model = Task
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def perform_create(self, serializer):
        """Force owner to the current user on save"""
        serializer.save(owner=self.request.user)

    def get_queryset(self):
      user = self.request.user
      #Devuelvo solo las tareas no eliminadas del usuario
      return self.queryset.filter(owner=user, is_deleted=False)


def home(request):
   context = {'request': request,
              'user': request.user}
   return render(request, 'home.html', context)
