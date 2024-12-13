"""empty message

Revision ID: 16d6a285e459
Revises: 1d4f45b96165
Create Date: 2024-12-13 03:08:15.523427

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '16d6a285e459'
down_revision = '1d4f45b96165'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('username', sa.String(length=15), nullable=True))
        batch_op.add_column(sa.Column('first_name', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('last_name', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('birthdate', sa.Date(), nullable=True))
        batch_op.drop_column('user_date_of_birth')
        batch_op.drop_column('user_first_name')
        batch_op.drop_column('user_last_name')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_last_name', sa.VARCHAR(length=100), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('user_first_name', sa.VARCHAR(length=100), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('user_date_of_birth', sa.DATE(), autoincrement=False, nullable=True))
        batch_op.drop_column('birthdate')
        batch_op.drop_column('last_name')
        batch_op.drop_column('first_name')
        batch_op.drop_column('username')

    # ### end Alembic commands ###
