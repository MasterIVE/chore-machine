from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.db.models import Q


class Grouping(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_groups'
    )
    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL, through='Member', related_name='groupings'
    )

    def __str__(self):
        return self.name


class Member(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='memberships',
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=100, blank=True)  # guests only
    group = models.ForeignKey(Grouping, on_delete=models.CASCADE, related_name='members')
    role = models.CharField(max_length=50, blank=True)

    class Meta:
        constraints = [
            # One membership per account per group. Postgres treats NULLs as
            # distinct, so guest rows (user=NULL) aren't affected.
            models.UniqueConstraint(
                fields=['user', 'group'], name='unique_user_per_group'
            ),
            # No duplicate guest names within a group.
            models.UniqueConstraint(
                fields=['group', 'name'],
                condition=Q(user__isnull=True),
                name='unique_guest_name_per_group',
            ),
            # Exactly one identity source: an account OR a guest name.
            models.CheckConstraint(
                condition=(
                    Q(user__isnull=False, name='')
                    | Q(user__isnull=True) & ~Q(name='')
                ),
                name='member_user_xor_guest_name',
            ),
        ]

    @property
    def display_name(self):
        return self.user.get_full_name() or self.user.get_username() if self.user_id else self.name

    def __str__(self):
        return f"{self.display_name} in {self.group}"


class Task(models.Model):
    class Frequency(models.TextChoices):
        DAILY = 'daily', 'Daily'
        WEEKLY = 'weekly', 'Weekly'
        BIWEEKLY = 'biweekly', 'Biweekly'
        MONTHLY = 'monthly', 'Monthly'

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    group = models.ForeignKey(Grouping, on_delete=models.CASCADE, related_name='tasks')
    level = models.PositiveSmallIntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    frequency = models.CharField(
        max_length=10, choices=Frequency.choices, default=Frequency.WEEKLY
    )

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=Q(level__gte=1, level__lte=5), name='task_level_1_to_5'
            ),
            models.CheckConstraint(
                condition=Q(frequency__in=['daily', 'weekly', 'biweekly', 'monthly']),
                name='task_valid_frequency',
            ),
        ]

    def __str__(self):
        return self.name


class Assignment(models.Model):
    class Status(models.TextChoices):
        NOT_STARTED = 'not started', 'Not Started'
        IN_PROGRESS = 'in progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'

    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='assignments')
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='assignments')
    assigned_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.NOT_STARTED
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['task', 'member', 'due_date'], name='unique_assignment_per_due_date'
            ),
            models.CheckConstraint(
                condition=Q(status__in=['not started', 'in progress', 'completed']),
                name='assignment_valid_status',
            ),
        ]

    def clean(self):
        if self.task.group_id != self.member.group_id:
            raise ValidationError("Task and member must belong to the same group.")