"""message

Revision ID: 51bcc0e91e81
Revises: a53403d3653f
Create Date: 2023-07-17 15:07:11.784971

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '51bcc0e91e81'
down_revision = 'a53403d3653f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('id',
               existing_type=sa.INTEGER(),
               nullable=False,
               autoincrement=True)
        batch_op.alter_column('username',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=False)
        batch_op.alter_column('password',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=False)
        batch_op.alter_column('name',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=True)
        batch_op.alter_column('avatar',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('avatar',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=True)
        batch_op.alter_column('name',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=True)
        batch_op.alter_column('password',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=False)
        batch_op.alter_column('username',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=False)
        batch_op.alter_column('id',
               existing_type=sa.INTEGER(),
               nullable=True,
               autoincrement=True)

    # ### end Alembic commands ###
