"""empty message

Revision ID: dd23646fd1e4
Revises: 16d6a285e459
Create Date: 2024-12-14 00:06:12.067295

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dd23646fd1e4'
down_revision = '16d6a285e459'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('username')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('username', sa.VARCHAR(length=15), autoincrement=False, nullable=True))

    # ### end Alembic commands ###
