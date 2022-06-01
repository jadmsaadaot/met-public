"""empty message

Revision ID: 326419c08f59
Revises: a2d20b31e275
Create Date: 2022-05-10 16:04:31.565892

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '326419c08f59'
down_revision = 'a2d20b31e275'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('engagement', sa.Column('user_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'engagement', 'user', ['user_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key(None, 'engagement', 'engagement_status', ['status_id'], ['id'], ondelete='CASCADE')
    op.drop_column('engagement', 'created_by')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('engagement', sa.Column('created_by', sa.VARCHAR(length=50), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'engagement', type_='foreignkey')
    op.drop_constraint(None, 'engagement', type_='foreignkey')
    op.drop_column('engagement', 'user_id')
    # ### end Alembic commands ###