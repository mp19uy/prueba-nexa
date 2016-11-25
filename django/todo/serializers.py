from rest_framework import serializers
from todo.models import Task

class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = ('id', 'desc', 'is_deleted', 'is_done')