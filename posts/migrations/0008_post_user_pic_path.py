# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2015-12-24 06:33
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0007_remove_comments_comment_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='user_pic_path',
            field=models.CharField(max_length=200, null=True),
        ),
    ]