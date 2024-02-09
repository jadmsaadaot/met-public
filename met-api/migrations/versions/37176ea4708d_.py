"""empty message

Revision ID: 37176ea4708d
Revises: ec0128056a33
Create Date: 2024-02-08 12:40:09.456210

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '37176ea4708d'
down_revision = 'ec0128056a33'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('email_verification', 'type',
               existing_type=postgresql.ENUM('Survey', 'RejectedComment', 'Subscribe', name='emailverificationtype'),
               nullable=False)
    op.create_index(op.f('ix_engagement_metadata_engagement_id'), 'engagement_metadata', ['engagement_id'], unique=False)
    op.create_index(op.f('ix_engagement_metadata_taxon_id'), 'engagement_metadata', ['taxon_id'], unique=False)
    op.create_index(op.f('ix_engagement_metadata_value'), 'engagement_metadata', ['value'], unique=False)
    op.create_index(op.f('ix_engagement_metadata_taxa_tenant_id'), 'engagement_metadata_taxa', ['tenant_id'], unique=False)
    op.create_unique_constraint(None, 'engagement_metadata_taxa', ['id'])
    op.execute('UPDATE membership_status_codes SET created_date = CURRENT_TIMESTAMP  WHERE created_date IS NULL;')
    op.alter_column('membership_status_codes', 'created_date',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)
    op.drop_index('ix_participant_email_address', table_name='participant')
    op.alter_column('timeline_event', 'widget_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('timeline_event', 'status',
               existing_type=postgresql.ENUM('Pending', 'InProgress', 'Completed', name='timelineeventstatus'),
               nullable=False)
    op.alter_column('timeline_event', 'position',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('widget_documents', 'is_uploaded',
               existing_type=sa.BOOLEAN(),
               nullable=True,
               existing_server_default=sa.text('false'))
    op.alter_column('widget_timeline', 'widget_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.execute('UPDATE widget_type SET created_date = CURRENT_TIMESTAMP  WHERE created_date IS NULL;')
    op.alter_column('widget_type', 'created_date',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('widget_type', 'created_date',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)
    op.alter_column('widget_timeline', 'widget_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('widget_documents', 'is_uploaded',
               existing_type=sa.BOOLEAN(),
               nullable=False,
               existing_server_default=sa.text('false'))
    op.alter_column('timeline_event', 'position',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('timeline_event', 'status',
               existing_type=postgresql.ENUM('Pending', 'InProgress', 'Completed', name='timelineeventstatus'),
               nullable=True)
    op.alter_column('timeline_event', 'widget_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.create_index('ix_participant_email_address', 'participant', ['email_address'], unique=False)

    op.alter_column('membership_status_codes', 'created_date',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)
    op.drop_constraint(None, 'engagement_metadata_taxa', type_='unique')
    op.drop_index(op.f('ix_engagement_metadata_taxa_tenant_id'), table_name='engagement_metadata_taxa')
    op.drop_index(op.f('ix_engagement_metadata_value'), table_name='engagement_metadata')
    op.drop_index(op.f('ix_engagement_metadata_taxon_id'), table_name='engagement_metadata')
    op.drop_index(op.f('ix_engagement_metadata_engagement_id'), table_name='engagement_metadata')
    op.alter_column('email_verification', 'type',
               existing_type=postgresql.ENUM('Survey', 'RejectedComment', 'Subscribe', name='emailverificationtype'),
               nullable=True)
    # ### end Alembic commands ###