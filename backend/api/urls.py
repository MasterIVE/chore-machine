from django.urls import path
from . import views

urlpatterns = [
    path('groups/', views.GroupListCreateView.as_view(), name='group-list-create'),
    path('groups/delete/<int:pk>/', views.GroupDeleteView.as_view(), name='group-delete'),
    path('tasks/', views.TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/delete/<int:pk>/', views.TaskDeleteView.as_view(), name='task-delete'),
    path('members/', views.MemberListCreateView.as_view(), name='member-list-create'),
    path('members/delete/<int:pk>/', views.MemberDeleteView.as_view(), name='member-delete'),
    path('assignments/refresh/<int:group_id>/', views.AssignmentRefreshView.as_view(), name='assignment-refresh'),
    path('assignments/create/', views.AssignmentCreateView.as_view(), name='assignment-create'),
]