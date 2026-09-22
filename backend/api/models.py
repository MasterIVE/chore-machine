from django.db import models
from django.contrib.auth.models import User

class Grouping(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_groups')

    def __str__(self):
        return self.name

class Task(models.Model):
    task_status_choices = [('not started', 'Not Started'),
        ('in progress', 'In Progress'), ('completed', 'Completed')]

    task_level_choices = [('1', '1'), ('2', '2'), ('3', '3'), ('4', '4'), ('5', '5')]

    task_frequency_choices = [('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly')]    

    taskName = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    group = models.ForeignKey(Grouping, on_delete=models.CASCADE, related_name='tasks')
    status = models.CharField(max_length=20, choices=task_status_choices, default='not started')
    level = models.CharField(max_length=10, choices=task_level_choices, default='1')
    frequency = models.CharField(max_length=10, choices=task_frequency_choices, default='weekly')

    def __str__(self):
        return self.taskName

class Member(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='memberships')
    name = models.CharField(max_length=100)
    group = models.ForeignKey(Grouping, on_delete=models.CASCADE, related_name='members')
   
    

    def __str__(self):
        return f"{self.name} in {self.group.name}" 

class Assignment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='assignments')
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='assignments')
    assigned_at = models.DateTimeField(auto_now_add=True)

    
       

# Create your models here.
