from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models

class Task(models.Model):
    desc = models.CharField(max_length=100)
    is_done = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False) 
    owner = models.ForeignKey(User)

    def __unicode__(self):
        return "(" + self.owner.username + ")" + self.desc 

