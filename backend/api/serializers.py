from django.contrib.auth.models import Group, User
from rest_framework import serializers

from .models import Member, Task, Grouping, Assignment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(
            **validated_data
        )
        return user

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grouping
        fields = ['id', 'name']


class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'taskName', 'description', 'created_at', 'group', 'status']

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'user', 'name', 'group']

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'task', 'member', 'assigned_at']        
                    

    