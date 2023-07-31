""" Add subscribe_item table to database

Revision ID: df73727dc6d9b7_add_sub_tbl
Revises: 5a1258a76598
Create Date: 2023-07-26 13:03:24.113767

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'df73727dc6d9b7_add_sub_tbl'
down_revision = '5a1258a76598'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('widget_subscribe',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('type', sa.Enum('EMAIL_LIST', 'SIGN_UP', name='subscribetypes'), nullable=False),
    sa.Column('sort_index', sa.Integer(), nullable=True),
    sa.Column('widget_id', sa.Integer(), nullable=True),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('updated_by', sa.String(length=50), nullable=True),
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['widget_id'], ['widget.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('subscribe_item',
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('description', sa.String(length=500), nullable=True),
    sa.Column('call_to_action_text', sa.String(length=25), nullable=True),
    sa.Column('call_to_action_type', sa.String(length=25), nullable=True),
    sa.Column('sort_index', sa.Integer(), nullable=True),
    sa.Column('widget_subscribe_id', sa.Integer(), nullable=True),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('updated_by', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['widget_subscribe_id'], ['widget_subscribe.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###

    op.drop_table('subscribe_item')
    op.drop_table('widget_subscribe')
    op.execute('DROP TYPE subscribetypes;')
    # ### end Alembic commands ###