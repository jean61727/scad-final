# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-07 13:39
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0013_auto_20160107_1250'),
    ]

    operations = [
        migrations.AlterField(
            model_name='like',
            name='post_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='posts.Post'),
        ),
    ]
