import random
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, GroupSerializer, MemberSerializer, TaskCreateSerializer, AssignmentSerializer
from .models import Member, Grouping, Task, Assignment
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class GroupListCreateView(generics.ListCreateAPIView):
    queryset = Grouping.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Grouping.objects.filter(created_by=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(created_by=self.request.user)
        else:
            print(serializer.errors)

class GroupDeleteView(generics.DestroyAPIView):
    queryset = Grouping.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Grouping.objects.filter(created_by=user) 

class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(group__created_by=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)                 

class TaskDeleteView(generics.DestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(group__created_by=user)

class MemberListCreateView(generics.ListCreateAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Member.objects.filter(group__created_by=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors) 

class MemberDeleteView(generics.DestroyAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Member.objects.filter(group__created_by=user)

class AssignmentCreateView(generics.CreateAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        task = serializer.validated_data['task']
        assignment_type = serializer.validated_data.get('type', 'random')

        members = Member.objects.filter(group=task.group)
        if not members.exists():
            raise ValidationError("This task's group has no members to assign.")

        if assignment_type == 'round_robin':
            last_assignment = Assignment.objects.filter(task=task).order_by('-assignedDate').first()
            if last_assignment:
                member_list = list(members)
                last_index = member_list.index(last_assignment.member)
                next_member = member_list[(last_index + 1) % len(member_list)]
            else:
                next_member = members.first()
        else:  # random
            next_member = random.choice(list(members))

        serializer.save(member=next_member)

class AssignmentRefreshView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, group_id):
        try:
            group = Grouping.objects.get(id=group_id)
        except Grouping.DoesNotExist:
            raise ValidationError("Group not found.")

        members = list(Member.objects.filter(group=group).order_by('id'))
        if not members:
            raise ValidationError("This group has no members to assign.")

        tasks = Task.objects.filter(group=group)

        # wipe stale assignments for this group's tasks
        Assignment.objects.filter(task__group=group).delete()

        new_assignments = []
        for i, task in enumerate(tasks):
            assignment_type = task.frequency  # or wherever you're storing round_robin/random per task
            if assignment_type == 'round_robin':
                member = members[i % len(members)]
            else:
                member = random.choice(members)

            new_assignments.append(Assignment(task=task, member=member, type=assignment_type))

        Assignment.objects.bulk_create(new_assignments)

        serializer = AssignmentSerializer(Assignment.objects.filter(task__group=group), many=True)
        return Response(serializer.data)                                 