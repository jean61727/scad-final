# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Follower',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('follow', models.CharField(max_length=50)),
                ('user_id', models.ForeignKey(to='login.MyUser')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.TextField(max_length=100)),
                ('url', models.TextField(max_length=100)),
                ('start_time', models.IntegerField()),
                ('post_message', models.TextField(max_length=100)),
                ('comments', models.TextField(max_length=100)),
                ('likes', models.IntegerField()),
                ('people_listening', models.IntegerField()),
                ('category', models.CharField(max_length=20)),
                ('user_id', models.ForeignKey(to='login.MyUser')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
