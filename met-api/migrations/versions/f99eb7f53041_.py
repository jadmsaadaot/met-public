"""Increase submission.rejected_reason_other length

Revision ID: f99eb7f53041
Revises: 7bf7394a517c
Create Date: 2023-03-27 11:15:52.342030

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'f99eb7f53041'
down_revision = '7bf7394a517c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('submission', 'rejected_reason_other',
               existing_type=sa.VARCHAR(length=50),
               type_=sa.VARCHAR(length=500),
               nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('submission', 'rejected_reason_other',
               existing_type=sa.VARCHAR(length=500),
               type_=sa.VARCHAR(length=50),
               nullable=True)
    # ### end Alembic commands ###
