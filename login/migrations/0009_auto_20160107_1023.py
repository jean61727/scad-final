# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-07 10:23
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0008_myuser'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='myuser',
            name='user',
        ),
        migrations.DeleteModel(
            name='MyUser',
        ),
    ]
