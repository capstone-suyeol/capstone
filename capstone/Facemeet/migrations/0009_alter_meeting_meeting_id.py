# Generated by Django 5.0.3 on 2024-04-30 08:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Facemeet', '0008_customuser_profileimage_alter_meeting_meeting_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='meeting',
            name='meeting_id',
            field=models.CharField(default='f2ac5da714ac464f9e27429bec29f086', max_length=100),
        ),
    ]