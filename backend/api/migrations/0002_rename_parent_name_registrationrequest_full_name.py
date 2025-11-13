from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='registrationrequest',
            old_name='parent_name',
            new_name='full_name',
        ),
    ]


