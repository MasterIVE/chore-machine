from django.contrib import admin
from .models import Task, Grouping, Member, Assignment

# Register your models here.
admin.site.register(Task)
admin.site.register(Grouping)
admin.site.register(Member)
admin.site.register(Assignment)