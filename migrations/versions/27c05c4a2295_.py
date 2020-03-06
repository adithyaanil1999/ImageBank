"""empty message

Revision ID: 27c05c4a2295
Revises: f00ef6c66742
Create Date: 2020-03-05 01:37:48.169374

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '27c05c4a2295'
down_revision = 'f00ef6c66742'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_login',
    sa.Column('user_id', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=True),
    sa.Column('last_login', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('user_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_login')
    # ### end Alembic commands ###
